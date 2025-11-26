import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Download } from "@mui/icons-material";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("تم تثبيت التطبيق");
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <Button
      variant="contained"
      onClick={handleInstall}
      startIcon={<Download />}
      sx={{
        backgroundColor: "#8C52FF",
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 1001,
      }}
    >
      <span className="font-arabic">تثبيت التطبيق</span>
    </Button>
  );
};

export default InstallPWA;
