import { getConnection } from '../../../utils/db';

export async function GET() {
  const connection = await getConnection();
  const [rows] = await connection.sql`SELECT * FROM students`;
  return new Response(JSON.stringify(rows));
}

export async function POST(request) {
  const res = await request.json();
  const connection = await getConnection();
  const [rows] = await connection.sql`INSERT INTO students (name, subject, lesson_duration_hours, lesson_duration_mins, lesson_rate) VALUES ('${res.name}', '${res.subject}', ${res.lesson_duration_hours}, ${res.lesson_duration_mins}, ${res.lesson_rate})`;
  return new Response(JSON.stringify(rows));
}