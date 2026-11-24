import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type } = await params;

  try {
    if (type === 'contact') {
      const records = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(records);
    }

    if (type === 'enquiry') {
      const records = await prisma.enquirySubmission.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(records);
    }

    if (type === 'newsletter') {
      const records = await prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(records);
    }

    return NextResponse.json({ error: `Unknown submission type: ${type}` }, { status: 404 });
  } catch (err) {
    console.error(`Submissions GET ${type}:`, err);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

