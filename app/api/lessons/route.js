import { getConnection } from '../../../utils/db';

export async function GET() {
  const connection = await getConnection();
  const [rows] = await connection.execute("SELECT lessons.id, lessons.date_time, lessons.duration, students.name as student_name, students.id as student_id FROM lessons INNER JOIN students ON lessons.student_id = students.id ORDER BY lessons.date_time");
  return new Response(JSON.stringify(rows));
}

export async function POST(request) {
  const res = await request.json();
  const connection = await getConnection();
  const [rows] = await connection.execute(`INSERT INTO lessons (student_id, date_time, duration) VALUES ('${res.student_id}', '${res.date_time}', ${res.duration})`);
  return new Response(JSON.stringify(rows));
}