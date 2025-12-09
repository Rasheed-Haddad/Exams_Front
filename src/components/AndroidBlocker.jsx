import { useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { Android, PhoneIphone } from "@mui/icons-material";

const AndroidBlocker = ({ children }) => {
  const [deviceType, setDeviceType] = useState(null); // 'android', 'desktop', null

  useEffect(() => {
    // كشف نظام التشغيل
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroidDevice = /android/i.test(userAgent);
    const isDesktop =
      !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );

    if (isAndroidDevice) {
      setDeviceType("android");
    } else if (isDesktop) {
      setDeviceType("desktop");
    }
  }, []);

  // إذا كان Android أو Desktop، اعرض صفحة التحويل
  if (deviceType === "android" || deviceType === "desktop") {
    const isAndroid = deviceType === "android";

    return (
      <div className="min-h-screen font-arabic bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-4">
        <Container maxWidth="sm">
          <Box
            className="bg-white rounded-2xl shadow-2xl p-8 text-center"
            sx={{ animation: "fadeIn 0.5s ease-in" }}
          >
            {/* أيقونة حسب النظام */}
            {isAndroid ? (
              <Android
                sx={{
                  fontSize: 100,
                  color: "#3DDC84",
                  mb: 3,
                }}
              />
            ) : (
              <PhoneIphone
                sx={{
                  fontSize: 100,
                  color: "#8C52FF",
                  mb: 3,
                }}
              />
            )}

            {/* العنوان */}
            <Typography
              variant="h4"
              className="font-arabic font-bold text-gray-800 mb-4"
            >
              {isAndroid ? "مرحباً  " : "هذا التطبيق للهواتف فقط "}
            </Typography>

            {/* الرسالة */}
            <Typography
              variant="body1"
              className="font-arabic text-gray-600 mb-6 text-lg leading-relaxed"
            >
              {isAndroid ? (
                <>
                  نلاحظ أنك تستخدم جهاز أندرويد
                  <br />
                  يرجى التواصل معنا على واتسأب لتحميل التطبيق المخصص
                </>
              ) : (
                <>
                  يرجى استخدام هاتفك الأيفون
                  <br />
                  للوصول إلى هذا الموقع
                </>
              )}
            </Typography>
          </Box>
        </Container>

        {/* أنيميشن CSS */}
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // إذا كان iPhone أو iPad، اعرض المحتوى العادي
  return <>{children}</>;
};

export default AndroidBlocker;
