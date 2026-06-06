import * as Relocation from "@/services/api/modules/relocation";
import {
  CreateRelocationRequestPayload,
  CreateRelocationRequestResponse,
  RelocationStatusResponse,
} from "@/services/api/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateRelocationRequest = () => {
  return useMutation<
    CreateRelocationRequestResponse,
    Error,
    CreateRelocationRequestPayload
  >({
    mutationFn: Relocation.createRelocationRequest,
  });
};

export const useRelocationStatus = (homeOwnerId: string) => {
  return useQuery<RelocationStatusResponse>({
    queryKey: ["relocation-status", homeOwnerId],
    queryFn: () => Relocation.getRelocationStatus(homeOwnerId),
    enabled: !!homeOwnerId,
  });
};
