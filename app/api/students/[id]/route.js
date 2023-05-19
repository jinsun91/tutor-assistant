import { getConnection } from '../../../../utils/db';

export async function DELETE(request, context) {
  const id = context.params.id;
  const connection = await getConnection();
  const [rows] = await connection.execute(`DELETE FROM students WHERE id = ${id}`);
  return new Response(JSON.stringify(rows));
}

export async function PUT(request, context) {
  const id = context.params.id;
  const res = await request.json();
  const connection = await getConnection();
  const [rows] = await connection.execute(`UPDATE students SET name = '${res.name}', subject = '${res.subject}' WHERE id = ${id}`);
  return new Response(JSON.stringify(rows));
}