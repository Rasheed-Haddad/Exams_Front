import { useSessionTracking } from "../../hooks/useSessionTracking.js";
import { useNavigate } from "react-router-dom";
import { BookOpen, LogOut, User, Lock, Play, SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmptyState } from "../components/Exams_Names";
import { send_time_spent_on_website, signOut } from "../store/slices/authSlice";
import { fetch_names_of_student_exams } from "../store/slices/exams_slice";
import {
  fetchSubjects,
  selectCollege,
  selectSubject,
} from "../store/slices/selectionSlice";

const SubjectSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);
  const { subjects, selectedCollege, loading, error } = useSelector(
    (state) => state.selection
  );
  const { names_of_exams } = useSelector((state) => state.exams);
  const { user, isInitialized } = useSelector((state) => state.auth);

  // إضافة تتبع الجلسات
  useSessionTracking();

  useEffect(() => {
    const loadSavedCollege = async () => {
      if (!selectedCollege) {
        const saved_college_str = localStorage.getItem("college");
        if (saved_college_str) {
          const saved_college = JSON.parse(saved_college_str);
          dispatch(selectCollege(saved_college));
        }
      }
    };

    loadSavedCollege();
  }, [dispatch, selectedCollege]);

  useEffect(() => {
    if (!selectedCollege || !user?.ID) {
      navigate("/signin", { replace: true });
      return;
    }
    if (subjects.length === 0 && isInitialized) {
      dispatch(
        fetchSubjects({ college_id: selectedCollege?.id, ID: user?.ID })
      ).finally(() => {
        setInitialLoading(false);
      });
    } else if (subjects.length > 0) {
      setInitialLoading(false);
    }
  }, [
    dispatch,
    selectedCollege,
    user,
    isInitialized,
    navigate,
    subjects.length,
  ]);

  useEffect(() => {
    console.log(isInitialized);
    if (names_of_exams.length === 0 && selectedCollege && user?.ID) {
      dispatch(
        fetch_names_of_student_exams({
          ID: user.ID,
          college_id: selectedCollege.id,
        })
      );
    }
  }, [selectedCollege, user, dispatch, names_of_exams.length]);

  const handleSubjectSelect = (subject) => {
    dispatch(selectSubject(subject));
    navigate("/lecture");
  };

  const handleSignOut = async () => {
    // إرسال الجلسة الحالية قبل الخروج
    const startTime = localStorage.getItem("session_start_time");
    const sessionSent = localStorage.getItem("session_sent");

    if (startTime && sessionSent !== "true" && user?.ID) {
      try {
        await dispatch(
          send_time_spent_on_website({
            ID: user.ID,
            start: startTime,
            end: new Date().toISOString(),
          })
        ).unwrap();
      } catch (error) {
        console.error("خطأ في إرسال الجلسة عند الخروج:", error);
      }
    }

    localStorage.clear();
    dispatch(signOut());
    navigate("/signin", { replace: true });
  };

  const handle_profile = () => {
    navigate("/profile");
  };

  return (
    <div
      style={{ direction: "rtl" }}
      className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-white"
    >
      {/* Modern Header with Gradient */}
      <div className="bg-brand shadow-2xl px-6 pt-12 pb-6 rounded-b-[32px]">
        {/* Action Buttons */}
        <div
          style={{ direction: "rtl" }}
          className="flex flex-row items-center gap-3"
        >
          <button
            onClick={handle_profile}
            className="flex-auto bg-white/20 backdrop-blur-lg px-4 py-3 rounded-2xl flex flex-row items-center justify-center gap-2 active:opacity-70 hover:bg-white/30 transition-all"
          >
            <User size={18} color="#fff" />
            <span className="text-white font-arabic text-sm">الإحصائيات</span>
          </button>

          <button
            onClick={handleSignOut}
            className="bg-white/20 flex-auto backdrop-blur-lg px-4 py-3 rounded-2xl flex flex-row items-center justify-center gap-2 active:opacity-70 hover:bg-white/30 transition-all"
          >
            <LogOut size={18} color="#fff" />
            <span className="text-white font-arabic text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      <div
        className="flex-1 px-5 -mt-4 overflow-y-auto"
        style={{ paddingBottom: "3rem" }}
      >
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 shadow-sm">
            <span className="text-red-700 text-base text-center font-medium">
              {error}
            </span>
          </div>
        )}

        {/* Subjects Grid */}
        {initialLoading || loading ? (
          <div className="mt-6">
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-lg p-6 border-2 border-transparent animate-pulse"
                >
                  <div style={{ direction: "rtl" }} className="flex flex-col">
                    <div className="h-7 bg-gray-200 rounded-lg mb-4 w-2/3 shimmer"></div>
                    <div className="h-16 bg-gray-200 rounded-lg mb-4 shimmer"></div>
                    <div className="h-14 bg-gray-200 rounded-2xl shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : subjects.length > 0 ? (
          <div className="mt-6">
            <div className="flex flex-col gap-4">
              {subjects.map((subject, index) => {
                const isLocked = !subject.visible;
                return (
                  <button
                    key={subject.ID}
                    onClick={() => !isLocked && handleSubjectSelect(subject)}
                    disabled={isLocked}
                    className={`bg-white rounded-3xl shadow-lg p-6 border-2 transition-all ${
                      isLocked
                        ? "border-gray-200 opacity-60 cursor-not-allowed"
                        : "border-transparent hover:border-[#8c52ff] hover:shadow-xl cursor-pointer"
                    }`}
                    style={{
                      boxShadow: isLocked
                        ? "0 4px 12px rgba(0, 0, 0, 0.05)"
                        : "0 4px 12px rgba(140, 82, 255, 0.15)",
                    }}
                  >
                    {/* Subject Info */}
                    <div style={{ direction: "rtl" }} className="flex flex-col">
                      <span
                        className={`text-xl font-arabic mb-4 ${
                          isLocked ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {subject.name}
                      </span>

                      {subject.info ? (
                        <span
                          className={`text-sm font-arabic leading-6 mb-4 ${
                            isLocked ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {subject.info}
                        </span>
                      ) : (
                        <span className="text-sm font-arabic text-gray-400 mb-4">
                          لا توجد معلومات إضافية
                        </span>
                      )}

                      {/* Action Button */}
                      <div
                        className={`flex flex-row items-center justify-center gap-2 py-4 rounded-2xl ${
                          isLocked ? "bg-gray-100" : "bg-brand"
                        }`}
                      >
                        {isLocked ? (
                          <Lock size={20} color="#9ca3af" />
                        ) : (
                          <Play size={20} color="#fff" />
                        )}
                        <span
                          className={` font-arabic text-base ${
                            isLocked ? "text-gray-400" : "text-white"
                          }`}
                        >
                          {isLocked ? "غير متاح حالياً" : " "}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-12 mt-12 flex flex-col items-center">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <BookOpen size={48} color="#8c52ff" />
            </div>
            <span className="text-xl font-arabic text-gray-800 mb-2 text-center">
              لم تسجل على أي مادة حتى الآن{" "}
            </span>
            <span className="text-sm font-arabic text-gray-500 text-center leading-6">
              يرجى المحاولة لاحقاً أو التواصل مع المدرس.
            </span>
          </div>
        )}

        {/* Available Exams Section */}
        {names_of_exams && names_of_exams.length > 0 && (
          <div className="mt-12 mb-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <div className="flex flex-row items-center gap-2">
                <div className="w-1 h-6 bg-[#8c52ff] rounded-full" />
                <span className="text-xl font-arabic text-gray-800">
                  مواد متوفرة لكليتك{" "}
                </span>
              </div>
              <div className="bg-green-50 px-3 py-1 rounded-full">
                <span className="text-green-600 font-arabic text-sm">
                  {names_of_exams.length} مادة
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {names_of_exams.map((exam, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const phone = exam.admin.phone_number?.replace(
                      /[^0-9]/g,
                      ""
                    );
                    if (phone) {
                      window.open(`https://wa.me/${phone}`, "_blank");
                    }
                  }}
                  className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div
                    style={{ direction: "rtl" }}
                    className="flex flex-row items-center justify-between"
                  >
                    <div className="flex flex-col items-start" dir="rtl">
                      <span className="text-lg font-arabic text-gray-800 mb-1">
                        {exam.name || "مادة "}
                      </span>
                      <span className="text-sm  font-arabic text-gray-500">
                        {exam.info || "الوصف فارغ"}
                      </span>
                    </div>
                    <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#25D366"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Other Exams */}
        {names_of_exams && names_of_exams.length === 0 && (
          <div className="mt-12 mb-6">
            <EmptyState />
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-12" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .shimmer {
          background: linear-gradient(
            to right,
            #e5e7eb 0%,
            #f3f4f6 20%,
            #e5e7eb 40%,
            #e5e7eb 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SubjectSelection;
