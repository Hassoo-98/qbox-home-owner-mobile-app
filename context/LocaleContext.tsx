import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";
import React, { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { I18nManager } from "react-native";

export type AppLocale = "en" | "ar";

type TranslationKey =
  | "save"
  | "saving"
  | "update"
  | "submit"
  | "confirm"
  | "connect"
  | "cancel"
  | "continue"
  | "retry"
  | "next"
  | "previous"
  | "complete"
  | "loading"
  | "check"
  | "profile"
  | "home"
  | "basicInformation"
  | "welcome"
  | "signIn"
  | "signUp"
  | "signInToAccount"
  | "welcomeBack"
  | "deliverSmarter"
  | "fastSecure"
  | "dontHaveAccount"
  | "forgotPassword"
  | "forgotPasswordQuestion"
  | "createSecurePassword"
  | "enterStrongPassword"
  | "passwordResetSuccessful"
  | "passwordResetSubtitle"
  | "goToLogin"
  | "rememberPasswordBackTo"
  | "newPassword"
  | "retypePassword"
  | "enterNewPassword"
  | "enterConfirmPassword"
  | "verifyQBox"
  | "address"
  | "password"
  | "language"
  | "myQBoxLocation"
  | "subscriptionHistory"
  | "promoCode"
  | "contactUs"
  | "logout"
  | "wifi"
  | "bluetooth"
  | "english"
  | "arabic"
  | "verify"
  | "verified"
  | "fullName"
  | "emailAddress"
  | "phoneNumber"
  | "secondaryNumber"
  | "selectLanguage"
  | "selectLocation"
  | "connected"
  | "disconnected"
  | "connecting"
  | "notFound"
  | "error"
  | "success"
  | "otpVerification"
  | "enterEmailOtp"
  | "enterPhoneOtp"
  | "resendOtp"
  | "didntReceiveTheCode"
  | "resendAgain"
  | "currentEmail"
  | "currentPhone"
  | "enterFullName"
  | "enterEmailAddress"
  | "enterPhoneNumber"
  | "enterSecondaryNumber"
  | "emailOrPhoneRequired"
  | "nameAndEmailRequired"
  | "verifyCurrentEmailBeforeSaving"
  | "verifyCurrentPhoneBeforeSaving"
  | "otpRequired"
  | "otpMustBe6Digits"
  | "profileUpdatedSuccessfully"
  | "emailVerifiedSuccessfully"
  | "phoneVerifiedSuccessfully"
  | "qboxNotFound"
  | "noQBoxFoundForThisUser"
  | "deviceAlreadyConnected"
  | "deviceOffline"
  | "permissionDenied"
  | "bluetoothOff"
  | "searchingForSmartLocker"
  | "makeSureSmartLocker"
  | "devicesFound"
  | "rescan"
  | "scan"
  | "noDevicesFound"
  | "signal"
  | "wifiConnected"
  | "wifiConnectionFailed"
  | "wifiPasswordIncorrect"
  | "yourQBoxNotResponding"
  | "noWifiNetworksFound"
  | "connectToNetwork"
  | "passwordOptional"
  | "enterWifiPassword"
  | "leaveEmptyForOpenNetwork"
  | "openNetwork"
  | "scanForNetworks"
  | "connectingTo"
  | "package"
  | "sendPackage"
  | "returnPackage"
  | "incoming"
  | "outgoing"
  | "delivered"
  | "packageType"
  | "packageWeight"
  | "enterWeight"
  | "itemValue"
  | "currency"
  | "description"
  | "packageImage"
  | "tapToChangeImage"
  | "uploadImage"
  | "qrSetting"
  | "qrCodeHistory"
  | "qrCodeDetails"
  | "qrNameOptional"
  | "maximumUsers"
  | "validDuration"
  | "generateAccessQRCode"
  | "generatingQrCode"
  | "shareQrCode"
  | "shareUrl"
  | "qrPreviewWillAppearHere"
  | "validFor"
  | "users"
  | "expiresIn"
  | "minute"
  | "hour"
  | "day"
  | "shortAddress"
  | "cityOptional"
  | "districtOptional"
  | "streetOptional"
  | "postalCodeOptional"
  | "buildingNumberOptional"
  | "secondaryNumberOptional"
  | "preferredInstallationLocation"
  | "accessInstruction"
  | "qboxImage"
  | "placeQBoxInFront"
  | "packageGuidelines"
  | "packageGuidelineMaxWeight"
  | "packageGuidelineFragile"
  | "packageGuidelineImage"
  | "packageGuidelinePerishable"
  | "dateTime"
  | "serviceProvider"
  | "discount"
  | "expiryDate"
  | "receiverName"
  | "senderName"
  | "courierName"
  | "lastUpdate"
  | "city"
  | "connectingToLiveUpdates"
  | "deviceMetrics"
  | "realTimeDeviceStatusAndHealth"
  | "connectionStatus"
  | "wifiAndMqttStatusWithRemoteActions"
  | "snapshot"
  | "quickDeviceDetailsAtAGlance"
  | "deviceUsage"
  | "cpuRamAndDiskUtilizationFromTheLatestTelemetrySample"
  | "deviceStatusUpdatesAreRefreshedInRealTimeWhenThePageIsOpenPullDownToRefreshManually"
  | "localIp"
  | "wifiSsid"
  | "cpuTemp"
  | "uptime"
  | "deviceId"
  | "restartDevice"
  | "factoryReset"
  | "choosePackageType"
  | "reportAnIssue"
  | "issueRelatedTo"
  | "selectIssueType"
  | "issueDescription"
  | "describeIssueClearly"
  | "promotionTitle"
  | "promotionCode"
  | "startDate"
  | "endDate"
  | "packageDescription"
  | "selectOneOfOptionsBelowToProceedFurther"
  | "driver"
  | "courier"
  | "send"
  | "scanHistory"
  | "qrCodeValidity"
  | "leftUsers"
  | "offerClaimedSuccessfully"
  | "promotionActivated"
  | "promotionSummary"
  | "theDiscountWillBeAppliedAutomaticallyAtCheckout"
  | "claimOffer"
  | "noScanHistoryFound"
  | "validForUsers"
  | "failed"
  | "lockerOpened"
  | "lockerClosed"
  | "viewRecording"
  | "qrCodeNotFound"
  | "pinCode"
  | "pinCodeInstruction"
  | "enterPinCode"
  | "packageNotFound"
  | "issueReportedSuccessfully"
  | "failedToReportIssue"
  | "somethingWentWrong"
  | "noShipmentsFound"
  | "searchByTrackingId"
  | "note"
  | "qboxStatus"
  | "internalCamera"
  | "externalCamera"
  | "alarm"
  | "unknown"
  | "working"
  | "notWorking"
  | "active"
  | "inactive"
  | "connectingNow"
  | "selectDate"
  | "done"
  | "otp"
  | "trackingId"
  | "driverName"
  | "assignOtp"
  | "openBox"
  | "liveView"
  | "inside"
  | "mainDoor"
  | "gate"
  | "buildingEntrance"
  | "qrCode"
  | "electronic"
  | "medical"
  | "other"
  | "driverOtpRequest"
  | "driverOtpCancelNote"
  | "pendingRelocationRequest"
  | "renewSubscription"
  | "wifiProvisioning"
  | "recipientInformation"
  | "packageInformation"
  | "deliveryInformation"
  | "smartLocker"
  | "telemetry";

const LOCALE_KEY = "app_locale";

const translations: Record<AppLocale, Record<TranslationKey, string>> = {
  en: {
    save: "Save",
    saving: "Saving...",
    update: "Update",
    submit: "Submit",
    confirm: "Confirm",
    connect: "Connect",
    cancel: "Cancel",
    continue: "Continue",
    retry: "Retry",
    next: "Next",
    previous: "Previous",
    complete: "Complete",
    loading: "Loading...",
    check: "Check",
    profile: "Profile",
    home: "Home",
    basicInformation: "Basic Information",
    welcome: "Welcome",
    signIn: "Sign In",
    signUp: "Sign Up",
    signInToAccount: "Sign in to your Qbox account.",
    welcomeBack: "Welcome Back!",
    deliverSmarter: "Deliver Smarter with QBOX",
    fastSecure: "Fast, Secure, and Hassle-Free Drop-Offs.",
    dontHaveAccount: "Don't have an account?",
    forgotPassword: "Forgot Password?",
    forgotPasswordQuestion: "Forgot Password?",
    createSecurePassword: "Create a Secure Password",
    enterStrongPassword: "Enter a strong password to secure your account.",
    passwordResetSuccessful: "Password Reset Successful!",
    passwordResetSubtitle:
      "Your password has been successfully reset. You can now login with your new password.",
    goToLogin: "Go to Login",
    rememberPasswordBackTo: "Remember Password? Back to",
    newPassword: "New Password",
    retypePassword: "Re-type Password",
    enterNewPassword: "Enter new password",
    enterConfirmPassword: "Enter password",
    verifyQBox: "Verify QBox",
    address: "Address",
    password: "Password",
    language: "Language",
    myQBoxLocation: "My QBox Location",
    subscriptionHistory: "Subscription History",
    promoCode: "Promo Code",
    contactUs: "Contact Us",
    logout: "Logout",
    wifi: "Wi-Fi",
    bluetooth: "Bluetooth",
    english: "English",
    arabic: "Arabic",
    verify: "Verify",
    verified: "Verified",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    secondaryNumber: "Secondary Number",
    selectLanguage: "Select Language",
    selectLocation: "Select location",
    connected: "Connected",
    disconnected: "Disconnected",
    connecting: "Connecting",
    notFound: "Not Found",
    error: "Error",
    success: "Success",
    otpVerification: "OTP Verification",
    enterEmailOtp: "Enter the 6-digit code sent to your email.",
    enterPhoneOtp: "Enter the 6-digit code sent to your phone number.",
    resendOtp: "Resend OTP",
    didntReceiveTheCode: "Didn't receive the code?",
    resendAgain: "Resend again",
    currentEmail: "Current email is already verified",
    currentPhone: "Current phone number is already verified",
    enterFullName: "Enter your full name",
    enterEmailAddress: "Enter email address",
    enterPhoneNumber: "Enter your phone number",
    enterSecondaryNumber: "Enter secondary number",
    emailOrPhoneRequired: "Please enter your email address or phone number.",
    nameAndEmailRequired: "Name and email are required.",
    verifyCurrentEmailBeforeSaving: "Please verify the current email before saving.",
    verifyCurrentPhoneBeforeSaving: "Please verify the current phone number before saving.",
    otpRequired: "OTP is required",
    otpMustBe6Digits: "OTP must be 6 digits",
    profileUpdatedSuccessfully: "Profile updated successfully.",
    emailVerifiedSuccessfully: "Email verified successfully.",
    phoneVerifiedSuccessfully: "Phone number verified successfully.",
    qboxNotFound: "No QBox is linked with this account.",
    noQBoxFoundForThisUser: "No QBox found for this user",
    deviceAlreadyConnected:
      "Your device is already connected with Wi-Fi. You are not able to use Bluetooth.",
    deviceOffline: "Your QBox is offline. Wi-Fi settings are locked until the device is online.",
    permissionDenied: "Permission Denied",
    bluetoothOff: "Bluetooth is Off",
    searchingForSmartLocker: "Searching for SmartLocker...",
    makeSureSmartLocker: "Make sure your SmartLocker is powered on and nearby.",
    devicesFound: "found",
    rescan: "Rescan",
    scan: "Scan",
    noDevicesFound: "No SmartLocker devices found.",
    signal: "Signal",
    wifiConnected: "Wi-Fi connected",
    wifiConnectionFailed: "Wi-Fi connection failed",
    wifiPasswordIncorrect: "Incorrect Wi-Fi password. Please check and try again.",
    yourQBoxNotResponding: "Your QBox is not responding. Please check that the device is online.",
    noWifiNetworksFound: "No Wi-Fi networks found.",
    connectToNetwork: "Connect to Network",
    passwordOptional: "Password (Optional)",
    enterWifiPassword: "Enter Wi-Fi password",
    leaveEmptyForOpenNetwork: "Leave empty for open network",
    openNetwork: "This is an open network. You can connect without a password.",
    scanForNetworks: "Scanning for networks...",
    connectingTo: "Connecting to",
    package: "Package",
    sendPackage: "Send a Package",
    returnPackage: "Return a Package",
    incoming: "Incoming",
    outgoing: "Outgoing",
    delivered: "Delivered",
    packageType: "Package Type",
    packageWeight: "Package Weight",
    enterWeight: "Enter Weight",
    itemValue: "Item Value",
    currency: "Currency",
    description: "Description",
    packageImage: "Package Image",
    tapToChangeImage: "Tap to change image",
    uploadImage: "Upload image",
    qrSetting: "QR Setting",
    qrCodeHistory: "QR Code History",
    qrCodeDetails: "QR Code Details",
    qrNameOptional: "QR Name (Optional)",
    maximumUsers: "Maximum Users",
    validDuration: "Valid Duration",
    generateAccessQRCode: "Generate Access QR Code",
    generatingQrCode: "Generating QR Code",
    shareQrCode: "Share QR Code",
    shareUrl: "Share URL",
    qrPreviewWillAppearHere: "QR preview will appear here",
    validFor: "Valid for",
    users: "users",
    expiresIn: "expires in",
    minute: "minute",
    hour: "hour",
    day: "day",
    shortAddress: "Short Address",
    cityOptional: "City (Optional)",
    districtOptional: "District (Optional)",
    streetOptional: "Street (Optional)",
    postalCodeOptional: "Postal Code (Optional)",
    buildingNumberOptional: "Building Number (Optional)",
    secondaryNumberOptional: "Secondary Number (Optional)",
    preferredInstallationLocation: "Preferred Installation Location",
    accessInstruction: "Access Instruction",
    qboxImage: "QBox Image",
    placeQBoxInFront: "Place QBox in front of your main door. Take the picture and upload it here.",
    packageGuidelines: "Package Guidelines",
    packageGuidelineMaxWeight: "Maximum weight: 5 kg",
    packageGuidelineFragile: "Fragile items should be packed properly.",
    packageGuidelineImage: "Upload a photo of the ready package.",
    packageGuidelinePerishable: "Do not send perishable food in long-distance shipments.",
    dateTime: "Date & Time",
    serviceProvider: "Service Provider",
    discount: "Discount",
    expiryDate: "Expiry Date",
    receiverName: "Receiver Name",
    senderName: "Sender Name",
    courierName: "Courier Name",
    lastUpdate: "Last update",
    city: "City",
    connectingToLiveUpdates: "Connecting to live updates...",
    deviceMetrics: "Device metrics",
    realTimeDeviceStatusAndHealth: "Real-time device status and health",
    connectionStatus: "Connection status",
    wifiAndMqttStatusWithRemoteActions: "Wi-Fi and MQTT status with remote actions",
    snapshot: "Snapshot",
    quickDeviceDetailsAtAGlance: "Quick device details at a glance",
    deviceUsage: "Device Usage",
    cpuRamAndDiskUtilizationFromTheLatestTelemetrySample:
      "CPU, RAM, and disk utilization from the latest telemetry sample",
    deviceStatusUpdatesAreRefreshedInRealTimeWhenThePageIsOpenPullDownToRefreshManually:
      "Device status updates are refreshed in real time when the page is open. Pull down to refresh manually.",
    localIp: "Local IP",
    wifiSsid: "Wi-Fi SSID",
    cpuTemp: "CPU Temp",
    uptime: "Uptime",
    deviceId: "Device ID",
    restartDevice: "Restart Device",
    factoryReset: "Factory Reset",
    choosePackageType: "Choose Package Type",
    reportAnIssue: "Report an issue",
    issueRelatedTo: "Issue related to",
    selectIssueType: "Select issue type",
    issueDescription: "Issue Description",
    describeIssueClearly: "Describe the issue clearly",
    promotionTitle: "Promotion Title",
    promotionCode: "Promotion Code",
    startDate: "Start Date",
    endDate: "End Date",
    packageDescription: "Package Description",
    selectOneOfOptionsBelowToProceedFurther: "Select one of the options below to proceed further.",
    driver: "Driver",
    courier: "Courier",
    send: "Send",
    scanHistory: "Scan History",
    qrCodeValidity: "QR Code Validity",
    leftUsers: "Left users",
    offerClaimedSuccessfully: "Offer Claimed Successfully!",
    promotionActivated: "Your promotion code has been activated.",
    promotionSummary: "Promotion Summary",
    theDiscountWillBeAppliedAutomaticallyAtCheckout:
      "The discount will be applied automatically at checkout.",
    claimOffer: "Claim Offer",
    noScanHistoryFound: "No scan history found",
    validForUsers: "Valid for",
    failed: "Failed",
    lockerOpened: "Locker Opened",
    lockerClosed: "Locker Closed",
    viewRecording: "View Recording",
    qrCodeNotFound: "QR Code not found",
    pinCode: "PIN Code",
    pinCodeInstruction:
      "To enter the PIN, open the delivered package you want to return, then enter the PIN added by the owner.",
    enterPinCode: "Enter pin Code",
    packageNotFound: "Package Not Found",
    issueReportedSuccessfully: "Issue reported successfully",
    failedToReportIssue: "Failed to report issue",
    somethingWentWrong: "Something went wrong while reporting the issue",
    noShipmentsFound: "No Shipments Found",
    searchByTrackingId: "Search by tracking ID",
    note: "Note",
    qboxStatus: "QBox Status",
    internalCamera: "Internal Camera",
    externalCamera: "External Camera",
    alarm: "Alarm",
    unknown: "Unknown",
    working: "Working",
    notWorking: "Not Working",
    active: "Active",
    inactive: "Inactive",
    connectingNow: "Connecting...",
    selectDate: "Select Date",
    done: "Done",
    otp: "OTP",
    trackingId: "Tracking ID",
    driverName: "Driver Name",
    assignOtp: "Assign OTP",
    openBox: "Open Box",
    liveView: "Live View",
    inside: "Inside",
    mainDoor: "Main Door",
    gate: "Gate",
    buildingEntrance: "Building Entrance",
    qrCode: "QR Code",
    electronic: "Electronic",
    medical: "Medical",
    other: "Other",
    driverOtpRequest: "Driver is requesting an OTP.",
    driverOtpCancelNote: "If you cancel, the delivery will be marked as failed.",
    pendingRelocationRequest:
      "You already have a pending relocation request. Please wait for approval before creating another one.",
    dataSecureTitle: "Your data is safe",
    dataSecureDescription:
      "All information is encrypted and stored securely. We comply with all data protection regulations.",
    renewSubscription: "Renew Subscription",
    wifiProvisioning: "WiFi Provisioning",
    recipientInformation: "Recipient Information",
    packageInformation: "Package Information",
    deliveryInformation: "Delivery Information",
    smartLocker: "SmartLocker",
    telemetry: "Telemetry",
  },
  ar: {
    save: "حفظ",
    saving: "جارٍ الحفظ...",
    update: "تحديث",
    submit: "إرسال",
    confirm: "تأكيد",
    connect: "اتصال",
    cancel: "إلغاء",
    continue: "متابعة",
    retry: "إعادة المحاولة",
    next: "التالي",
    previous: "السابق",
    complete: "إكمال",
    loading: "جارٍ التحميل...",
    check: "تحقق",
    profile: "الملف الشخصي",
    home: "الرئيسية",
    basicInformation: "المعلومات الأساسية",
    welcome: "مرحبًا",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signInToAccount: "سجّل الدخول إلى حساب Qbox الخاص بك.",
    welcomeBack: "مرحبًا بعودتك!",
    deliverSmarter: "سلّم بذكاء مع QBOX",
    fastSecure: "تسليم سريع وآمن وسهل.",
    dontHaveAccount: "ليس لديك حساب؟",
    forgotPassword: "هل نسيت كلمة المرور؟",
    forgotPasswordQuestion: "هل نسيت كلمة المرور؟",
    createSecurePassword: "أنشئ كلمة مرور آمنة",
    enterStrongPassword: "أدخل كلمة مرور قوية لتأمين حسابك.",
    passwordResetSuccessful: "تمت إعادة تعيين كلمة المرور بنجاح!",
    passwordResetSubtitle:
      "تمت إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
    goToLogin: "الانتقال إلى تسجيل الدخول",
    rememberPasswordBackTo: "تتذكر كلمة المرور؟ العودة إلى",
    newPassword: "كلمة المرور الجديدة",
    retypePassword: "أعد كتابة كلمة المرور",
    enterNewPassword: "أدخل كلمة المرور الجديدة",
    enterConfirmPassword: "أدخل كلمة المرور",
    verifyQBox: "التحقق من QBox",
    address: "العنوان",
    password: "كلمة المرور",
    language: "اللغة",
    myQBoxLocation: "موقعي QBox",
    subscriptionHistory: "سجل الاشتراك",
    promoCode: "رمز الخصم",
    contactUs: "تواصل معنا",
    logout: "تسجيل الخروج",
    wifi: "Wi-Fi",
    bluetooth: "البلوتوث",
    english: "الإنجليزية",
    arabic: "العربية",
    verify: "تحقق",
    verified: "تم التحقق",
    fullName: "الاسم الكامل",
    emailAddress: "البريد الإلكتروني",
    phoneNumber: "رقم الهاتف",
    secondaryNumber: "رقم ثانوي",
    selectLanguage: "اختر اللغة",
    selectLocation: "اختر الموقع",
    connected: "متصل",
    disconnected: "غير متصل",
    connecting: "جارٍ الاتصال",
    notFound: "غير موجود",
    error: "خطأ",
    success: "نجاح",
    otpVerification: "التحقق عبر OTP",
    enterEmailOtp: "أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك الإلكتروني.",
    enterPhoneOtp: "أدخل الرمز المكون من 6 أرقام المرسل إلى رقم هاتفك.",
    resendOtp: "إعادة إرسال OTP",
    didntReceiveTheCode: "لم يصلك الرمز؟",
    resendAgain: "إعادة الإرسال",
    currentEmail: "تم التحقق من البريد الإلكتروني الحالي بالفعل",
    currentPhone: "تم التحقق من رقم الهاتف الحالي بالفعل",
    enterFullName: "أدخل اسمك الكامل",
    enterEmailAddress: "أدخل البريد الإلكتروني",
    enterPhoneNumber: "أدخل رقم هاتفك",
    enterSecondaryNumber: "أدخل الرقم الثانوي",
    emailOrPhoneRequired: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف.",
    nameAndEmailRequired: "الاسم والبريد الإلكتروني مطلوبان.",
    verifyCurrentEmailBeforeSaving: "يرجى التحقق من البريد الإلكتروني الحالي قبل الحفظ.",
    verifyCurrentPhoneBeforeSaving: "يرجى التحقق من رقم الهاتف الحالي قبل الحفظ.",
    otpRequired: "OTP مطلوب",
    otpMustBe6Digits: "يجب أن يتكون OTP من 6 أرقام",
    profileUpdatedSuccessfully: "تم تحديث الملف الشخصي بنجاح.",
    emailVerifiedSuccessfully: "تم التحقق من البريد الإلكتروني بنجاح.",
    phoneVerifiedSuccessfully: "تم التحقق من رقم الهاتف بنجاح.",
    qboxNotFound: "لا يوجد QBox مرتبط بهذا الحساب.",
    noQBoxFoundForThisUser: "لم يتم العثور على QBox لهذا المستخدم",
    deviceAlreadyConnected:
      "جهازك متصل بالفعل بشبكة Wi-Fi. لا يمكنك استخدام البلوتوث.",
    deviceOffline: "QBox غير متصل. إعدادات Wi-Fi مقفلة حتى يصبح الجهاز متصلاً.",
    permissionDenied: "تم رفض الإذن",
    bluetoothOff: "البلوتوث مغلق",
    searchingForSmartLocker: "جارٍ البحث عن SmartLocker...",
    makeSureSmartLocker: "تأكد من أن SmartLocker يعمل وقريب منك.",
    devicesFound: "تم العثور على",
    rescan: "إعادة الفحص",
    scan: "فحص",
    noDevicesFound: "لم يتم العثور على أجهزة SmartLocker.",
    signal: "الإشارة",
    wifiConnected: "تم الاتصال بـ Wi-Fi",
    wifiConnectionFailed: "فشل الاتصال بـ Wi-Fi",
    wifiPasswordIncorrect: "كلمة مرور Wi-Fi غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.",
    yourQBoxNotResponding: "QBox لا يستجيب. يرجى التأكد من أن الجهاز متصل بالإنترنت.",
    noWifiNetworksFound: "لم يتم العثور على شبكات Wi-Fi.",
    connectToNetwork: "الاتصال بالشبكة",
    passwordOptional: "كلمة المرور (اختياري)",
    enterWifiPassword: "أدخل كلمة مرور Wi-Fi",
    leaveEmptyForOpenNetwork: "اتركه فارغًا للشبكة المفتوحة",
    openNetwork: "هذه شبكة مفتوحة. يمكنك الاتصال بدون كلمة مرور.",
    scanForNetworks: "جارٍ البحث عن الشبكات...",
    connectingTo: "جارٍ الاتصال بـ",
    package: "الحزمة",
    sendPackage: "إرسال حزمة",
    returnPackage: "إرجاع حزمة",
    incoming: "الوارد",
    outgoing: "الصادر",
    delivered: "تم التسليم",
    packageType: "نوع الحزمة",
    packageWeight: "وزن الحزمة",
    enterWeight: "أدخل الوزن",
    itemValue: "قيمة العنصر",
    currency: "العملة",
    description: "الوصف",
    packageImage: "صورة الحزمة",
    tapToChangeImage: "اضغط لتغيير الصورة",
    uploadImage: "رفع الصورة",
    qrSetting: "إعداد QR",
    qrCodeHistory: "سجل رموز QR",
    qrCodeDetails: "تفاصيل رمز QR",
    qrNameOptional: "اسم QR (اختياري)",
    maximumUsers: "الحد الأقصى للمستخدمين",
    validDuration: "مدة الصلاحية",
    generateAccessQRCode: "إنشاء رمز QR للدخول",
    generatingQrCode: "جارٍ إنشاء رمز QR",
    shareQrCode: "مشاركة رمز QR",
    shareUrl: "مشاركة الرابط",
    qrPreviewWillAppearHere: "سيظهر معاينة QR هنا",
    validFor: "صالح لـ",
    users: "مستخدمين",
    expiresIn: "تنتهي الصلاحية خلال",
    minute: "دقيقة",
    hour: "ساعة",
    day: "يوم",
    shortAddress: "العنوان المختصر",
    cityOptional: "المدينة (اختياري)",
    districtOptional: "الحي (اختياري)",
    streetOptional: "الشارع (اختياري)",
    postalCodeOptional: "الرمز البريدي (اختياري)",
    buildingNumberOptional: "رقم المبنى (اختياري)",
    secondaryNumberOptional: "رقم إضافي (اختياري)",
    preferredInstallationLocation: "موقع التركيب المفضل",
    accessInstruction: "تعليمات الوصول",
    qboxImage: "صورة QBox",
    placeQBoxInFront: "ضع QBox أمام الباب الرئيسي. التقط الصورة وارفعها هنا.",
    packageGuidelines: "إرشادات الحزمة",
    packageGuidelineMaxWeight: "الحد الأقصى للوزن: 5 كجم",
    packageGuidelineFragile: "يجب تغليف العناصر القابلة للكسر بشكل مناسب.",
    packageGuidelineImage: "ارفع صورة للحزمة الجاهزة.",
    packageGuidelinePerishable: "لا تُرسل المواد الغذائية سريعة التلف في الشحنات طويلة المسافة.",
    dateTime: "التاريخ والوقت",
    serviceProvider: "مزود الخدمة",
    discount: "الخصم",
    expiryDate: "تاريخ الانتهاء",
    receiverName: "اسم المستلم",
    senderName: "اسم المرسل",
    courierName: "اسم شركة الشحن",
    lastUpdate: "آخر تحديث",
    city: "المدينة",
    connectingToLiveUpdates: "جارٍ الاتصال بالتحديثات المباشرة...",
    deviceMetrics: "قياسات الجهاز",
    realTimeDeviceStatusAndHealth: "الحالة والصحة اللحظية للجهاز",
    connectionStatus: "حالة الاتصال",
    wifiAndMqttStatusWithRemoteActions: "حالة Wi-Fi وMQTT مع إجراءات عن بُعد",
    snapshot: "لقطة",
    quickDeviceDetailsAtAGlance: "تفاصيل الجهاز السريعة في لمحة",
    deviceUsage: "استخدام الجهاز",
    cpuRamAndDiskUtilizationFromTheLatestTelemetrySample:
      "استخدام CPU وRAM والقرص من آخر عينة قياس",
    deviceStatusUpdatesAreRefreshedInRealTimeWhenThePageIsOpenPullDownToRefreshManually:
      "تُحدَّث حالة الجهاز في الوقت الفعلي عند فتح الصفحة. اسحب للأسفل للتحديث يدويًا.",
    localIp: "IP المحلي",
    wifiSsid: "SSID شبكة Wi-Fi",
    cpuTemp: "درجة حرارة CPU",
    uptime: "مدة التشغيل",
    deviceId: "معرّف الجهاز",
    restartDevice: "إعادة تشغيل الجهاز",
    factoryReset: "إعادة ضبط المصنع",
    choosePackageType: "اختر نوع الحزمة",
    reportAnIssue: "الإبلاغ عن مشكلة",
    issueRelatedTo: "المشكلة متعلقة بـ",
    selectIssueType: "اختر نوع المشكلة",
    issueDescription: "وصف المشكلة",
    describeIssueClearly: "صف المشكلة بوضوح",
    promotionTitle: "عنوان العرض",
    promotionCode: "رمز العرض",
    startDate: "تاريخ البداية",
    endDate: "تاريخ النهاية",
    packageDescription: "وصف الحزمة",
    selectOneOfOptionsBelowToProceedFurther: "اختر أحد الخيارات أدناه للمتابعة.",
    driver: "السائق",
    courier: "شركة الشحن",
    send: "إرسال",
    scanHistory: "سجل الفحص",
    qrCodeValidity: "صلاحية رمز QR",
    leftUsers: "المستخدمون المتبقون",
    offerClaimedSuccessfully: "تم المطالبة بالعرض بنجاح!",
    promotionActivated: "تم تفعيل رمز الخصم الخاص بك.",
    promotionSummary: "ملخص العرض",
    theDiscountWillBeAppliedAutomaticallyAtCheckout:
      "سيتم تطبيق الخصم تلقائيًا عند الدفع.",
    claimOffer: "المطالبة بالعرض",
    noScanHistoryFound: "لم يتم العثور على سجل فحص",
    validForUsers: "صالح لـ",
    failed: "فشل",
    lockerOpened: "تم فتح الصندوق",
    lockerClosed: "تم إغلاق الصندوق",
    viewRecording: "عرض التسجيل",
    qrCodeNotFound: "لم يتم العثور على رمز QR",
    pinCode: "رمز PIN",
    pinCodeInstruction:
      "لإدخال رمز PIN، افتح الحزمة المسلّمة التي تريد إرجاعها، ثم أدخل رمز PIN المضاف من المالك.",
    enterPinCode: "أدخل رمز PIN",
    packageNotFound: "لم يتم العثور على الحزمة",
    issueReportedSuccessfully: "تم الإبلاغ عن المشكلة بنجاح",
    failedToReportIssue: "فشل الإبلاغ عن المشكلة",
    somethingWentWrong: "حدث خطأ أثناء الإبلاغ عن المشكلة",
    noShipmentsFound: "لم يتم العثور على شحنات",
    searchByTrackingId: "البحث برقم التتبع",
    note: "ملاحظة",
    qboxStatus: "حالة QBox",
    internalCamera: "الكاميرا الداخلية",
    externalCamera: "الكاميرا الخارجية",
    alarm: "الإنذار",
    unknown: "غير معروف",
    working: "يعمل",
    notWorking: "غير يعمل",
    active: "نشط",
    inactive: "غير نشط",
    connectingNow: "جارٍ الاتصال...",
    selectDate: "اختر التاريخ",
    done: "تم",
    otp: "OTP",
    trackingId: "رقم التتبع",
    driverName: "اسم السائق",
    assignOtp: "تعيين OTP",
    openBox: "فتح الصندوق",
    liveView: "عرض مباشر",
    inside: "بالداخل",
    mainDoor: "الباب الرئيسي",
    gate: "البوابة",
    buildingEntrance: "مدخل المبنى",
    qrCode: "رمز QR",
    electronic: "إلكتروني",
    medical: "طبي",
    other: "أخرى",
    driverOtpRequest: "السائق يطلب رمز OTP.",
    driverOtpCancelNote: "عند الإلغاء، سيتم وضع حالة التوصيل كفاشلة.",
    pendingRelocationRequest:
      "لديك بالفعل طلب نقل معلق. يرجى الانتظار حتى تتم الموافقة قبل إنشاء طلب آخر.",
    dataSecureTitle: "بياناتك آمنة",
    dataSecureDescription:
      "يتم تشفير جميع المعلومات وتخزينها بأمان. نحن نلتزم بجميع لوائح حماية البيانات.",
    renewSubscription: "تجديد الاشتراك",
    wifiProvisioning: "تهيئة Wi-Fi",
    recipientInformation: "معلومات المستلم",
    packageInformation: "معلومات الحزمة",
    deliveryInformation: "معلومات التسليم",
    smartLocker: "SmartLocker",
    telemetry: "القياس",
  },
};

export const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  isRTL: false,
  isReady: false,
  setLocale: async () => {},
  t: (key) => translations.en[key],
});

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<AppLocale>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadLocale = async () => {
      const stored = await SecureStore.getItemAsync(LOCALE_KEY);
      const nextLocale = stored === "ar" ? "ar" : "en";
      setLocaleState(nextLocale);
      I18nManager.allowRTL(nextLocale === "ar");
      I18nManager.forceRTL(nextLocale === "ar");
      setIsReady(true);
    };

    loadLocale();
  }, []);

  const setLocale = async (nextLocale: AppLocale) => {
    await SecureStore.setItemAsync(LOCALE_KEY, nextLocale);
    const shouldFlipRTL = I18nManager.isRTL !== (nextLocale === "ar");
    setLocaleState(nextLocale);
    I18nManager.allowRTL(nextLocale === "ar");
    I18nManager.forceRTL(nextLocale === "ar");

    if (shouldFlipRTL) {
      await Updates.reloadAsync();
    }
  };

  const value = useMemo(
    () => ({
      locale,
      isRTL: locale === "ar",
      isReady,
      setLocale,
      t: (key: TranslationKey) => translations[locale][key],
    }),
    [isReady, locale]
  );

  if (!isReady) {
    return null;
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};
