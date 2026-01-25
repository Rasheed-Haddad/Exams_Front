import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingGlow from "./LoadingGlow";
import { get_rank, get_student_info } from "../store/slices/authSlice";
import { mockColleges, mockUniversities } from "../store/slices/selectionSlice";
import {
  ArrowBigRight,
  BriefcaseBusiness,
  TrendingDown,
  User,
  GraduationCap,
  Trophy,
  Medal,
} from "lucide-react";
import { Analytics } from "@mui/icons-material";

// Helper function to get university name
const getUniversityName = (collegeId) => {
  for (const [univId, colleges] of Object.entries(mockColleges)) {
    const college = colleges.find((c) => c.id == String(collegeId));
    if (college) {
      const university = mockUniversities.find((u) => u.id == univId);
      return university?.name || "غير محدد";
    }
  }
  return "غير محدد";
};

// Helper function to get college name
const getCollegeName = (collegeId) => {
  for (const colleges of Object.values(mockColleges)) {
    const college = colleges.find((c) => c.id === String(collegeId));
    if (college) {
      return college.name;
    }
  }
  return "غير محدد";
};

// Skeleton Loader Component
const SkeletonBox = ({ width = "100%", height = 32 }) => (
  <div
    className="bg-gray-200 rounded-lg overflow-hidden animate-pulse"
    style={{
      width: typeof width === "number" ? `${width}px` : width,
      height: `${height}px`,
    }}
  >
    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
  </div>
);

// Skeleton for Leaderboard Card
const LeaderboardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <SkeletonBox width={40} height={40} />
        <div className="flex-1 space-y-2">
          <SkeletonBox width="60%" height={20} />
          <SkeletonBox width="40%" height={16} />
        </div>
      </div>
      <SkeletonBox width={60} height={32} />
    </div>
  </div>
);

