import { PrismaClient } from '@prisma/client';
import { starterPosts } from '../src/lib/starter-posts';

const prisma = new PrismaClient();

async function seedPosts() {
  console.log('Seeding starter blog posts...');
  let createdCount = 0;

  for (const post of starterPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImageUrl: post.coverImageUrl,
        published: post.published,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImageUrl: post.coverImageUrl,
        published: post.published,
      },
    });
    createdCount++;
    console.log(`Upserted post: ${post.title}`);
  }

  console.log(`Successfully seeded ${createdCount} starter posts.`);
}

seedPosts()
  .catch((err) => {
    console.error('Error seeding posts:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
