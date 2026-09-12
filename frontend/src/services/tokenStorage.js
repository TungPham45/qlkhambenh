const TOKEN_KEY = "clinic_gateway_token";
const USER_KEY = "clinic_gateway_user";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getToken() {
  if (!isBrowser()) return null;

  const token = localStorage.getItem(TOKEN_KEY);

  return typeof token === "string" &&
    token.trim()
    ? token
    : null;
}

export function setToken(token) {
  if (!isBrowser()) return;

  if (
    typeof token === "string" &&
    token.trim()
  ) {
    localStorage.setItem(
      TOKEN_KEY,
      token.trim()
    );
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (!isBrowser()) return null;

  const value =
    localStorage.getItem(USER_KEY);

  if (!value) return null;

  try {
    const parsed = JSON.parse(value);

    if (
      parsed &&
      typeof parsed === "object"
    ) {
      return parsed;
    }

    return null;
  } catch (error) {
    console.error(
      "Invalid stored user:",
      error
    );

    localStorage.removeItem(USER_KEY);

    return null;
  }
}

export function setStoredUser(user) {
  if (!isBrowser()) return;

  if (
    user &&
    typeof user === "object"
  ) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );

    return;
  }

  localStorage.removeItem(USER_KEY);
}

export function hasSession() {
  return Boolean(
    getToken() && getStoredUser()
  );
}

export function clearSession() {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error(
      "Failed to clear session:",
      error
    );
  }
}