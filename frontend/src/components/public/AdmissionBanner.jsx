import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Slim "admissions open" strip under the notice ticker. Text: Admin → Home Page → Parent Info (admission_banner). Empty = hidden.
export default function AdmissionBanner({ text }) {
  if (!text) return null;
  return (
    <Link to="/admission/online-registration" className="flex items-center justify-center gap-2 bg-navy-700 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-navy-800">
      <span>{text}</span> <span className="flex items-center gap-1 text-gold-400">Enquire Now <ArrowRight size={14} /></span>
    </Link>
  );
}
