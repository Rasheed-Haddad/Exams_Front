import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BookOpen, HelpCircle, LogOut, User, Lock, Play } from "lucide-react";
import {
  fetchSubjects,
  selectCollege,
  selectSubject,
} from "../store/slices/selectionSlice";
import { fetch_names_of_student_exams } from "../store/slices/exams_slice";

// Skeleton Component للمواد
const SubjectSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-100">
    <div dir="rtl">
      {/* Title Skeleton */}
      <div className="bg-gray-200 h-6 w-3/4 rounded-lg mb-4 animate-pulse" />

      {/* Info Skeleton */}
      <div className="mb-4 space-y-2">
        <div className="bg-gray-200 h-4 w-full rounded-lg animate-pulse" />
        <div className="bg-gray-200 h-4 w-5/6 rounded-lg animate-pulse" />
      </div>

      {/* Button Skeleton */}
      <div className="bg-gray-200 h-14 rounded-2xl animate-pulse" />
    </div>
  </div>
);

// Skeleton Component للاختبارات المتاحة
const ExamCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
    <div dir="rtl" className="flex items-start justify-between">
      <div className="flex-1 space-y-3">
        {/* Name Skeleton */}
        <div className="bg-gray-200 h-5 w-2/3 rounded-lg animate-pulse" />

        {/* Info Skeleton */}
        <div className="bg-gray-200 h-4 w-full rounded-lg animate-pulse" />

        {/* Details Row Skeleton */}
        <div className="flex gap-3 mt-2">
          <div className="bg-gray-200 h-8 w-20 rounded-full animate-pulse" />
          <div className="bg-gray-200 h-8 w-24 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Icon Skeleton */}
      <div className="bg-gray-200 w-12 h-12 rounded-full animate-pulse" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="bg-white rounded-3xl shadow-lg p-12 flex flex-col items-center">
    <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
      <BookOpen size={48} className="text-[#8c52ff]" />
    </div>
    <p className="text-lg text-gray-800 mb-2 text-center">
      لا توجد مواد متاحة حالياً
    </p>
  </div>
);

const SubjectSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);

  // Redux selectors - adjust based on your actual store structure
  const subjects = useSelector((state) => state.selection?.subjects || []);
  const selectedCollege = useSelector(
    (state) => state.selection?.selectedCollege,
  );
  const loading = useSelector((state) => state.selection?.loading);
  const error = useSelector((state) => state.selection?.error);
  const namesOfExams = useSelector(
    (state) => state.exams?.names_of_exams || [],
  );
  const examsLoading = useSelector((state) => state.exams?.loading);
  const user = useSelector((state) => state.auth?.user);
  const isInitialized = useSelector((state) => state.auth?.isInitialized);

  useEffect(() => {
    const loadSavedCollege = () => {
      if (!selectedCollege) {
        const savedCollegeStr = localStorage.getItem("college");
        if (savedCollegeStr) {
          const savedCollege = JSON.parse(savedCollegeStr);
          dispatch(selectCollege(savedCollege));
        }
      }
    };

    loadSavedCollege();
  }, [dispatch, selectedCollege]);

  useEffect(() => {
    if (!selectedCollege || !user?.ID) {
      navigate("/signin");
      return;
    }
    if (subjects.length === 0 && isInitialized) {
      dispatch(
        fetchSubjects({ college_id: selectedCollege?.id, ID: user?.ID }),
      );
      setInitialLoading(false);
    } else if (subjects.length > 0) {
      setInitialLoading(false);
    }
  }, [
    dispatch,
    selectedCollege,
    user,
    isInitialized,
    subjects.length,
    navigate,
  ]);

  useEffect(() => {
    if (
      namesOfExams.length === 0 &&
      isInitialized &&
      selectedCollege?.id &&
      user?.ID
    ) {
      dispatch(
        fetch_names_of_student_exams({
          ID: user.ID,
          college_id: selectedCollege.id,
        }),
      );
    }
  }, [isInitialized, selectedCollege, user, namesOfExams.length, dispatch]);

  const handleSubjectSelect = (subject) => {
    dispatch(selectSubject(subject));
    navigate("/lecture");
  };

  const handleSignOut = async () => {
    const startTime = localStorage.getItem("session_start_time");
    const sessionSent = localStorage.getItem("session_sent");

    if (startTime && sessionSent !== "true" && user?.ID) {
      try {
        await dispatch({
          type: "auth/send_time_spent_on_website",
          payload: {
            ID: user.ID,
            start: startTime,
            end: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error("خطأ في إرسال الجلسة عند الخروج:", error);
      }
    }

    localStorage.clear();
    dispatch({ type: "auth/signOut" });
    navigate("/signin");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleWhatsAppContact = (exam) => {
    const phone = exam.admin?.phone_number?.replace(/[^0-9]/g, "");
    if (phone) {
      window.open(
        `https://wa.me/${phone}?text=مرحبا, بخصوص مكثفة ال${exam.name} شو بتتضمن وكيف فيني سجل؟`,
        "_blank",
      );
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen font-arabic bg-gradient-to-b from-purple-50 to-white"
    >
      {/* Modern Header with Gradient */}
      <div className="bg-[#8c52ff] shadow-2xl px-6 pt-12 pb-6 rounded-b-[32px]">
        <div dir="rtl" className="grid grid-cols-2 gap-3">
          <button
            onClick={handleProfile}
            className="bg-white/20 backdrop-blur-lg px-4 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/30 transition-all active:opacity-70"
          >
            <User size={18} className="text-white" />
            <span className="text-white font-arabic text-sm">الإحصائيات</span>
          </button>

          <button
            onClick={handleSignOut}
            className="bg-white/20 backdrop-blur-lg px-4 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/30 transition-all active:opacity-70"
          >
            <LogOut size={18} className="text-white" />
            <span className="text-white text-sm font-arabic">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 -mt-4 pb-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 shadow-sm">
            <p className="text-red-700 text-base text-center font-arabic">
              {error}
            </p>
          </div>
        )}

        {/* Subjects Section */}
        <div className="mt-6">
          {loading ? (
            <SubjectSkeleton />
          ) : subjects.length > 0 ? (
            <div className="space-y-4">
              {subjects.map((subject, index) => {
                const isLocked = !subject.visible;
                return (
                  <button
                    key={subject.ID}
                    onClick={() => !isLocked && handleSubjectSelect(subject)}
                    disabled={isLocked}
                    className={`w-full bg-white rounded-3xl shadow-lg p-6 border-2 transition-all ${
                      isLocked
                        ? "border-gray-200 opacity-60 cursor-not-allowed"
                        : "border-transparent hover:border-[#8c52ff] hover:shadow-xl cursor-pointer"
                    }`}
                    style={{
                      boxShadow: isLocked
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                        : "0 4px 12px -1px rgba(140, 82, 255, 0.15)",
                    }}
                  >
                    <div dir="rtl">
                      <h3
                        className={`text-xl font-arabic mb-4 ${
                          isLocked ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {subject.name}
                      </h3>

                      {subject.info ? (
                        <p
                          className={`text-sm leading-6 font-arabic mb-4 ${
                            isLocked ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {subject.info}
                        </p>
                      ) : (
                        <p className="text-sm font-arabic text-gray-400 mb-4">
                          لا توجد معلومات إضافية
                        </p>
                      )}

                      <div
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl ${
                          isLocked ? "bg-gray-100" : "bg-[#8c52ff]"
                        }`}
                      >
                        {isLocked ? (
                          <Lock size={20} className="text-gray-400" />
                        ) : (
                          <Play size={20} className="text-white" />
                        )}
                        <span
                          className={`font-bold text-base ${
                            isLocked ? "text-gray-400" : "text-white"
                          }`}
                        >
                          {isLocked ? "غير متاح حالياً" : ""}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-12 flex flex-col items-center">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                <BookOpen size={48} className="text-[#8c52ff]" />
              </div>
              <p className="text-lg text-gray-800 mb-2 text-center">
                لم تسجل على أي مادة حتى الآن
              </p>
            </div>
          )}
        </div>

        {/* Available Exams Section */}
        <div className="mt-12 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-[#8c52ff] rounded-full" />
              <h2 className="text-xl text-gray-800">مواد متوفرة لكليتك</h2>
            </div>
            {!examsLoading && namesOfExams && namesOfExams.length > 0 && (
              <div className="bg-green-50 px-3 py-1 rounded-full">
                <span className="text-green-600 font-bold text-sm">
                  {namesOfExams.length} مادة
                </span>
              </div>
            )}
          </div>

          {examsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <ExamCardSkeleton key={i} />
              ))}
            </div>
          ) : namesOfExams && namesOfExams.length > 0 ? (
            <div className="space-y-3">
              {namesOfExams.map((exam, index) => (
                <button
                  key={index}
                  onClick={() => handleWhatsAppContact(exam)}
                  className="w-full bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div dir="rtl" className="flex items-start justify-between">
                    <div className="flex-1 text-right">
                      <h3 className="text-lg text-gray-800 mb-2">
                        {exam.name || "مادة"}
                      </h3>

                      {exam.info && (
                        <p className="text-sm text-gray-500 mb-3">
                          {exam.info}
                        </p>
                      )}

                      {/* Details Row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Price Badge */}
                        <div
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                            exam.price === 0 ? "bg-green-50" : "bg-blue-50"
                          }`}
                        >
                          <span
                            className={`text-xs font-bold ${
                              exam.price === 0
                                ? "text-green-600"
                                : "text-blue-600"
                            }`}
                          >
                            {exam.price === 0 ? "مجاني" : `${exam.price} ل.س`}
                          </span>
                        </div>

                        {/* Questions Count Badge */}
                        {exam.questionsCount > 0 && (
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50">
                            <HelpCircle size={14} className="text-[#8c52ff]" />
                            <span className="text-xs font-bold text-purple-600">
                              {exam.questionsCount} سؤال
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp Icon */}
                    <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="#25D366"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;
