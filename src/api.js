const BASE_URL = 'https://lbbcoc4xnd.execute-api.ap-southeast-2.amazonaws.com/dev';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';

async function request(path, options = {}, token = null, needsApiKey = false) {
  const headers = { 'Content-Type': 'application/json' };

  if (token) headers['Authorization'] = token;
  if (needsApiKey && API_KEY) headers['x-api-key'] = API_KEY;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { message: text }; }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Server error (${res.status})`);
  }
  return data;
}

// ─── Auth (no auth headers required) ─────────────────────────────────────────

export function registerUser({ email, password, name }) {
  return request('/user/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export function loginUser(email, password) {
  return request('/user/auth', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function verifyEmail(email, code) {
  return request('/user/verification', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

// Requires Authorization
export function updatePassword(email, old_password, new_password, token) {
  return request('/user/update/password', {
    method: 'POST',
    body: JSON.stringify({ email, old_password, new_password }),
  }, token);
}

// Requires x-api-key only
export function getUserStatus(email) {
  return request('/user/status', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }, null, true);
}

// ─── Sites (Authorization + x-api-key) ───────────────────────────────────────

export function listSites(user, token) {
  return request('/site', {
    method: 'POST',
    body: JSON.stringify({ action: 'list', user }),
  }, token, true);
}

export function createSite({ site_name, description, gateway_id, user }, token) {
  return request('/site', {
    method: 'POST',
    body: JSON.stringify({ action: 'create', site_name, description, gateway_id, user }),
  }, token, true);
}

export function updateSite({ site_id, site_name, description }, token) {
  return request('/site', {
    method: 'POST',
    body: JSON.stringify({ action: 'update', site_id, site_name, description }),
  }, token, true);
}

export function deleteSite(site_id, token) {
  return request('/site', {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', site_id }),
  }, token, true);
}

// ─── Lanes / Rows (Authorization + x-api-key) ────────────────────────────────

export function listLanes(site_id, token) {
  return request('/lane', {
    method: 'POST',
    body: JSON.stringify({ action: 'list', site_id }),
  }, token, true);
}

export function createLane({ site_id, lane_name }, token) {
  return request('/lane', {
    method: 'POST',
    body: JSON.stringify({ action: 'create', site_id, lane_name }),
  }, token, true);
}

export function updateLane({ lane_id, lane_name, expected_sensors }, token) {
  return request('/lane', {
    method: 'POST',
    body: JSON.stringify({ action: 'update', lane_id, lane_name, expected_sensors }),
  }, token, true);
}

export function deleteLane(lane_id, token) {
  return request('/lane', {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', lane_id }),
  }, token, true);
}

// ─── Devices / Sensors (Authorization + x-api-key) ───────────────────────────

export function listDevices({ site_id, lane_id }, token) {
  return request('/device', {
    method: 'POST',
    body: JSON.stringify({ action: 'list', site_id, lane_id }),
  }, token, true);
}

export function createDevice({ site_id, lane_id, mac, lat, lng, timestamp }, token) {
  return request('/device', {
    method: 'POST',
    body: JSON.stringify({ action: 'create', site_id, lane_id, mac, lat, lng, timestamp }),
  }, token, true);
}

export function deleteDevice(mac, token) {
  return request('/device', {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', mac }),
  }, token, true);
}

// Requires Authorization (device/register is a separate registration endpoint)
export function registerDevice({ mac, site_id, lane_id, lat, lng }, token) {
  return request('/device/register', {
    method: 'POST',
    body: JSON.stringify({ mac, site_id, lane_id, lat, lng }),
  }, token);
}

// ─── Locations (Authorization) ────────────────────────────────────────────────

export function saveLocation({ mac, lat, lng, timestamp }, token) {
  return request('/location/new', {
    method: 'POST',
    body: JSON.stringify({ mac, lat, lng, timestamp }),
  }, token);
}

export function getDeviceLocation(mac, token) {
  return request(`/location?mac=${encodeURIComponent(mac)}`, {}, token);
}

export function getUserLocations(user, token) {
  return request(`/locations?user=${encodeURIComponent(user)}`, {}, token);
}

// ─── Readings ─────────────────────────────────────────────────────────────────

export function saveReading({ mac, current, timestamp }) {
  return request('/reading/save', {
    method: 'POST',
    body: JSON.stringify({ mac, current, timestamp }),
  });
}

export function getReadingsPaginated(mac, page = 1, limit = 20, token) {
  return request(
    `/reading/list/paginated?mac=${encodeURIComponent(mac)}&page=${page}&limit=${limit}`,
    {},
    token,
    true,
  );
}

export function deleteReading(data, token) {
  return request('/reading', {
    method: 'DELETE',
    body: JSON.stringify(data),
  }, token);
}
