import { emailPattern, ERROR_MESSAGES, passwordPattern } from "@/constants";
import { ForgotPasswordFormValues, LoginFormValues } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";
import * as yup from "yup";

export const LoginFormResolver = yupResolver(
  yup.object().shape(
    {
      email: yup
        .string()
        .optional()
        .when("phone", {
          is: (phone: string | undefined) => !phone || phone.length === 0,
          then: (schema) =>
            schema
              .matches(emailPattern, ERROR_MESSAGES.INVALID_EMAIL)
              .required(ERROR_MESSAGES.REQUIRED_FIELD),
          otherwise: (schema) => schema.optional(),
        }),

      phone: yup
        .string()
        .optional()
        .when("email", {
          is: (email: string | undefined) => !email || email.length === 0,
          then: (schema) =>
            schema
              .required(ERROR_MESSAGES.REQUIRED_FIELD)
              .test(
                "valid-phone",
                "Please enter a valid phone number",
                function (value) {
                  if (!value) return false;
                  const preFixedValue = value.startsWith("+")
                    ? value
                    : `+${value}`;
                  try {
                    const phoneNumber =
                      parsePhoneNumberWithError(preFixedValue);
                    if (!phoneNumber) return false;
                    const isValid = isValidPhoneNumber(
                      preFixedValue,
                      phoneNumber.country as any
                    );
                    return isValid;
                  } catch (error) {
                    console.log("error while validating phone number", error);
                    return false;
                  }
                }
              ),
          otherwise: (schema) => schema.optional(),
        }),

      password: yup
        .string()
        .matches(passwordPattern, ERROR_MESSAGES.INVALID_PASSWORD)
        .required(ERROR_MESSAGES.REQUIRED_FIELD) as yup.StringSchema<
        string,
        yup.AnyObject,
        undefined,
        ""
      >,
    },
    [["email", "phone"]]
  ) as yup.ObjectSchema<LoginFormValues>
);

export const ForgotPasswordFormResolver = yupResolver(
  yup.object().shape(
    {
      email: yup
        .string()
        .optional()
        .when("phone", {
          is: (phone: string | undefined) => !phone || phone.length === 0,
          then: (schema) =>
            schema
              .matches(emailPattern, ERROR_MESSAGES.INVALID_EMAIL)
              .required(ERROR_MESSAGES.REQUIRED_FIELD),
          otherwise: (schema) => schema.optional(),
        }),

      phone: yup
        .string()
        .optional()
        .when("email", {
          is: (email: string | undefined) => !email || email.length === 0,
          then: (schema) =>
            schema
              .required(ERROR_MESSAGES.REQUIRED_FIELD)
              .test(
                "valid-phone",
                "Please enter a valid phone number",
                function (value) {
                  if (!value) return false;
                  const preFixedValue = value.startsWith("+")
                    ? value
                    : `+${value}`;
                  try {
                    const phoneNumber =
                      parsePhoneNumberWithError(preFixedValue);
                    if (!phoneNumber) return false;
                    const isValid = isValidPhoneNumber(
                      preFixedValue,
                      phoneNumber.country as any
                    );
                    return isValid;
                  } catch (error) {
                    console.log("error while validating phone number", error);
                    return false;
                  }
                }
              ),
          otherwise: (schema) => schema.optional(),
        }),
    },
    [["email", "phone"]]
  ) as yup.ObjectSchema<ForgotPasswordFormValues>
);
