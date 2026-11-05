export default function About({ text, heading, subheading }) {
  const paragraphs = (text || '').split(/\n{2,}/).filter(Boolean);
  return (
    <section id="about" className="section scroll-mt-20 bg-navy-700">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold md:text-4xl">{heading || 'Welcome to Adarsh Vidya Mandir'}</h2>
        <p className="mb-8 mt-2 text-center text-lg text-white/90">{subheading || 'A Legacy of Excellence in Muzaffarpur, Bihar'}</p>
        <div className="space-y-5 text-sm text-justify leading-relaxed text-white/90 md:text-[15px]">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}
