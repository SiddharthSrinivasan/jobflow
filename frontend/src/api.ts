const API_URL = import.meta.env.VITE_API_URL;

export function getToken(){
  return localStorage.getItem("token");
}

export async function apiFetch(path:string, options: RequestInit = {}) {
    const token = getToken();

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
             ...(options.headers || {}),
        },
    });

    const data = await res.json().catch(() => null);

    if(!res.ok) {
        throw new Error(data?.error || "Request failed");
    }

    return data;
}