import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { starterPosts } from '@/lib/starter-posts';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = [];
    for (const p of starterPosts) {
      const post = await prisma.post.upsert({
        where: { slug: p.slug },
        update: {
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          coverImageUrl: p.coverImageUrl,
          published: p.published,
        },
        create: {
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          coverImageUrl: p.coverImageUrl,
          published: p.published,
        },
      });
      results.push(post);
    }

    revalidatePath('/blog');
    revalidatePath('/blog/[slug]');
    revalidatePath('/admin/post');

    return NextResponse.json({
      success: true,
      count: results.length,
      posts: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to seed starter posts' },
      { status: 500 }
    );
  }
}
