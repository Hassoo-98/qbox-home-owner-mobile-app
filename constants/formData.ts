import { AUTH_PROVIDERS, PACKAGE_TYPE } from "./enums";

export const AUTH_PROVIDER_OPTIONS = [
  { label: "Phone Number", value: AUTH_PROVIDERS.PHONE },
  { label: "Email Address", value: AUTH_PROVIDERS.EMAIL },
];

export const PACKAGES_OPTIONS = [
  { label: "Incoming", value: PACKAGE_TYPE.INCOMING },
  { label: "Outgoing", value: PACKAGE_TYPE.OUTGOING },
  { label: "Delivered", value: PACKAGE_TYPE.DELIVERED },
];
