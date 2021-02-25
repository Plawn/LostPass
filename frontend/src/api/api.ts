
type Method = 'GET' | 'PUT' | 'POST' | 'DELETE'

const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");

async function api<T>(url: string, method: Method, body: any = null,
    form: boolean = false, blob: boolean = false): Promise<T> {
    const res = await fetch(`/api${url}`,
        {
            method: method,
            headers: form ? undefined : headers,
            body: body ? (form ? body : JSON.stringify(body)) : null
        }
    );
    if (!res.ok) {
        throw res;
    }
    if (blob) {
        return res.blob() as unknown as Promise<T>;
    }
    return res.json() as Promise<T>;
}

// TODO: prevent T from being other than json type

async function get<T>(url: string) {
    return api<T>(url, 'GET');
}

async function getBlob(url: string) {
    return api<Blob>(url, 'GET', undefined, false, true);
}

async function post<T>(url: string, body?: any, form: boolean = false) {
    return api<T>(url, 'POST', body, form);
}

export const createTokenForString = async (content: string, ttl: number, linksNumber = 1) => {
    const res = await post<{ tokens: string[] }>('/new/string', { content, ttl, links_number: linksNumber });
    return res.tokens;
}

export const createTokenForFile = async (content: File, ttl: number, linksNumber = 1) => {
    const form = new FormData();
    form.append('file', content);
    form.append('ttl', '' + ttl);
    form.append('links_number', '' + linksNumber);
    const res = await post<{ tokens: string[] }>('/new/file', form, true);
    return res.tokens;
}

export type VerifyTokenDto = {
    valid: boolean;
    meta: {
        type: 0 | 1;
        fileanme?: string;
    }
};

export const verifyToken = async (token: string) => {
    const res = await get<VerifyTokenDto>(`/preview/${encodeURIComponent(token)}`);
    return res;
}

export const retrieveStringContent = async (token: string) => {
    const res = await get<{ content: string }>(`/view/${encodeURIComponent(token)}`);
    return res.content;
};

export const retrieveBytesContent = async (token: string, meta: any) => {
    const resp = await getBlob(`/view/${encodeURIComponent(token)}`);
    const objectURL = window.URL.createObjectURL(resp);
    const fileLink = document.createElement("a");
    fileLink.href = objectURL;
    fileLink.download = meta.filename;
    fileLink.click();
}
