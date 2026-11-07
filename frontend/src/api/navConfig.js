// Main navigation — edit freely. Each item: { label, to, children?: [...] }; children can nest (submenus).
// Child links are /<parent-slug>/<child-slug>; each one becomes a CMS page with that full slug.
const sub = (parent, items) =>
  items.map(([label, slug, children]) => ({
    label,
    to: `/${parent}/${slug}`,
    ...(children ? { children: sub(`${parent}/${slug}`, children) } : {}),
  }));

export const NAV = [
  { label: 'Home', to: '/' },
  {
    label: 'About Us', to: '/about-us',
    children: sub('about-us', [
      ['About AVM', 'about-avm'],
      ['Vision & Mission', 'vision-mission'],
      ["Principal's Welcome", 'principals-welcome'],
      ['Virtual Tour', 'virtual-tour'],
      ['Testimonials', 'testimonials'],
    ]),
  },
  {
    label: 'Academics', to: '/academics',
    children: sub('academics', [
      ['Curriculum', 'curriculum'],
      ['Approach to Learning', 'approach-to-learning'],
      ['Facilities', 'facilities'],
    ]),
  },
  {
    label: 'Governing Body', to: '/governing-body',
    children: sub('governing-body', [
      ["Founder's Message", 'founders-message'],
      ['Board of Governors', 'board-of-governors'],
      ['About President', 'about-president'],
    ]),
  },
  {
    label: 'Sports & Activities', to: '/sports-and-activities',
    children: sub('sports-and-activities', [
      ['Sports Overview', 'sports-overview'],
      ['Student Leadership', 'student-leadership'],
      ['Activities', 'activities'],
    ]),
  },
  { label: 'Events', to: '/events' },
  {
    label: 'Downloads', to: '/downloads',
    children: sub('downloads', [
      ['Annual Calendar 2026-2027', 'annual-calendar'],
      ['E-Brochure', 'e-brochure'],
      ['Yearbook 2025-2026', 'yearbook-2025-2026'],
      ['Old Year Books', 'old-year-books'],
      ['Newsletter', 'newsletter'],
      ['Results', 'results'],
      ['Transfer Certificate', 'transfer-certificate'],
    ]),
  },
  {
    label: 'Pastoral', to: '/pastoral',
    children: sub('pastoral', [
      ['Overview', 'overview'],
      ['House System', 'house-system', [
        ['Knowledge House', 'knowledge-house'],
        ['Wonder House', 'wonder-house'],
        ['Intelligent House', 'intelligent-house'],
        ['Confidence House', 'confidence-house'],
      ]],
    ]),
  },
  // Dropdown is built from the documents on this page (Admin → Public Disclosure → Documents); clicking one downloads the file.
  { label: 'Public Disclosure', to: '/public-disclosure', dynamicFrom: 'public-disclosure' },
  { label: 'Alumni', to: '/alumni' },
  {
    label: 'Admission', to: '/admission',
    children: sub('admission', [
      ['Procedure', 'procedure'],
      ['Online Registration', 'online-registration'],
      ['Fee Structure', 'fee-structure'],
      ['Scholarships and Bursaries', 'scholarships-and-bursaries'],
    ]),
  },
  {
    label: 'Contact Us', to: '/contact-us',
    children: sub('contact-us', [
      ['Enquire Now', 'enquire-now'],
      ['Apply Now', 'apply-now'],
    ]),
  },
];
