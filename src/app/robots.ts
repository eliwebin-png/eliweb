import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXTAUTH_URL || 'https://eliweb.in').replace(/\/$/, '');

  const disallowed = ['/admin/', '/api/', '/admin-login'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowed,
      },
      // Explicit allowance for leading AI & Generative Search Engines (GEO/AIO)
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai',
          'Bytespider',
        ],
        allow: '/',
        disallow: disallowed,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

