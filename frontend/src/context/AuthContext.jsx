import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { httpClient } from "../api/httpClient.js";
import { endpoints } from "../api/endpoints.js";

import {
  clearSession,
  getStoredUser,
  getToken,
  hasSession,
  setStoredUser,
  setToken,
} from "../services/tokenStorage.js";

const AuthContext = createContext(null);

function getInitialToken() {
  const storedUser = getStoredUser();
  const storedUsername = String(storedUser?.username || storedUser?.TenDangNhap || "").toLowerCase().replace(/\s+/g, "");

  if (storedUsername === "admin2") {
    clearSession();
    return null;
  }

  return getToken();
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getInitialToken);

  const [user, setUser] = useState(() =>
    getStoredUser()
  );

  const [bootstrapped, setBootstrapped] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const logout = useCallback(() => {
    clearSession();

    setTokenState(null);
    setUser(null);
  }, []);

  const syncSession = useCallback(
    (nextToken, nextUser) => {
      setToken(nextToken);
      setStoredUser(nextUser);

      setTokenState(nextToken);
      setUser(nextUser);
    },
    []
  );

  const updateUser = useCallback((nextUser) => {
    setStoredUser(nextUser);
    setUser(nextUser);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(
      "auth:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized
      );
    };
  }, [logout]);

  useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      try {
        if (!hasSession()) {
          if (mounted) {
            setBootstrapped(true);
          }

          return;
        }

        const storedToken = getToken();

        if (!storedToken) {
          throw new Error("TOKEN_MISSING");
        }

        const response =
          await httpClient.get(
            endpoints.auth.me
          );

        const verifiedUser =
          response?.user ||
          response?.data?.user ||
          response?.data ||
          null;

        const authenticatedUser = verifiedUser
          ? { ...getStoredUser(), ...verifiedUser }
          : null;

        if (!authenticatedUser) {
          throw new Error(
            "INVALID_AUTH_USER"
          );
        }

        if (!mounted) return;

        syncSession(
          storedToken,
          authenticatedUser
        );
      } catch (error) {
        console.error(
          "Auth bootstrap failed:",
          error
        );

        if (mounted) {
          logout();
        }
      } finally {
        if (mounted) {
          setBootstrapped(true);
        }
      }
    }

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, [logout, syncSession]);

  const login = useCallback(
    async ({ username, password }) => {
      setLoading(true);

      try {
        const response =
          await httpClient.post(
            endpoints.auth.login,
            {
              username: username.trim(),
              password: password,
              TenDangNhap: username.trim(),
              MatKhau: password,
            }
          );

        const nextToken =
          response?.token ||
          response?.data?.token ||
          response?.data?.access_token ||
          "";

        if (!nextToken) {
          throw new Error(
            "Không nhận được token đăng nhập"
          );
        }

        setToken(nextToken);

        const meResponse =
          await httpClient.get(
            endpoints.auth.me
          );

        const profileUser =
          meResponse?.user ||
          meResponse?.data?.user ||
          meResponse?.data ||
          {};
        const loginUser = response?.user || response?.data?.user || {};
        const mergedUser = { ...loginUser, ...profileUser };
        const nextUser = Object.keys(mergedUser).length > 0 ? mergedUser : null;

        if (!nextUser) {
          throw new Error(
            "Không lấy được thông tin người dùng"
          );
        }

        syncSession(
          nextToken,
          nextUser
        );

        return nextUser;
      } catch (error) {
        clearSession();

        console.error(
          "Login failed:",
          error
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [syncSession]
  );

  const value = useMemo(
    () => ({
      token,
      user,

      role:
        user?.VaiTro ||
        user?.role ||
        null,

      isAuthenticated: Boolean(
        token && user
      ),

      bootstrapped,
      loading,

      login,
      logout,
      updateUser,
    }),
    [
      token,
      user,
      bootstrapped,
      loading,
      login,
      logout,
      updateUser,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
