import { getConnection } from '../../../utils/db';

export async function GET() {
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM income_auto_adds");
    return new Response(JSON.stringify(rows));
}
  
export async function POST(request) {
    const res = await request.json();
    const connection = await getConnection();
    const [rows] = await connection.execute(`INSERT INTO income_auto_adds (date) VALUES ('${res.date}')`);
    return new Response(JSON.stringify(rows));
}
  