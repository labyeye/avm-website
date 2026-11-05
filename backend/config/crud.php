<?php
// Shared CRUD handler for gallery / testimonials / notices admin endpoints.
// $table: table name; $fields: [column => 'str'|'int'|'bool'|'date']; $required: columns needed on create;
// $order: ORDER BY clause (trusted constant). $filter: optional column that GET ?col=value filters on (trusted constant).

function crud_handle(string $table, array $fields, array $required, string $order, ?string $filter = null): void
{
    $pdo = db();
    $method = $_SERVER['REQUEST_METHOD'];
    $body = in_array($method, ['POST', 'PUT'], true) ? json_input() : [];
    $id = (int)($_GET['id'] ?? $body['id'] ?? 0);

    $clean = function (array $src, bool $partial) use ($fields, $required) {
        $out = [];
        foreach ($fields as $col => $type) {
            if (!array_key_exists($col, $src)) {
                if (!$partial && $type === 'bool') $out[$col] = 1;
                continue;
            }
            $v = $src[$col];
            switch ($type) {
                case 'int':  $out[$col] = (int)$v; break;
                case 'bool': $out[$col] = filter_var($v, FILTER_VALIDATE_BOOLEAN) ? 1 : 0; break;
                case 'date':
                    $d = DateTime::createFromFormat('Y-m-d', (string)$v);
                    if (!$d || $d->format('Y-m-d') !== (string)$v) fail("Invalid date for $col", 422);
                    $out[$col] = $v;
                    break;
                default:     $out[$col] = trim((string)$v);
            }
        }
        if (!$partial) {
            foreach ($required as $col) {
                if (!isset($out[$col]) || $out[$col] === '') fail("$col is required", 422);
            }
        } else {
            foreach ($required as $col) {
                if (isset($out[$col]) && $out[$col] === '') fail("$col cannot be empty", 422);
            }
        }
        return $out;
    };

    $find = function (int $id) use ($pdo, $table) {
        $s = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
        $s->execute([$id]);
        return $s->fetch();
    };

    try {
        switch ($method) {
            case 'GET':
                if ($filter && isset($_GET[$filter])) {
                    $st = $pdo->prepare("SELECT * FROM `$table` WHERE `$filter` = ? ORDER BY $order");
                    $st->execute([(string)$_GET[$filter]]);
                    respond($st->fetchAll());
                }
                respond($pdo->query("SELECT * FROM `$table` ORDER BY $order")->fetchAll());
            case 'POST':
                $data = $clean($body, false);
                $cols = array_keys($data);
                $sql = sprintf(
                    'INSERT INTO `%s` (%s) VALUES (%s)',
                    $table,
                    implode(',', array_map(fn($c) => "`$c`", $cols)),
                    implode(',', array_fill(0, count($cols), '?'))
                );
                $pdo->prepare($sql)->execute(array_values($data));
                respond($find((int)$pdo->lastInsertId()), 201);
            case 'PUT':
                if (!$id) fail('id is required', 422);
                if (!$find($id)) fail('Not found', 404);
                $data = $clean($body, true);
                if ($data) {
                    $set = implode(',', array_map(fn($c) => "`$c` = ?", array_keys($data)));
                    $pdo->prepare("UPDATE `$table` SET $set WHERE id = ?")->execute([...array_values($data), $id]);
                }
                respond($find($id));
            case 'DELETE':
                // Bulk delete: ?ids=1,2,3
                if (isset($_GET['ids'])) {
                    $ids = array_values(array_unique(array_filter(array_map('intval', explode(',', (string)$_GET['ids'])))));
                    if (!$ids) fail('ids is required', 422);
                    if (count($ids) > 500) fail('Too many ids', 422);
                    $s = $pdo->prepare("DELETE FROM `$table` WHERE id IN (" . implode(',', array_fill(0, count($ids), '?')) . ')');
                    $s->execute($ids);
                    respond(['deleted' => $s->rowCount()]);
                }
                if (!$id) fail('id is required', 422);
                $s = $pdo->prepare("DELETE FROM `$table` WHERE id = ?");
                $s->execute([$id]);
                if (!$s->rowCount()) fail('Not found', 404);
                respond(null);
            default:
                fail('Method not allowed', 405);
        }
    } catch (PDOException $e) {
        db_fail($e);
    }
}
