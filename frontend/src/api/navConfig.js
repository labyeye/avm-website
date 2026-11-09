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
      ['Why AVM', 'why-avm'],
      ["Principal's Welcome", 'principals-welcome'],
      ['Virtual Tour', 'virtual-tour'],
      ['Working Committee', 'working-committee'],
    ]),
  },
  {
    label: 'Admission', to: '/admission',
    children: sub('admission', [
      ['Procedure', 'procedure'],
      ['Online Registration', 'online-registration'],
      ['Age Criteria', 'age-criteria'],
      ['Fee Structure', 'fee-structure'],
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
    label: 'Sports & Events', to: '/sports-and-activities',
    children: sub('sports-and-activities', [
      ['Sports Overview', 'sports-overview'],
      ['Student Leadership', 'student-leadership'],
      ['Achievements', 'achievements'],
    ]).concat([{ label: 'Events', to: '/events' }]),
  },
  {
    label: 'House System', to: '/pastoral',
    children: sub('pastoral/house-system', [
      ['Knowledge House', 'knowledge-house'],
      ['Wisdom House', 'wonder-house'],
      ['Intelligence House', 'intelligent-house'],
      ['Confidence House', 'confidence-house'],
    ]),
  },
  { label: 'Public Disclosure', to: '/public-disclosure' },
  { label: 'Alumni', to: '/alumni' },
  { label: 'Contact Us', to: '/contact-us' },
];
