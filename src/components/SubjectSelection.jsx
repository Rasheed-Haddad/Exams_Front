import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, User, X } from "lucide-react";
import { EmptyState } from "./Exams_Names";
import { signOut } from "../store/slices/authSlice";
import {
  fetch_names_of_student_exams,
  fetch_requests_of_the_student,
  request_exams,
} from "../store/slices/exams_slice";
import {
  fetchSubjects,
  selectCollege,
  selectSubject,
} from "../store/slices/selectionSlice";
import { replace, useNavigate } from "react-router-dom";

// Skeleton Component للمواد
const SubjectSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-100">
    <div dir="rtl">
      {/* Title Skeleton */}
      <div className="bg-gray-200 h-6 w-3/4 rounded-lg mb-4 animate-pulse" />
      {/* Button Skeleton */}
      <div className="bg-gray-200 h-14 rounded-2xl animate-pulse" />
    </div>
  </div>
);

// Skeleton Component للاختبارات المتاحة
const ExamCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
    <div dir="rtl" className="flex flex-row items-start justify-between">
      <div className="flex-1 flex flex-col gap-3">
        {/* Name Skeleton */}
        <div className="bg-gray-200 h-5 w-2/3 rounded-lg animate-pulse" />
      </div>
      {/* Icon Skeleton */}
      <div className="bg-gray-200 w-20 h-12 rounded-2xl animate-pulse" />
    </div>
  </div>
);

const SubjectSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [examsInitialLoading, setExamsInitialLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentError, setCurrentError] = useState("");
  const { requests } = useSelector((state) => state.exams);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  // ── Cart State ──────────────────────────────────────────────
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [show_sham_cash_parcode_modal, set_show_sham_cash_parcode_modal] =
    useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [note, set_note] = useState("");
  const [savedUniversity, setSavedUniversity] = useState(null);
  const [savedCollege, setSavedCollege] = useState(null);

  const { subjects, selectedCollege, loading, error } = useSelector(
    (state) => state.selection,
  );
  const {
    names_of_exams,
    loading: examsLoading,
    error: examsError,
  } = useSelector((state) => state.exams);
  const { user, isInitialized } = useSelector((state) => state.auth);

  // تحميل بيانات الجامعة والكلية
  useEffect(() => {
    const loadStorageData = async () => {
      const universityStr = localStorage.getItem("university");
      const collegeStr = localStorage.getItem("college");
      if (universityStr) setSavedUniversity(JSON.parse(universityStr));
      if (collegeStr) setSavedCollege(JSON.parse(collegeStr));
    };
    loadStorageData();
    dispatch(fetch_requests_of_the_student({ ID: user?.ID }));
  }, []);

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
    if (!isInitialized) return; // ← انتظر لحد ما يخلص

    if (!selectedCollege || !user?.ID) {
      navigate("/signin", { replace: true });
      return;
    }
  }, [dispatch, selectedCollege, user, isInitialized]);

  useEffect(() => {
    if (
      names_of_exams.length === 0 &&
      isInitialized &&
      selectedCollege?.id &&
      user?.ID
    ) {
      dispatch(
        fetch_names_of_student_exams({
          ID: user.ID,
          college_id: selectedCollege.id,
        }),
      ).finally(() => {
        setExamsInitialLoading(false);
      });
    } else if (names_of_exams.length > 0) {
      setExamsInitialLoading(false);
    }
  }, [isInitialized, selectedCollege, user]);

  useEffect(() => {
    if (error) {
      setCurrentError(error);
      setShowErrorModal(true);
    }
  }, [error, user]);

  useEffect(() => {
    if (examsError) {
      setCurrentError(examsError);
      setShowErrorModal(true);
    }
  }, [examsError, user]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setSearchLoading(true);
    await dispatch(
      fetchSubjects({
        college_id: selectedCollege?.id,
        ID: user?.ID,
        search_term: searchTerm.trim(),
      }),
    );
    setSearchLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      searchTerm.trim() &&
        dispatch(
          fetchSubjects({
            college_id: selectedCollege?.id,
            ID: user?.ID,
            search_term: searchTerm.trim(),
          }),
        ),
      dispatch(
        fetch_names_of_student_exams({
          college_id: selectedCollege?.id,
          ID: user?.ID,
        }),
      ),
      dispatch(fetch_requests_of_the_student({ ID: user?.ID })),
    ]);
    setRefreshing(false);
  };

  const handleSubjectSelect = (subject) => {
    dispatch(selectSubject(subject));
    navigate("/lecture", replace);
  };

  const handleSignOut = async () => {
    localStorage.clear();
    dispatch(signOut());
    navigate("/signIn", replace);
  };

  const handle_profile = () => {
    navigate("/profile", replace);
  };

  // ── Cart Handlers ───────────────────────────────────────────
  const toggleCart = (exam) => {
    setCart((prev) =>
      prev.find((e) => e.ID === exam.ID)
        ? prev.filter((e) => e.ID !== exam.ID)
        : [...prev, exam],
    );
  };

  const totalPrice = cart.reduce((sum, e) => sum + e.price, 0);

  const { loading: requestLoading } = useSelector((state) => state.exams);

  const handleCartSubmit = async () => {
    if (!transactionNumber.trim()) {
      alert("الرجاء إدخال رقم العملية");
      return;
    }
    try {
      await dispatch(
        request_exams({
          student_ID: user.ID,
          exams_ids: cart.map((e) => e._id),
          college_id: selectedCollege?.id,
          university_id: savedUniversity?.id,
          total_price: totalPrice,
          process_id: transactionNumber.trim(),
          student_notes: note || "",
        }),
      ).unwrap();

      alert("تم إرسال طلبك بنجاح، سيتم الرد بأسرع وقت");
      setTransactionNumber("");
      setCart([]);
      setShowCartModal(false);
      dispatch(fetch_requests_of_the_student({ ID: user?.ID }));
    } catch (err) {
      alert(err || "حدث خطأ، حاول مجدداً");
    }
  };

  // تحديد المواد التي هي قيد الانتظار حالياً
  const pendingExamIds = requests
    ? requests
        .filter((req) => req.status === "pending")
        .flatMap((req) => req.exams_ids)
    : [];

  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-brand">
      {/* Modern Header with Gradient */}
      <div className="px-6 pt-6 pb-6 rounded-b-[32px]">
        <div dir="rtl" className="flex flex-row items-center gap-3">
          <button
            onClick={handle_profile}
            className="flex-1 bg-white backdrop-blur-lg px-4 py-3 rounded-2xl flex flex-row items-center justify-center gap-2 active:opacity-70"
          >
            <User size={18} />
            <span className=" text-sm font-arabic">الإحصائيات</span>
          </button>

          <button
            onClick={handleSignOut}
            className="flex-1 bg-white backdrop-blur-lg px-4 py-3 rounded-2xl flex flex-row items-center justify-center gap-2 active:opacity-70"
          >
            <LogOut size={18} />
            <span className="text-sm font-arabic">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 -mt-4 overflow-y-auto">
        {/* ── Search Bar ── */}
        <div className="mt-6 flex flex-row gap-2" dir="rtl">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="ابحث عن مادة..."
            className="flex-1 bg-white font-arabic rounded-2xl px-4 py-3 text-base text-zinc-900 border border-brand/30 text-right outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading || !searchTerm.trim()}
            className="px-5 rounded-2xl flex items-center justify-center bg-white"
          >
            {searchLoading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8c52ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8c52ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            )}
          </button>
        </div>

        {/* Subjects Section */}
        <div className="mt-4">
          {loading || searchLoading ? (
            <SubjectSkeleton />
          ) : error ? (
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8c52ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="text-base font-arabic text-center text-gray-600">
                {typeof error === "string" ? error : "حدث خطأ غير متوقع"}
              </span>
            </div>
          ) : subjects.length > 0 ? (
            <div className="flex flex-col gap-4">
              {subjects.map((subject, index) => {
                const isLocked = !subject.visible;
                return (
                  <button
                    key={index}
                    onClick={() => !isLocked && handleSubjectSelect(subject)}
                    disabled={isLocked}
                    className="bg-white rounded-3xl p-6 border border-brand text-right w-full"
                  >
                    <div dir="rtl">
                      <p className="text-xl text-center mb-8 font-arabic">
                        {subject.name}
                      </p>
                      <div
                        className={`flex flex-row items-center justify-center gap-2 py-4 rounded-2xl ${
                          isLocked ? "bg-gray-100" : "bg-brand"
                        }`}
                      >
                        {isLocked ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                        <span
                          className={`text-base font-arabic ${isLocked ? "text-gray-400" : "text-white"}`}
                        >
                          {isLocked ? "غير متاح حالياً" : " "}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : searchTerm.trim() ? (
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className="text-base font-arabic text-center text-gray-400">
                لا توجد نتائج
              </span>
            </div>
          ) : null}
        </div>

        {/* Available Exams Section */}
        <div className="mt-12 mb-12 pb-12">
          {examsLoading || examsInitialLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <ExamCardSkeleton key={i} />
              ))}
            </div>
          ) : names_of_exams && names_of_exams.length > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center justify-center mb-12">
                <div className="flex flex-row items-center gap-2">
                  <div className="w-1 h-6 bg-[#8c52ff] rounded-full" />
                  <span className="text-2xl font-arabic text-white">
                    المواد المتوفرة لكليتك
                  </span>
                </div>
              </div>
              {/* ── قائمة المواد ── */}
              {names_of_exams.map(
                (exam, index) =>
                  exam.price > 0 && (
                    <div
                      key={index}
                      dir="rtl"
                      className="bg-white rounded-2xl p-5 flex flex-col items-center shadow-sm shadow-gray-100"
                    >
                      {/* Title */}
                      <span className="text-base font-arabic text-gray-800 text-center mb-1">
                        {exam.name || "مادة"}
                      </span>

                      {/* Info */}
                      {exam.info && (
                        <span className="text-xs font-arabic text-gray-400 text-center leading-relaxed mb-4">
                          {exam.info}
                        </span>
                      )}

                      {/* Button */}
                      <button
                        onClick={() =>
                          !pendingExamIds.includes(exam._id) && toggleCart(exam)
                        }
                        disabled={pendingExamIds.includes(exam._id)}
                        className={`px-6 py-2 rounded-full ${
                          pendingExamIds.includes(exam._id)
                            ? "bg-gray-50"
                            : cart.find((e) => e.ID === exam.ID)
                              ? "bg-white border border-brand"
                              : "bg-brand"
                        }`}
                      >
                        <span
                          className={`text-sm font-arabic ${
                            pendingExamIds.includes(exam._id)
                              ? "text-gray-400"
                              : cart.find((e) => e.ID === exam.ID)
                                ? "text-brand"
                                : "text-white"
                          }`}
                        >
                          {pendingExamIds.includes(exam._id)
                            ? "في انتظار القبول"
                            : cart.find((e) => e.ID === exam.ID)
                              ? "إزالة"
                              : "إضافة +"}
                        </span>
                      </button>
                    </div>
                  ),
              )}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Bottom Spacing */}
        <div className="h-12" />
      </div>

      {/* ── Floating Cart Bar ── */}
      {cart.length > 0 && (
        <div
          className="fixed bottom-6 left-5 right-5 bg-white rounded-2xl p-4 border border-[#8c52ff40] flex flex-col gap-3"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
        >
          <div className="flex flex-row items-center justify-between" dir="rtl">
            <span className="text-base font-arabic text-gray-800">
              المواد المختارة ({cart.length})
            </span>
            <span className="text-brand font-arabic text-base">
              {totalPrice} ل.س
            </span>
          </div>
          <button
            onClick={() => setShowCartModal(true)}
            className="bg-brand rounded-xl py-3 flex items-center justify-center"
          >
            <span className="text-white text-sm font-arabic">تأكيد الطلب</span>
          </button>
        </div>
      )}

      {/* ── Cart Modal ── */}
      {showCartModal && (
        <div className="fixed inset-0 flex items-center justify-center px-4 bg-black/40 z-50">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden border border-zinc-200">
            {/* Header */}
            <div className="bg-brand px-5 pt-2 pb-2">
              <div className="flex flex-row items-center justify-center mb-3">
                <button
                  onClick={() => setShowCartModal(false)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <X size={18} color="#fff" />
                </button>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3">
              {/* المواد المختارة */}
              <div className="rounded-2xl border border-zinc-100 overflow-hidden">
                <div className="flex flex-row items-center gap-2 px-3.5 py-2 bg-brand">
                  <span className="text-xs font-arabic text-white">
                    المواد المختارة
                  </span>
                </div>
                <div className="max-h-[120px] overflow-y-auto">
                  <div className="px-3.5 py-3 flex flex-col gap-2" dir="rtl">
                    {cart.map((e) => (
                      <div
                        key={e.ID}
                        className="flex flex-row items-center justify-between"
                      >
                        <span className="text-zinc-700 text-[13px] font-arabic flex-1">
                          {e.name}
                        </span>
                        <span className="text-zinc-500 font-arabic text-[13px]">
                          {e.price} ل.س
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* طريقة الدفع */}
              <div className="rounded-2xl border border-zinc-100 overflow-hidden">
                <div className="flex flex-row items-center gap-2 px-3.5 py-2 bg-brand">
                  <span className="text-xs font-arabic text-white">
                    طريقة الدفع
                  </span>
                </div>
                <div className="px-3.5 py-3 flex flex-col gap-2.5">
                  <div className="flex flex-row items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-brand mt-0.5 shrink-0" />
                    <span className="text-zinc-700 font-arabic text-[13px] leading-snug flex-1">
                      حوّل مبلغ{" "}
                      <span className="font-arabic text-zinc-900">
                        {totalPrice} ل.س
                      </span>{" "}
                      على شام كاش إلى هذا الحساب
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-4 justify-center pt-1.5">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          "83c6c514cecf088aab7d9d9f0337ca35",
                        )
                      }
                      className="px-2.5 py-1 rounded-md border border-zinc-500"
                    >
                      <span className="text-zinc-500 font-arabic text-[11px]">
                        نسخ رمز الحساب
                      </span>
                    </button>
                    <button
                      onClick={() => set_show_sham_cash_parcode_modal(true)}
                      className="px-2.5 py-1 rounded-md border border-zinc-500"
                    >
                      <span className="text-zinc-500 font-arabic text-[11px]">
                        إظهار الباركود
                      </span>
                    </button>
                  </div>
                  {[
                    "بعد التحويل يظهر في الفاتورة (رسالة التحويل) رقم يسمى رقم العملية",
                    "أدخل آخر 4 أرقام فقط من رقم العملية في الحقل أدناه",
                    "اضغط تأكيد وسيتم التسجيل في أسرع وقت",
                  ].map((step, i) => (
                    <div key={i} className="flex flex-row items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-brand mt-0.5 shrink-0" />
                      <span className="text-zinc-600 text-[13px] font-arabic leading-snug flex-1">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input */}
              <input
                value={transactionNumber}
                onChange={(e) => setTransactionNumber(e.target.value)}
                placeholder="أدخل هنا"
                className="bg-zinc-50 border font-arabic border-zinc-100 rounded-xl px-4 py-3 text-lg text-zinc-900 text-center outline-none w-full"
              />
              {/* Input */}
              <input
                value={note}
                onChange={(e) => set_note(e.target.value)}
                placeholder="ملاحظات (اختياري)"
                className="bg-zinc-50 border font-arabic border-zinc-100 rounded-xl px-4 py-3 text-lg text-zinc-900 text-center outline-none w-full"
              />
              {/* Submit */}
              <button
                onClick={handleCartSubmit}
                disabled={requestLoading}
                className={`rounded-xl py-3 flex items-center justify-center ${requestLoading ? "bg-brand/50" : "bg-brand"}`}
              >
                <span className="text-white text-sm font-arabic">
                  {requestLoading ? "جاري الإرسال..." : "تأكيد"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sham Cash Parcode Modal ── */}
      {show_sham_cash_parcode_modal && (
        <div className="fixed inset-0 flex items-center justify-center px-4 bg-black/40 z-50">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden border border-zinc-200">
            {/* Header */}
            <div className="bg-brand px-5 pt-2 pb-2">
              <div className="flex flex-row items-center justify-center mb-3">
                <button
                  onClick={() => set_show_sham_cash_parcode_modal(false)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <X size={18} color="#fff" />
                </button>
              </div>
            </div>
            <div className="p-5 flex items-center justify-center bg-brand">
              <img
                src="/public/sham_cash.jpg"
                alt="sham cash barcode"
                style={{ width: "100%", height: 350, objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectSelection;
