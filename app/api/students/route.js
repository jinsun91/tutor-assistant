import { getConnection } from '../../../utils/db';

export async function GET() {
  const connection = await getConnection();
  const [rows] = await connection.execute("SELECT * FROM students");
  return new Response(JSON.stringify(rows));
}

export async function POST(request) {
  const res = await request.json();
  const connection = await getConnection();
  const [rows] = await connection.execute(`INSERT INTO students (name, subject) VALUES ('${res.name}', '${res.subject}')`);
  return new Response(JSON.stringify(rows));
}