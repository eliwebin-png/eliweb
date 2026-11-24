import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteParams = { params: Promise<{ type: string; id: string }> };

// PUT /api/admin/submissions/[type]/[id] -> mark as read / toggle read
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, id } = await params;
  const body = await request.json().catch(() => ({}));
  const read = typeof body.read === 'boolean' ? body.read : true;

  try {
    if (type === 'contact') {
      const updated = await prisma.contactSubmission.update({
        where: { id },
        data: { read },
      });
      return NextResponse.json(updated);
    }

    if (type === 'enquiry') {
      const updated = await prisma.enquirySubmission.update({
        where: { id },
        data: { read },
      });
      return NextResponse.json(updated);
    }

    if (type === 'newsletter') {
      const updated = await prisma.newsletterSubscriber.update({
        where: { id },
        data: { read },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: `Unknown submission type: ${type}` }, { status: 404 });
  } catch (err) {
    console.error(`Submissions PUT ${type}/${id}:`, err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

// DELETE /api/admin/submissions/[type]/[id] -> delete submission
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, id } = await params;

  try {
    if (type === 'contact') {
      await prisma.contactSubmission.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (type === 'enquiry') {
      await prisma.enquirySubmission.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (type === 'newsletter') {
      await prisma.newsletterSubscriber.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: `Unknown submission type: ${type}` }, { status: 404 });
  } catch (err) {
    console.error(`Submissions DELETE ${type}/${id}:`, err);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}

