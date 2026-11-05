import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { sendContact } from '../../api/public';
import { errorMessage } from '../../api/axiosInstance';
import { useToast } from '../admin/Toast';
import Reveal from './Reveal';
import useSettings from '../../api/useSettings';

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactSection() {
  const s = useSettings();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await sendContact(form);
      toast.success('Thank you! We will get back to you shortly.');
      setForm(EMPTY);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not send your message'));
    } finally {
      setBusy(false);
    }
  };

  const info = [
    { Icon: MapPin, text: s.address },
    { Icon: Mail, text: s.contact_email, href: s.contact_email && `mailto:${s.contact_email}` },
    { Icon: Phone, text: s.contact_phone, href: s.contact_phone && `tel:${s.contact_phone.replace(/\s/g, '')}` },
  ].filter((i) => i.text);

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-2">
      <Reveal from="left">
      <div className="space-y-5">
        {info.map(({ Icon, text, href }) => (
          <div key={text} className="flex items-start gap-3 transition duration-300 hover:-translate-y-1">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-950"><Icon size={18} /></span>
            {href ? <a href={href} className="pt-2 hover:text-gold-400">{text}</a> : <span className="pt-2">{text}</span>}
          </div>
        ))}
      </div>
      </Reveal>
      <Reveal from="right">
      <form onSubmit={submit} className="space-y-3 rounded-2xl bg-white/15 p-6">
        <input className="field" required placeholder="Your name" value={form.name} onChange={set('name')} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field" type="email" required placeholder="Email" value={form.email} onChange={set('email')} />
          <input className="field" type="tel" placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} />
        </div>
        <input className="field" placeholder="Subject" value={form.subject} onChange={set('subject')} />
        <textarea className="field" rows={5} required placeholder="Your message" value={form.message} onChange={set('message')} />
        <button disabled={busy} className="btn-gold w-full">{busy ? 'Sending…' : 'Send Message'}</button>
      </form>
      </Reveal>
    </div>
  );
}
