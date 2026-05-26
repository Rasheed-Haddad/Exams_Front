import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, initializeAuth, signIn } from "../store/slices/authSlice";
import { replace, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: "",
    nick_name: "",
    ID: "",
    password: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const justSignedIn = useRef(false);

  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user, isInitialized } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized && isAuthenticated && user && !error) {
      // ← أضف !error
      if (justSignedIn.current) {
        justSignedIn.current = false;
        setShowPasswordModal(true);
      } else {
        navigate("/university", { replace: true });
      }
    }
  }, [isInitialized, isAuthenticated, user, error]); // ← أضف error

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const getDeviceId = async () => {
    return navigator.userAgent || "unknown";
  };

  const handleStudentChange = (name, value) => {
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = async () => {
    dispatch(clearError());
    const device_id = await getDeviceId();
    justSignedIn.current = true;
    dispatch(signIn({ ...studentData, user_type: "student", device_id }));
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(studentData.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasswordModalConfirm = () => {
    setShowPasswordModal(false);
    navigate("/university", { replace: true });
  };

  if (!isInitialized) {
    return (
      <div className="flex-1 flex justify-center items-center bg-[#8c52ff] min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-white text-lg">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user && !showPasswordModal) {
    return (
      <div className="flex-1 flex justify-center items-center bg-[#8c52ff] min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-white text-lg">
            جاري تحميل الصفحة الرئيسية...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        dir="rtl"
        className="flex-1 min-h-screen bg-[#8c52ff] overflow-y-auto"
      >
        <div className="flex justify-center items-center px-5 min-h-screen bg-[#8c52ff]">
          <div className="w-full max-w-sm bg-brand px-7 py-9">
            {/* ─── بانر الخطأ ─── */}
            {error && (
              <div className="flex flex-row items-center bg-red-50 border border-red-300 rounded-xl px-4 py-3 mb-5">
                <span className="text-red-500 text-lg ml-2">⚠️</span>
                <span className="text-red-600 font-arabic text-sm text-right flex-1 leading-5">
                  {error}
                </span>
              </div>
            )}

            {/* الاسم والكنية */}
            <div className="mb-4">
              <input
                className="w-full border border-[#8c52ff]/25 rounded-xl font-arabic px-4 py-3 text-center bg-white text-[#3a3a3a] outline-none"
                value={studentData.name}
                onChange={(e) => handleStudentChange("name", e.target.value)}
                placeholder="الاسم والكنية"
              />
            </div>

            {/* الاسم المستعار */}
            <div className="mb-4">
              <input
                className="w-full border font-arabic border-[#8c52ff]/25 rounded-xl px-4 py-3 text-center bg-white text-[#3a3a3a] outline-none"
                value={studentData.nick_name}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/[^ء-ي]/g, "");
                  if (filtered.length <= 10)
                    handleStudentChange("nick_name", filtered);
                }}
                maxLength={10}
                placeholder="الاسم المستعار (يظهر للآخرين)"
              />
            </div>

            {/* الرقم الجامعي */}
            <div className="mb-4">
              <input
                className="w-full border font-arabic border-[#8c52ff]/25 rounded-xl px-4 py-3 text-center bg-white text-[#3a3a3a] outline-none"
                value={studentData.ID}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value))
                    handleStudentChange("ID", e.target.value);
                }}
                inputMode="numeric"
                placeholder="الرقم الجامعي"
              />
            </div>

            {/* كلمة المرور */}
            <div className="mb-8">
              <input
                className="w-full border font-arabic border-[#8c52ff]/25 rounded-xl px-4 py-3 text-center bg-white text-[#3a3a3a] outline-none"
                value={studentData.password}
                onChange={(e) =>
                  handleStudentChange("password", e.target.value)
                }
                placeholder="ضع كلمة مرور وتذكرها جيدا"
              />
            </div>

            {/* زر التأكيد */}
            <button
              className="w-full font-arabic h-13 rounded-xl flex items-center justify-center py-3.5 bg-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#8c52ff] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-brand text-base font-arabic">دخول</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* مودال تذكير كلمة المرور */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 flex justify-center items-center px-6 z-50"
          style={{ backgroundColor: "rgba(140,82,255,0.55)" }}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl px-7 py-8"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
          >
            <p className="text-center text-4xl mb-3">🔑</p>
            <p className="text-[#8c52ff] text-xl text-center mb-2">
              احفظ كلمة المرور
            </p>
            <p className="text-[#8c52ff]/60 text-sm text-center mb-6 leading-6">
              قد تضطر لحذف حسابك في حال نسيانها
              <br />
              تأكد من حفظها الآن
            </p>

            <div className="flex flex-row items-center justify-between bg-[#8c52ff]/8 border border-[#8c52ff]/20 rounded-2xl px-4 py-3 mb-6">
              <button
                onClick={handleCopyPassword}
                className="bg-[#8c52ff] rounded-lg px-4 py-1.5"
              >
                <span className="text-white text-sm">
                  {copied ? "تم النسخ ✓" : "نسخ"}
                </span>
              </button>
              <span className="text-[#8c52ff] text-base tracking-wider flex-1 text-right ml-3">
                {studentData.password}
              </span>
            </div>

            <button
              className="w-full bg-[#8c52ff] rounded-xl py-3.5 flex items-center justify-center"
              onClick={handlePasswordModalConfirm}
            >
              <span className="text-white text-base font-semibold">متابعة</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;
