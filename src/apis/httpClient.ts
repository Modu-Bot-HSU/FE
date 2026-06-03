export const API_BASE_URL = "https://modubot.shop";

export async function parseApiResponse<TResponse>(response: Response): Promise<TResponse> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    if (typeof body === "object" && body !== null && "message" in body) {
      const raw = (body as { message?: unknown }).message;
      if (typeof raw === "string") {
        message = raw;
      } else if (Array.isArray(raw) && raw.every((item) => typeof item === "string")) {
        message = (raw as string[]).join(", ");
      }
    }
    throw new Error(message);
  }

  return body as TResponse;
}

export function getBearerAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("accessToken");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function getRefreshBearerHeaders(): Record<string, string> {
  const token = localStorage.getItem("refreshToken");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
