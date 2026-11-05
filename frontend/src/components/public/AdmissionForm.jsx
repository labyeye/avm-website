import { useState } from 'react';
import { submitAdmission } from '../../api/public';
import { errorMessage } from '../../api/axiosInstance';
import { useToast } from '../admin/Toast';
import { asset, withFallback } from '../../api/assets';

const CLASSES = ['Nursery', 'KG', ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)];
const EMPTY = { student_name: '', parent_name: '', email: '', phone: '', dob: '', class_applied: '' };

export default function AdmissionForm({ heading, subheading, showHeading = true }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await submitAdmission(form);
      toast.success('Thank you! Your enquiry has been submitted.');
      setForm(EMPTY);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not submit the form'));
    } finally {
      setBusy(false);
    }
  };

  const field = (k, label, type = 'text', placeholder) => (
    <div key={k}>
      <label htmlFor={k} className="mb-1 block text-xs font-semibold text-white">{label}</label>
      <input id={k} type={type} required value={form[k]} onChange={set(k)} placeholder={placeholder} max={type === 'date' ? new Date().toISOString().slice(0, 10) : undefined} className="field !py-1.5 !text-xs" />
    </div>
  );

  return (
    <section id="admissions" className="section scroll-mt-20 bg-navy-700">
      {showHeading && (
        <>
          <h2 className="text-center text-3xl font-medium">{heading || 'Admission Enquiry'}</h2>
          <p className="mb-8 mt-1 text-center text-white/90">{subheading || "Begin Your Child's Journey to Excellence"}</p>
        </>
      )}
      <div className="mx-auto grid max-w-5xl gap-6 rounded-2xl bg-white/15 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 md:grid-cols-2">
        <img
          src={asset('admission-form-bg.jpg')}
          onError={withFallback(600, 500, 'AVM Students', '16346b')}
          alt="AVM students"
          className="h-64 w-full rounded-xl object-cover md:h-full"
        />
        <form onSubmit={submit}>
          <h3 className="mb-3 text-lg">Enter Details</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {field('student_name', "Student's Name", 'text', "Enter student's name")}
            {field('parent_name', "Parent's Name", 'text', "Enter parent's name")}
            {field('email', "Parent's Email Address", 'email', "Enter parent's email")}
            {field('phone', "Parent's Phone Number", 'tel', "Enter parent's phone")}
            {field('dob', "Student Date of Birth", 'date')}
            <div>
              <label htmlFor="class_applied" className="mb-1 block text-xs font-semibold text-white">Enter Grade</label>
              <select id="class_applied" required value={form.class_applied} onChange={set('class_applied')} className="field !py-1.5 !text-xs">
                <option value="" disabled>Select class</option>
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button disabled={busy} className="mx-auto mt-5 block rounded-full bg-navy-950 px-10 py-2 text-xs font-bold tracking-wide transition hover:bg-black disabled:opacity-60">
            {busy ? 'SUBMITTING…' : 'SUBMIT'}
          </button>
        </form>
      </div>
    </section>
  );
}
