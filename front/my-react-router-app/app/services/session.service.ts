// app/services/session.server.ts

import { createCookieSessionStorage, redirect } from "react-router";
import type { BearerToken, UserTokenInformation } from "~/model/bearer-token";
import type { ActionArgs } from "react-router";
import axiosInstance from "./axios.service";

/**
 * Creates a cookie-based session storage.
 * @see https://reactrouter.com/en/dev/utils/create-cookie-session-storage
 */
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["s3cret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export const { commitSession, destroySession } = sessionStorage;

/**
 * Retrieves the user session from the request.
 * @param {Request} request - The incoming request.
 * @returns {Promise<Session>} The user session.
 */
async function getUserSession(request: Request) {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
};

export async function login(username: string, password: string) {
  try {
    return await axiosInstance.post('/token', {username,
      password}, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(response => {
      response.data = {
        token: response.data.access_token,
        refreshToken: response.data.refresh_token,
        type: response.data.token_type,
      };
      return response;
    });
  } catch (error) {
    // Handle error
    console.error('Login failed', error);
  }
};

/**
 * Logs out the user by destroying their session.
 * @param {Request} request - The incoming request.
 * @returns {Promise<Response>} Redirect response after logout.
 */
export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

const USER_SESSION_KEY = "userId";

/**
 * Retrieves the user token information from the session.
 * @param {Request} request - The incoming request.
 * @returns {Promise<BearerToken | undefined>} The BearerToken object if found, undefined otherwise.
 */
export async function getUserTokenInformation(
  request: Request
): Promise<UserTokenInformation | undefined> {
  const session = await getUserSession(request);
  if(session.data) {
    const token = session.get("token");
    const refreshToken = session.get("refreshToken");
    const userId = session.get(USER_SESSION_KEY);
    const type = session.get("type");

    if (token && refreshToken) {
      return { token, refreshToken, userId, type };
    }
  }

  return undefined;
}

/**
 * Creates a new user session.
 * @param {Object} params - The parameters for creating the session.
 * @param {Request} params.request - The incoming request.
 * @param {string} params.userId - The user ID to store in the session.
 * @param {boolean} params.remember - Whether to create a persistent session.
 * @param {string} [params.redirectUrl] - The URL to redirect to after creating the session.
 * @returns {Promise<Response>} Redirect response with the new session cookie.
 */
export async function createUserSession(
  request: Request,
  userId: string,
  tokenData: BearerToken,
  remember = true,
  redirectUrl?: string,
) {
  const session = await getUserSession(request);
  session.set(USER_SESSION_KEY, userId);
  session.set("token", tokenData.token);
  session.set("refreshToken", tokenData.refreshToken);
  session.set("type", tokenData.type);
  return redirect(redirectUrl || "/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}
