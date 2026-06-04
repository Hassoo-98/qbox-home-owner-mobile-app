import api from "../config";
import { ServiceProviderLookupResponse } from "../types";

export const lookupServiceProvider = async (
  query?: string
): Promise<ServiceProviderLookupResponse> => {
  const response = await api.get<ServiceProviderLookupResponse>(
    "/service_provider/lookup/",
    {
      params: query
        ? {
            lookup: query,
            name: query,
          }
        : undefined,
    }
  );
  return response.data;
};
