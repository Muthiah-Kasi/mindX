const API_BASE_URL = '';

/**
 * Send a user message to the AI support API.
 * @param {string} query - The user's message text.
 * @returns {Promise<{ticketId: number, aiResponse: string}>}
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

/**
 * Fetch all tickets.
 * @returns {Promise<Array>}
 */
export async function getTickets() {
  const res = await fetch(`${API_BASE_URL}/tickets`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetch a single ticket by ID with its messages.
 * @param {number|string} id
 * @returns {Promise<{ticket: Object, messages: Array}>}
 */
export async function getTicketById(id) {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Update a ticket's status.
 * @param {number|string} id
 * @param {string} status - "OPEN" | "RESOLVED" | "NEEDS_HUMAN"
 * @returns {Promise<Object>} Updated ticket
 */
export async function updateTicketStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
