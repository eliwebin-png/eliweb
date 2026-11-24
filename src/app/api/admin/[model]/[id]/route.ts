import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { modelConfigs } from '@/lib/admin/config';
import { schemaMap } from '@/lib/admin/schemas';

type RouteParams = { params: Promise<{ model: string; id: string }> };

// GET /api/admin/[model]/[id] → single record
export async function GET(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { model, id } = await params;
  const config = modelConfigs[model];
  if (!config) {
    return NextResponse.json({ error: `Unknown model: ${model}` }, { status: 404 });
  }

  try {
    const record = await config.delegate.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (err) {
    console.error(`Admin GET ${model}/${id}:`, err);
    return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 });
  }
}

// PUT /api/admin/[model]/[id] → update record
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { model, id } = await params;
  const config = modelConfigs[model];
  const schema = schemaMap[model];
  if (!config || !schema) {
    return NextResponse.json({ error: `Unknown model: ${model}` }, { status: 404 });
  }

  try {
    const body = await request.json();

    // Strip fields the client shouldn't set
    delete body.id;
    delete body.createdAt;
    delete body.updatedAt;

    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const record = await config.delegate.update({
      where: { id },
      data: result.data,
    });

    for (const path of config.revalidate) {
      revalidatePath(path);
    }

    return NextResponse.json(record);
  } catch (err) {
    console.error(`Admin PUT ${model}/${id}:`, err);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

// DELETE /api/admin/[model]/[id] → delete record
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { model, id } = await params;
  const config = modelConfigs[model];
  if (!config) {
    return NextResponse.json({ error: `Unknown model: ${model}` }, { status: 404 });
  }

  try {
    await config.delegate.delete({ where: { id } });

    for (const path of config.revalidate) {
      revalidatePath(path);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`Admin DELETE ${model}/${id}:`, err);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}

