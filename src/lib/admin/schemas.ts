import { z } from 'zod';

// ---------- HeroContent ----------
export const heroContentSchema = z.object({
  headline: z.string().min(1, 'Headline is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  cta1Label: z.string().min(1),
  cta1Url: z.string().min(1),
  cta2Label: z.string().min(1),
  cta2Url: z.string().min(1),
  trustPills: z.array(z.string()),
  tickerItems: z.array(z.string()),
});

// ---------- Service ----------
export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  tags: z.array(z.string()),
  items: z.array(z.string()),
  steps: z.array(z.string()),
  ctaLabel: z.string().min(1, 'CTA label is required'),
  order: z.number().int().optional().default(0),
});

// ---------- Project ----------
export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  featured: z.boolean().optional().default(false),
  homepageTeaser: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});

// ---------- CaseStudy ----------
export const caseStudySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  results: z.string().min(1, 'Results is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
});

// ---------- Testimonial ----------
export const testimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  avatarUrl: z.string().min(1, 'Avatar URL is required'),
  order: z.number().int().optional().default(0),
});

// ---------- Faq ----------
export const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  page: z.string().optional().default('homepage'),
  order: z.number().int().optional().default(0),
});

// ---------- TeamMember ----------
export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  order: z.number().int().optional().default(0),
});

// ---------- Stat ----------
export const statSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  order: z.number().int().optional().default(0),
});

// ---------- TechTool ----------
export const techToolSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().min(1, 'Logo URL is required'),
  order: z.number().int().optional().default(0),
});

// ---------- AboutContent ----------
export const aboutContentSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

// ---------- Value ----------
export const valueSchema = z.object({
  icon: z.string().min(1, 'Icon is required'),
  label: z.string().min(1, 'Label is required'),
  order: z.number().int().optional().default(0),
});

// ---------- SiteSettings ----------
export const siteSettingsSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

// ---------- FooterLink ----------
export const footerLinkSchema = z.object({
  column: z.string().min(1, 'Column is required'),
  label: z.string().min(1, 'Label is required'),
  url: z.string().min(1, 'URL is required'),
  order: z.number().int().optional().default(0),
});

// ---------- Post ----------
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  coverImageUrl: z.string().min(1, 'Cover image URL is required'),
  published: z.boolean().optional().default(false),
});

// ---------- Schema map (keyed by URL slug) ----------
export const schemaMap: Record<string, z.ZodType> = {
  'hero-content': heroContentSchema,
  'service': serviceSchema,
  'project': projectSchema,
  'case-study': caseStudySchema,
  'testimonial': testimonialSchema,
  'faq': faqSchema,
  'team-member': teamMemberSchema,
  'stat': statSchema,
  'tech-tool': techToolSchema,
  'about-content': aboutContentSchema,
  'value': valueSchema,
  'site-settings': siteSettingsSchema,
  'footer-link': footerLinkSchema,
  'post': postSchema,
};

