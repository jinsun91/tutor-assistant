import { sql } from '@vercel/postgres';

export async function GET() {
  const {rows} = await sql`SELECT finances.id, finances.date, students.name as student_name, students.id as student_id, finances.amount, finances.received FROM finances INNER JOIN students ON finances.student_id = students.id ORDER BY finances.date`;
  return new Response(JSON.stringify(rows));
}

export async function POST(request) {
  const res = await request.json();
  const {rows} = await sql`INSERT INTO finances (date, student_id, amount, received) VALUES (${res.date}, ${res.student_id}, ${res.amount}, ${res.received})`;
  return new Response(JSON.stringify(rows));
}

export async function PUT(request) {
  const res = await request.json();
  for (let i = 0; i < res.selectedEntries.length; i++) {
    const {} = await sql`UPDATE finances SET received = ${res.received} WHERE id = ${res.selectedEntries[i]}`;
  }
  return new Response(JSON.stringify({}));
}