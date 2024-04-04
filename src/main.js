import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const authFetch = async (auth, path, data) => {
  try {
    if (auth.accessToken) {
      const decodedToken = jwtDecode(auth.accessToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        const refreshToken = auth.cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("refreshToken is required");
        }

        const response = await fetch(auth.authApiPath + "/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw data;
        }

        auth.cookies.set("refreshToken", data.refreshToken, { path: "/" });
        auth.accessToken = data.accessToken;
      }

      const response = await fetch(path, {
        ...data,
        headers: {
          ...data.headers,
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      return response;
    } else {
      const response = await fetch(path, data);
      return response;
    }
  } catch (error) {
    throw error;
  }
};

const trySignInWithRefreshToken = async (auth) => {
  const refreshToken = auth.cookies.get("refreshToken");

  if (!refreshToken || auth.currentUser) {
    return null;
  }

  try {
    const response = await fetch(auth.authApiPath + "/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    auth.cookies.set("refreshToken", data.refreshToken, { path: "/" });
    auth.currentUser = data.user;
    auth.accessToken = data.accessToken;

    return data.user;
  } catch (error) {
    throw error;
  }
};

const initAuth = ({ authApiPath }) => {
  if (!authApiPath) {
    throw new Error("authApiPath is required");
  }

  const cookies = new Cookies();

  return {
    authApiPath,
    cookies,
    currentUser: null,
    accessToken: null,
  };
};

const register = async (auth, email, password) => {
  try {
    const response = await fetch(auth.authApiPath + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    auth.cookies.set("refreshToken", data.refreshToken, { path: "/" });
    auth.currentUser = data.user;
    auth.accessToken = data.accessToken;

    return data.user;
  } catch (error) {
    throw error;
  }
};

const logout = async (auth) => {
  try {
    const response = await fetch(auth.authApiPath + "/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: auth.cookies.get("refreshToken") }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    auth.cookies.remove("refreshToken");
    auth.currentUser = null;
    auth.accessToken = null;

    return;
  } catch (error) {
    throw error;
  }
};

const changeEmail = async (auth, email, password) => {
  try {
    const response = await authFetch(auth, auth.authApiPath + "/email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    auth.currentUser = data;
    console.log(auth.currentUser);

    return data;
  } catch (error) {
    throw error;
  }
};

export {
  authFetch,
  initAuth,
  register,
  trySignInWithRefreshToken,
  logout,
  changeEmail,
};
