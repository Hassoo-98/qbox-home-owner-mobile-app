import api from "../config";
import {
  CreateRelocationRequestPayload,
  CreateRelocationRequestResponse,
  RelocationStatusResponse,
} from "../types";

export const createRelocationRequest = async (
  data: CreateRelocationRequestPayload
): Promise<CreateRelocationRequestResponse> => {
  const response = await api.post<CreateRelocationRequestResponse>(
    "/home_owner/relocation/create",
    data
  );

  return response.data;
};

export const getRelocationStatus = async (
  homeOwnerId: string
): Promise<RelocationStatusResponse> => {
  const response = await api.get<RelocationStatusResponse>(
    `/home_owner/relocation/status/${homeOwnerId}`
  );

  return response.data;
};
