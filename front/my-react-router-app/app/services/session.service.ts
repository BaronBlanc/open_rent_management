// app/services/session.server.ts

import { createCookieSessionStorage, redirect } from "react-router";
import type { BearerToken } from "~/model/bearer-token";
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

const USER_SESSION_KEY = "userId";
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

export const { commitSession, destroySession } = sessionStorage;

/**
 * Retrieves the user session from the request.
 * @param {Request} request - The incoming request.
 * @returns {Promise<Session>} The user session.
 */
async function getUserCookie(request: Request) {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
};

/**
 * Retrieves the user id information from the session.
 * @param {Request} request - The incoming request.
 * @returns {Promise<string | undefined>} The BearerToken object if found, undefined otherwise.
 */
export async function getUserId(
  request: Request
): Promise<string | undefined> {
  const session = await getUserCookie(request);
  if(session.data) {
    return session.get(USER_SESSION_KEY);
  }
  return undefined;
}

/**
 * Retrieves the user token information from the session.
 * @param {Request} request - The incoming request.
 * @returns {Promise<BearerToken | undefined>} The BearerToken object if found, undefined otherwise.
 */
export async function getCookieInformation(
  request: Request
): Promise<BearerToken | undefined> {
  const session = await getUserCookie(request);
  if(session.data) {
    const refreshToken = session.get(ACCESS_TOKEN);
    const accessToken = session.get(REFRESH_TOKEN);
    const userId = session.get(USER_SESSION_KEY);

    if (refreshToken) {
      return { refreshToken, userId, accessToken };
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
  const session = await getUserCookie(request);
  session.set(USER_SESSION_KEY, userId);
  session.set(ACCESS_TOKEN, tokenData.accessToken);
  session.set(REFRESH_TOKEN, tokenData.refreshToken);
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

export async function login(username: string, password: string) {
  try {
      return await axiosInstance.post('/token', {username,
      password}, {
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      }).then(response => {
      response.data = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        type: response.data.token_type,
      };
      return response;
      });
  } catch (error) {
      // Handle error
      console.error('Login failed', error);
  }
}

export async function logout(request: Request) {
  const session = await getUserCookie(request);
  return redirect("/", {
      headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
      },
  });
}