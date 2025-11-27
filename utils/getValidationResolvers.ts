import {
  emailPattern,
  ERROR_MESSAGES,
  passwordPattern,
  QR_VALIDITY_DURATION_TYPE,
} from "@/constants";
import {
  ForgotPasswordFormValues,
  LoginFormValues,
  QBoxLocationFormFormValues,
  QRGenerationFormValues,
  SignUpFormValues,
} from "@/types";
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

export const QRGenerationFormResolver = yupResolver(
  yup.object().shape({
    qrName: yup.string().optional().max(20, ERROR_MESSAGES.MAX_LENGTH),
    maxUsers: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^[0-9]+$/, "Please enter a valid number")
      .test("is-positive", "Must be greater than 0", (value) =>
        value ? parseInt(value) > 0 : false
      ),
    validityDuration: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^[0-9]+$/, "Please enter a valid number")
      .test("is-positive", "Must be greater than 0", (value) =>
        value ? parseInt(value) > 0 : false
      ),
    validityDurationType: yup
      .string()
      .oneOf(
        Object.values(QR_VALIDITY_DURATION_TYPE),
        ERROR_MESSAGES.REQUIRED_FIELD
      )
      .required(ERROR_MESSAGES.REQUIRED_FIELD),
  }) as yup.ObjectSchema<QRGenerationFormValues>
);

export const SignUpFormResolver = yupResolver(
  yup.object().shape({
    // Step 1 - Basic Information
    fullName: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters"),

    email: yup
      .string()
      .matches(emailPattern, ERROR_MESSAGES.INVALID_EMAIL)
      .required(ERROR_MESSAGES.REQUIRED_FIELD),

    phone: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .test(
        "valid-phone",
        "Please enter a valid phone number",
        function (value) {
          if (!value) return false;
          const preFixedValue = value.startsWith("+") ? value : `+${value}`;
          try {
            const phoneNumber = parsePhoneNumberWithError(preFixedValue);
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

    password: yup
      .string()
      .matches(passwordPattern, ERROR_MESSAGES.INVALID_PASSWORD)
      .required(ERROR_MESSAGES.REQUIRED_FIELD),

    confirmPassword: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .oneOf([yup.ref("password")], "Passwords must match"),

    // Step 2 - QBox Verification
    qBoxId: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(5, "QBox ID must be at least 5 characters"),

    // Step 3 - Address Information
    shortId: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(5, "Short ID must be at least 5 characters"),

    city: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "City must be at least 2 characters"),

    district: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "District must be at least 2 characters"),

    street: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "Street must be at least 2 characters"),

    postalCode: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^[0-9]{5}$/, "Postal code must be 5 digits"),

    buildingNumber: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^[0-9]+$/, "Building number must be numeric"),

    secondaryNumber: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^[0-9]+$/, "Secondary number must be numeric"),

    installationLocation: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .oneOf(
        ["mainDoor", "gate", "entrance"],
        "Please select a valid installation location"
      ),

    accessInstruction: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(
        10,
        "Please provide detailed access instructions (at least 10 characters)"
      )
      .max(500, "Access instructions must not exceed 500 characters"),

    qboxImage: yup.string().required("Please upload a QBox image"),
  }) as yup.ObjectSchema<SignUpFormValues>
);

export const MyQBoxLocationResolver = yupResolver(
  yup.object().shape({
    shortId: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(5, "Short ID must be at least 5 characters"),

    city: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "City must be at least 2 characters"),

    district: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "District must be at least 2 characters"),

    street: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "Street must be at least 2 characters"),

    postalCode: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^[0-9]{5}$/, "Postal code must be 5 digits"),

    buildingNumber: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^[0-9]+$/, "Building number must be numeric"),

    secondaryNumber: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^[0-9]+$/, "Secondary number must be numeric"),

    installationLocation: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .oneOf(
        ["mainDoor", "gate", "entrance"],
        "Please select a valid installation location"
      ),

    accessInstruction: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(
        10,
        "Please provide detailed access instructions (at least 10 characters)"
      )
      .max(500, "Access instructions must not exceed 500 characters"),

    qboxImage: yup.string().required("Please upload a QBox image"),
  }) as yup.ObjectSchema<QBoxLocationFormFormValues>
);
