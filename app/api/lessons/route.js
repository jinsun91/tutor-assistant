import { getConnection } from '../../../utils/db';

export async function GET() {
  const connection = await getConnection();
  const [rows] = await connection.sql`SELECT lessons.id, lessons.date_time, lessons.duration_hours, lessons.duration_mins, lessons.income, lessons.completed, students.name as student_name, students.id as student_id FROM lessons INNER JOIN students ON lessons.student_id = students.id ORDER BY lessons.date_time`;
  return new Response(JSON.stringify(rows));
}

export async function POST(request) {
  const res = await request.json();
  const connection = await getConnection();
  const [rows] = await connection.sql`INSERT INTO lessons (student_id, date_time, duration_hours, duration_mins, income, completed) VALUES ('${res.student_id}', '${res.date_time}', ${res.duration_hours}, ${res.duration_mins}, ${res.income}, ${res.completed})`;
  return new Response(JSON.stringify(rows));
}