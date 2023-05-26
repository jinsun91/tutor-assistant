import { getConnection } from '../../../../utils/db';

// TODO: proper response
export async function DELETE(request, context) {
  const id = context.params.id;
  const connection = await getConnection();
  const [rows_students] = await connection.execute(`DELETE FROM students WHERE id = ${id}`);
  const [rows_finances] = await connection.execute(`DELETE FROM finances WHERE student_id = ${id}`);
  const [rows_lessons] = await connection.execute(`DELETE FROM lessons WHERE student_id = ${id}`);
  return new Response(JSON.stringify({}));
}

export async function PUT(request, context) {
  const id = context.params.id;
  const res = await request.json();
  const connection = await getConnection();
  const [rows] = await connection.execute(`UPDATE students SET name = '${res.name}', subject = '${res.subject}' WHERE id = ${id}`);
  return new Response(JSON.stringify(rows));
}