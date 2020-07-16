
type Method = 'GET' | 'PUT' | 'POST' | 'DELETE'

async function api<T>(url: string, method: Method, body: any = null) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    const res = await fetch(`/api${url}`,
        {
            method: method,
            headers,
            body: body ? JSON.stringify(body) : null
        }
    );
    if (!res.ok) {
        throw res;
    }
    return res.json() as Promise<T>;
}

async function get<T>(url: string) { return api<T>(url, 'GET'); }

async function post<T>(url: string, body?: any) { return api<T>(url, 'POST', body); }

export const createToken = async (content: string, ttl: number, linksNumber = 1) => (await post<{ tokens: string[] }>('/new', { content, ttl, links_number: linksNumber })).tokens;

export const verifyToken = async (token: string) => (await get<{ valid: boolean }>(`/preview/${encodeURIComponent(token)}`)).valid;

export const retrieveContent = async (token: string) => (await get<{ content: string }>(`/view/${encodeURIComponent(token)}`)).content;
