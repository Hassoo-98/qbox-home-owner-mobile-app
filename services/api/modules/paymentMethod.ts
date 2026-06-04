import api from "../config";
import { PaymentMethodsResponse } from "../types";

export const getPaymentMethods = async (): Promise<PaymentMethodsResponse> => {
  const response = await api.get<PaymentMethodsResponse>("/payment-method/");
  return response.data;
};
