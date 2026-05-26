import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_rank, get_student_info } from "../store/slices/authSlice";
import { mockColleges, mockUniversities } from "../store/slices/selectionSlice";
import { replace, useNavigate } from "react-router-dom";

// ─── Helpers ───────────────────────────────────────────────────────────────
const getUniversityName = (collegeId) => {
  for (const [univId, colleges] of Object.entries(mockColleges)) {
    const college = colleges.find((c) => c.id === String(collegeId));
    if (college) {
      const university = mockUniversities.find((u) => u.id === univId);
      return university?.name || "غير محدد";
    }
  }
  return "غير محدد";
};

const getCollegeName = (collegeId) => {
  for (const colleges of Object.values(mockColleges)) {
    const college = colleges.find((c) => c.id === String(collegeId));
    if (college) return college.name;
  }
  return "غير محدد";
};

// ─── Badge System ─────────────────────────────────────────────────────────
const BADGE_TIERS = [
  { label: "فارش", min: 0, max: 49, icon: "🥚", color: "#9CA3AF" },
  { label: "مبتدئ", min: 50, max: 999, icon: "🌱", color: "#6B7280" },
  { label: "مثابر", min: 1000, max: 2999, icon: "💪", color: "#3B82F6" },
  { label: "مميز", min: 3000, max: 3999, icon: "⭐", color: "#10B981" },
  { label: "متفوق", min: 4000, max: 4999, icon: "🏅", color: "#8B5CF6" },
  { label: "نخبة", min: 5000, max: 5999, icon: "🔥", color: "#F59E0B" },
  { label: "نيرد", min: 6000, max: 6999, icon: "🤓", color: "#6366F1" },
  {
    label: "صائد العلامات",
    min: 7000,
    max: 7999,
    icon: "🎯",
    color: "#EC4899",
  },
  { label: "كبير الحكماء", min: 8000, max: 9999, icon: "🧙‍♂️", color: "#F43F5E" },
  {
    label: "قدها وقدود",
    min: 10000,
    max: Infinity,
    icon: "👑",
    color: "#EF4444",
  },
];

const getBadgeTier = (points) =>
  BADGE_TIERS.find((t) => points >= t.min && points <= t.max) || BADGE_TIERS[0];

const getNextTier = (points) => {
  const idx = BADGE_TIERS.findIndex((t) => points >= t.min && points <= t.max);
  return idx < BADGE_TIERS.length - 1 ? BADGE_TIERS[idx + 1] : null;
};

// ─── Animated Progress Bar ──────────────────────────────────────────────────
const XPProgressBar = ({ points, loading }) => {
  const [width, setWidth] = useState(0);
  const tier = getBadgeTier(points || 0);
  const next = getNextTier(points || 0);
  const pct = next ? ((points - tier.min) / (next.min - tier.min)) * 100 : 100;

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setWidth(pct), 100);
    }
  }, [loading, pct]);

  return (
    <div className="mt-2" style={{ direction: "rtl" }}>
      <div className="flex flex-row justify-between items-center mb-2">
        <div className="flex flex-row items-center gap-1">
          <span className="text-[16px] font-arabic">{tier.icon}</span>
          <span
            className="text-[13px] font-arabic"
            style={{ color: tier.color }}
          >
            {tier.label}
          </span>
        </div>
        {next ? (
          <div className="flex flex-row items-center gap-1">
            <span className="text-gray-400 font-arabic text-[12px]">
              {next.min - (points || 0)} نقطة للـ
            </span>
            <span className="text-[14px] font-arabic">{next.icon}</span>
            <span
              className="text-[12px] font-arabic"
              style={{ color: next.color }}
            >
              {next.label}
            </span>
          </div>
        ) : (
          <span className="text-amber-500 text-[12px]">الحد الأقصى 👑</span>
        )}
      </div>
      {/* Track */}
      <div className="h-[10px] bg-gray-100 rounded-full overflow-hidden">
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            backgroundColor: tier.color,
            transition: "width 1.2s cubic-bezier(0.33,1,0.68,1)",
          }}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-row justify-between mt-1">
        <span className="text-gray-400 text-[10px]">{tier.min}</span>
        <span className="text-gray-400 text-[10px]">
          {next ? next.min : "MAX"}
        </span>
      </div>
    </div>
  );
};

