import { useEffect, useState } from "react";

const LoadingGlow = () => {
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow((prev) => !prev);
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center pt-12  bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="relative">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-ping"
            style={{ animationDuration: "3s" }}
          />
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex flex-col items-center gap-8 animate-float">
          {/* النص المضيء */}
          <h1
            className={`text-6xl md:text-7xl font-thin text-brand transition-all duration-750 ${
              glow
                ? "drop-shadow-[0_0_25px_rgba(140,82,255,0.8)] scale-105"
                : "drop-shadow-[0_0_10px_rgba(140,82,255,0.5)] scale-100"
            }`}
            style={{
              textShadow: glow
                ? "0 0 20px rgba(140, 82, 255, 0.8), 0 0 40px rgba(140, 82, 255, 0.6), 0 0 60px rgba(140, 82, 255, 0.4)"
                : "0 0 10px rgba(140, 82, 255, 0.5), 0 0 20px rgba(140, 82, 255, 0.3)",
            }}
          >
            قدها وقدود
          </h1>

          {/* Spinner مخصص */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-brand/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-brand rounded-full animate-spin" />
            <div
              className="absolute inset-2 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1s" }}
            />
          </div>

          {/* نقاط متحركة */}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 bg-brand rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-3 h-3 bg-brand rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-3 h-3 bg-brand rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>

          {/* نص ثانوي */}
          <p className="text-gray-500 text-lg font-light animate-pulse">
            جاري التحميل...
          </p>
        </div>

        {/* دوائر زخرفية */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 border-2 border-brand/20 rounded-full animate-ping"
          style={{ animationDuration: "2s" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-32 h-32 border-2 border-purple-300/30 rounded-full animate-ping"
          style={{ animationDuration: "2.5s" }}
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingGlow;
