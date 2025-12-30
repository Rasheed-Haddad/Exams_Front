import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { send_time_spent_on_website } from "../src/store/slices/authSlice.js";

const SESSION_START_KEY = "session_start_time";
const SESSION_SENT_KEY = "session_sent";

export const useSessionTracking = () => {
  const dispatch = useDispatch();
  const sessionStartTime = useRef(null);
  const hasSentSession = useRef(false);

  const { user } = useSelector((state) => state.auth);

  // حفظ وقت البدء
  const saveSessionStart = () => {
    const now = new Date().toISOString();
    sessionStartTime.current = now;
    localStorage.setItem(SESSION_START_KEY, now);
    localStorage.setItem(SESSION_SENT_KEY, "false");
    hasSentSession.current = false;
  };

  // إرسال بيانات الجلسة
  const sendSessionData = async () => {
    try {
      // تحقق من عدم الإرسال مسبقاً
      const alreadySent = localStorage.getItem(SESSION_SENT_KEY);
      if (alreadySent === "true" || hasSentSession.current) {
        return;
      }

      // جلب وقت البدء
      const startTime =
        sessionStartTime.current || localStorage.getItem(SESSION_START_KEY);

      if (!startTime || !user?.ID) {
        return;
      }

      const endTime = new Date().toISOString();
      const start = new Date(startTime);
      const end = new Date(endTime);

      // تحقق من أن الجلسة منطقية (أكثر من 5 ثواني)
      const duration = end.getTime() - start.getTime();
      if (duration < 5000) {
        return;
      }

      // إرسال البيانات
      await dispatch(
        send_time_spent_on_website({
          ID: user.ID,
          start: startTime,
          end: endTime,
        })
      ).unwrap();

      // تحديد أن الجلسة تم إرسالها
      localStorage.setItem(SESSION_SENT_KEY, "true");
      hasSentSession.current = true;
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (!user?.ID) return;

    // بدء الجلسة عند تحميل الصفحة
    saveSessionStart();

    // الاستماع لإغلاق النافذة أو الانتقال بعيداً
    const handleBeforeUnload = (e) => {
      // إرسال البيانات باستخدام sendBeacon لضمان الإرسال
      const startTime =
        sessionStartTime.current || localStorage.getItem(SESSION_START_KEY);
      const alreadySent = localStorage.getItem(SESSION_SENT_KEY);

      if (startTime && alreadySent !== "true" && user?.ID) {
        const endTime = new Date().toISOString();
        const start = new Date(startTime);
        const end = new Date(endTime);
        const duration = end.getTime() - start.getTime();

        if (duration >= 5000) {
          // استخدام sendBeacon لإرسال البيانات بشكل موثوق عند إغلاق الصفحة
          const data = JSON.stringify({
            ID: user.ID,
            start: startTime,
            end: endTime,
          });

          // يمكنك استخدام sendBeacon أو fetch مع keepalive
          navigator.sendBeacon("/api/send-session", data);

          localStorage.setItem(SESSION_SENT_KEY, "true");
        }
      }
    };

    // الاستماع لإخفاء الصفحة (الانتقال لتاب آخر)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        sendSessionData();
      } else {
        saveSessionStart(); // بدء جلسة جديدة
      }
    };

    // الاستماع لفقدان التركيز
    const handleBlur = () => {
      sendSessionData();
    };

    // الاستماع لاستعادة التركيز
    const handleFocus = () => {
      const alreadySent = localStorage.getItem(SESSION_SENT_KEY);
      if (alreadySent === "true") {
        saveSessionStart(); // بدء جلسة جديدة فقط إذا تم إرسال الجلسة السابقة
      }
    };

    // إضافة المستمعين
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    // تنظيف عند إلغاء التحميل
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);

      // محاولة أخيرة لإرسال البيانات
      sendSessionData();
    };
  }, [user?.ID, dispatch]);

  return { sendSessionData };
};
