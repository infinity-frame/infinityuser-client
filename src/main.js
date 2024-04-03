import Cookies from "universal-cookie";

const infinityFetch = (auth, path, method, body) => {
  try {
    if (auth.currentUser) {
      // TODO: implement the logic to add the token to the request
      const response = fetch(path, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      return response;
    } else {
      const response = fetch(path, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
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

    auth.currentUser = data.user;
    auth.cookies.set("refreshToken", data.refreshToken, { path: "/" });

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

    return data.user;
  } catch (error) {
    throw error;
  }
};

export { infinityFetch, initAuth, register, trySignInWithRefreshToken };
