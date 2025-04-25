import type { Property } from "~/model/property";
import axiosInstance from "./axios.service";
import type { Tenant } from "~/model/tenant";
import { getCookieInformation, logout } from "./session.service";


async function setAuthorizationHeader(request: Request) {
  const cookie = await getCookieInformation(request);
  if (cookie) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${cookie.accessToken}`;
  }
}

export async function fetchData(request: Request, path: string) {
  setAuthorizationHeader(request);
  const cookie = await getCookieInformation(request);

  return await axiosInstance.get(path).then((response) => {
    return response.data;
  }).catch(async (error) => {
    if (error.response && error.response.status === 401) {
      if (cookie && cookie.refreshToken) {
        console.log("Refreshing token...", cookie.refreshToken);
        try {
          const response = await axiosInstance.post(`/refresh?refresh_token=${cookie.refreshToken}`);
          const newAccessToken = response.data.access_token;
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance.request(error.config);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          return await logout(request);
        }
      }
    }
    throw error;
  });
}

/// <summary>
/// Get the list of properties.
/// </summary>
/// <param name="request">The request object.</param>
/// <returns>A promise that resolves to an array of properties.</returns>
/// <remarks>
export async function getProperties(request: Request): Promise<Property[]> {
  return await fetchData(request, `/properties`);
}

/// <summary>
/// Get the list of tenants.
/// </summary>
/// <param name="request">The request object.</param>
/// <returns>A promise that resolves to an array of tenants.</returns>
/// <remarks>
export async function getTenants(request: Request): Promise<Tenant[]> {
  setAuthorizationHeader(request);
  return await fetchData(request, `/tenants`);
}

/// <summary>
/// Get the list of tenants.
/// </summary>
/// <param name="request">The request object.</param>
/// <returns>A promise that resolves to an array of tenants.</returns>
/// <remarks>
export async function getPropertyId(request: Request, tenantId: string): Promise<Property[]> {
  setAuthorizationHeader(request);
  return await axiosInstance.get(`/property/${tenantId}`);
}
