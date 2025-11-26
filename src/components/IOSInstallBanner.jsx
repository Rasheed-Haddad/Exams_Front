import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Close, IosShare } from "@mui/icons-material";

const IOSInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // كشف iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // تحقق إذا كان التطبيق مثبت مسبقاً
    const isStandalone =
      window.navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches;

    // اعرض البانر إذا كان iOS وغير مثبت
    if (isIOS && !isStandalone) {
      // أخّر الظهور 3 ثواني
      setTimeout(() => {
        const hasSeenBanner = localStorage.getItem("iosInstallBannerSeen");
        if (!hasSeenBanner) {
          setShowBanner(true);
        }
      }, 3000);
    }
  }, []);

  const handleClose = () => {
    setShowBanner(false);
    localStorage.setItem("iosInstallBannerSeen", "true");
  };

  if (!showBanner) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#8C52FF",
        color: "white",
        padding: "16px",
        zIndex: 9999,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "white",
        }}
      >
        <Close />
      </IconButton>

      <Box className="flex items-start gap-3 pr-8">
        <IosShare sx={{ fontSize: 32, mt: 0.5 }} />

        <Box>
          <Typography variant="h6" className="font-arabic font-bold mb-2">
            ثبّت التطبيق
          </Typography>
          <Typography variant="body2" className="font-arabic">
            اضغط على زر المشاركة
            <IosShare sx={{ fontSize: 16, mx: 0.5, verticalAlign: "middle" }} />
            ثم اختر "إضافة إلى الشاشة الرئيسية"
          </Typography>
        </Box>
      </Box>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default IOSInstallBanner;
