import { sql } from '@vercel/postgres';

export async function POST(request) {
    const res = await request.json();
    for (let i = 0; i < res.length; i++) {
        const {} = await sql`DELETE FROM finances WHERE id = ${res[i]}`;
    }
    return new Response(JSON.stringify({}));
}