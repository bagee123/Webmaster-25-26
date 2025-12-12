const resources = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Community Resource ${i + 1}`,
  category: ['health', 'education', 'volunteering', 'events', 'support', 'recreation', 'nonprofits'][i % 7],
  description: 'Comprehensive community resource providing support, services, and opportunities for residents.',
  phone: `(972) 304-${(3500 + (i % 100)).toString().padStart(4, '0')}`,
  email: `resource${i + 1}@coppelltx.gov`,
  website: 'www.coppellcommunity.org',
  address: `${100 + i} Main St, Coppell, TX 75019`,
  hours: 'Mon-Fri 8AM-6PM, Sat 9AM-2PM',
}));

export default resources;
