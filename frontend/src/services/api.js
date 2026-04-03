const API_BASE_URL = 'http://localhost:8080';

/**
 * Send a user message to the AI support API.
 * @param {string} query - The user's message text.
 * @returns {Promise<{ticketId: number, response: string}>}
 */
export async function sendMessage(query) {
  const res = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
