import { useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { Android } from "@mui/icons-material";

const AndroidBlocker = ({ children }) => {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // كشف نظام Android
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroidDevice = /android/i.test(userAgent);

    setIsAndroid(isAndroidDevice);
  }, []);

  // إذا كان Android، اعرض صفحة التحويل
  if (isAndroid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-4">
        <Container maxWidth="sm">
          <Box
            className="bg-white rounded-2xl shadow-2xl p-8 text-center"
            sx={{ animation: "fadeIn 0.5s ease-in" }}
          >
            {/* أيقونة Android */}
            <Android
              sx={{
                fontSize: 100,
                color: "#3DDC84",
                mb: 3,
              }}
            />

            {/* العنوان */}
            <Typography
              variant="h4"
              className="font-arabic font-bold text-gray-800 mb-4"
            >
              أهلا وسهلا 💜
            </Typography>

            {/* الرسالة */}
            <Typography
              variant="body1"
              className="font-arabic text-gray-600 mb-6 text-lg leading-relaxed"
            >
              نلاحظ أنك تستخدم جهاز أندرويد.
              <br />
              يرجى التواصل معنا على واتسأب على الرقم 0937922870 لتحميل التطبيق
              المخصص 💜
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

  // إذا لم يكن Android، اعرض المحتوى العادي
  return <>{children}</>;
};

export default AndroidBlocker;
