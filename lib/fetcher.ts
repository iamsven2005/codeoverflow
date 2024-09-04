export const fetcher = async (url: string, method: string = 'GET', body: any = null) => {
    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
    });
    if (!res.ok) {
        throw new Error('Failed to fetch');
    }
    return await res.json();
};
