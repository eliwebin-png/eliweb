import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { modelConfigs } from '@/lib/admin/config';
import { schemaMap } from '@/lib/admin/schemas';
import { dbQuery } from '@/lib/db';

// GET /api/admin/[model] → list all records
export async function GET(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { model } = await params;
  const config = modelConfigs[model];
  if (!config) {
    return NextResponse.json({ error: `Unknown model: ${model}` }, { status: 404 });
  }

  try {
    const findArgs: Record<string, unknown> = {};
    if (config.orderBy) {
      findArgs.orderBy = config.orderBy;
    }
    const records = await dbQuery(
      () => config.delegate.findMany(findArgs),
      [],
      4500
    );
    return NextResponse.json(records);
  } catch (err: any) {
    console.error(`Admin GET ${model}:`, err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch records' }, { status: 500 });
  }
}

// POST /api/admin/[model] → create a record
export async function POST(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { model } = await params;
  const config = modelConfigs[model];
  const schema = schemaMap[model];
  if (!config || !schema) {
    return NextResponse.json({ error: `Unknown model: ${model}` }, { status: 404 });
  }

  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data as any;
    let record;
    if (model === 'site-settings' && data.key) {
      const prismaClient = (await import('@/lib/prisma')).prisma;
      record = await prismaClient.siteSettings.upsert({
        where: { key: data.key },
        update: { value: data.value },
        create: { key: data.key, value: data.value },
      });
    } else if (model === 'about-content' && data.key) {
      const prismaClient = (await import('@/lib/prisma')).prisma;
      record = await prismaClient.aboutContent.upsert({
        where: { key: data.key },
        update: { value: data.value },
        create: { key: data.key, value: data.value },
      });
    } else {
      record = await config.delegate.create({ data });
    }

    // Revalidate affected public pages
    for (const path of config.revalidate) {
      revalidatePath(path);
    }

    return NextResponse.json(record, { status: 201 });
  } catch (err: any) {
    console.error(`Admin POST ${model}:`, err);
    return NextResponse.json({ error: err?.message || 'Failed to create record' }, { status: 500 });
  }
}

