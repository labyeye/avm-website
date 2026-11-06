import { lazy } from 'react';
import SiteLayout from '../../components/public/SiteLayout';
import Hero from '../../components/public/Hero';
import LazySection from '../../components/public/LazySection';
import Reveal from '../../components/public/Reveal';
import useSettings from '../../api/useSettings';

const About = lazy(() => import('../../components/public/About'));
const WhyAVM = lazy(() => import('../../components/public/WhyAVM'));
const Gallery = lazy(() => import('../../components/public/Gallery'));
const AdmissionForm = lazy(() => import('../../components/public/AdmissionForm'));
const Testimonials = lazy(() => import('../../components/public/Testimonials'));

export default function Home() {
  const s = useSettings();
  return (
    <SiteLayout>
      <Hero heading={s.hero_heading} image={s.hero_image} />
      <LazySection><Reveal from="right" clip><About text={s.about_text} heading={s.about_heading} subheading={s.about_subheading} /></Reveal></LazySection>
      <LazySection><Reveal from="left" clip><WhyAVM /></Reveal></LazySection>
      <LazySection><Reveal from="right" clip><Gallery heading={s.gallery_heading} subheading={s.gallery_subheading} columns={s.gallery_columns} scroll={s.gallery_scroll} height={s.gallery_height} /></Reveal></LazySection>
      <LazySection><Reveal from="left" clip><AdmissionForm heading={s.admission_heading} subheading={s.admission_subheading} /></Reveal></LazySection>
      <LazySection><Reveal from="right" clip><Testimonials heading={s.testimonials_heading} subheading={s.testimonials_subheading} /></Reveal></LazySection>
    </SiteLayout>
  );
}
