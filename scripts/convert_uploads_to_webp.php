<?php
// One-time: convert existing JPG/PNG uploads to WebP and point the database at the WebP copies.
//   php scripts/convert_uploads_to_webp.php [--backend=/var/www/avm/backend] [--apply]
// Without --apply it only reports what it would do. Originals are NEVER deleted or changed:
// they stay in uploads/ next to the .webp and are what "Download" serves (backend/api/public/original.php).
// Run it as the web user so it can read .env and write uploads/:  sudo -u www-data php scripts/convert_uploads_to_webp.php --backend=/var/www/avm/backend --apply
if (PHP_SAPI !== 'cli') { http_response_code(403); exit; }
@ini_set('memory_limit', '1024M');

$apply = in_array('--apply', $argv, true);
$backend = __DIR__ . '/../backend';
foreach ($argv as $a) if (strpos($a, '--backend=') === 0) $backend = substr($a, 10);
$backend = realpath($backend) ?: exit("backend folder not found\n");
$dir = "$backend/uploads";
if (!function_exists('imagewebp')) exit("PHP GD with WebP support is missing (apt install php-gd)\n");
require_once "$backend/config/db.php";
$pdo = db();

echo ($apply ? "APPLY" : "DRY RUN (nothing changed)") . " - uploads: $dir\n";

// 1. make a .webp for every <16hex>.jpg / .png that has none yet
$made = []; $skipped = 0; $failed = [];
$bytesBefore = 0; $bytesAfter = 0;
foreach (glob("$dir/*.{jpg,png}", GLOB_BRACE) as $path) {
    if (!preg_match('/^([a-f0-9]{16})\.(jpg|png)$/', basename($path), $m)) continue;
    [$all, $id, $ext] = $m;
    $out = "$dir/$id.webp";
    if (is_file($out)) { $made[$id] = $ext; $skipped++; continue; }   // already converted (e.g. by the new upload code)
    $bytesBefore += filesize($path);
    if (!$apply) { $made[$id] = $ext; continue; }
    $src = $ext === 'jpg' ? @imagecreatefromjpeg($path) : @imagecreatefrompng($path);
    if (!$src) { $failed[] = basename($path); continue; }
    if ($ext === 'jpg' && function_exists('exif_read_data')) {
        $exif = @exif_read_data($path);
        $rot = [3 => 180, 6 => -90, 8 => 90][$exif['Orientation'] ?? 0] ?? 0;
        if ($rot && ($r = imagerotate($src, $rot, 0))) $src = $r;
    }
    $w = imagesx($src); $h = imagesy($src);
    if ($w > 1920) {
        $nh = max(1, (int)round($h * 1920 / $w));
        $d = imagecreatetruecolor(1920, $nh);
        imagealphablending($d, false); imagesavealpha($d, true);
        if (imagecopyresampled($d, $src, 0, 0, 0, 0, 1920, $nh, $w, $h)) $src = $d;
    }
    if ($ext === 'png') { imagepalettetotruecolor($src); imagealphablending($src, true); imagesavealpha($src, true); }
    if (@imagewebp($src, $out, 80) && is_file($out) && filesize($out) > 0) {
        $made[$id] = $ext; $bytesAfter += filesize($out);
        @chmod($out, fileperms($path) & 0777);
    } else { @unlink($out); $failed[] = basename($path); }
}
echo sprintf("images: %d to use as WebP (%d already had a .webp), %d failed%s\n", count($made), $skipped, count($failed), $failed ? ' -> ' . implode(', ', $failed) : '');
if ($apply && $bytesBefore) echo sprintf("size of newly converted: %.1f MB -> %.1f MB\n", $bytesBefore / 1048576, $bytesAfter / 1048576);

// 2. point every text column at the .webp copies
$cols = $pdo->query("SELECT table_name t, column_name c FROM information_schema.columns
    WHERE table_schema = DATABASE() AND data_type IN ('varchar','text','mediumtext','longtext') AND table_name <> 'admin_users'")->fetchAll();
$changed = 0;
foreach ($cols as ['t' => $t, 'c' => $c]) {
    $cnt = 0;
    foreach ($made as $id => $ext) {
        $old = "/backend/uploads/$id.$ext"; $new = "/backend/uploads/$id.webp";
        $like = '%' . str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $old) . '%';
        $q = $pdo->prepare("SELECT COUNT(*) FROM `$t` WHERE `$c` LIKE ?"); $q->execute([$like]);
        $n = (int)$q->fetchColumn();
        if (!$n) continue;
        if ($apply) $pdo->prepare("UPDATE `$t` SET `$c` = REPLACE(`$c`, ?, ?) WHERE `$c` LIKE ?")->execute([$old, $new, $like]);
        $cnt += $n;
    }
    if ($cnt) { echo sprintf("  %-14s %-20s %d row(s)%s\n", $t, $c, $cnt, $apply ? ' updated' : ' would change'); $changed += $cnt; }
}
echo "database rows " . ($apply ? "updated" : "that would change") . ": $changed\n";
if (!$apply) echo "Re-run with --apply to do it.\n";
