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
import LoadingGlow from "./LoadingGlow";

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
            <span className="text-brand  font-arabic font-arabic text-lg">
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
            <div className="text-2xl font-arabic text-brand font-arabic">
              {user.nick_name || "John Doe"}
            </div>
          </div>

          {loading ? (
            <LoadingGlow />
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
