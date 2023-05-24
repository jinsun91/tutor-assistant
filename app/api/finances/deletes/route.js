import { getConnection } from '../../../../utils/db';

export async function POST(request) {
    const res = await request.json();
    const connection = await getConnection();
    const [rows] = await connection.execute(`DELETE FROM finances WHERE id IN (${res.join(", ")})`);
    return new Response(JSON.stringify(rows));
}