import { useEffect, useState } from "react";

const AndroidBlocker = ({ children }) => {
  const [deviceType, setDeviceType] = useState(null);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroidDevice = /android/i.test(userAgent);
    const isIOSDevice = /iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    const isIPad =
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      /ipad/i.test(userAgent.toLowerCase());
    const isAppleDevice = isIOSDevice || isIPad;
    const isDesktop =
      !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase(),
      ) && !isIPad;

    if (isAndroidDevice) setDeviceType("android");
    else if (isAppleDevice) setDeviceType("ios");
    else if (isDesktop) setDeviceType("desktop");
  }, []);

  const downloadUrl =
    "https://drive.google.com/uc?id=1ZYXmypCBrt3E3BclB50p1nU6eSLCJ5eu";

  if (deviceType === "android" || deviceType === "desktop") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 bg-brand font-[Tajawal,sans-serif] direction-rtl"
        dir="rtl"
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        <div className="w-full max-w-[420px] bg-brand rounded-[20px] px-8 py-12 text-center ">
          <h1 className="text-[2.5rem] font-arabic text-white mb-2 leading-[1.3]">
            قدها وقدود
          </h1>

          <p className="text-[0.95rem] text-white leading-[1.8] mb-8 font-light">
            يمكنك تحميل التطبيق من هنا
          </p>

          <a
            href={downloadUrl}
            download
            className="inline-flex items-center gap-2.5 bg-brand_2 text-black text-base font-arabic px-[30px] py-[13px] rounded-full no-underline mb-6"
          >
            تحميل التطبيق
          </a>

          <div className="flex flex-col gap-3 text-right">
            {[
              {
                icon: "🕔",
                title: "اختصر وقتك",
                desc: "ملخصات تزيل الحشو الزائد من الكتب",
              },
              {
                icon: "🛡️",
                title: "قلل الخوف قبل الامتحان",
                desc: "مع أسئلة أتمتة تغطي مقرر المادة, يمكنك إعادة الأفكار في أقل من ساعتين",
              },
              {
                icon: "💜",
                title: "حقق أعلى النتائج",
                desc: "مع نصائح الزملاء الموجودة داخل كل ملخص",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 bg-white p-[0.9rem_1rem] border border-[#e5e4de] rounded-xl"
              >
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 text-base">
                  {icon}
                </div>
                <div>
                  <div className="text-[1.1rem] font-arabic text-brand mb-0.5">
                    {title}
                  </div>
                  <div className="text-[0.82rem] text-brand leading-[1.6] font-arabic">
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AndroidBlocker;
