import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  LogOut,
  User,
  X,
  Lock,
  Play,
  RefreshCw,
  Copy,
  CheckCircle2,
} from "lucide-react";
import ErrorHelperModal from "../components/ErrorHelperModal";
import { EmptyState } from "../components/Exams_Names";
import { signOut, send_time_spent_on_website } from "../store/slices/authSlice";
import {
  clearExamsError,
  fetch_names_of_student_exams,
} from "../store/slices/exams_slice";
import {
  clearSelectionError,
  fetchSubjects,
  selectCollege,
  selectSubject,
} from "../store/slices/selectionSlice";

// Skeleton Component للمواد
const SubjectSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-100 animate-pulse">
    <div className="flex flex-col items-center" style={{ direction: "rtl" }}>
      <div className="bg-gray-200 h-6 w-3/4 rounded-lg mb-4" />
      <div className="bg-gray-200 h-14 w-full rounded-2xl" />
    </div>
  </div>
);

// Skeleton Component للاختبارات المتاحة
const ExamCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 animate-pulse">
    <div
      style={{ direction: "rtl" }}
      className="flex flex-row items-start justify-between"
    >
      <div className="flex-1">
        <div className="bg-gray-200 h-5 w-2/3 rounded-lg" />
      </div>
      <div className="bg-gray-200 w-20 h-10 rounded-xl" />
    </div>
  </div>
);

