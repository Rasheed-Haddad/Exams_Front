import { useEffect, useState } from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { Android, PhoneIphone, Download } from "@mui/icons-material";

const AndroidBlocker = ({ children }) => {
  const [deviceType, setDeviceType] = useState(null);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroidDevice = /android/i.test(userAgent);
    const isIOSDevice = /iphone|ipad|ipod/i.test(userAgent.toLowerCase());

    // ✅ كشف iPad الحديث (iPadOS 13+)
    const isIPad =
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      /ipad/i.test(userAgent.toLowerCase());

    // ✅ كشف أي جهاز iOS (iPhone + iPad القديم والجديد)
    const isAppleDevice = isIOSDevice || isIPad;

    const isDesktop =
      !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase(),
      ) && !isIPad; // ✅ استثناء iPad من Desktop

    if (isAndroidDevice) {
      setDeviceType("android");
    } else if (isAppleDevice) {
      setDeviceType("ios"); // ✅ iPhone + iPad (القديم والجديد)
    } else if (isDesktop) {
      setDeviceType("desktop");
    }
  }, []);

  // فقط حظر Android و Desktop، السماح لـ iOS (iPhone + iPad)
  if (deviceType === "android" || deviceType === "desktop") {
    const isAndroid = deviceType === "android";
    const downloadUrl =
      "https://expo.dev/artifacts/eas/stoWxAb3mTovU4UY8z8ov6.apk";

    return (
      <div className="min-h-screen font-arabic bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-4">
        <Container maxWidth="sm">
          <Box
            className="bg-white rounded-2xl shadow-2xl p-8 text-center"
            sx={{ animation: "fadeIn 0.5s ease-in" }}
          >
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

            <Typography variant="h4" className="font-arabic text-gray-800 mb-4">
              {isAndroid ? "مرحباً بك" : "هذا التطبيق للهواتف فقط"}
            </Typography>

            <Typography
              variant="body1"
              className="font-arabic text-gray-600 mb-6 text-lg leading-relaxed"
            >
              {isAndroid ? (
                <>
                  نلاحظ أنك تستخدم جهاز أندرويد
                  <br />
                  يمكنك تحميل التطبيق المخصص الآن
                </>
              ) : (
                <>
                  يمكنك تحميل التطبيق على هاتفك الأندرويد
                  <br />
                  أو استخدام هاتف الآيفون/الآيباد
                </>
              )}
            </Typography>

            <Button
              variant="contained"
              size="large"
              href={downloadUrl}
              download
              startIcon={<Download />}
              sx={{
                backgroundColor: isAndroid ? "#3DDC84" : "#8C52FF",
                color: "white",
                fontSize: "1.1rem",
                padding: "12px 32px",
                borderRadius: "12px",
                textTransform: "none",
                fontFamily: "inherit",
                marginTop: "10px",
                "&:hover": {
                  backgroundColor: isAndroid ? "#2BC170" : "#7640E6",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              تحميل التطبيق
            </Button>
          </Box>
        </Container>

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

  return <>{children}</>;
};

export default AndroidBlocker;
