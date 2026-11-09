import { Phone } from 'lucide-react';
import { InstagramIcon, YouTubeIcon, WhatsAppIcon } from './BrandIcons';

// One floating button: round icon; on hover the pill slides out to the left and shows its label.
function Fab({ href, label, text, bg, textCls, external = true, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group flex h-12 items-center overflow-hidden rounded-full shadow-lg transition hover:shadow-xl ${bg} ${textCls}`}
    >
      <span className="max-w-0 whitespace-nowrap pl-0 text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:max-w-[160px] group-hover:pl-4 group-hover:opacity-100 group-focus-visible:max-w-[160px] group-focus-visible:pl-4 group-focus-visible:opacity-100">{text}</span>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center">{children}</span>
    </a>
  );
}

// Always-visible quick actions for parents. Number/links come from Admin → Settings (contact_phone, instagram_url, youtube_url).
export default function FloatingActions({ settings }) {
  const phone = settings?.contact_phone || '';
  const digits = phone.replace(/\D/g, '');
  const wa = digits ? `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}?text=${encodeURIComponent('Hello, I would like to know about admissions at AVM.')}` : '';
  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3 print:hidden">
      {settings?.instagram_url && <Fab href={settings.instagram_url} label="Instagram" text="Follow us" bg="bg-white" textCls="text-navy-900"><InstagramIcon className="h-7 w-7" /></Fab>}
      {settings?.youtube_url && <Fab href={settings.youtube_url} label="YouTube" text="Subscribe us" bg="bg-white" textCls="text-navy-900"><YouTubeIcon className="h-7 w-7" /></Fab>}
      {phone && <Fab href={`tel:${phone.replace(/\s/g, '')}`} label="Call the school" text="Call us" bg="bg-white" textCls="text-navy-700" external={false}><Phone size={20} /></Fab>}
      {wa && <Fab href={wa} label="Chat on WhatsApp" text="Message us" bg="bg-green-500" textCls="text-white"><WhatsAppIcon className="h-7 w-7" /></Fab>}
    </div>
  );
}
