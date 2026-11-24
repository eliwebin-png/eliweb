import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';
import HeaderNav from '@/components/HeaderNav';
import SiteFooter from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog & Insights | EliWeb.in — Engineering, Architecture & Video Craft',
  description: 'Deep dives, architectural perspectives, and growth engineering playbooks from the EliWeb technical team.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog & Insights | EliWeb.in — Engineering, Architecture & Video Craft',
    description: 'Deep dives, architectural perspectives, and growth engineering playbooks from the EliWeb technical team.',
    url: '/blog',
  },
};

export default async function BlogPage() {
  const [dbPosts, settingsData] = await Promise.all([
    dbQuery(() => prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }), []),
    dbQuery(() => prisma.siteSettings.findMany(), []),
  ]);

  const settings: Record<string, string> = {};
  settingsData.forEach((s) => {
    settings[s.key] = s.value;
  });

  const fallbackArticles = [
    {
      id: 'art-1',
      slug: 'architecting-for-speed',
      title: 'Architecting for Speed: How Next.js App Router & Serverless Postgres Power Modern Applications',
      excerpt:
        'A comprehensive exploration of streaming SSR, server components, and connection pooler optimization for sub-100ms global response times.',
      category: 'Software Architecture',
      readTime: '6 min read',
      date: 'September 18, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      author: 'Elena Rostova',
      featured: true,
    },
    {
      id: 'art-2',
      slug: 'editorial-web-design',
      title: 'Editorial Web Design: Moving Beyond Generic Framework Templates in 2026',
      excerpt:
        'Why leading tech enterprises are abandoning cookie-cutter CSS kits in favor of custom design systems with bespoke typography and atmospheric lighting.',
      category: 'Design & UI/UX',
      readTime: '4 min read',
      date: 'September 12, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      author: 'Marcus Vance',
      featured: false,
    },
    {
      id: 'art-3',
      slug: 'psychology-of-video-conversion',
      title: 'The Psychology of Video Conversion: Crafting Cinematic Brand Stories that Drive Pipeline',
      excerpt:
        'How 4K high-definition video production combined with narrative pacing converts curious visitors into long-term enterprise clients.',
      category: 'Video & Content',
      readTime: '5 min read',
      date: 'August 28, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      author: 'David Chen',
      featured: false,
    },
    {
      id: 'art-4',
      slug: 'prisma-orm-best-practices',
      title: 'Prisma ORM Best Practices: Zero-Downtime Migrations & Relational Integrity',
      excerpt:
        'Field-tested patterns for scaling PostgreSQL schemas, managing complex foreign keys, and maintaining blazing fast read caches in high-traffic applications.',
      category: 'Database Engineering',
      readTime: '7 min read',
      date: 'August 15, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      author: 'Kavita Sharma',
      featured: false,
    },
  ];

  const postCategoryMap: Record<string, { category: string; author: string }> = {
    'architecting-for-speed': { category: 'Software Architecture', author: 'Elena Rostova' },
    'editorial-web-design': { category: 'Design & UI/UX', author: 'Marcus Vance' },
    'psychology-of-video-conversion': { category: 'Video & Content', author: 'David Chen' },
    'prisma-orm-best-practices': { category: 'Database Engineering', author: 'Kavita Sharma' },
  };

  const articles =
    dbPosts.length > 0
      ? dbPosts.map((p, idx) => {
          const meta = postCategoryMap[p.slug] || { category: 'Digital Engineering', author: 'EliWeb Editorial' };
          return {
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            category: meta.category,
            readTime: `${Math.max(3, Math.ceil(p.content.split(' ').length / 180))} min read`,
            date: new Date(p.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            imageUrl: p.coverImageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
            author: meta.author,
            featured: idx === 0,
          };
        })
      : fallbackArticles;

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const regularArticles = articles.filter((a) => a.id !== featuredArticle.id);

  const siteUrl = (process.env.NEXTAUTH_URL || 'https://eliweb.in').replace(/\/$/, '');
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'EliWeb.in Engineering & Design Blog',
    description: 'Deep dives, architectural perspectives, and growth engineering playbooks from the EliWeb technical team.',
    url: `${siteUrl}/blog`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <HeaderNav alwaysVisible={true} />

      <main className="subpage-main">
        {/* Featured Article */}
        <section className="blog-featured-section">
          <div className="container">
            <div className="featured-article-card">
              <div className="featured-img-wrap">
                <Link href={`/blog/${featuredArticle.slug}`}>
                  <Image
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    width={750}
                    height={450}
                    className="featured-article-img"
                    priority
                  />
                </Link>
              </div>
              <div className="featured-article-content">
                <div className="article-meta-row">
                  <span className="article-category-badge">{featuredArticle.category}</span>
                  <span className="article-date">{featuredArticle.date}</span>
                  <span className="article-readtime">&bull; {featuredArticle.readTime}</span>
                </div>
                <h2 className="featured-article-title">
                  <Link href={`/blog/${featuredArticle.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {featuredArticle.title}
                  </Link>
                </h2>
                <p className="featured-article-excerpt">{featuredArticle.excerpt}</p>
                <div className="featured-author-row">
                  <span className="author-label">By {featuredArticle.author}</span>
                  <Link href={`/blog/${featuredArticle.slug}`} className="btn-brand-solid">
                    Read Article &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="blog-grid-section">
          <div className="container">
            <div className="section-header-left">
              <span className="section-eyebrow">LATEST PUBLICATIONS</span>
              <h2 className="section-title">Explore Articles by Topic</h2>
            </div>

            <div className="blog-cards-grid">
              {regularArticles.map((article) => (
                <article key={article.id} className="blog-card">
                  <div className="blog-card-img-wrap">
                    <Link href={`/blog/${article.slug}`}>
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={500}
                        height={320}
                        className="blog-card-img"
                      />
                    </Link>
                    <span className="blog-category-tag">{article.category}</span>
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span>{article.date}</span>
                      <span>&bull;</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="blog-card-title">
                      <Link href={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="blog-card-excerpt">{article.excerpt}</p>
                    <div className="blog-card-footer">
                      <span className="blog-card-author">{article.author}</span>
                      <Link href={`/blog/${article.slug}`} className="blog-read-link">
                        Read Story &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
