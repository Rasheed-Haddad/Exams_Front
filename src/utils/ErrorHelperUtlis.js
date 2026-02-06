// utils/errorHelper.utils.ts

import { CommonErrorType } from "../types/ErrorHelper";

/**
 * إعدادات افتراضية لنظام مساعدة الأخطاء
 */
const DEFAULT_CONFIG = {
  defaultWhatsappNumber: "00963937922870", // غيّر هذا الرقم
  enableAnalytics: true,
  enableLocalLogging: true,
  maxLocalLogs: 100,
};

let currentConfig = { ...DEFAULT_CONFIG };

/**
 * تهيئة نظام مساعدة الأخطاء بإعدادات مخصصة
 */
export const initErrorHelper = (config) => {
  currentConfig = { ...DEFAULT_CONFIG, ...config };
};

/**
 * الحصول على الإعدادات الحالية
 */
export const getErrorHelperConfig = () => {
  return currentConfig;
};

/**
 * حفظ سجل خطأ محلياً
 */
export const logError = async (errorMessage, screenType, userId, metadata) => {
  if (!currentConfig.enableLocalLogging) return;

  try {
    const errorLog = {
      message: errorMessage,
      screenType,
      timestamp: new Date().toISOString(),
      userId,
      metadata,
    };

    // قراءة السجلات الموجودة
    const existingLogsJson = await localStorage.getItem("error_logs");
    const existingLogs = existingLogsJson ? JSON.parse(existingLogsJson) : [];

    // إضافة السجل الجديد
    existingLogs.unshift(errorLog);

    // الحفاظ على الحد الأقصى للسجلات
    const trimmedLogs = existingLogs.slice(0, currentConfig.maxLocalLogs);

    // حفظ السجلات المحدثة
    await localStorage.setItem("error_logs", JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error("Failed to log error:", error);
  }
};

/**
 * الحصول على جميع سجلات الأخطاء
 */
export const getErrorLogs = async () => {
  try {
    const logsJson = await localStorage.getItem("error_logs");
    return logsJson ? JSON.parse(logsJson) : [];
  } catch (error) {
    console.error("Failed to get error logs:", error);
    return [];
  }
};

/**
 * مسح جميع سجلات الأخطاء
 */
export const clearErrorLogs = async () => {
  try {
    await localStorage.removeItem("error_logs");
  } catch (error) {
    console.error("Failed to clear error logs:", error);
  }
};

/**
 * الحصول على إحصائيات الأخطاء
 */
export const getErrorStatistics = async () => {
  const logs = await getErrorLogs();

  // عدد الأخطاء حسب نوع الشاشة
  const errorsByScreen = logs.reduce((acc, log) => {
    acc[log.screenType] = (acc[log.screenType] || 0) + 1;
    return acc;
  }, {});

  // الأخطاء الأكثر شيوعاً
  const errorFrequency = logs.reduce((acc, log) => {
    acc[log.message] = (acc[log.message] || 0) + 1;
    return acc;
  }, {});

  const mostCommonErrors = Object.entries(errorFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([message, count]) => ({ message, count }));

  // الأخطاء خلال آخر 24 ساعة
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentErrors = logs.filter(
    (log) => new Date(log.timestamp) > oneDayAgo,
  );

  return {
    totalErrors: logs.length,
    errorsByScreen,
    mostCommonErrors,
    recentErrorsCount: recentErrors.length,
    oldestError: logs[logs.length - 1]?.timestamp,
    newestError: logs[0]?.timestamp,
  };
};

/**
 * تحديد نوع الخطأ بناءً على رسالة الخطأ
 */
export const identifyErrorType = (errorMessage) => {
  const message = errorMessage.toLowerCase();

  if (
    message.includes("password") ||
    message.includes("كلمة المرور") ||
    message.includes("تأكد من")
  ) {
    return CommonErrorType.AUTHENTICATION_FAILED;
  }

  if (
    message.includes("required") ||
    message.includes("مطلوب") ||
    message.includes("validation")
  ) {
    return CommonErrorType.VALIDATION_ERROR;
  }

  if (
    message.includes("network") ||
    message.includes("timeout") ||
    message.includes("الشبكة") ||
    message.includes("الاتصال")
  ) {
    return CommonErrorType.NETWORK_ERROR;
  }

  if (
    message.includes("server") ||
    message.includes("الخادم") ||
    message.includes("500")
  ) {
    return CommonErrorType.SERVER_ERROR;
  }

  if (
    message.includes("permission") ||
    message.includes("denied") ||
    message.includes("غير مصرح") ||
    message.includes("unauthorized")
  ) {
    return CommonErrorType.PERMISSION_DENIED;
  }

  if (
    message.includes("not found") ||
    message.includes("لا توجد") ||
    message.includes("404")
  ) {
    return CommonErrorType.RESOURCE_NOT_FOUND;
  }

  if (
    message.includes("expired") ||
    message.includes("انتهت") ||
    message.includes("صلاحية")
  ) {
    return CommonErrorType.EXPIRED_SESSION;
  }

  if (
    message.includes("rate limit") ||
    message.includes("too many") ||
    message.includes("تجاوزت")
  ) {
    return CommonErrorType.RATE_LIMIT_EXCEEDED;
  }

  return CommonErrorType.UNKNOWN_ERROR;
};

/**
 * فتح واتساب مع رسالة محددة مسبقاً
 */
export const openWhatsAppSupport = (
  errorMessage,
  screenType,
  customMessage,
) => {
  const phoneNumber = currentConfig.defaultWhatsappNumber;

  let message = customMessage || `مرحباً، أواجه مشكلة في التطبيق:%0a`;
  message += `الخطأ: ${errorMessage}`;

  if (screenType) {
    const screenNames = {
      signin: "شاشة تسجيل الدخول",
      subject: "شاشة اختيار المادة",
      result: "شاشة نتيجة الاختبار",
    };
    message += `%0aالموقع: ${screenNames[screenType]}`;
  }

  const { Linking } = require("react-native");
  Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${message}`);
};

/**
 * تصدير سجلات الأخطاء كملف JSON
 */
export const exportErrorLogs = async () => {
  const logs = await getErrorLogs();
  const statistics = await getErrorStatistics();

  const exportData = {
    exportDate: new Date().toISOString(),
    statistics,
    logs,
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * إرسال تقرير الأخطاء عبر الإيميل
 */
export const sendErrorReport = async (email) => {
  const { Linking } = require("react-native");
  const exportData = await exportErrorLogs();
  const statistics = await getErrorStatistics();

  const subject = `تقرير أخطاء التطبيق - ${new Date().toLocaleDateString(
    "ar",
  )}`;
  const body = `
مرحباً،

إليك تقرير بالأخطاء التي واجهتها في التطبيق:

📊 إحصائيات:
- إجمالي الأخطاء: ${statistics.totalErrors}
- أخطاء آخر 24 ساعة: ${statistics.recentErrorsCount}

الأخطاء الأكثر شيوعاً:
${statistics.mostCommonErrors
  .map((e, i) => `${i + 1}. ${e.message} (${e.count} مرة)`)
  .join("\n")}

السجل الكامل مرفق في البيانات أدناه.

---
${exportData}
  `.trim();

  Linking.openURL(
    `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`,
  );
};

/**
 * التحقق من وجود أخطاء متكررة
 */
export const detectRepeatingErrors = async (
  threshold = 3,
  timeWindowMinutes = 30,
) => {
  const logs = await getErrorLogs();
  const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);

  // تصفية الأخطاء ضمن النطاق الزمني
  const recentLogs = logs.filter((log) => new Date(log.timestamp) > cutoffTime);

  // عد تكرار كل خطأ
  const errorCounts = recentLogs.reduce((acc, log) => {
    acc[log.message] = (acc[log.message] || 0) + 1;
    return acc;
  }, {});

  // العثور على الأخطاء المتكررة
  return Object.entries(errorCounts)
    .filter(([, count]) => count >= threshold)
    .map(([message]) => message);
};

/**
 * اقتراح حلول تلقائية بناءً على نمط الأخطاء
 */
export const suggestAutoFix = async (errorMessage) => {
  const errorType = identifyErrorType(errorMessage);

  const autoFixSuggestions = {
    [CommonErrorType.NETWORK_ERROR]:
      "تم اكتشاف مشكلة في الشبكة. سيحاول التطبيق إعادة الاتصال تلقائياً.",
    [CommonErrorType.SERVER_ERROR]:
      "خطأ في السيرفر. سيتم المحاولة مرة أخرى بعد 10 ثوانٍ.",
    [CommonErrorType.EXPIRED_SESSION]:
      "انتهت صلاحية جلستك. الرجاء تسجيل الدخول مرة أخرى.",
    [CommonErrorType.RATE_LIMIT_EXCEEDED]:
      "تجاوزت الحد المسموح. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.",
    [CommonErrorType.AUTHENTICATION_FAILED]: null,
    [CommonErrorType.VALIDATION_ERROR]: null,
    [CommonErrorType.PERMISSION_DENIED]: null,
    [CommonErrorType.RESOURCE_NOT_FOUND]: null,
    [CommonErrorType.UNKNOWN_ERROR]: null,
  };

  return autoFixSuggestions[errorType];
};
