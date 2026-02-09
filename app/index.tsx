export async function query<T>(text: string, params?: unknown[]): Promise<T[]|null> {
    const client = await pool.connect()

    try {
        const result = await client.query(text, params)
        return result.rows as T[]
    } finally {
        client.release()
    }
}