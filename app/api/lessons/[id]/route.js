import { getConnection } from '../../../../utils/db';

export async function PUT(request, context) {
  const id = context.params.id;
  const res = await request.json();
  const connection = await getConnection();
  const [rows] = await connection.execute(`UPDATE lessons SET student_id = '${res.student_id}', date_time = '${res.date_time}', duration_hours = ${res.duration_hours}, duration_mins = ${res.duration_mins}, income = ${res.income}, completed = ${res.completed} WHERE id = ${id}`);
  return new Response(JSON.stringify(rows));
}

export async function DELETE(request, context) {
  const id = context.params.id;
  const connection = await getConnection();
  const [rows_students] = await connection.execute(`DELETE FROM lessons WHERE id = ${id}`);
  return new Response(JSON.stringify({}));
}