import type { Property } from "~/model/property";
import axiosInstance from "./axios.service";
import { getUserTokenInformation } from "./session.service";
import type { Tenant } from "~/model/tenant";


/// <summary>
/// Get the list of properties.
/// </summary>
/// <param name="request">The request object.</param>
/// <returns>A promise that resolves to an array of properties.</returns>
/// <remarks>
export async function getProperties(request: Request): Promise<Property[]> {
  return await callApiAsync('/properties', ApiMethod.GET, null, request);
}

/// <summary>
/// Get the list of tenants.
/// </summary>
/// <param name="request">The request object.</param>
/// <returns>A promise that resolves to an array of tenants.</returns>
/// <remarks>
export async function getTenants(request: Request): Promise<Tenant[]> {
  return await callApiAsync('/tenants', ApiMethod.GET, null, request);
}

/// <summary>
/// Enum for API methods.
/// </summary>
/// <remarks>
/// This enum defines the HTTP methods that can be used for API calls.
/// It is used to specify the method when making API requests.
/// </remarks>
export enum ApiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/// <summary>
/// Call the API asynchronously.
/// </summary>
/// <param name="url">The URL of the API endpoint.</param>
/// <param name="method">The HTTP method to use (GET, POST, PUT, DELETE).</param>
/// <param name="data">The data to send with the request (optional).</param>
/// <param name="request">The request object (optional).</param>
/// <returns>A promise that resolves to the response data.</returns>
/// <remarks>
/// This function uses the axiosInstance to make the API call.
/// It automatically includes the authorization token in the request headers.
/// It also handles errors and logs them to the console.
/// </remarks>
export async function callApiAsync(
  url: string,
  method: ApiMethod,
  data: unknown = null,
  request: Request
) {
  const tokenInfo = await getUserTokenInformation(request);
  return await axiosInstance({
    url,
    method,
    data,
    headers: { 'Authorization': `Bearer ${tokenInfo?.token}` },
    withCredentials: true
  })
  .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}