import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // بدلاً من expo-router
import ErrorHelperModal from "./ErrorHelperModal";
import { clearError, initializeAuth, signIn } from "../store/slices/authSlice";

const SignIn = () => {
  const [userType, setUserType] = useState("student");
  const [studentData, setStudentData] = useState({
    name: "",
    nick_name: "",
    ID: "",
    password: "",
  });
  const [teacherData, setTeacherData] = useState({
    name: "",
    phone_number: "",
    password: "",
  });
  const [showErrorModal, setShowErrorModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user, isInitialized } = useSelector(
    (state) => state.auth,
  );

  // تهيئة التطبيق عند أول تحميل
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // التوجيه التلقائي إذا كان المستخدم مسجل دخول
  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      // توجيه المستخدم حسب نوعه
      if (user.role === "teacher") {
        navigate("/admin");
      } else {
        navigate("/university");
      }
    }
  }, [isInitialized, isAuthenticated, user, navigate]);

  // إظهار الـ Modal عند حدوث خطأ
  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleStudentChange = (name, value) => {
    setStudentData({
      ...studentData,
      [name]: value,
    });
  };

  const handleTeacherChange = (name, value) => {
    setTeacherData({
      ...teacherData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (userType === "student") {
      // استدعاء API تسجيل دخول الطالب
      dispatch(signIn({ ...studentData, user_type: "student" }));
    } else {
      // استدعاء API تسجيل دخول المدرس
      dispatch(signIn({ ...teacherData, user_type: "teacher" }));
    }
  };

  const switchUserType = (type) => {
    setUserType(type);
    dispatch(clearError());
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    dispatch(clearError());
  };

  // عرض شاشة تحميل أثناء التهيئة
  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full justify-center items-center bg-[#8c52ff]">
        <div className="flex flex-col items-center">
          {/* ActivityIndicator بديل */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white font-arabic text-lg mt-4">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا كان المستخدم مسجل دخول، لا تعرض صفحة التسجيل
  if (isAuthenticated && user) {
    return (
      <div className="flex h-screen w-full justify-center items-center bg-[#8c52ff]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white font-arabic text-lg mt-4">
            جاري تحميل الصفحة الرئيسية...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-[#8c52ff]"
      style={{ direction: "rtl" }}
    >
      <div className="flex-1 overflow-y-auto bg-[#8c52ff]/10 p-4 flex flex-col items-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg mt-10">
          {/* اختيار نوع المستخدم - تم إبقاء الكود المعلق كما هو مع تحويله */}
          {/* 
          <div className="flex flex-row mb-6 bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-3 rounded-lg transition-colors ${
                userType === "student" ? "bg-[#8c52ff] text-white" : "bg-transparent text-gray-600"
              }`}
              onClick={() => switchUserType("student")}
            >
              <span className="text-center font-arabic text-base ">
                طالب
              </span>
            </button>

            <button
              className={`flex-1 py-3 rounded-lg transition-colors ${
                userType === "teacher" ? "bg-[#8c52ff] text-white" : "bg-transparent text-gray-600"
              }`}
              onClick={() => switchUserType("teacher")}
            >
              <span className="text-center font-arabic text-base ">
                مدرس
              </span>
            </button>
          </div> 
          */}

          <form onSubmit={handleSubmit}>
            {/* نموذج الطالب */}
            {userType === "student" && (
              <div className="flex flex-col gap-y-4">
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-4 font-arabic text-right placeholder-[#8c52ff] outline-none focus:ring-2 focus:ring-[#8c52ff]/50"
                    value={studentData.name}
                    onChange={(e) =>
                      handleStudentChange("name", e.target.value)
                    }
                    placeholder=" الاسم والكنية باللغة العربية"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full border border-gray-300 font-arabic rounded-lg p-4 text-right placeholder-[#8c52ff] outline-none focus:ring-2 focus:ring-[#8c52ff]/50"
                    value={studentData.nick_name}
                    onChange={(e) => {
                      const value = e.target.value;
                      const filteredValue = value.replace(/[^ء-ي]/g, "");
                      if (filteredValue.length <= 10) {
                        handleStudentChange("nick_name", filteredValue);
                      }
                    }}
                    maxLength={10}
                    placeholder=" الاسم المستعار (يظهر للآخرين)"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full border font-arabic border-gray-300 rounded-lg p-4 text-left placeholder-[#8c52ff] outline-none focus:ring-2 focus:ring-[#8c52ff]/50"
                    value={studentData.ID}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleStudentChange("ID", value);
                      }
                    }}
                    placeholder=" الرقم الجامعي"
                  />
                </div>

                <div className="mb-6">
                  <input
                    className="w-full border font-arabic border-gray-300 rounded-lg p-4 text-left placeholder-[#8c52ff] outline-none focus:ring-2 focus:ring-[#8c52ff]/50"
                    value={studentData.password}
                    onChange={(e) =>
                      handleStudentChange("password", e.target.value)
                    }
                    placeholder="كلمة المرور"
                  />
                </div>
              </div>
            )}

            {/* نموذج المدرس */}
            {userType === "teacher" && (
              <div className="flex flex-col gap-y-4">
                <div className="mb-4">
                  <label className="block text-sm text-[#8c52ff] mb-2 font-arabic">
                    الاسم والكنية باللغة العربية
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-4 font-arabic text-right outline-none focus:ring-2 focus:ring-[#8c52ff]/50"
                    value={teacherData.name}
                    onChange={(e) =>
                      handleTeacherChange("name", e.target.value)
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-[#8c52ff] mb-2 font-arabic">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 font-arabic rounded-lg p-4 text-right outline-none focus:ring-2 focus:ring-[#8c52ff]/50"
                    value={teacherData.phone_number}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleTeacherChange("phone_number", value);
                      }
                    }}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-[#8c52ff] mb-2 font-arabic">
                    كلمة المرور
                  </label>
                  <input
                    className="w-full border font-arabic border-gray-300 rounded-lg p-4 text-right outline-none focus:ring-2 focus:ring-[#8c52ff]/50"
                    value={teacherData.password}
                    onChange={(e) =>
                      handleTeacherChange("password", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* زر التأكيد */}
            <button
              type="submit"
              className={`w-full h-12 rounded-lg flex items-center justify-center transition-opacity ${
                loading
                  ? "bg-[#8c52ff]/70 cursor-not-allowed"
                  : "bg-[#8c52ff] hover:opacity-90"
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <span className="text-white font-arabic text-lg">
                  تسجيل الدخول
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Error Helper Modal */}
      <ErrorHelperModal
        visible={showErrorModal}
        onClose={handleCloseErrorModal}
        errorMessage={error || ""}
        screenType="signin"
      />
    </div>
  );
};

export default SignIn;
