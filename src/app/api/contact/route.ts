import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const sanitizeText = (str: string) => str.replace(/<[^>]*>/g, '').trim();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).transform(sanitizeText),
  email: z.string().email('Please enter a valid email address').max(150),
  phone: z.string().max(30).optional().nullable().transform((v) => (v ? sanitizeText(v) : null)),
  service: z.string().max(100).optional().nullable().transform((v) => (v ? sanitizeText(v) : null)),
  budget: z.string().max(60).optional().nullable().transform((v) => (v ? sanitizeText(v) : null)),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000).transform(sanitizeText),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`contact:${ip}`, 5, 10 * 60); // 5 per 10 minutes

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait a few minutes before trying again.' },
      { status: 429 }
    );
  }

  try {
    const json = await request.json();
    const result = contactSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, service, budget, message } = result.data;

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        service,
        budget,
        message,
        read: false,
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
