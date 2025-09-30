import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { get_rank } from "../store/slices/authSlice";
import { get_student_info } from "../store/slices/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const handle_back = () => {
    navigate("/subject");
  };
  const student_scores = user?.scores?.map((s) => Number(s.score) || 0) || [];

  const GPA =
    student_scores.length > 0
      ? student_scores.reduce((a, b) => a + b, 0) / student_scores.length
      : 0;

  useEffect(() => {
    dispatch(get_student_info({ ID: Number(user.ID) }));
    dispatch(get_rank({ ID: Number(user.ID) }));
  }, []);

  return (
    <div
      dir="rtl"
      className="flex justify-center items-start min-h-screen bg-gray-50 p-6"
    >
      <Card className="w-full max-w-md shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
        <CardHeader
          title={
            <span className="text-brand  font-arabic font-bold text-lg">
              {user.name}
            </span>
          }
          subheader={
            <span className="text-gray-500  font-arabic">
              الرقم الجامعي : {user.ID}
            </span>
          }
          className="bg-brand/10 px-6 py-4 "
        />
        <CardContent className="space-y-6 px-6 py-4">
          {/* الاسم المستعار */}

          <div className="w-full text-center bg-gradient-to-br from-brand/10 to-brand/20 rounded-xl p-1 border border-brand/30 mt-4">
            <p className="text-sm font-medium text-gray-600 mb-1 font-arabic">
              الاسم المستعار
            </p>
            <div className="text-2xl font-bold text-brand font-arabic">
              {user.nick_name || "John Doe"}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center mt-32">
              <h1 className="glow-text">قدها وقدود</h1>

              <style jsx>{`
                .glow-text {
                  font-size: 3rem;
                  font-weight: 100;
                  color: #8c52ff;
                  animation: glow 1.5s ease-in-out infinite,
                    float 3s ease-in-out infinite;
                }

                @keyframes glow {
                  0%,
                  100% {
                    text-shadow: 0 0 5px #8c52ff, 0 0 10px #8c52ff,
                      0 0 20px #8c52ff;
                  }
                  50% {
                    text-shadow: 0 0 15px #8c52ff, 0 0 30px #8c52ff,
                      0 0 45px #8c52ff;
                  }
                }

                @keyframes float {
                  0%,
                  100% {
                    transform: translateY(0);
                  }
                  50% {
                    transform: translateY(-20px); /* نزول وطلوع أوضح */
                  }
                }
              `}</style>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center w-full">
              {/* المعدل */}
              <div className="mt-4 w-full bg-gradient-to-br from-brand/10 to-brand/20 rounded-xl p-2 border border-brand/30">
                <p className="text-sm font-medium text-gray-600 mb-1">المعدل</p>
                <div className="text-3xl font-extrabold text-brand">
                  {GPA.toFixed(2)}
                </div>
              </div>

              {/* النقاط */}
              <div className="mt-1 w-full bg-gradient-to-br from-brand/10 to-brand/20 rounded-xl p-2 border border-brand/30">
                <p className="text-sm font-medium text-gray-600 mb-1">النقاط</p>
                <div className="text-3xl font-extrabold text-brand">
                  {user.points}
                </div>
              </div>

              {/* الرتبة */}
              <div className="mt-1 w-full bg-gradient-to-br from-brand/10 to-brand/20 rounded-xl p-2 border border-brand/30">
                <p className="text-sm font-medium text-gray-600 mb-1">الرتبة</p>
                <div className="text-3xl font-extrabold text-brand">
                  {user.badge}
                </div>
              </div>

              {/* الترتيب على الموقع */}
              <div className="mt-1 w-full bg-gradient-to-br from-brand/10 to-brand/20 rounded-xl p-2 border border-brand/30">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  الترتيب على الموقع
                </p>
                <div className="text-3xl font-extrabold text-brand">
                  #{user.rank}
                </div>
              </div>
            </div>
          )}

          <Divider />

          {/* الدرجات */}
          {/*<div>
            <span className="font-arabic text-xl text-gray-700 block mb-3">
              الدرجات :
            </span>
            {user.scores && user.scores.length > 0 ? (
              <ul className="space-y-3">
                {user.scores.map((s, index) => (
                  <li
                    key={index}
                    className="p-3 border rounded-lg bg-brand/5 hover:bg-brand/10 transition-colors duration-200 flex justify-between items-center"
                  >
                    <span className="font-arabic text-brand">
                      {s.subject_id}
                    </span>
                    <span className="font-arabic text-brand">
                      {s.score.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="font-arabic text-brand">لا توجد درجات بعد</span>
            )}
          </div>*/}

          {/* زر العودة */}
          <Button
            variant="contained"
            onClick={handle_back}
            className="bg-brand hover:bg-brand/90 mt-4 w-full"
            sx={{ backgroundColor: "#8C52FF" }}
          >
            <span className="font-arabic text-white text-lg">عودة</span>
          </Button>
          {/* 🔽 دليل النقاط */}
          <div className="text-right font-arabic mt-4 bg-gradient-to-br from-purple-50 to-yellow-50 rounded-xl p-2 shadow-inner">
            <ul className="space-y-2 text-base">
              <li className="flex justify-between items-center bg-white rounded-lg px-3 py-1 shadow-sm">
                <span>قدها وقدود</span>
                <span className="text-orange-600"> 10000+</span>
              </li>
              <li className="flex justify-between items-center bg-white rounded-lg px-3 py-1 shadow-sm">
                <span>كبير الحكماء</span>
                <span className="text-green-700"> 8000+</span>
              </li>
              <li className="flex justify-between items-center bg-white rounded-lg px-3 py-1 shadow-sm">
                <span>صائد العلامات</span>
                <span className="text-red-500"> 7000+</span>
              </li>
              <li className="flex justify-between items-center bg-white rounded-lg px-3 py-1 shadow-sm">
                <span>نيرد</span>
                <span className="text-pink-500"> 6000+</span>
              </li>
              <li className="flex justify-between items-center bg-white rounded-lg px-3 py-1 shadow-sm">
                <span>نخبة</span>
                <span className="text-indigo-500"> 5000+</span>
              </li>
              <li className="flex justify-between items-center bg-white rounded-lg px-3 py-1 shadow-sm">
                <span>متفوق</span>
                <span className="text-yellow-500"> 4000+</span>
              </li>
              <li className="flex justify-between items-center bg-white rounded-lg px-3 py-1 shadow-sm">
                <span>مميز</span>
                <span className="text-purple-500"> 3000+</span>
              </li>
              <li className="flex justify-between items-center bg-white rounded-lg px-3 py-1 shadow-sm">
                <span>مثابر</span>
                <span className="text-green-500"> 2000+</span>
              </li>
              <li className="flex justify-between items-center bg-white rounded-lg px-3 py-1 shadow-sm">
                <span>مبتدئ</span>
                <span className="text-blue-500"> 50+</span>
              </li>
              <li className="flex justify-between items-center bg-white rounded-lg px-3 py-1 shadow-sm">
                <span>فارش</span>
                <span className="text-gray-500"> أقل من 50</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