// ─── Stat Card with count-up ────────────────────────────────────────────────
const AnimatedStatCard = ({
  icon,
  label,
  value,
  suffix = "",
  prefix = "",
  colorClass = "text-brand",
  bgClass = "bg-brand/10",
  borderClass = "border-brand/30",
  loading,
  large = false,
}) => {
  const [display, setDisplay] = useState(0);
  const [scale, setScale] = useState(0.8);
  const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;

  useEffect(() => {
    if (!loading && value !== undefined) {
      setScale(1);
      const duration = 1000;
      const steps = 40;
      const increment = numericValue / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplay(numericValue);
          clearInterval(interval);
        } else {
          setDisplay(current);
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }
  }, [loading, value]);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transition: "transform 0.4s",
        direction: "rtl",
      }}
      className={`flex-1 bg-[#FAFAFA] rounded-[16px] border-[1.5px] ${borderClass} p-[14px] flex flex-col items-center`}
    >
      <div
        className={`w-[36px] h-[36px] rounded-full ${bgClass} flex items-center justify-center mb-[6px]`}
      >
        <span className="text-[18px]  font-arabic ">{icon}</span>
      </div>
      <span className="text-[11px] font-arabic  text-gray-400 mb-[4px] text-center">
        {label}
      </span>
      {loading ? (
        <div
          className={`w-[60px] ${large ? "h-[32px]" : "h-[26px]"} bg-gray-200 rounded-[8px]`}
        />
      ) : (
        <span
          className={`${large ? "text-[26px]" : "text-[20px]"}  font-arabic  ${colorClass} text-center`}
        >
          {prefix}
          {suffix === " %"
            ? display.toFixed(1) + suffix
            : `${prefix}${value}${suffix}`}
        </span>
      )}
    </div>
  );
};

// ─── Pulse Skeleton ─────────────────────────────────────────────────────────
const PulseSkeleton = ({ width, height, radius = 8 }) => (
  <div
    style={{ width, height, borderRadius: radius }}
    className="bg-gray-200 animate-pulse"
  />
);

// ─── Rank Medal ─────────────────────────────────────────────────────────────
const RankMedal = ({ rank }) => {
  const medals = {
    1: { icon: "👑" },
    2: { icon: "🥈" },
    3: { icon: "🥉" },
  };
  const medal = medals[rank];
  return (
    <div
      style={{ direction: "rtl" }}
      className="w-[44px] h-[44px] rounded-full bg-gray-100 flex items-center justify-center"
    >
      {medal ? (
        <span className="text-[20px]">{medal.icon}</span>
      ) : (
        <span className="text-gray-500 text-[13px]">#{rank}</span>
      )}
    </div>
  );
};

