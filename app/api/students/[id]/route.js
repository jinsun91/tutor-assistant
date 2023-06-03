import { sql } from '@vercel/postgres';

export async function DELETE(request, context) {
  const id = context.params.id;
  const {rows_students} = await sql`DELETE FROM students WHERE id = ${id}`;
  const {rows_finances} = await sql`DELETE FROM finances WHERE student_id = ${id}`;
  const {rows_lessons} = await sql`DELETE FROM lessons WHERE student_id = ${id}`;
  return new Response(JSON.stringify({}));
}

export async function PUT(request, context) {
  const id = context.params.id;
  const res = await request.json();
  const {rows} = await sql`UPDATE students SET name = ${res.name}, subject = ${res.subject}, lesson_duration_hours = ${res.lesson_duration_hours}, lesson_duration_mins = ${res.lesson_duration_mins}, lesson_rate = ${res.lesson_rate} WHERE id = ${id}`;
  return new Response(JSON.stringify(rows));
}