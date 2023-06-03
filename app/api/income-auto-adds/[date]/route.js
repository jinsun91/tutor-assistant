import { getConnection } from '../../../../utils/db';

export async function DELETE(request, context) {
    const date = context.params.date;
    const connection = await getConnection();
    const [rows] = await connection.sql`DELETE FROM income_auto_adds WHERE date = '${date}'`;
    return new Response(JSON.stringify({}));
}