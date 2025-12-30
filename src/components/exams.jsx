import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  XCircle,
  Info,
  Plus,
  Search,
  BookOpen,
  Users,
  Clock,
} from "lucide-react";
import {
  add_student_to_exam,
  clearError,
  delete_exam_for_the_admin,
  fetch_exams_for_the_admin,
} from "../store/slices/exams_slice";

const ExamsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exams, loading, error, status } = useSelector((state) => state.exams);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [showStatus, setShowStatus] = useState(true);
  const [STUDENT_ID_TO_ADD, SET_STUDENT_ID_TO_ADD] = useState("");

  // إخفاء رسالة الحالة تلقائياً بعد 5 ثوانٍ
  useEffect(() => {
    if (status !== "") {
      setShowStatus(true);
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handle_add_student_to_exam = ({ EXAM_ID }) => {
    if (!STUDENT_ID_TO_ADD || STUDENT_ID_TO_ADD.trim() === "") {
      alert("الرجاء إدخال رقم الطالب");
      return;
    }

    dispatch(add_student_to_exam({ STUDENT_ID: STUDENT_ID_TO_ADD, EXAM_ID }));
    SET_STUDENT_ID_TO_ADD("");
  };

  const handleSearch = () => {
    dispatch(
      fetch_exams_for_the_admin({ _id: user.id, search_term: searchTerm })
    );
  };

  const handleDeleteExam = (exam_id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الاختبار؟")) {
      dispatch(delete_exam_for_the_admin(exam_id));
    }
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  const handleCloseStatus = () => {
    setShowStatus(false);
  };

  const renderExamCard = (exam, index) => {
    return (
      <div
        key={exam.ID || index}
        dir="rtl"
        className="bg-white border border-gray-200 hover:border-brand/50 rounded-xl p-5 mb-4 shadow-sm hover:shadow-lg transition-all duration-300 group"
      >
        {/* رأس البطاقة */}
        <div className="flex flex-row items-start justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex-1">
            <div className="flex flex-row items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs font-arabic text-white">
                  #{exam.ID}
                </span>
              </div>
              <h3 className="text-lg font-arabic text-gray-900 group-hover:text-brand transition-colors">
                {exam.name}
              </h3>
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mb-4 space-y-3">
          {/* Stats */}
          <div className="flex flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
              <BookOpen size={16} className="text-blue-600" />
              <span className="text-xs text-gray-600">الأسئلة:</span>
              <span className="text-sm font-arabic text-blue-600">
                {exam.questions?.length || 0}
              </span>
            </div>

            {exam.registeredStudents && (
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
                <Users size={16} className="text-green-600" />
                <span className="text-xs text-gray-600">الطلاب:</span>
                <span className="text-sm font-arabic text-green-600">
                  {exam.registeredStudents}
                </span>
              </div>
            )}
          </div>

          {/* إضافة طالب */}
          <div className="flex flex-row gap-2">
            <input
              className="flex-1 border-2 rounded-lg border-gray-300 focus:border-brand p-3 text-sm transition-colors outline-none"
              value={STUDENT_ID_TO_ADD}
              onChange={(e) => SET_STUDENT_ID_TO_ADD(e.target.value)}
              placeholder=" الرقم الجامعي للطالب"
              type="number"
            />
            <button
              className="bg-gradient-to-r from-brand to-purple-600 hover:from-purple-600 hover:to-brand rounded-lg px-6 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => {
                handle_add_student_to_exam({ EXAM_ID: exam._id });
              }}
            >
              <span className="text-white text-sm ">إضافة</span>
            </button>
          </div>
        </div>

        {/* الإجراءات */}
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={() => {
              navigate(`/admin/exams/${exam._id}`);
            }}
            className="flex-1 flex flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 transition-all duration-300 group/btn"
          >
            <Eye
              size={16}
              className="text-blue-600 group-hover/btn:scale-110 transition-transform"
            />
            <span className="text-sm font-medium text-blue-600">عرض</span>
          </button>

          <button
            onClick={() => {
              navigate(`/admin/exams/edit/${exam._id}`);
            }}
            className="flex-1 flex flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border border-yellow-200 transition-all duration-300 group/btn"
          >
            <Edit
              size={16}
              className="text-yellow-600 group-hover/btn:scale-110 transition-transform"
            />
            <span className="text-sm font-medium text-yellow-600">تعديل</span>
          </button>

          <button
            onClick={() => handleDeleteExam(exam._id)}
            className="flex items-center justify-center p-2.5 rounded-lg bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 transition-all duration-300 group/btn"
          >
            <Trash2
              size={18}
              className="text-red-600 group-hover/btn:scale-110 transition-transform"
            />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 text-base font-medium">
          جاري تحميل الاختبارات...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 font-arabic min-h-screen bg-gray-50 pb-8">
      {/* 🔴 عرض الأخطاء */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mx-4 mb-4  shadow-sm">
          <div className="flex flex-row items-start gap-3">
            <AlertCircle
              className="text-red-600 flex-shrink-0 mt-0.5"
              size={22}
            />
            <div className="flex-1">
              <p className="text-red-600 text-sm leading-relaxed">
                {error?.message ?? error}
              </p>
            </div>
            <button
              onClick={handleCloseError}
              className="hover:opacity-70 transition-opacity"
            >
              <XCircle className="text-red-400" size={20} />
            </button>
          </div>
        </div>
      )}

      {/* 🔵 عرض رسالة الحالة */}
      {status !== "" && status !== undefined && showStatus && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mx-4 mb-4 shadow-sm">
          <div className="flex flex-row items-start gap-3">
            <Info className="text-green-600 flex-shrink-0 mt-0.5" size={22} />
            <div className="flex-1">
              <p className="text-green-800 text-sm leading-relaxed">
                {status?.message ?? status}
              </p>
            </div>
            <button
              onClick={handleCloseStatus}
              className="hover:opacity-70 transition-opacity"
            >
              <XCircle className="text-green-400" size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center gap-3 sm:gap-4 px-4 mb-4 ">
        <Link to="/admin/exams/create">
          <button className="bg-gradient-to-r mt-4 mb-8 from-brand to-purple-600 hover:from-purple-600 hover:to-brand px-5 py-3 rounded-xl flex flex-row items-center justify-center gap-2 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Plus size={20} className="text-white" />
            <span className="text-white text-base ">إنشاء اختبار جديد</span>
          </button>
        </Link>
      </div>

      {/* 🔍 البحث */}
      <div className="bg-white rounded-xl border-2 border-gray-200 mx-4 mb-6 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-row items-center bg-gray-50 border-2 border-gray-300 focus-within:border-brand rounded-xl  px-4 py-3 transition-colors">
            <Search className="text-gray-400 ml-2" size={20} />
            <input
              placeholder="ابحث عن اختبار بالاسم..."
              className="flex-1 text-base text-gray-800 bg-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-brand hover:bg-purple-600 px-6 py-2 rounded-lg transition-colors duration-300"
            >
              <span className="text-white text-sm ">بحث</span>
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الامتحانات */}
      <div className="px-4">
        {Array.isArray(exams) && exams.length > 0 ? (
          exams.map((exam, index) => renderExamCard(exam, index))
        ) : (
          <div className="py-16 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Search className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-base font-medium">
              لا توجد اختبارات متاحة
            </p>
            <p className="text-gray-400 text-sm mt-2">
              ابدأ بإنشاء اختبار جديد
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsList;
