import { getConnection } from '../../../utils/db';

export async function GET() {
  const connection = await getConnection();
  const [rows] = await connection.execute("SELECT finances.date, students.name, finances.amount, finances.received FROM finances INNER JOIN students ON finances.student_id = students.id ORDER BY finances.date");
  console.log(rows);
  return new Response(JSON.stringify(rows));
}

export async function POST(request) {
    const res = await request.json();
    const connection = await getConnection();
    const [rows] = await connection.execute(`INSERT INTO finances (date, student_id, amount, received) VALUES ('${res.date}', '${res.student_id}', ${res.amount}, ${res.received})`);
    return new Response(JSON.stringify(rows));
  }