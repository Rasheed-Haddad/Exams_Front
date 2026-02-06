import React from "react";
import {
  Lock,
  AlertCircle,
  Users,
  Server,
  Wifi,
  RefreshCw,
  School,
  UserMinus,
  Bug,
  Database,
  AlertTriangle,
  FileText,
  Share2,
  Calculator,
  Trophy,
  HelpCircle,
  X,
  MessageCircle,
} from "lucide-react";

const ErrorHelperModal = ({
  visible,
  onClose,
  errorMessage = "",
  screenType,
  onRetry,
  whatsappNumber = "+963937922870",
}) => {
  const getErrorSolution = () => {
    // ================== أخطاء واجهة تسجيل الدخول ==================
    if (screenType === "signin") {
      if (errorMessage.includes("تأكد من كلمة المرور")) {
        return {
          title: "كلمة المرور غير صحيحة",
          description: "",
          steps: [
            "تذكر كلمة المرور وانتبه للأحرف الصغيرة والكبيرة والمسافات",
            "إذا نسيت كلمة المرور، تواصل معنا على واتساب",
          ],
          icon: Lock,
          color: "#ef4444",
        };
      }

      if (errorMessage.includes("جميع الحقول مطلوبة")) {
        return {
          title: "معلومات ناقصة",
          description: "يجب ملء جميع الحقول لتتمكن من تسجيل الدخول",
          steps: ["املأ كل الحقول"],
          icon: AlertCircle,
          color: "#f59e0b",
        };
      }

      if (errorMessage.includes("نوع المستخدم غير صحيح")) {
        return {
          title: "خطأ في نوع المستخدم",
          description: "حدثت مشكلة في تحديد نوع حسابك",
          steps: [
            "أغلق التطبيق تماماً من قائمة التطبيقات",
            "افتح التطبيق مرة أخرى",
            "حاول تسجيل الدخول مرة أخرى",
          ],
          icon: Users,
          color: "#8c52ff",
        };
      }

      if (errorMessage.includes("خطأ في الخادم")) {
        return {
          title: "مشكلة في السيرفر",
          description: "يوجد مشكلة مؤقتة في خادم التطبيق",
          steps: [
            "انتظر لمدة 5 دقائق ثم حاول مرة أخرى",
            "جرب تشغيل VPN",
            "إذا استمرت المشكلة، تواصل معنا",
            "السيرفر قد يكون قيد الصيانة حالياً",
          ],
          icon: Server,
          color: "#6366f1",
        };
      }

      if (
        errorMessage.includes("Network") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("الشبكة") ||
        errorMessage.includes("الاتصال")
      ) {
        return {
          title: "مشكلة في الاتصال بالإنترنت",
          description: "لا يمكن الوصول إلى السيرفر، تحقق من اتصالك",
          steps: ["تحقق من اتصالك بالانترنت ويفضل تشغيل VPN"],
          icon: Wifi,
          color: "#10b981",
        };
      }
    }

    // ================== أخطاء واجهة اختيار المادة ==================
    if (screenType === "subject") {
      if (
        errorMessage.includes("تأكد من اتصالك بالإنترنت أو من صلاحية الدخول")
      ) {
        return {
          title: "مشكلة في الاتصال أو الصلاحيات",
          description:
            "لا يمكن تحميل المواد، قد تكون المشكلة في الإنترنت أو صلاحيات حسابك",
          steps: [
            "تأكد أنك متصل بالانترنت",
            "شغل VPN",
            "جرب تسجيل الخروج والدخول مرة أخرى",
          ],
          icon: AlertCircle,
          color: "#f59e0b",
        };
      }

      if (errorMessage.includes("فشل جلب المواد")) {
        return {
          title: "فشل تحميل قائمة المواد",
          description: "حدثت مشكلة أثناء تحميل المواد المتاحة",
          steps: [
            "تأكد من اتصالك بالإنترنت",
            "اسحب الشاشة للأسفل لإعادة التحميل",
            "شغل VPN",
          ],
          icon: RefreshCw,
          color: "#ef4444",
        };
      }

      if (errorMessage.includes("لم يقم أي من المدرسين بإنشاء اختبارات")) {
        return {
          title: "لا توجد مواد متاحة لكليتك",
          description: "لم يتم إضافة أي مواد دراسية لكليتك حتى الآن",
          steps: [
            "تأكد من اختيار الكلية الصحيحة عند التسجيل",
            "تواصل مع إدارة التطبيق للاستفسار عن موعد إضافة المواد",
            "اسحب الشاشة للأسفل للمحاولة مرة أخرى ",
          ],
          icon: School,
          color: "#8b5cf6",
        };
      }

      if (
        errorMessage.includes("الرقم الجامعي مفقود") ||
        errorMessage.includes("رمز الكلية مفقود")
      ) {
        return {
          title: "مشكلة في بيانات حسابك",
          description: "الرقم الجامعي غير موجود في بيانات حسابك",
          steps: [
            "حدث تقطع في الاتصال بالشبكة",
            "مرر للأسفل لإعادة المحاولة",
            "إذا استمرت المشكلة جرب تسجيل الخروج والدخول مرة أخرى",
          ],
          icon: UserMinus,
          color: "#dc2626",
        };
      }

      if (
        errorMessage.includes("حدث خطأ غير متوقع") &&
        screenType === "subject"
      ) {
        return {
          title: "خطأ غير متوقع",
          description: "حدثت مشكلة غير متوقعة أثناء تحميل البيانات",
          steps: ["تأكد أنك متصل بالانترنت", "شغل VPN"],
          icon: Bug,
          color: "#6366f1",
        };
      }

      if (
        errorMessage.includes("خطأ في الخادم") ||
        errorMessage.includes("حدث خطأ في الخادم")
      ) {
        return {
          title: "مشكلة مؤقتة في السيرفر",
          description: "السيرفر يواجه مشكلة مؤقتة ولا يمكنه الاستجابة حالياً",
          steps: [
            "انتظر 3-5 دقائق ثم حاول مرة أخرى",
            "المشكلة من السيرفر وليست من جهازك",
            "السيرفر قد يكون قيد الصيانة أو مشغول جداً",
          ],
          icon: Database,
          color: "#6366f1",
        };
      }
    }

    // ================== أخطاء واجهة نتيجة الاختبار ==================
    if (screenType === "result") {
      if (errorMessage.includes("فشل حفظ النتيجة")) {
        return {
          title: "لم يتم حفظ النتيجة",
          description: "حدثت مشكلة أثناء حفظ درجتك",
          steps: [
            "لا تغلق التطبيق، ابق في هذه الصفحة",
            "تحقق من اتصالك بالإنترنت",
            "سيحاول التطبيق الحفظ تلقائياً",
            "إذا فشل الحفظ، التقط صورة للنتيجة وأرسلها للمدرس",
            "لا تقلق، بياناتك محفوظة مؤقتاً",
          ],
          icon: AlertTriangle,
          color: "#dc2626",
        };
      }

      if (errorMessage.includes("فشل تحميل النتائج")) {
        return {
          title: "لا يمكن عرض النتائج السابقة",
          description: "حدثت مشكلة في تحميل سجل نتائجك",
          steps: [
            "أعد تحميل الصفحة بالسحب للأسفل",
            "تحقق من اتصالك بالإنترنت",
            "جرب لاحقاً، البيانات محفوظة في السيرفر",
            "إذا استمرت المشكلة، راجع المدرس",
          ],
          icon: FileText,
          color: "#f59e0b",
        };
      }

      if (
        errorMessage.includes("فشلت المشاركة") ||
        errorMessage.includes("share")
      ) {
        return {
          title: "لا يمكن مشاركة النتيجة",
          description: "حدثت مشكلة عند محاولة المشاركة",
          steps: [
            "التقط صورة شاشة للنتيجة وشاركها يدوياً",
            "تأكد من منح التطبيق صلاحيات الوصول للملفات",
            "جرب إعادة تشغيل التطبيق",
            "تحقق من مساحة التخزين المتاحة",
          ],
          icon: Share2,
          color: "#3b82f6",
        };
      }

      if (
        errorMessage.includes("خطأ في حساب النقاط") ||
        errorMessage.includes("points")
      ) {
        return {
          title: "خطأ في حساب النقاط",
          description: "النقاط المعروضة قد لا تكون دقيقة",
          steps: [
            "التقط صورة للنتيجة فوراً",
            "تواصل معنا في أقرب وقت",
            "أرسل تفاصيل الاختبار والنتيجة المعروضة",
            "سيتم تصحيح النقاط يدوياً",
            "لا تقلق، سيتم حل المشكلة",
          ],
          icon: Calculator,
          color: "#ef4444",
        };
      }

      if (errorMessage.includes("الترتيب") || errorMessage.includes("rank")) {
        return {
          title: "مشكلة في تحديث ترتيبك",
          description: "لم يتم تحديث موقعك في قائمة المتصدرين",
          steps: [
            "نتيجتك محفوظة بشكل صحيح",
            "الترتيب سيتحدث تلقائياً خلال دقائق",
            "إذا لم يتحدث، جرب إعادة تحميل الصفحة",
            "إذا استمرت المشكلة، تواصل مع الدعم الفني",
          ],
          icon: Trophy,
          color: "#fbbf24",
        };
      }
    }

    return {
      title: "حدث خطأ غير متوقع",
      description: "نعتذر عن هذا الإزعاج، حدثت مشكلة غير متوقعة",
      steps: ["شغل VPN", "تأكد انك متصل بالانترنت"],
      icon: HelpCircle,
      color: "#64748b",
    };
  };

  const solution = getErrorSolution();
  if (!visible || !solution) return null;

  const openWhatsApp = () => {
    const screenNames = {
      signin: "شاشة تسجيل الدخول",
      subject: "شاشة اختيار المادة",
      result: "شاشة نتيجة الاختبار",
    };

    const message = `مرحباً، أواجه مشكلة في التطبيق:\n\nالخطأ: ${errorMessage}\nالموقع: ${screenNames[screenType] || "غير معروف"}\n\nأرجو المساعدة.`;
    window.open(
      `https://wa.me/${whatsappNumber.replace("+", "")}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const IconComponent = solution.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      style={{ direction: "rtl" }}
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className="p-6 flex flex-row items-center justify-between text-white"
          style={{ backgroundColor: solution.color }}
        >
          <div className="flex flex-row items-center flex-1 gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <IconComponent size={28} />
            </div>
            <h3 className="font-arabic text-xl  flex-1 leading-tight">
              {solution.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors outline-none"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Steps */}
          <div className="p-6">
            <p className="text-gray-600 font-arabic text-sm mb-4 leading-relaxed">
              {solution.description}
            </p>
            {solution.steps.map((step, index) => (
              <div key={index} className="flex flex-row items-start mb-4 gap-3">
                <div
                  className="w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${solution.color}20` }}
                >
                  <span
                    className="font-arabic  text-sm"
                    style={{ color: solution.color }}
                  >
                    {index + 1}
                  </span>
                </div>
                <p className="text-gray-700 font-arabic text-base flex-1 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* Retry Button */}
          {onRetry && (
            <div className="px-6 pb-4">
              <button
                onClick={() => {
                  onClose();
                  onRetry();
                }}
                className="w-full py-3 px-4 rounded-xl flex flex-row items-center justify-center border-2 transition-colors hover:bg-gray-50 outline-none"
                style={{ borderColor: solution.color, color: solution.color }}
              >
                <RefreshCw size={20} className="ml-2" />
                <span className="font-arabic text-base ">حاول مرة أخرى</span>
              </button>
            </div>
          )}

          {/* Contact Support */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center">
              <span className="text-gray-600 font-arabic text-sm mb-3">
                لم تحل المشكلة؟ تواصل معنا
              </span>
              <button
                onClick={openWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl flex flex-row items-center justify-center transition-colors outline-none"
              >
                <MessageCircle size={22} className="ml-2" />
                <span className="font-arabic text-base ">
                  راسلنا على واتساب
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="px-6 pb-6 bg-white">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl border-2 transition-colors hover:bg-gray-50 outline-none"
            style={{ borderColor: solution.color, color: solution.color }}
          >
            <span className="font-arabic text-base ">فهمت</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorHelperModal;
