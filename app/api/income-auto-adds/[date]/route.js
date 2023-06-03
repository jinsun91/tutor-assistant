import { sql } from '@vercel/postgres';

export async function DELETE(request, context) {
    const date = context.params.date;
    const {rows} = await sql`DELETE FROM income_auto_adds WHERE date = ${date}`;
    return new Response(JSON.stringify({}));
}