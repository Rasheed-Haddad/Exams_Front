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
            <span className="text-brand font-arabic font-bold text-lg">
              {user.name}
            </span>
          }
          subheader={
            <span className="text-gray-500 font-arabic">
              الرقم الجامعي : {user.ID}
            </span>
          }
          className="bg-brand/10 px-6 py-4"
        />
        <CardContent className="space-y-6 px-6 py-4">
          {/* الاسم المستعار */}

          <div>
            <span className="font-arabic text-gray-700 block mb-1">
              الاسم المستعار :
            </span>
            <span className="text-gray-600 font-arabic">
              {user.nick_name || "John Doe"}
            </span>
          </div>
          {loading ? (
            <div className="bg-gray-50 flex items-center justify-center">
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
                    transform: translateY(-5px);
                  }
                }
              `}</style>
            </div>
          ) : (
            <div className="grid grid-rows-4 gap-4">
              {/* المعدل */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 font-arabic">
                  المعدل :
                </span>

                <Chip
                  variant="outlined"
                  label={
                    <span className="font-arabic text-brand">
                      {GPA.toFixed(2)}
                    </span>
                  }
                  className="border-brand"
                  sx={{ borderWidth: 2 }}
                />
              </div>

              {/* النقاط */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 font-arabic">
                  النقاط :
                </span>

                <Chip
                  variant="outlined"
                  label={
                    <span className="font-arabic text-brand">
                      {user.points}
                    </span>
                  }
                  className="border-brand"
                  sx={{ borderWidth: 2 }}
                />
              </div>

              {/* الرتبة */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 font-arabic">
                  الرتبة :
                </span>

                <Chip
                  variant="outlined"
                  label={
                    <span className="font-arabic text-brand">{user.badge}</span>
                  }
                  className="border-brand"
                  sx={{ borderWidth: 2 }}
                />
              </div>

              {/* الترتيب على الموقع */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 font-arabic">
                  الترتيب على الموقع :
                </span>

                <Chip
                  variant="outlined"
                  label={
                    <span className="font-arabic text-brand">
                      # {user.rank}
                    </span>
                  }
                  className="border-brand"
                  sx={{ borderWidth: 2 }}
                />
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
                    <span className="font-arabic text-brand">{s.score}</span>
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
        </CardContent>
      </Card>
    </div>
  );
}
