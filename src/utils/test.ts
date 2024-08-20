import api from '@/api'

export const apiCall = (url: string, method = 'GET', body: any = null) => {
    return api
        .handle(new Request(`http://localhost:4321/${url}`, {
            headers: { 'Content-Type': 'application/json' },
            method,
            body: body ? JSON.stringify(body) : undefined
        }))
        .then((res: any) => res.json());
}