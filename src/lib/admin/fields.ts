export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'array' | 'select';
  placeholder?: string;
  options?: string[];
}

export interface ModelPageConfig {
  slug: string;
  title: string;
  singular: string;
  fields: FieldConfig[];
  singleRecord?: boolean; // HeroContent
  listColumns: string[];  // field names shown in the table
}

export const modelPageConfigs: Record<string, ModelPageConfig> = {
  'hero-content': {
    slug: 'hero-content',
    title: 'Hero Content',
    singular: 'Hero',
    singleRecord: true,
    listColumns: ['headline'],
    fields: [
      { name: 'headline', label: 'Headline', type: 'text', placeholder: 'We Build Websites. / We Craft Videos.' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Your tagline...' },
      { name: 'cta1Label', label: 'CTA 1 Label', type: 'text', placeholder: 'Start Your Project' },
      { name: 'cta1Url', label: 'CTA 1 URL', type: 'text', placeholder: '/contact' },
      { name: 'cta2Label', label: 'CTA 2 Label', type: 'text', placeholder: 'Watch Our Projects' },
      { name: 'cta2Url', label: 'CTA 2 URL', type: 'text', placeholder: '/portfolio' },
      { name: 'trustPills', label: 'Trust Pills', type: 'array', placeholder: 'e.g. 50+ Projects Delivered' },
      { name: 'tickerItems', label: 'Ticker Items', type: 'array', placeholder: 'e.g. Software Development' },
    ],
  },
  'service': {
    slug: 'service',
    title: 'Services',
    singular: 'Service',
    listColumns: ['title', 'category', 'order'],
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'software / marketing / creative' },
      { name: 'imageUrl', label: 'Image URL', type: 'text' },
      { name: 'tags', label: 'Tags', type: 'array', placeholder: 'Add a tag' },
      { name: 'items', label: 'Deliverable Items', type: 'array', placeholder: 'Add an item' },
      { name: 'steps', label: 'Workflow Steps', type: 'array', placeholder: 'Add a step' },
      { name: 'ctaLabel', label: 'CTA Label', type: 'text', placeholder: 'Start Your Project' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  'project': {
    slug: 'project',
    title: 'Projects',
    singular: 'Project',
    listColumns: ['name', 'category', 'featured', 'order'],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'Web Projects / Video Projects' },
      { name: 'tags', label: 'Tags', type: 'array', placeholder: 'Add a tag' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'imageUrl', label: 'Image URL', type: 'text' },
      { name: 'featured', label: 'Featured', type: 'boolean' },
      { name: 'homepageTeaser', label: 'Show on Homepage', type: 'boolean' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  'case-study': {
    slug: 'case-study',
    title: 'Case Studies',
    singular: 'Case Study',
    listColumns: ['title'],
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'results', label: 'Results', type: 'textarea' },
      { name: 'imageUrl', label: 'Image URL', type: 'text' },
    ],
  },
  'testimonial': {
    slug: 'testimonial',
    title: 'Testimonials',
    singular: 'Testimonial',
    listColumns: ['name', 'role', 'order'],
    fields: [
      { name: 'quote', label: 'Quote', type: 'textarea' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'avatarUrl', label: 'Avatar URL', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  'faq': {
    slug: 'faq',
    title: 'FAQs',
    singular: 'FAQ',
    listColumns: ['question', 'page', 'order'],
    fields: [
      { name: 'question', label: 'Question', type: 'text' },
      { name: 'answer', label: 'Answer', type: 'textarea' },
      { name: 'page', label: 'Page', type: 'select', options: ['homepage', 'contact', 'services'] },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  'team-member': {
    slug: 'team-member',
    title: 'Team Members',
    singular: 'Team Member',
    listColumns: ['name', 'role', 'order'],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'imageUrl', label: 'Photo URL', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  'stat': {
    slug: 'stat',
    title: 'Stats',
    singular: 'Stat',
    listColumns: ['value', 'label', 'order'],
    fields: [
      { name: 'value', label: 'Value', type: 'text', placeholder: '50+' },
      { name: 'label', label: 'Label', type: 'text', placeholder: 'Projects Delivered' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  'tech-tool': {
    slug: 'tech-tool',
    title: 'Tech & Tools',
    singular: 'Tech Tool',
    listColumns: ['name', 'order'],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'logoUrl', label: 'Logo URL', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  'about-content': {
    slug: 'about-content',
    title: 'About Content',
    singular: 'About Entry',
    listColumns: ['key', 'value'],
    fields: [
      { name: 'key', label: 'Key', type: 'text', placeholder: 'mission / vision / story_heading' },
      { name: 'value', label: 'Value', type: 'textarea' },
    ],
  },
  'value': {
    slug: 'value',
    title: 'Values',
    singular: 'Value',
    listColumns: ['icon', 'label', 'order'],
    fields: [
      { name: 'icon', label: 'Icon (emoji or name)', type: 'text', placeholder: '🔥 or Flame' },
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  'site-settings': {
    slug: 'site-settings',
    title: 'Site Settings',
    singular: 'Setting',
    listColumns: ['key', 'value'],
    fields: [
      { name: 'key', label: 'Key', type: 'text', placeholder: 'email / phone / brand_tagline' },
      { name: 'value', label: 'Value', type: 'textarea' },
    ],
  },
  'footer-link': {
    slug: 'footer-link',
    title: 'Footer Links',
    singular: 'Footer Link',
    listColumns: ['label', 'column', 'url', 'order'],
    fields: [
      { name: 'column', label: 'Column', type: 'select', options: ['company', 'services'] },
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'url', label: 'URL', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  'post': {
    slug: 'post',
    title: 'Blog Posts',
    singular: 'Post',
    listColumns: ['title', 'slug', 'published'],
    fields: [
      { name: 'title', label: 'Post Title', type: 'text' },
      { name: 'slug', label: 'Slug (URL friendly)', type: 'text', placeholder: 'architecting-for-speed' },
      { name: 'excerpt', label: 'Short Excerpt', type: 'textarea' },
      { name: 'content', label: 'Full Article Content (Markdown/Text)', type: 'textarea' },
      { name: 'coverImageUrl', label: 'Cover Image URL', type: 'text' },
      { name: 'published', label: 'Published & Live', type: 'boolean' },
    ],
  },
};

/** Sidebar navigation grouping */
export const sidebarGroups = [
  {
    label: 'CONTENT',
    items: [
      { slug: 'hero-content', label: 'Hero Content' },
      { slug: 'post', label: 'Blog Posts' },
      { slug: 'service', label: 'Services' },
      { slug: 'project', label: 'Projects' },
      { slug: 'case-study', label: 'Case Studies' },
      { slug: 'testimonial', label: 'Testimonials' },
      { slug: 'faq', label: 'FAQs' },
      { slug: 'team-member', label: 'Team Members' },
    ],
  },
  {
    label: 'DATA',
    items: [
      { slug: 'stat', label: 'Stats' },
      { slug: 'tech-tool', label: 'Tech & Tools' },
      { slug: 'about-content', label: 'About Content' },
      { slug: 'value', label: 'Values' },
    ],
  },
  {
    label: 'INBOX & LEADS',
    items: [
      { slug: 'submissions/contact', label: 'Contact Submissions' },
      { slug: 'submissions/enquiry', label: 'Enquiry Submissions' },
      { slug: 'submissions/newsletter', label: 'Newsletter Subscribers' },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { slug: 'site-settings', label: 'Site Settings' },
      { slug: 'footer-link', label: 'Footer Links' },
    ],
  },
];

export const modelConfigsMap = modelPageConfigs;


