import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';
import HeaderNav from '@/components/HeaderNav';
import SiteFooter from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await dbQuery(() => prisma.post.findUnique({ where: { slug } }), null);
  if (!post) {
    return { title: 'Article | EliWeb.in' };
  }
  const siteUrl = (process.env.NEXTAUTH_URL || 'https://eliweb.in').replace(/\/$/, '');
  const url = `${siteUrl}/blog/${slug}`;
  const title = `${post.title} | EliWeb.in Journal`;
  const description = post.excerpt;
  const image = post.coverImageUrl || `${siteUrl}/eliweb-logo.png`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [post, settingsData] = await Promise.all([
    dbQuery(() => prisma.post.findUnique({ where: { slug } }), null),
    dbQuery(() => prisma.siteSettings.findMany(), []),
  ]);

  const settings: Record<string, string> = {};
  settingsData.forEach((s) => {
    settings[s.key] = s.value;
  });

  // If DB post not found, check fallback articles
  let article = post;
  if (!article) {
    const fallbackArticles: Record<string, { title: string; excerpt: string; content: string; coverImageUrl: string; createdAt: Date }> = {
      'architecting-for-speed': {
        title: 'Architecting for Speed: How Next.js App Router & Serverless Postgres Power Modern Applications',
        excerpt: 'A comprehensive exploration of streaming SSR, server components, and connection pooler optimization for sub-100ms global response times.',
        content: `Modern web architecture requires uncompromising performance. When latency rises, user engagement drops and conversion rates plummet.

At EliWeb, we optimize every layer of the technology stack: from Next.js server components streaming HTML directly from the edge, to Neon Serverless PostgreSQL instances with pooled transaction caching.

By decoupling data hydration from client-side bundle execution, applications render within single-digit milliseconds globally. Combined with intelligent revalidation and automated static fallbacks, your platform stays resilient even during multi-region traffic spikes.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        createdAt: new Date('2026-09-18'),
      },
      'editorial-web-design': {
        title: 'Editorial Web Design: Moving Beyond Generic Framework Templates in 2026',
        excerpt: 'Why leading tech enterprises are abandoning cookie-cutter CSS kits in favor of custom design systems with bespoke typography and atmospheric lighting.',
        content: `Every brand wants to stand out, yet most commercial websites today look identical. Generic CSS component kits have democratized web development at the cost of brand identity.

Editorial web design reclaims individuality. By pairing bespoke serif typography with atmospheric background gradients and fluid layouts, digital atelier experiences create memorable impressions that elevate customer perception and establish market authority.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        createdAt: new Date('2026-09-12'),
      },
      'psychology-of-video-conversion': {
        title: 'The Psychology of Video Conversion: Crafting Cinematic Brand Stories that Drive Pipeline',
        excerpt: 'How 4K high-definition video production combined with narrative pacing converts curious visitors into long-term enterprise clients.',
        content: `Visual storytelling is the most potent conversion medium available today. A compelling 60-second video conveys technical architecture, executive ethos, and customer trust faster than pages of technical documentation.

By structuring high-retention video arcs around problem identification, structural resolution, and measurable outcomes, brand videos become self-sustaining acquisition engines across organic search and paid campaigns.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
        createdAt: new Date('2026-08-28'),
      },
    };

    const fb = fallbackArticles[slug];
    if (!fb) {
      notFound();
    }
    article = {
      id: slug,
      slug,
      title: fb.title,
      excerpt: fb.excerpt,
      content: fb.content,
      coverImageUrl: fb.coverImageUrl,
      published: true,
      createdAt: fb.createdAt,
      updatedAt: fb.createdAt,
    };
  }

  const postCategoryMap: Record<string, { category: string; author: string }> = {
    'architecting-for-speed': { category: 'Software Architecture', author: 'Elena Rostova' },
    'editorial-web-design': { category: 'Design & UI/UX', author: 'Marcus Vance' },
    'psychology-of-video-conversion': { category: 'Video & Content', author: 'David Chen' },
    'prisma-orm-best-practices': { category: 'Database Engineering', author: 'Kavita Sharma' },
  };

  const meta = postCategoryMap[article.slug] || { category: 'Digital Engineering', author: 'EliWeb Editorial' };

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const siteUrl = (process.env.NEXTAUTH_URL || 'https://eliweb.in').replace(/\/$/, '');
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImageUrl || `${siteUrl}/eliweb-logo.png`,
    datePublished: article.createdAt ? new Date(article.createdAt).toISOString() : new Date().toISOString(),
    dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: meta.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'EliWeb.in',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/eliweb-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <HeaderNav alwaysVisible={true} />

      <main className="subpage-main">
        <article className="container" style={styles.articleContainer}>
          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            <Link href="/blog" style={styles.backLink}>
              ← Back to All Articles
            </Link>
            <span style={styles.dot}>•</span>
            <span style={styles.categoryBadge}>{meta.category}</span>
          </div>

          {/* Title Header */}
          <header style={styles.header}>
            <h1 style={styles.title}>{article.title}</h1>
            <p style={styles.lead}>{article.excerpt}</p>
            <div style={styles.metaRow}>
              <span style={styles.authorBadge}>By {meta.author}</span>
              <span style={styles.dot}>•</span>
              <time style={styles.date}>{formattedDate}</time>
            </div>
          </header>

          {/* Cover Image */}
          {article.coverImageUrl && (
            <div style={styles.coverWrapper}>
              <Image
                src={article.coverImageUrl}
                alt={article.title}
                width={1200}
                height={640}
                style={styles.coverImg}
                priority
              />
            </div>
          )}

          {/* Content Body */}
          <div style={styles.contentBody}>
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} style={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Consultation CTA Banner */}
          <div style={styles.ctaBanner}>
            <h3 style={styles.ctaTitle}>Ready to build scalable digital experiences?</h3>
            <p style={styles.ctaText}>
              Collaborate directly with our engineering architects and creative directors on your next product release.
            </p>
            <Link href="/contact" className="btn-brand-solid">
              Schedule Free Consultation &rarr;
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  articleContainer: {
    maxWidth: '840px',
    margin: '0 auto',
    padding: '40px 24px 80px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    fontSize: '0.85rem',
  },
  backLink: {
    color: '#0066FF',
    textDecoration: 'none',
    fontWeight: 600,
  },
  dot: {
    color: '#666',
  },
  categoryBadge: {
    color: '#00C2CB',
    fontWeight: 600,
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    lineHeight: 1.25,
    color: '#191817',
    margin: '0 0 16px',
    letterSpacing: '-0.02em',
  },
  lead: {
    fontSize: '1.2rem',
    lineHeight: 1.6,
    color: '#585550',
    margin: '0 0 20px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.85rem',
    color: '#8E8A82',
  },
  authorBadge: {
    fontWeight: 600,
    color: '#191817',
  },
  date: {
    color: '#8E8A82',
  },
  coverWrapper: {
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '40px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
  },
  coverImg: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
  },
  contentBody: {
    fontSize: '1.125rem',
    lineHeight: 1.85,
    color: '#2a2825',
    marginBottom: '60px',
  },
  paragraph: {
    marginBottom: '24px',
  },
  ctaBanner: {
    background: '#141413',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    color: '#F6F3EE',
  },
  ctaTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 0 12px',
    color: '#fff',
  },
  ctaText: {
    fontSize: '0.95rem',
    color: '#9E9A92',
    maxWidth: '520px',
    margin: '0 auto 24px',
    lineHeight: 1.5,
  },
};