// Medal Icon Component
const MedalIcon = ({ rank }) => {
  const colors = {
    1: "#FFD700", // Gold
    2: "#C0C0C0", // Silver
    3: "#CD7F32", // Bronze
  };

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${
        rank <= 3 ? "" : "bg-gray-100"
      }`}
      style={rank <= 3 ? { backgroundColor: colors[rank] } : {}}
    >
      {rank <= 3 ? (
        <Trophy size={20} color="#fff" />
      ) : (
        <span className="text-gray-600 font-bold text-sm">#{rank}</span>
      )}
    </div>
  );
};

// Leaderboard Card Component
const LeaderboardCard = ({ student, isCurrentUser }) => {
  const universityName = student.college_id
    ? getUniversityName(student.college_id)
    : null;
  const collegeName = student.college_id
    ? getCollegeName(student.college_id)
    : null;

  return (
    <div className="animate-fadeIn">
      <div
        className={`bg-white rounded-2xl p-4 mb-3 border-2 transition-all duration-300 ${
          isCurrentUser
            ? "border-[#8c52ff] shadow-lg"
            : "border-gray-100 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Left Section: Rank + Info */}
          <div className="flex items-center gap-3 flex-1">
            <MedalIcon rank={student.rank} />

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-lg font-bold ${
                    isCurrentUser ? "text-[#8c52ff]" : "text-gray-800"
                  }`}
                >
                  {student.nick_name || student.name}
                </span>
                {isCurrentUser && (
                  <div className="bg-[#8c52ff] px-2 py-0.5 rounded-full">
                    <span className="text-white text-xs font-bold">أنت</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Medal size={14} color="#6B7280" />
                  <span className="text-xs text-gray-500">{student.badge}</span>
                </div>

                {collegeName && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1">
                      <GraduationCap size={14} color="#6B7280" />
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {collegeName}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {universityName && (
                <div className="flex items-center gap-1 mt-1">
                  <BriefcaseBusiness size={12} color="#9ca3af" />
                  <span className="text-xs text-gray-400 truncate max-w-[200px]">
                    {universityName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Points */}
          <div className="flex flex-col items-end">
            <div className="bg-gradient-to-br from-[#8c52ff]/10 to-[#8c52ff]/20 px-4 py-2 rounded-full border border-[#8c52ff]/30">
              <span className="text-[#8c52ff] font-bold text-lg">
                {student.points}
              </span>
            </div>
            <span className="text-xs text-gray-400 mt-1">نقطة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  const handle_back = () => {
    navigate("/subject");
  };

  const student_scores = user?.scores?.map((s) => Number(s.score) || 0) || [];

  const GPA =
    student_scores.length > 0
      ? student_scores.reduce((a, b) => a + b, 0) / student_scores.length
      : 0;

  useEffect(() => {
    if (user?.ID) {
      dispatch(get_student_info({ ID: user.ID }));
      dispatch(get_rank({ ID: user.ID }));
    }
  }, [user?.ID, dispatch]);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  if (!user) {
    return <LoadingGlow />;
  }

  return (
    <div className="flex-1 font-arabic bg-gray-50 min-h-screen">
      {/* Header with Tabs */}
      <div className="bg-[#8c52ff] shadow-2xl px-6 pt-12 pb-4 rounded-b-[32px]">
        {/* Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "profile"
                ? "bg-white"
                : "bg-white/20 backdrop-blur-lg"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User
                size={30}
                color={activeTab === "profile" ? "#8c52ff" : "#fff"}
              />
            </div>
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "leaderboard"
                ? "bg-white"
                : "bg-white/20 backdrop-blur-lg"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy
                size={30}
                color={activeTab === "leaderboard" ? "#8c52ff" : "#fff"}
              />
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 -mt-4 overflow-y-auto">
        {activeTab === "profile" ? (
          // Profile View
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-6">
            {/* User Info Header */}
            <div className="bg-gradient-to-br from-[#8c52ff]/5 to-[#8c52ff]/10 px-6 py-6 border-b border-gray-100">
              <div className="flex flex-col items-center">
                <span className="text-gray-800 text-2xl font-bold mb-1">
                  {user.name}
                </span>
                <div className="bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-gray-600 text-sm">{user.ID}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              {/* الاسم المستعار */}
              <div className="w-full bg-gradient-to-br from-[#8c52ff]/10 to-[#8c52ff]/20 rounded-xl p-3 border border-[#8c52ff]/30 mb-3">
                <div className="flex items-center justify-center mb-1">
                  <span className="text-sm font-medium text-gray-600 mr-2">
                    الاسم المستعار
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#8c52ff] text-center">
                  {user.nick_name || "John Doe"}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="space-y-3">
                {/* المعدل */}
                <div className="bg-gradient-to-br from-[#8c52ff]/10 to-[#8c52ff]/20 rounded-xl p-3 border border-[#8c52ff]/30">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-sm font-medium text-gray-600 mr-2">
                      المعدل
                    </span>
                  </div>
                  <div className="flex items-center justify-center min-h-[36px]">
                    {loading ? (
                      <SkeletonBox width={120} height={36} />
                    ) : (
                      <span className="text-3xl font-extrabold text-[#8c52ff] text-center">
                        {GPA.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* النقاط والرتبة - صف واحد */}
                <div className="flex gap-3">
                  <div className="flex-1 bg-gradient-to-br from-[#8c52ff]/10 to-[#8c52ff]/20 rounded-xl p-3 border border-[#8c52ff]/30">
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-sm font-medium text-gray-600 mr-2">
                        النقاط
                      </span>
                    </div>
                    <div className="flex items-center justify-center min-h-[36px]">
                      {loading ? (
                        <SkeletonBox width={80} height={36} />
                      ) : (
                        <span className="text-2xl font-extrabold text-[#8c52ff] text-center">
                          {user.points}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 bg-gradient-to-br from-[#8c52ff]/10 to-[#8c52ff]/20 rounded-xl p-3 border border-[#8c52ff]/30">
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-sm font-medium text-gray-600 mr-2">
                        الرتبة
                      </span>
                    </div>
                    <div className="flex items-center justify-center min-h-[36px]">
                      {loading ? (
                        <SkeletonBox width={100} height={36} />
                      ) : (
                        <span className="text-2xl font-extrabold text-[#8c52ff] text-center">
                          {user.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* الترتيب على الموقع */}
                <div className="bg-gradient-to-br from-[#8c52ff]/10 to-[#8c52ff]/20 rounded-xl p-3 border border-[#8c52ff]/30">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-sm font-medium text-gray-600 mr-2">
                      الترتيب على الموقع
                    </span>
                  </div>
                  <div className="flex items-center justify-center min-h-[36px]">
                    {loading ? (
                      <SkeletonBox width={80} height={36} />
                    ) : (
                      <span className="text-3xl font-extrabold text-[#8c52ff] text-center">
                        #{user.rank}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-300 my-4" />

              {/* زر العودة */}
              <button
                className="w-full bg-[#8c52ff] rounded-xl py-3 flex items-center justify-center hover:bg-[#7a42e6] transition-colors duration-300"
                onClick={handle_back}
              >
                <span className="text-white text-lg mr-2 font-semibold">
                  عودة
                </span>
              </button>
            </div>
          </div>
        ) : (
          // Leaderboard View
          <div className="my-6">
            {/* Leaderboard List */}
            {loading || !user.top10Students ? (
              <div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <LeaderboardSkeleton key={i} />
                ))}
              </div>
            ) : user.top10Students.length > 0 ? (
              <div>
                {user.top10Students.map((student) => (
                  <LeaderboardCard
                    key={student.ID}
                    student={student}
                    isCurrentUser={student.ID == user.ID}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 flex flex-col items-center">
                <span className="text-lg font-bold text-gray-800 mb-2 text-center">
                  لا توجد بيانات متاحة
                </span>
                <span className="text-sm text-gray-500 text-center">
                  لم يتم العثور على طلاب في المتصدرين
                </span>
              </div>
            )}

            {/* Back Button */}
            <button
              className="w-full bg-[#8c52ff] rounded-xl py-3 flex items-center justify-center mt-6 hover:bg-[#7a42e6] transition-colors duration-300"
              onClick={handle_back}
            >
              <span className="text-white text-lg mr-2 font-semibold">
                عودة
              </span>
            </button>
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