// ─── Leaderboard Card ────────────────────────────────────────────────────────
const LeaderboardCard = ({ student, isCurrentUser, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), index * 60);
  }, []);

  const tier = getBadgeTier(student.points || 0);
  const university = getUniversityName(student.college_id);
  const college = getCollegeName(student.college_id);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        direction: "rtl",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(60px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        cursor: "pointer",
      }}
      className={`p-[14px] rounded-[20px] font-arabic mb-[10px] bg-white border ${
        isCurrentUser ? "border-brand" : "border-gray-100"
      }`}
    >
      {/* Main Content (Row) */}
      <div className="flex flex-row items-center">
        <RankMedal rank={index + 1} />
        <div className="flex-1 mr-[14px]">
          <div className="flex flex-row items-center gap-2">
            <span
              className={`text-[15px] ${isCurrentUser ? "text-brand" : "text-gray-800"}`}
            >
              {student.nick_name}
            </span>
            {isCurrentUser && (
              <div className="bg-brand/10 px-[6px] py-[2px] rounded-full">
                <span className="text-brand text-[10px]">أنت</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex flex-row items-center gap-1">
            <span className="text-brand text-[16px]">{student.points}</span>
            <span className="text-gray-400 text-[10px]">XP</span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <span className="text-[10px]">{tier.icon}</span>
            <span className="text-[10px]" style={{ color: tier.color }}>
              {tier.label}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col gap-3">
          <div className="flex flex-row justify-between items-start bg-gray-50/50 p-3 rounded-xl">
            <div className="flex flex-row items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-[14px]">🏛️</span>
              </div>
            </div>
            <span className="text-gray-800 text-[13px] text-right flex-1 ml-4">
              {university}
            </span>
          </div>

          <div className="flex flex-row justify-between items-start bg-gray-50/50 p-3 rounded-xl">
            <div className="flex flex-row items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                <span className="text-[14px]">🎓</span>
              </div>
            </div>
            <span className="text-gray-800 text-[13px] text-right flex-1 ml-4">
              {college}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Leaderboard Skeleton ────────────────────────────────────────────────────
const LeaderboardSkeleton = () => (
  <div
    style={{ direction: "rtl" }}
    className="flex flex-row items-center p-[14px] rounded-[20px] mb-[10px] bg-white border border-gray-100"
  >
    <PulseSkeleton width={44} height={44} radius={22} />
    <div className="flex-1 mr-[14px] flex flex-col gap-2">
      <PulseSkeleton width="60%" height={16} />
      <PulseSkeleton width="40%" height={12} />
    </div>
    <div className="flex flex-col items-end gap-2">
      <PulseSkeleton width={40} height={16} />
      <PulseSkeleton width={30} height={12} />
    </div>
  </div>
);

// ─── Main Profile Screen ────────────────────────────────────────────────────
export default function ProfileScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const { user, loading } = useSelector((state) => state.auth);
  const { requests } = useSelector((state) => state.exams);
  const [headerVisible, setHeaderVisible] = useState(false);

  const handle_back = () => navigate("/subject", replace);

  const student_scores = user?.scores?.map((s) => Number(s.score) || 0) || [];
  const GPA =
    student_scores.length > 0
      ? student_scores.reduce((a, b) => a + b, 0) / student_scores.length
      : 0;

  const tier = getBadgeTier(user?.points || 0);

  useEffect(() => {
    if (user?.ID) {
      dispatch(get_student_info({ ID: user.ID }));
      dispatch(get_rank({ ID: user.ID }));
    }
  }, [user?.ID, dispatch]);

  useEffect(() => {
    if (!user) navigate("/subject", replace);
  }, [user]);

  useEffect(() => {
    setTimeout(() => setHeaderVisible(true), 50);
  }, []);

  return (
    <div
      style={{ direction: "rtl" }}
      className="flex flex-col min-h-screen bg-brand"
    >
      {/* ── Header ── */}
      <div
        style={{
          transform: headerVisible ? "translateY(0)" : "translateY(-100px)",
          opacity: headerVisible ? 1 : 0,
          transition: "transform 0.5s ease, opacity 0.5s ease",
        }}
        className="bg-brand pt-[52px] pb-[20px] px-[20px] rounded-b-[28px]"
      >
        {/* Tabs */}
        <div className="flex flex-row bg-white/15 rounded-[14px] p-[4px] gap-[4px]">
          {[
            {
              key: "profile",
              label: "ملفي",
              icon: (active) => (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={active ? "#8c52ff" : "rgba(255,255,255,0.8)"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ),
            },
            {
              key: "leaderboard",
              label: "المتصدرون",
              icon: (active) => (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={active ? "#8c52ff" : "rgba(255,255,255,0.8)"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              ),
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-row items-center justify-center gap-[6px] py-[10px] rounded-[11px] ${
                activeTab === tab.key ? "bg-white" : "bg-transparent"
              }`}
            >
              {tab.icon(activeTab === tab.key)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-10">
        {activeTab === "profile" ? (
          <div className="flex flex-col gap-[12px] mt-[12px]">
            {/* ── XP + Progress Card ── */}
            <div className="bg-white rounded-[20px] p-[18px] border border-[#EDE9FF]">
              <div className="flex flex-row justify-between items-center mb-[12px]">
                <span className="text-[15px] text-gray-800 font-arabic ">
                  مستوى التقدم
                </span>
                <div className="flex flex-row items-center gap-[4px] bg-brand/10 px-[10px] py-[4px] rounded-full">
                  <span className="text-[14px] font-arabic ">⚡</span>
                  {loading ? (
                    <PulseSkeleton width={40} height={16} />
                  ) : (
                    <span className="text-brand  font-arabic  text-[15px]">
                      {user?.points || 0}
                    </span>
                  )}
                  <span className="text-gray-400 font-arabic text-[12px]">
                    XP
                  </span>
                </div>
              </div>
              <XPProgressBar points={user?.points || 0} loading={loading} />
            </div>

            {/* ── Stats Grid ── */}
            <div className="flex flex-row gap-[10px]">
              <AnimatedStatCard
                icon="📊"
                label="المعدل"
                value={GPA}
                suffix=" %"
                colorClass="text-brand"
                bgClass="bg-brand/10"
                borderClass="border-brand/30"
                loading={loading}
                large
              />
              <AnimatedStatCard
                icon="🏆"
                label="الترتيب"
                value={user?.rank}
                prefix=""
                colorClass="text-amber-500"
                bgClass="bg-amber-500/10"
                borderClass="border-amber-500/30"
                loading={loading}
                large
              />
            </div>

            {/* ── ID Card ── */}
            <div className="bg-white rounded-[20px] border border-[#EDE9FF] overflow-hidden">
              <div className="bg-brand/5 p-[16px] border-b border-[#EDE9FF]">
                <span className="text-[12px] font-arabic  text-gray-400 mb-[2px] block">
                  الاسم الكامل
                </span>
                <span className="text-[18px] text-gray-800">{user?.name}</span>
              </div>
              <div className="p-[16px] flex flex-col gap-[12px]">
                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 font-arabic  text-[13px]">
                    الرقم الجامعي
                  </span>
                  <span className="text-gray-800 font-arabic text-[13px]">
                    {user?.ID}
                  </span>
                </div>
                <div className="h-[1px] bg-gray-100" />
                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-[13px] font-arabic ">
                    الرتبة
                  </span>
                  <span
                    className="text-[13px] font-arabic"
                    style={{ color: tier.color }}
                  >
                    {tier.icon} {user?.badge || tier.label}
                  </span>
                </div>
              </div>
            </div>

            {/* ── طلباتي ── */}
            {requests && requests.length > 0 && (
              <div className="flex flex-col gap-[10px]">
                <span className="text-white text-[13px] mr-1">
                  طلباتي الأخيرة
                </span>
                {requests.map((req, idx) => {
                  const isPending = req.status === "pending";
                  const isAccepted = req.status === "accepted";
                  const statusColor = isPending
                    ? "#8c52ff"
                    : isAccepted
                      ? "#10B981"
                      : "#EF4444";
                  const statusLabel = isPending
                    ? "قيد الانتظار"
                    : isAccepted
                      ? "تم القبول"
                      : "مرفوض";
                  const statusText = isPending
                    ? "text-brand"
                    : isAccepted
                      ? "text-green-600"
                      : "text-red-500";

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-lg p-2 border border-[#EDE9FF] overflow-hidden"
                    >
                      {/* Header */}
                      <div
                        className="flex flex-row items-center justify-between px-[16px] py-[12px] border-b border-[#EDE9FF]"
                        dir="rtl"
                      >
                        <div className="flex flex-row items-center gap-[6px] px-[10px] py-[4px] rounded-full">
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: 4,
                              backgroundColor: statusColor,
                            }}
                          />
                          <span
                            className={`text-[12px] font-arabic ${statusText}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                        <span
                          className=" font-arabic  text-[15px]"
                          style={{ color: statusColor }}
                        >
                          {req.total_price} ل.س
                        </span>
                      </div>

                      {/* Body */}
                      <div
                        className="px-[16px] py-[12px] flex flex-col gap-[8px]"
                        dir="rtl"
                      >
                        <div className="flex flex-row items-center gap-[6px]">
                          <span className="text-gray-400 font-arabic text-[12px]">
                            رقم العملية:
                          </span>
                          <span className="text-gray-700 font-arabic text-[12px]">
                            {req.process_id}
                          </span>
                        </div>

                        {req.student_notes ? (
                          <div className="flex flex-row items-start gap-[6px]">
                            <span className="text-gray-400 font-arabic text-[12px]">
                              ملاحظاتي:
                            </span>
                            <span className="text-gray-600 font-arabic text-[12px] flex-1">
                              {req.student_notes}
                            </span>
                          </div>
                        ) : null}

                        {req.status !== "pending" && req.our_notes ? (
                          <div className="bg-brand/5 border border-brand/20 p-[10px] rounded-[12px] mt-[2px]">
                            <span className="text-brand font-arabic text-[11px] block mb-[2px]">
                              رد الإدارة:
                            </span>
                            <span className="text-gray-700 font-arabic text-[12px]">
                              {req.our_notes}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Back Button ── */}
            <button
              onClick={handle_back}
              className="bg-white rounded-[16px] py-[15px] flex flex-row items-center justify-center gap-[8px] mt-[4px] w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8c52ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span className="text-brand font-arabic text-[16px]">عودة</span>
            </button>
          </div>
        ) : (
          // ── Leaderboard Tab ──
          <div className="mt-[12px]">
            {/* Current user rank pill */}
            {!loading && user?.rank && (
              <div className="bg-brand/10 rounded-[14px] p-[14px] flex flex-row items-center justify-between mb-[14px] border border-brand/25">
                <span className="text-white text-[13px] font-arabic">
                  ترتيبك الحالي
                </span>
                <div className="flex flex-row items-center gap-[6px]">
                  <span className="text-white text-[22px]  font-arabic ">
                    #{user.rank}
                  </span>
                  <span className="text-[18px]">🎯</span>
                </div>
              </div>
            )}

            {loading || !user?.top10Students ? (
              Array.from({ length: 10 }).map((_, i) => (
                <LeaderboardSkeleton key={i} />
              ))
            ) : user.top10Students.length > 0 ? (
              user.top10Students.map((student, idx) => (
                <LeaderboardCard
                  key={student.ID}
                  student={student}
                  isCurrentUser={student.ID == user.ID}
                  index={idx}
                />
              ))
            ) : (
              <div className="bg-white rounded-[20px] p-[48px] flex flex-col items-center gap-[12px]">
                <span className="text-[48px]">🏆</span>
                <span className="text-[16px] font-arabic text-gray-800 text-center">
                  لا توجد بيانات بعد
                </span>
                <span className="text-[13px] font-arabic text-gray-400 text-center">
                  كن أول من يصعد للقمة!
                </span>
              </div>
            )}

            <button
              onClick={handle_back}
              className="bg-white rounded-[16px] font-arabic py-[15px] flex flex-row items-center justify-center gap-[8px] mt-[14px] w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8c52ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span className="text-brand text-[16px] font-arabic ">عودة</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
