import {
  emailPattern,
  ERROR_MESSAGES,
  passwordPattern,
  QR_VALIDITY_DURATION_TYPE,
} from "@/constants";
import {
  BasicInformationFormValues,
  ForgotPasswordFormValues,
  LoginFormValues,
  PasswordFormVales,
  QBoxLocationFormFormValues,
  QRGenerationFormValues,
  RenewSubscriptionFormData,
  ResetPasswordFormVales,
  ReturnPackageFormValues,
  SendPackageFormValues,
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
                  } catch {
                    // error handling
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
                  } catch {
                    // error handling
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

export const BasicInformationFormResolver = yupResolver(
  yup.object().shape(
    {
      fullName: yup
        .string()
        .required(ERROR_MESSAGES.REQUIRED_FIELD)
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name must not exceed 50 characters"),
      email: yup
        .string()
        .required(ERROR_MESSAGES.REQUIRED_FIELD)
        .matches(emailPattern, ERROR_MESSAGES.INVALID_EMAIL),
      phone: yup
        .string()
        .required(ERROR_MESSAGES.REQUIRED_FIELD)
        .max(15, "Phone number must not exceed 15 characters")
        .test("valid-phone", "Please enter a valid phone number", function (value) {
          if (!value) return false;
          const candidate = value.startsWith("+") ? value : `+${value}`;
          try {
            parsePhoneNumberWithError(candidate);
            return isValidPhoneNumber(candidate);
          } catch {
            return false;
          }
        }),
      secondaryPhone: yup
        .string()
        .optional()
        .max(15, "Secondary phone number must not exceed 15 characters")
        .test("valid-phone", "Please enter a valid phone number", function (value) {
          if (!value) return true;
          const candidate = value.startsWith("+") ? value : `+${value}`;
          try {
            parsePhoneNumberWithError(candidate);
            return isValidPhoneNumber(candidate);
          } catch {
            return false;
          }
        }),
    }
  ) as yup.ObjectSchema<BasicInformationFormValues>
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
      .max(15, "Phone number must not exceed 15 characters")
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

    secondaryPhone: yup
      .string()
      .nullable()
      .optional()
      .max(15, "Secondary phone number must not exceed 15 characters")
      .test(
        "valid-phone",
        "Please enter a valid phone number",
        function (value) {
          // ✅ empty = OK (optional field)
          if (!value) return true;

          const preFixedValue = value.startsWith("+") ? value : `+${value}`;

          try {
            const phoneNumber = parsePhoneNumberWithError(preFixedValue);
            if (!phoneNumber) return false;

            return isValidPhoneNumber(
              preFixedValue,
              phoneNumber.country as any
            );
          } catch (error) {
            console.log("error while validating phone number", error);
            return false;
          }
        }
      ),


    password: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(passwordPattern, ERROR_MESSAGES.INVALID_PASSWORD),

    confirmPassword: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .oneOf([yup.ref("password")], ERROR_MESSAGES.INVALID_CONFIRM_PASSWORD),

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
      .nullable()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "City must be at least 2 characters"),

    district: yup
      .string()
      .nullable()

      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "District must be at least 2 characters"),

    street: yup
      .string()
      .nullable()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "Street must be at least 2 characters"),

    postalCode: yup
      .string()
      .nullable()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^[0-9]{5}$/, "Postal code must be 5 digits"),

    buildingNumber: yup
      .string()
      .nullable()
      .optional(),

    secondaryNumber: yup
      .string()
      .nullable()
      .optional(),

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

    city: yup.string().nullable().optional(),

    district: yup.string().nullable().optional(),

    street: yup.string().nullable().optional(),

    postalCode: yup.string().nullable().optional(),

    buildingNumber: yup.string().nullable().optional(),

    secondaryNumber: yup.string().nullable().optional(),

    installationLocation: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "Please select an installation location"),

    accessInstruction: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "Please enter access instructions"),

    qboxImage: yup.string().nullable().optional(),
  }) as yup.ObjectSchema<QBoxLocationFormFormValues>
);
export const RenewSubscriptionResolver = yupResolver(
  yup.object().shape({
    name: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),

    phone: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(10, "Phone number must be at least 10 digits"),

    price: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),

    startDate: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^\d{2}\/\d{2}\/\d{2}$/, "Date format should be DD/MM/YY"),

    endDate: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .matches(/^\d{2}\/\d{2}\/\d{2}$/, "Date format should be DD/MM/YY"),

    paymentMethod: yup
      .string()
      .oneOf(["card", "stc"], "Please select a valid payment method")
      .required(ERROR_MESSAGES.REQUIRED_FIELD),

    cardHolderName: yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .required(ERROR_MESSAGES.REQUIRED_FIELD)
          .min(3, "Card holder name must be at least 3 characters")
          .max(100, "Card holder name must not exceed 100 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),

    cardNumber: yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .required(ERROR_MESSAGES.REQUIRED_FIELD)
          .matches(
            /^\d{13,19}$/,
            "Card number must be between 13 and 19 digits"
          )
          .test("luhn", "Invalid card number", (value) => {
            if (!value) return false;
            // Luhn algorithm for card validation
            let sum = 0;
            let isEven = false;
            for (let i = value.length - 1; i >= 0; i--) {
              let digit = parseInt(value.charAt(i), 10);
              if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
              }
              sum += digit;
              isEven = !isEven;
            }
            return sum % 10 === 0;
          }),
      otherwise: (schema) => schema.notRequired(),
    }),

    expiry: yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .required(ERROR_MESSAGES.REQUIRED_FIELD)
          .matches(/^\d{2}\/\d{4}$/, "Expiry format should be MM/YYYY")
          .test("valid-month", "Month must be between 01 and 12", (value) => {
            if (!value) return false;
            const month = parseInt(value.split("/")[0], 10);
            return month >= 1 && month <= 12;
          })
          .test("not-expired", "Card has expired", (value) => {
            if (!value) return false;
            const [month, year] = value.split("/").map(Number);
            const expiry = new Date(year, month - 1);
            const today = new Date();
            today.setDate(1); // Set to first day of current month
            return expiry >= today;
          }),
      otherwise: (schema) => schema.notRequired(),
    }),

    cvv: yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .required(ERROR_MESSAGES.REQUIRED_FIELD)
          .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }) as yup.ObjectSchema<RenewSubscriptionFormData>
);

