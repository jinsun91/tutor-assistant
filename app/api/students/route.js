import { sql } from '@vercel/postgres';

export async function GET() {
  const {rows} = await sql`SELECT * FROM students ORDER BY name`;
  return new Response(JSON.stringify(rows));
}

export async function POST(request) {
  const res = await request.json();
  const {rows} = await sql`INSERT INTO students (name, subject, lesson_duration_hours, lesson_duration_mins, lesson_rate) VALUES (${res.name}, ${res.subject}, ${res.lesson_duration_hours}, ${res.lesson_duration_mins}, ${res.lesson_rate})`;
  return new Response(JSON.stringify(rows));
}