// Registration Modal Component
const RegistrationModal = ({ visible, exam, onClose, user }) => {
  const [transactionNumber, setTransactionNumber] = useState("");
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transactionNumber.trim()) {
      alert("الرجاء إدخال رقم العملية");
      return;
    }

    const phone = exam.admin?.phone_number?.replace(/[^0-9]/g, "");
    if (phone) {
      const message = `الرقم الجامعي: ${user.ID}, رقم العملية: ${transactionNumber}, المادة: ${exam.name}`;
      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank",
      );
      setTransactionNumber("");
      onClose();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      style={{ direction: "rtl" }}
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#8c52ff] px-6 py-5 flex flex-row items-center justify-between text-white">
          <h3 className="font-arabic text-lg ">تسجيل في مادة</h3>
          <button
            onClick={onClose}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {exam.info && (
            <div className="mb-5 w-full bg-gray-50 rounded-2xl p-4 max-h-32 overflow-y-auto">
              <p className="text-gray-700 text-sm leading-relaxed text-center font-arabic">
                {exam.info}
              </p>
            </div>
          )}

          <div className="bg-green-50 rounded-2xl p-4 mb-5 w-full text-center">
            <span className="text-green-600 text-xl  font-arabic">
              {exam.price === 0 ? "مجاني" : `${exam.price} ل.س`}
            </span>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 mb-5 w-full">
            <h4 className="text-blue-900 text-sm  mb-3 text-center font-arabic">
              طريقة التسجيل
            </h4>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
              <div className="flex flex-row items-start gap-3">
                <div className="bg-[#8c52ff] min-w-[24px] h-6 rounded-full flex items-center justify-center text-white text-xs ">
                  1
                </div>
                <p className="text-blue-800 text-xs leading-relaxed font-arabic">
                  قم بتحويل مبلغ {exam.price} ل.س بإحدى الطرق التالية:
                </p>
              </div>

              <div className="mr-8 bg-blue-100/50 rounded-xl p-3">
                <p className="text-blue-700 text-xs leading-loose font-arabic">
                  • سيرتيل كاش: 0937922870
                  <br />• رصيد: 0937922870
                </p>
                <div className="flex flex-row items-center justify-between mt-2 gap-2">
                  <span className="text-blue-700 text-xs font-arabic truncate">
                    • شام كاش: 83c6c514...
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard("83c6c514cecf088aab7d9d9f0337ca35")
                    }
                    className="bg-blue-200 hover:bg-blue-300 text-[#8c52ff] px-3 py-1 rounded-lg text-xs  transition-colors whitespace-nowrap"
                  >
                    {copied ? "تم النسخ" : "نسخ الرمز"}
                  </button>
                </div>
              </div>

              <div className="flex flex-row items-start gap-3">
                <div className="bg-[#8c52ff] min-w-[24px] h-6 rounded-full flex items-center justify-center text-white text-xs ">
                  2
                </div>
                <p className="text-blue-800 text-xs leading-relaxed font-arabic">
                  احتفظ برقم العملية الظاهر في رسالة التحويل
                </p>
              </div>

              <div className="flex flex-row items-start gap-3">
                <div className="bg-[#8c52ff] min-w-[24px] h-6 rounded-full flex items-center justify-center text-white text-xs ">
                  3
                </div>
                <p className="text-blue-800 text-xs leading-relaxed font-arabic">
                  أدخل رقم العملية في الحقل أدناه
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={transactionNumber}
              onChange={(e) => setTransactionNumber(e.target.value)}
              placeholder="أدخل رقم العملية هنا"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-center text-sm outline-none focus:border-[#8c52ff] transition-colors font-arabic"
            />
            <button
              type="submit"
              className="w-full bg-[#8c52ff] hover:bg-[#7a41e6] text-white rounded-2xl py-3.5 shadow-lg  transition-all active:scale-[0.98] font-arabic"
            >
              تأكيد
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const SubjectSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examsInitialLoading, setExamsInitialLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentError, setCurrentError] = useState("");

  const { subjects, selectedCollege, loading, error } = useSelector(
    (state) => state.selection,
  );
  const {
    names_of_exams,
    loading: examsLoading,
    error: examsError,
  } = useSelector((state) => state.exams);
  const { user, isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadSavedCollege = () => {
      const saved_college_str = localStorage.getItem("selected_college");
      if (saved_college_str && !selectedCollege) {
        const saved_college = JSON.parse(saved_college_str);
        dispatch(selectCollege(saved_college));
      }
    };
    loadSavedCollege();
  }, [dispatch, selectedCollege]);

  useEffect(() => {
    if (isInitialized && (!selectedCollege || !user?.ID)) {
      navigate("/signin");
      return;
    }
    if (isInitialized && selectedCollege && subjects.length === 0) {
      dispatch(
        fetchSubjects({ college_id: selectedCollege?.id, ID: user?.ID }),
      ).finally(() => setInitialLoading(false));
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
      isInitialized &&
      selectedCollege?.id &&
      user?.ID &&
      names_of_exams.length === 0
    ) {
      dispatch(
        fetch_names_of_student_exams({
          ID: user.ID,
          college_id: selectedCollege.id,
        }),
      ).finally(() => setExamsInitialLoading(false));
    } else if (names_of_exams.length > 0) {
      setExamsInitialLoading(false);
    }
  }, [isInitialized, selectedCollege, user, names_of_exams.length, dispatch]);

  useEffect(() => {
    if (error) {
      setCurrentError(error);
      setShowErrorModal(true);
    }
  }, [error]);

  useEffect(() => {
    if (examsError) {
      setCurrentError(examsError);
      setShowErrorModal(true);
    }
  }, [examsError]);

  const handleSubjectSelect = (subject) => {
    dispatch(selectSubject(subject));
    navigate("/lecture");
  };

  const handleSignOut = async () => {
    const startTime = localStorage.getItem("session_start_time");
    const sessionSent = localStorage.getItem("session_sent");

    if (startTime && sessionSent !== "true" && user?.ID) {
      try {
        await dispatch(
          send_time_spent_on_website({
            ID: user.ID,
            start: startTime,
            end: new Date().toISOString(),
          }),
        ).unwrap();
      } catch (err) {
        console.error("Error sending session:", err);
      }
    }

    localStorage.clear();
    dispatch(signOut());
    navigate("/signin");
  };

  const handle_profile = () => navigate("/profile");

  const handleRegisterClick = (exam) => {
    setSelectedExam(exam);
    setModalVisible(true);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setCurrentError("");
    dispatch(clearSelectionError());
    dispatch(clearExamsError());
  };

  return (
    <div
      className="min-h-screen bg-gray-50 font-arabic flex flex-col"
      style={{ direction: "rtl" }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white rounded-b-[32px] shadow-sm">
        <div className="flex flex-row items-center gap-3">
          <button
            onClick={handle_profile}
            className="flex-1 bg-[#8c52ff] hover:bg-[#7a41e6] text-white px-4 py-3 rounded-2xl flex flex-row items-center justify-center gap-2 transition-colors font-arabic "
          >
            <User size={18} />
            <span className="font-arabic">الإحصائيات</span>
          </button>

          <button
            onClick={handleSignOut}
            className="flex-1 bg-[#8c52ff] hover:bg-[#7a41e6] text-white px-4 py-3 rounded-2xl flex flex-row items-center justify-center gap-2 transition-colors font-arabic "
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 overflow-y-auto pb-10">
        {/* Subjects Section */}
        <div className="mt-6">
          {loading || initialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SubjectSkeleton />
              <SubjectSkeleton />
            </div>
          ) : subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject) => {
                const isLocked = !subject.visible;
                return (
                  <button
                    key={subject.ID}
                    onClick={() => !isLocked && handleSubjectSelect(subject)}
                    disabled={isLocked}
                    className={`bg-white rounded-3xl shadow-lg p-6 border-2 text-right transition-all group ${
                      isLocked
                        ? "border-gray-100 opacity-60 cursor-not-allowed"
                        : "border-transparent hover:border-[#8c52ff] active:scale-[0.98]"
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <h3
                        className={`text-xl text-center font-arabic  mb-8 ${isLocked ? "text-gray-400" : "text-[#8c52ff]"}`}
                      >
                        {subject.name}
                      </h3>
                      <div
                        className={`mt-auto flex flex-row items-center justify-center gap-2 py-4 rounded-2xl transition-colors ${isLocked ? "bg-gray-100" : "bg-[#8c52ff] group-hover:bg-[#7a41e6]"}`}
                      >
                        {isLocked ? (
                          <Lock size={20} className="text-gray-400" />
                        ) : (
                          <Play size={20} className="text-white fill-current" />
                        )}
                        <span
                          className={` text-base font-arabic ${isLocked ? "text-gray-400" : "text-white"}`}
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
              <p className="text-lg text-gray-800 text-center font-arabic">
                لم تسجل على أي مادة حتى الآن
              </p>
            </div>
          )}
        </div>

        {/* Available Exams Section */}
        <div className="mt-12">
          <div className="flex flex-row items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-[#8c52ff] rounded-full" />
            <h2 className="text-xl  text-gray-800 font-arabic">
              مواد متوفرة لكليتك
            </h2>
          </div>

          {examsLoading || examsInitialLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <ExamCardSkeleton key={i} />
              ))}
            </div>
          ) : names_of_exams && names_of_exams.length > 0 ? (
            <div className="space-y-3">
              {names_of_exams.map(
                (exam, index) =>
                  exam.price > 0 && (
                    <div
                      key={index}
                      className="bg-white border border-purple-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-row items-center justify-between gap-4">
                        <span className="text-lg  text-gray-800 flex-1 font-arabic">
                          {exam.name || "مادة"}
                        </span>
                        <button
                          onClick={() => handleRegisterClick(exam)}
                          className="bg-[#8c52ff] hover:bg-[#7a41e6] text-white px-6 py-2.5 rounded-xl text-sm  shadow-sm transition-all active:scale-95 font-arabic"
                        >
                          تسجيل
                        </button>
                      </div>
                    </div>
                  ),
              )}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedExam && (
        <RegistrationModal
          visible={modalVisible}
          exam={selectedExam}
          onClose={() => setModalVisible(false)}
          user={user}
        />
      )}

      <ErrorHelperModal
        visible={showErrorModal}
        onClose={handleCloseErrorModal}
        errorMessage={currentError}
        screenType="subject"
      />
    </div>
  );
};

export default SubjectSelection;
