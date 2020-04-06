

export const createToken = async (content: string, ttl: number, linksNumber = 1) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    const res = await fetch('/api/new',
        {
            method: 'POST',
            headers,
            body: JSON.stringify({ content, ttl, links_number: linksNumber })
        }
    );
    const result: { tokens: string[] } = await res.json();
    return result.tokens;
};


export const verifyToken = async (token: string) => {
    const res = await fetch(`/api/preview/${encodeURI(token)}`)
    const result: { valid: boolean } = await res.json();
    return result.valid;
}

export const retrieveContent = async (token: string) => {
    const res = await fetch(`/api/view/${encodeURI(token)}`)
    const result: { content: string } = await res.json();
    return result.content;
}