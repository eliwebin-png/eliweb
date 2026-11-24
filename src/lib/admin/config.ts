import { prisma } from '@/lib/prisma';

type PrismaDelegate = {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<unknown | null>;
  create: (args: Record<string, unknown>) => Promise<unknown>;
  update: (args: Record<string, unknown>) => Promise<unknown>;
  delete: (args: Record<string, unknown>) => Promise<unknown>;
};

interface ModelConfig {
  delegate: PrismaDelegate;
  orderBy?: Record<string, string>;
  revalidate: string[];
}

/** Allow-list of URL slugs → Prisma delegates + metadata */
export const modelConfigs: Record<string, ModelConfig> = {
  'hero-content': {
    delegate: prisma.heroContent as unknown as PrismaDelegate,
    revalidate: ['/', '/services'],
  },
  'service': {
    delegate: prisma.service as unknown as PrismaDelegate,
    orderBy: { order: 'asc' },
    revalidate: ['/', '/services'],
  },
  'project': {
    delegate: prisma.project as unknown as PrismaDelegate,
    orderBy: { order: 'asc' },
    revalidate: ['/', '/portfolio'],
  },
  'case-study': {
    delegate: prisma.caseStudy as unknown as PrismaDelegate,
    revalidate: ['/'],
  },
  'testimonial': {
    delegate: prisma.testimonial as unknown as PrismaDelegate,
    orderBy: { order: 'asc' },
    revalidate: ['/'],
  },
  'faq': {
    delegate: prisma.faq as unknown as PrismaDelegate,
    orderBy: { order: 'asc' },
    revalidate: ['/', '/services', '/contact'],
  },
  'team-member': {
    delegate: prisma.teamMember as unknown as PrismaDelegate,
    orderBy: { order: 'asc' },
    revalidate: ['/about'],
  },
  'stat': {
    delegate: prisma.stat as unknown as PrismaDelegate,
    orderBy: { order: 'asc' },
    revalidate: ['/', '/about'],
  },
  'tech-tool': {
    delegate: prisma.techTool as unknown as PrismaDelegate,
    orderBy: { order: 'asc' },
    revalidate: ['/services'],
  },
  'about-content': {
    delegate: prisma.aboutContent as unknown as PrismaDelegate,
    revalidate: ['/about'],
  },
  'value': {
    delegate: prisma.value as unknown as PrismaDelegate,
    orderBy: { order: 'asc' },
    revalidate: ['/about'],
  },
  'site-settings': {
    delegate: prisma.siteSettings as unknown as PrismaDelegate,
    revalidate: ['/', '/about', '/services', '/portfolio', '/blog', '/contact', '/privacy', '/security', '/terms', '/cookies'],
  },
  'footer-link': {
    delegate: prisma.footerLink as unknown as PrismaDelegate,
    orderBy: { order: 'asc' },
    revalidate: ['/', '/about', '/services', '/portfolio', '/blog', '/contact', '/privacy', '/security', '/terms', '/cookies'],
  },
  'post': {
    delegate: prisma.post as unknown as PrismaDelegate,
    orderBy: { createdAt: 'desc' },
    revalidate: ['/blog'],
  },
};

/** All allowed model slugs */
export const ALLOWED_MODELS = Object.keys(modelConfigs);

