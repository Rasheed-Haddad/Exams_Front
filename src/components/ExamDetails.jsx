import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Circle,
  BookOpen,
  Clock,
  DollarSign,
  Users,
  FileText,
} from "lucide-react";
import { useSelector } from "react-redux";

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exams } = useSelector((state) => state.exams);
  const exam = exams.find((e) => e._id == id);
  console.log(id);
  if (!exam) {
    return (
      <div className="flex-1 font-arabic flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 mx-auto">
            <FileText size={48} className="text-gray-400" />
          </div>
          <p className="text-2xl text-gray-600 mb-6 font-semibold">
            لم يتم العثور على الاختبار
          </p>
          <button
            onClick={() => navigate("/admin/exams")}
            className="flex flex-row items-center gap-2 mx-auto bg-brand hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowRight size={18} />
            <span>العودة إلى قائمة الاختبارات</span>
          </button>
        </div>
      </div>
    );
  }

  // رندر كل سؤال
  const renderQuestion = (question, index) => {
    return (
      <div
        key={index}
        dir="rtl"
        className="rounded-xl font-arabic border-2 border-gray-100 hover:border-brand/30 p-5 bg-gradient-to-br from-white to-gray-50 mb-4 shadow-sm hover:shadow-lg transition-all duration-300"
      >
        {/* عنوان السؤال */}
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-purple-600 shadow-md">
              <span className="text-white text-sm font-bold">{index + 1}</span>
            </div>
            <span className="text-brand font-semibold text-sm">
              السؤال {index + 1}
            </span>
          </div>
        </div>

        {/* نص السؤال */}
        <p className="text-base text-gray-800 mb-4 leading-relaxed font-medium bg-white p-3 rounded-lg border border-gray-100">
          {question.question}
        </p>

        {/* الخيارات */}
        <div className="space-y-3">
          {question.options.map((option, optIndex) => {
            const isCorrect = question.answer == optIndex + 1;
            return (
              <div
                key={optIndex}
                className={`p-4 font-arabic rounded-lg border-2 transition-all duration-300 ${
                  isCorrect
                    ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-row items-center gap-3">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full shadow-sm ${
                      isCorrect
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : "bg-gray-200"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle size={16} className="text-white" />
                    ) : (
                      <span className="text-xs font-semibold text-gray-700">
                        {optIndex + 1}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm flex-1 ${
                      isCorrect ? "text-green-700 font-bold" : "text-gray-700"
                    }`}
                  >
                    {option}
                  </p>
                  {isCorrect && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-semibold">
                      الإجابة الصحيحة
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-arabic bg-gradient-to-br from-gray-50 to-purple-50/30 pb-8">
      {/* Header */}
      <div
        dir="rtl"
        className="bg-white shadow-md border-b-2 border-gray-100 px-4 py-4 mb-6 sticky top-0 z-10"
      >
        <div className="flex flex-row items-center justify-between max-w-7xl mx-auto">
          <div className="flex flex-row items-center gap-4">
            <button
              onClick={() => navigate("/admin/exams")}
              className="hover:bg-brand/10 p-2 rounded-lg transition-colors"
            >
              <ArrowRight size={24} className="text-brand" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">تفاصيل الاختبار</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* بطاقة بيانات الاختبار */}
        <div
          className="bg-white p-6 rounded-2xl border-2 border-gray-100 mb-6 shadow-xl"
          dir="rtl"
        >
          <div className="text-center">
            {/* أيقونة الاختبار */}
            <div className="w-20 h-20 bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen size={40} className="text-white" />
            </div>

            {/* بيانات المادة */}
            <h2 className="text-3xl mb-6 font-bold text-gray-900">
              {exam.name}
            </h2>

            {/* معلومات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <FileText size={24} className="text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-1">رمز المادة</p>
                <p className="text-lg font-bold text-blue-600">{exam.ID}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <Users size={24} className="text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-1">رمز الكلية</p>
                <p className="text-lg font-bold text-purple-600">
                  {exam.college_id}
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <Clock size={24} className="text-orange-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-1">المدة</p>
                <p className="text-lg font-bold text-orange-600">
                  {exam.time} دقيقة
                </p>
              </div>
            </div>

            {/* وصف الاختبار */}
            {exam.info && (
              <div className="mb-6 bg-gradient-to-br from-gray-50 to-purple-50/50 rounded-xl p-5 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2 font-semibold">
                  وصف الاختبار
                </p>
                <p className="text-base text-gray-800 leading-relaxed">
                  {exam.info}
                </p>
              </div>
            )}

            {/* السعر */}
            <div className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-5 border-2 border-green-300 shadow-md">
              <DollarSign size={28} className="text-green-600 mx-auto mb-2" />
              <p className="text-base text-gray-700 mb-2 font-semibold">
                السعر
              </p>
              <p className="text-green-600 text-3xl font-bold">
                {exam?.price.toLocaleString("en")} ل.س
              </p>
            </div>

            {/* عدد الأسئلة */}
            <div className="mb-6 bg-gradient-to-br from-brand/10 to-purple-100/50 rounded-xl p-5 border-2 border-brand/30 shadow-md">
              <BookOpen size={28} className="text-brand mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-semibold">عدد الأسئلة</p>
              <p className="text-4xl font-bold text-brand mt-2">
                {exam.questions.length}
              </p>
            </div>

            {/* الطلاب المسموح لهم */}
            {exam?.available_to && exam.available_to.length > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={20} className="text-brand" />
                  <h3 className="text-lg font-bold text-gray-800">
                    الاختبار متاح للطلاب:
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {exam.available_to.map((student, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-brand/10 to-purple-100/50 rounded-lg px-4 py-3 flex flex-row items-center gap-2 border border-brand/20 hover:border-brand/50 transition-all"
                    >
                      <span className="text-lg">🎓</span>
                      <span className="text-sm text-brand font-semibold">
                        {student}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* قائمة الأسئلة */}
        <div dir="rtl" className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-600 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">الأسئلة</h2>
          </div>

          {exam.questions && exam.questions.length > 0 ? (
            exam.questions.map((question, index) =>
              renderQuestion(question, index)
            )
          ) : (
            <div className="flex flex-col items-center py-16 px-4 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-base text-center font-medium">
                لا توجد أسئلة مضافة لهذا الاختبار
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
