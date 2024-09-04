import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  const { position } = await req.json();

  const updatedRole = await db.courses.update({
    where: { id: params.courseId },
    data: { position },
  });

  return NextResponse.json(updatedRole);
}
