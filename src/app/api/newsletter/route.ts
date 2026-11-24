import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const newsletterSchema = z.object({
  email: z.string().email('Valid email address is required').max(150).toLowerCase().trim(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`newsletter:${ip}`, 5, 10 * 60);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes before trying again.' },
      { status: 429 }
    );
  }

  try {
    const json = await request.json();
    const result = newsletterSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const { email } = result.data;

    // Record in dedicated NewsletterSubscriber model
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
