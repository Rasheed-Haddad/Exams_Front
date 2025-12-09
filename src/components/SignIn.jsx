import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, signIn, initializeAuth } from "../store/slices/authSlice";

const SignIn = () => {
  const navigate = useNavigate();
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
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  // 🔥 تحميل البيانات من localStorage عند فتح الصفحة
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // 🔥 التوجيه بعد التحميل
  useEffect(() => {
    if (isAuthenticated && user) {
      const path = user.role === "teacher" ? "/admin" : "/university";
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

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
    e.preventDefault();
    if (userType === "student") {
      dispatch(signIn({ ...studentData, user_type: "student" }));
    } else {
      dispatch(signIn({ ...teacherData, user_type: "teacher" }));
    }
  };

  const switchUserType = (type) => {
    setUserType(type);
    dispatch(clearError());
  };

  return (
    <div
      className="min-h-screen font-arabic flex flex-col bg-[#8c52ff]"
      dir="rtl"
    >
      <div className="flex-1 overflow-auto">
        <div className="min-h-full flex justify-start items-center p-4 bg-[#8c52ff]/10">
          <div className="w-full max-w-md mt-12 bg-white rounded-2xl p-8 shadow-lg mx-auto">
            {/* اختيار نوع المستخدم */}
            <div className="flex flex-row mb-6 bg-gray-100 rounded-lg p-1">
              <button
                className={`flex-1 py-3 rounded-lg transition-colors ${
                  userType === "student" ? "bg-[#8c52ff]" : "bg-transparent"
                }`}
                onClick={() => switchUserType("student")}
                type="button"
              >
                <span
                  className={`text-center text-base ${
                    userType === "student" ? "text-white" : "text-gray-600"
                  }`}
                >
                  طالب
                </span>
              </button>

              <button
                className={`flex-1 py-3 rounded-lg transition-colors ${
                  userType === "teacher" ? "bg-[#8c52ff]" : "bg-transparent"
                }`}
                onClick={() => switchUserType("teacher")}
                type="button"
              >
                <span
                  className={`text-center text-base font-semibold ${
                    userType === "teacher" ? "text-white" : "text-gray-600"
                  }`}
                >
                  مدرس
                </span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            )}

            {/* نموذج الطالب */}
            {userType === "student" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm text-[#8c52ff] mb-2">
                    الاسم والكنية باللغة العربية
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-4 text-right"
                    value={studentData.name}
                    onChange={(e) =>
                      handleStudentChange("name", e.target.value)
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-[#8c52ff] mb-2">
                    الاسم المستعار (يظهر للآخرين)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-4 text-right"
                    value={studentData.nick_name}
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(
                        /[^ء-ي]/g,
                        ""
                      );
                      if (filteredValue.length <= 10) {
                        handleStudentChange("nick_name", filteredValue);
                      }
                    }}
                    maxLength={10}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-[#8c52ff] mb-2">
                    الرقم الجامعي
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-4 text-right"
                    value={studentData.ID}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        handleStudentChange("ID", e.target.value);
                      }
                    }}
                    inputMode="numeric"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-[#8c52ff] mb-2">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    className="w-full border mb-6 border-gray-300 rounded-lg p-4 text-right"
                    value={studentData.password}
                    onChange={(e) =>
                      handleStudentChange("password", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* نموذج المدرس */}
            {userType === "teacher" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm text-[#8c52ff] mb-2">
                    الاسم والكنية باللغة العربية
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-4 text-right"
                    value={teacherData.name}
                    onChange={(e) =>
                      handleTeacherChange("name", e.target.value)
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-[#8c52ff] mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg p-4 text-right"
                    value={teacherData.phone_number}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        handleTeacherChange("phone_number", e.target.value);
                      }
                    }}
                    inputMode="tel"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-brand mb-2">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    className="w-full border mb-6 border-gray-300 rounded-lg p-4 text-right"
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
              className={`w-full h-12 rounded-lg flex items-center justify-center transition-colors ${
                loading ? "bg-[#8c52ff]/70" : "bg-[#8c52ff]"
              }`}
              onClick={handleSubmit}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-white text-lg font-semibold">
                  تسجيل الدخول
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
