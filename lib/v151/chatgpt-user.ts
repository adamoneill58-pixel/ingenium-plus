export type ChatGPTUser = { userId: string; displayName: string; email: string; fullName: string | null };
/** Legacy identity headers are not proof of authentication. */
export function chatGPTUserFromHeaders(_headers: Headers): ChatGPTUser | null { void _headers; return null; }
