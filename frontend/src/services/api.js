const API_BASE_URL = '';

// ===========================
// AUTH APIs
// ===========================

/**
 * Signup a new user.
 * @param {{ name: string, email: string, password: string, mobileNumber: string }} data
 * @returns {Promise<{ userId: number, name: string, role: string }>}
 */
export async function signup(data) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Signup failed: ${res.status}`);
  }
  return json;
}

/**
 * Login with email and password.
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ userId: number, name: string, role: string }>}
 */
export async function login(data) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Login failed: ${res.status}`);
  }
  return json;
}

// ===========================
// TICKET APIs (existing)
// ===========================

/**
 * Send a user message to the AI support API.
 * @param {string} query - The user's message text.
 * @param {number|string} [userId] - Optional user ID.
 * @returns {Promise<{ticketId: number, aiResponse: string}>}
 */
export async function sendMessage(query, userId) {
  const body = { query };
  if (userId) {
    body.userId = String(userId);
  }

  const res = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ===========================
// ADMIN APIs
// ===========================

/**
 * Fetch all users (admin view) with optional mobile search.
 * @param {string} [mobile] - Optional mobile number filter.
 * @returns {Promise<Array>}
 */
export async function getAdminUsers(mobile) {
  const url = mobile
    ? `${API_BASE_URL}/admin/users?mobile=${encodeURIComponent(mobile)}`
    : `${API_BASE_URL}/admin/users`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetch full conversation for a user (admin view).
 * @param {number|string} userId
 * @returns {Promise<{user: Object, messages: Array, latestTicketId: number}>}
 */
export async function getAdminUserMessages(userId) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/messages`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
