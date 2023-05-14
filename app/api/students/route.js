import { getConnection } from '../../../utils/db';

export async function GET() {
  const connection = await getConnection();
  const [rows] = await connection.execute("SELECT * FROM students");
  return new Response(JSON.stringify(rows));
}
