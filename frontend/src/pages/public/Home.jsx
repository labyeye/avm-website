import SiteLayout from '../../components/public/SiteLayout';
import Hero from '../../components/public/Hero';
import About from '../../components/public/About';
import WhyAVM from '../../components/public/WhyAVM';
import Gallery from '../../components/public/Gallery';
import AdmissionForm from '../../components/public/AdmissionForm';
import Testimonials from '../../components/public/Testimonials';
import Reveal from '../../components/public/Reveal';
import useSettings from '../../api/useSettings';

export default function Home() {
  const s = useSettings();
  return (
    <SiteLayout>
      <Hero heading={s.hero_heading} image={s.hero_image} />
      <Reveal from="right" clip><About text={s.about_text} heading={s.about_heading} subheading={s.about_subheading} /></Reveal>
      <Reveal from="left" clip><WhyAVM /></Reveal>
      <Reveal from="right" clip><Gallery heading={s.gallery_heading} subheading={s.gallery_subheading} columns={s.gallery_columns} scroll={s.gallery_scroll} height={s.gallery_height} /></Reveal>
      <Reveal from="left" clip><AdmissionForm heading={s.admission_heading} subheading={s.admission_subheading} /></Reveal>
      <Reveal from="right" clip><Testimonials heading={s.testimonials_heading} subheading={s.testimonials_subheading} /></Reveal>
    </SiteLayout>
  );
}
