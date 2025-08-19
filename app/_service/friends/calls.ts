export const fetcher = (input: RequestInfo | URL, init?: RequestInit) => fetch(input, { credentials: 'include' }).then((res) => res.json());
