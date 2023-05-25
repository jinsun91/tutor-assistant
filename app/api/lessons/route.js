import { getConnection } from '../../../utils/db';

export async function GET() {
  const connection = await getConnection();
  const [rows] = await connection.execute("SELECT lessons.id, lessons.date_time, lessons.duration, students.name as student_name, students.id as student_id FROM lessons INNER JOIN students ON lessons.student_id = students.id ORDER BY lessons.date_time");
  return new Response(JSON.stringify(rows));
}