export const SendPackageFormResolver = yupResolver(
  yup.object().shape({
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

            return isValidPhoneNumber(
              preFixedValue,
              phoneNumber.country as any
            );
          } catch (error) {
            console.log("error while validating phone number", error);
            return false;
          }
        }
      ),

    qBoxId: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(5, "QBox ID must be at least 5 characters"),

    receiverHomeOwnerId: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),

    senderHomeOwnerId: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),

    serviceProviderId: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),

    packageType: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),

    packageWeight: yup
      .number()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(0.1, "Weight must be greater than 0"),

    currency: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),

    packageItemValue: yup
      .number()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(1, "Item value must be greater than 0"),

    packageDescription: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must not exceed 500 characters"),

    qboxImage: yup.string().required("Please upload a QBox image"),

    shippingCompany: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),

    shippingCompanyName: yup.string().optional(),

    paymentMethod: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),

    paymentMethodId: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),

    cardHolderName: yup.string().when("paymentMethod", {
      is: (value: string) => value === "Credit/Debit Card",
      then: (schema) => schema.required(ERROR_MESSAGES.REQUIRED_FIELD),
      otherwise: (schema) => schema.optional(),
    }),

    cardNumber: yup.string().when("paymentMethod", {
      is: (value: string) => value === "Credit/Debit Card",
      then: (schema) =>
        schema
          .required(ERROR_MESSAGES.REQUIRED_FIELD)
          .matches(/^\d{13,19}$/, "Card number must be between 13 and 19 digits"),
      otherwise: (schema) => schema.optional(),
    }),

    expiry: yup.string().when("paymentMethod", {
      is: (value: string) => value === "Credit/Debit Card",
      then: (schema) =>
        schema
          .required(ERROR_MESSAGES.REQUIRED_FIELD)
          .matches(/^\d{2}\/\d{2}$/, "Expiry format should be MM/YY"),
      otherwise: (schema) => schema.optional(),
    }),

    cvv: yup.string().when("paymentMethod", {
      is: (value: string) => value === "Credit/Debit Card",
      then: (schema) =>
        schema
          .required(ERROR_MESSAGES.REQUIRED_FIELD)
          .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
      otherwise: (schema) => schema.optional(),
    }),

    charges: yup.number().required(ERROR_MESSAGES.REQUIRED_FIELD),
  }) as yup.ObjectSchema<SendPackageFormValues>
);

export const ReturnPackageFormResolver = yupResolver(
  yup.object().shape({
    pinCode: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(3, "Pin Code must be at least 3 characters")
      .max(18, "Pin Code must not exceed 18 characters"),
    packageType: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),

    packageWeight: yup
      .number()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(0.1, "Weight must be greater than 0"),

    currency: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),

    packageItemValue: yup
      .number()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(1, "Item value must be greater than 0"),

    packageDescription: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must not exceed 500 characters"),

    returnPackageImage: yup.string().required("Please upload a QBox image"),
  }) as yup.ObjectSchema<ReturnPackageFormValues>
);
const checkPasswordStrength = (password: string) => {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  return {
    hasLowercase,
    hasUppercase,
    hasNumbers,
    hasSpecialChar,
  };
};

export const PasswordFormResolver = yupResolver(
  yup.object().shape({
    oldPassword: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(8, "Password must be at least 8 characters")
      .test(
        "password-strength",
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
        function (value) {
          if (!value) return false;
          const strength = checkPasswordStrength(value);
          return (
            strength.hasLowercase &&
            strength.hasUppercase &&
            strength.hasNumbers &&
            strength.hasSpecialChar
          );
        }
      ),

    password: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(8, "Password must be at least 8 characters")
      .test(
        "password-strength",
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
        function (value) {
          if (!value) return false;
          const strength = checkPasswordStrength(value);
          return (
            strength.hasLowercase &&
            strength.hasUppercase &&
            strength.hasNumbers &&
            strength.hasSpecialChar
          );
        }
      )
      .test(
        "different-from-old",
        "New password must be different from old password",
        function (value) {
          const { oldPassword } = this.parent;
          return !oldPassword || value !== oldPassword;
        }
      ),

    confirmPassword: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .oneOf([yup.ref("password")], "Passwords must match"),
  }) as yup.ObjectSchema<PasswordFormVales>
);

export const ResetPasswordFormResolver = yupResolver(
  yup.object().shape({
    password: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .min(8, "Password must be at least 8 characters")
      .test(
        "password-strength",
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
        function (value) {
          if (!value) return false;
          const strength = checkPasswordStrength(value);
          return (
            strength.hasLowercase &&
            strength.hasUppercase &&
            strength.hasNumbers &&
            strength.hasSpecialChar
          );
        }
      ),
    confirmPassword: yup
      .string()
      .required(ERROR_MESSAGES.REQUIRED_FIELD)
      .oneOf([yup.ref("password")], "Passwords must match"),
  }) as yup.ObjectSchema<ResetPasswordFormVales>
);
