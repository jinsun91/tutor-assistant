import { getConnection } from '../../../../utils/db';

export async function DELETE(request, context) {
  const id = context.params.id;
  const connection = await getConnection();
  const [rows] = await connection.execute(`DELETE FROM finances WHERE id = ${id}`);
  return new Response(JSON.stringify(rows));
}