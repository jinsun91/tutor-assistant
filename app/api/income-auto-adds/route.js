import { sql } from '@vercel/postgres';

export async function GET() {
    const {rows} = await sql`SELECT * FROM income_auto_adds`;
    return new Response(JSON.stringify(rows));
}
  
export async function POST(request) {
    const res = await request.json();
    const {rows} = await sql`INSERT INTO income_auto_adds (date) VALUES (${res.date})`;
    return new Response(JSON.stringify(rows));
}
  