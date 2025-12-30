import { BookOpen, FileText, Phone, User, Sparkles } from "lucide-react";

const ExamCard = ({ exam, onClick }) => {
  return (
    <div
      onClick={onClick}
      dir="rtl"
      className="w-full mb-4 cursor-pointer group"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-brand/30 transition-all duration-300 transform hover:-translate-y-1">
        {/* Header with gradient */}
        <div className="bg-gradient-to-l from-brand to-purple-600 p-4 relative overflow-hidden">
          {/* خلفية متحركة */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <div className="flex flex-row items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="flex flex-row items-center mb-1 gap-2">
                <BookOpen size={20} className="text-white" />
                <h3 className="text-white text-lg font-arabic">{exam.name}</h3>
              </div>
            </div>

            {/* Price Badge */}
            <div
              className={`${
                exam.price === 0
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-yellow-400 to-amber-500"
              } px-4 py-2 rounded-full shadow-lg flex items-center gap-1`}
            >
              {exam.price === 0 ? (
                <>
                  <Sparkles size={14} className="text-white" />
                  <span className="text-white text-sm font-arabic">مجاني</span>
                </>
              ) : (
                <div className="flex flex-row items-center">
                  <span className="text-white text-sm font-arabic mr-1">
                    {exam.price.toLocaleString("en")} ل.س
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Description */}
          {exam.info && (
            <div className="mb-4 bg-gradient-to-br from-gray-50 to-purple-50/30 p-3 rounded-lg border border-gray-100">
              <p className="text-gray-700 text-sm leading-5">{exam.info}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="flex flex-row mb-4 gap-3">
            <div className="flex-1 items-center bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 rounded-lg border border-blue-200/50 text-center">
              <div className="flex justify-center mb-1">
                <FileText size={20} className="text-blue-600" />
              </div>
              <p className="text-blue-700 text-xs mt-1">الأسئلة</p>
              <p className="text-blue-900 text-lg font-arabic">
                {exam.questionsCount}
              </p>
            </div>

            {exam.time && (
              <div className="flex-1 items-center bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 rounded-lg border border-purple-200/50 text-center">
                <div className="flex justify-center mb-1">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-purple-700 text-xs mt-1">المدة</p>
                <p className="text-purple-900 text-lg font-arabic">
                  {exam.time} د
                </p>
              </div>
            )}
          </div>

          {/* Teacher Info */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center flex-1 gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1 items-center justify-center">
                  <p className="text-gray-900  text-sm">{exam.admin.name}</p>
                  <div className="flex flex-row items-center mt-1 mr-8 gap-1">
                    <Phone size={12} className="text-gray-500" />
                    <span className="text-gray-600 text-xs mr-1">
                      {exam.admin.phone_number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="bg-gradient-to-r from-brand to-purple-600 px-4 py-2 rounded-lg hover:from-purple-600 hover:to-brand transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <span className="text-white text-sm ">سجّل</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, count, icon: Icon }) => (
  <div className="flex flex-row items-center justify-between mb-4 px-1">
    <div className="flex flex-row items-center gap-2">
      {Icon && (
        <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
          <Icon size={20} className="text-brand" />
        </div>
      )}
      <h2 className="text-gray-900 text-xl font-arabic">{title}</h2>
    </div>
    {count !== undefined && (
      <div className="bg-gradient-to-r from-brand to-purple-600 px-3 py-1 rounded-full shadow-md">
        <span className="text-white text-sm font-arabic">{count}</span>
      </div>
    )}
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="relative mb-6">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
        <BookOpen size={48} className="text-gray-400" />
      </div>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand/20 rounded-full animate-ping" />
      <div
        className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-400/20 rounded-full animate-ping"
        style={{ animationDelay: "150ms" }}
      />
    </div>
    <p className="text-gray-600 text-lg text-center  mb-2">
      لا توجد امتحانات متاحة حالياً
    </p>
    <p className="text-gray-400 text-sm text-center max-w-sm leading-relaxed">
      يمكنك إنشاء اختبارات لموادك عن طريق تسجيل الدخول كمدرس
    </p>

    {/* زخارف إضافية */}
    <div className="flex items-center gap-2 mt-6">
      <div className="w-2 h-2 bg-brand/30 rounded-full animate-bounce" />
      <div
        className="w-2 h-2 bg-purple-400/30 rounded-full animate-bounce"
        style={{ animationDelay: "100ms" }}
      />
      <div
        className="w-2 h-2 bg-brand/30 rounded-full animate-bounce"
        style={{ animationDelay: "200ms" }}
      />
    </div>
  </div>
);

// Main Export
export { EmptyState, ExamCard, SectionHeader };
