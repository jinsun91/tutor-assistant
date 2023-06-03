import { db } from '@vercel/postgres';

let connection;

export async function getConnection() {
    connection = db.connect();
    return connection;
}
