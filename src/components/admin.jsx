import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_teacher_info } from "../store/slices/authSlice";
import {
  ActivitySquare,
  BookOpen,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Phone,
  TrendingUp,
  Trophy,
  Unlock,
  User,
  Users,
} from "lucide-react";
import LoadingGlow from "./LoadingGlow";

const Admin = () => {
  const dispatch = useDispatch();
  const { user, analytics, analyticsLoading } = useSelector(
    (state) => state.auth
  );
  // نظام النصائح الذكي
  const getSmartTip = (analytics) => {
    if (!analytics) {
      return {
        title: "مرحباً بك",
        tip: "قم بإنشاء امتحاناتك الأولى لبدء تتبع الأداء والحصول على نصائح مخصصة",
        icon: "👋",
        priority: "low",
      };
    }

    const tips = [];

    // تحليل معدل النجاح
    if (
      analytics.performance.passRate < 50 &&
      analytics.performance.failureRate > 50
    ) {
      tips.push({
        title: "تنبيه: معدل رسوب مرتفع",
        tip: `${analytics.performance.failureRate}% من الطلاب يرسبون. راجع توزيع الأسئلة الصعبة وتأكد من تغطية المحتوى بشكل متوازن`,
        icon: "🚨",
        priority: "high",
      });
    } else if (analytics.performance.passRate < 70) {
      tips.push({
        title: "تحسين الأداء العام",
        tip: `معدل النجاح ${analytics.performance.passRate}%. حلل الأسئلة التي يخطئ فيها معظم الطلاب وركز عليها في المراجعات`,
        icon: "📊",
        priority: "high",
      });
    }

    // تحليل متوسط الدرجات
    if (analytics.performance.averageScore < 50) {
      tips.push({
        title: "متوسط الدرجات منخفض",
        tip: `المتوسط ${analytics.performance.averageScore}/100. قد تكون الأسئلة صعبة جداً. جرّب إضافة أمثلة عملية في المحاضرات`,
        icon: "📉",
        priority: "high",
      });
    } else if (analytics.performance.averageScore > 85) {
      tips.push({
        title: "متوسط مرتفع - فرصة للتحدي",
        tip: `المتوسط ${analytics.performance.averageScore}/100. طلابك متفوقون! أضف أسئلة تحليلية أعمق`,
        icon: "🎯",
        priority: "low",
      });
    }

    // تحليل عدد الأسئلة
    if (analytics.exams.averageQuestionsPerExam < 10) {
      tips.push({
        title: "عدد الأسئلة قليل",
        tip: `متوسط ${analytics.exams.averageQuestionsPerExam} سؤال فقط. استهدف 15-25 سؤال لتقييم أشمل`,
        icon: "📝",
        priority: "medium",
      });
    } else if (analytics.exams.averageQuestionsPerExam > 40) {
      tips.push({
        title: "احذر من الإطالة",
        tip: `${analytics.exams.averageQuestionsPerExam} سؤال قد يسبب إرهاق. وزّع المحتوى على امتحانات متعددة`,
        icon: "⏰",
        priority: "medium",
      });
    }

    // تحليل الوقت
    if (analytics.exams.averageExamTime < 20) {
      tips.push({
        title: "وقت ضيق للتفكير",
        tip: `${analytics.exams.averageExamTime} دقيقة فقط. امنح الطلاب 30-45 دقيقة للتفكير العميق`,
        icon: "⏱️",
        priority: "medium",
      });
    }

    // تحليل توزيع الطلاب
    const dist = analytics.students.distributionByExamCount;
    const lowEngagement = dist["1-2 امتحانات"];
    const totalDist = Object.values(dist).reduce((a, b) => a + b, 0);

    if (totalDist > 0 && lowEngagement / totalDist > 0.6) {
      tips.push({
        title: "انخراط منخفض",
        tip: `${Math.round(
          (lowEngagement / totalDist) * 100
        )}% سجلوا في 1-2 امتحان فقط. أرسل تذكيرات للتحفيز`,
        icon: "📢",
        priority: "high",
      });
    }

    // تحليل الإيرادات
    const revenueRate = analytics.revenue.current / analytics.revenue.total;
    if (revenueRate < 0.3 && analytics.revenue.potential > 100000) {
      tips.push({
        title: "إيرادات محتملة كبيرة",
        tip: `لديك ${analytics.revenue.potential.toLocaleString()} ل.س محتملة. تابع مع الطلاب وذكّرهم بالدفع`,
        icon: "💰",
        priority: "high",
      });
    }

    // تحليل المحاضرات
    if (analytics.topLectures.length > 0) {
      const topLecture = analytics.topLectures[0];
      const concentration =
        (topLecture.questionsCount / analytics.exams.totalQuestions) * 100;

      if (concentration > 30) {
        tips.push({
          title: "تركيز زائد على محاضرة واحدة",
          tip: `${Math.round(concentration)}% من الأسئلة من "${
            topLecture.lecture
          }". نوّع مصادر الأسئلة`,
          icon: "📚",
          priority: "medium",
        });
      }
    }

    // تحليل عدد الامتحانات
    if (analytics.exams.total < 5) {
      tips.push({
        title: "ابدأ ببناء محتواك",
        tip: `لديك ${analytics.exams.total} امتحانات فقط. أضف 10-15 امتحان متنوع لبناء مكتبة شاملة`,
        icon: "🏗️",
        priority: "high",
      });
    }

    // تحليل النمو
    if (analytics.growth.growthRate) {
      const rate = parseFloat(analytics.growth.growthRate);
      if (rate < -10) {
        tips.push({
          title: "انخفاض في التسجيلات",
          tip: `نمو سالب ${rate}%. راجع استراتيجية التسويق وجودة الامتحانات الأخيرة`,
          icon: "📉",
          priority: "high",
        });
      } else if (rate > 50) {
        tips.push({
          title: "نمو سريع جداً",
          tip: `نمو ${rate}%! حافظ على الجودة مع الزيادة وفكر في توظيف مساعد`,
          icon: "🚀",
          priority: "low",
        });
      }
    }

    // نصيحة شاملة
    if (
      analytics.performance.passRate > 75 &&
      analytics.students.total > 50 &&
      revenueRate > 0.7
    ) {
      tips.push({
        title: "أداء استثنائي",
        tip: "معدل نجاح مرتفع وإيرادات جيدة. أنت تدير منصة ناجحة! ركز على التطوير المستمر",
        icon: "🎉",
        priority: "low",
      });
    }

    // ترتيب وإرجاع أول نصيحة
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    tips.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    return (
      tips[0] || {
        title: "كل شيء على ما يرام",
        tip: "استمر في متابعة طلابك وتحديث محتواك بانتظام",
        icon: "✨",
        priority: "low",
      }
    );
  };

  useEffect(() => {
    if (user && user.role === "teacher" && !analytics) {
      dispatch(get_teacher_info({ id: user.id }));
    }
  }, []);

  if (analyticsLoading && !analytics) {
    return <LoadingGlow />;
  }

  if (!user || user.role !== "teacher") {
    return (
      <div className="flex-1 justify-center items-center bg-gray-50">
        <span className="text-red-500 text-lg font-arabic">
          خطأ في تحميل البيانات
        </span>
      </div>
    );
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
    bgColor,
    onClick,
  }) => (
    <button
      onClick={onClick}
      disabled={!onClick}
      activeOpacity={onClick ? 0.7 : 1}
      className={`${bgColor} rounded-2xl w-full p-4 shadow-sm border border-gray-100`}
    >
      {/* أعلى البطاقة */}
      <div className="flex flex-row items-center justify-between mb-2">
        <div
          className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}
        >
          <Icon size={22} color="white" />
        </div>
      </div>

      {/* العنوان */}
      <span className="text-gray-600 text-xs mb-1 font-arabic block">
        {title}
      </span>

      {/* القيمة */}
      <span className="text-gray-900 text-2xl font-arabic mb-1 block">
        {value}
      </span>

      {/* الساب تايتل */}
      {subtitle && (
        <span className="text-gray-500 text-xs font-arabic block">
          {subtitle}
        </span>
      )}
    </button>
  );

  const SectionHeader = ({ title, icon: Icon }) => (
    <div className="flex-row items-center mb-4">
      {Icon && <Icon size={20} color="#8c52ff" style={{ marginLeft: 8 }} />}
      <span className="text-gray-900 text-xl font-arabic">{title}</span>
    </div>
  );

  return (
    <div dir="rtl" className="flex-1 bg-gray-50 ">
      {/* Header Card */}
      <div className="bg-brand p-6 shadow-lg mb-6">
        <div className="flex flex-row items-center justify-between mb-4">
          <div>
            <span className="text-white/80 text-sm font-arabic mb-1 block">
              مرحباً بك
            </span>
            <span className="text-white text-3xl font-arabic block">
              {user.name}
            </span>
          </div>

          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User size={32} color="white" />
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex flex-row items-center mb-2">
            <Phone size={16} color="white" />
            <span className="text-white text-base mr-2 font-arabic">
              {user.phone_number}
            </span>
          </div>

          <div className="flex flex-row items-center">
            <CheckCircle size={16} color="#4ade80" />
            <span className="text-white/90 text-sm mr-2 font-arabic">
              حساب نشط - {analytics?.summary.totalExams || 0} امتحان
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-12">
        {/* Statistics Grid */}
        <SectionHeader title="الإحصائيات الرئيسية" icon={TrendingUp} />
        <div className="mb-6">
          {/* الصف الأول */}
          <div className="flex flex-row gap-2 mb-3">
            <div className="flex-1 mr-2">
              <StatCard
                icon={DollarSign}
                title="الأرباح الحالية"
                value={`${analytics?.revenue.current.toLocaleString("en")}`}
                subtitle="ليرة سورية"
                color="bg-green-500"
                bgColor="bg-green-50"
              />
            </div>

            <div className="flex-1 ml-2">
              <StatCard
                icon={FileText}
                title="الامتحانات"
                value={analytics?.exams.total || 0}
                subtitle={`${analytics?.exams.visible || 0} مرئي`}
                color="bg-blue-500"
                bgColor="bg-blue-50"
                onClick={() => router.replace("/(admin)/exams/Exams")}
              />
            </div>
          </div>

          {/* الصف الثاني */}
          <div className="flex gap-2 flex-row mb-3">
            <div className="flex-1 mr-2">
              <StatCard
                icon={Users}
                title="الطلاب"
                value={analytics?.students.total || 0}
                subtitle={`${
                  analytics?.students.withCompletedExams || 0
                } سبق أن أنهوا اختبار`}
                color="bg-purple-500"
                bgColor="bg-purple-50"
              />
            </div>

            <div className="flex-1 ml-2">
              <StatCard
                icon={TrendingUp}
                title="معدل النجاح"
                value={`${analytics?.performance.passRate} %`}
                subtitle={`متوسط ${analytics?.performance.averageScore || 0}`}
                color="bg-orange-500"
                bgColor="bg-orange-50"
              />
            </div>
          </div>

          {/* الصف الثالث */}
          <div className="flex gap-2 flex-row">
            <div className="flex-1 mr-2">
              <StatCard
                icon={BookOpen}
                title="متوسط الأسئلة"
                value={analytics?.exams.averageQuestionsPerExam || 0}
                subtitle="سؤال لكل امتحان"
                color="bg-indigo-500"
                bgColor="bg-indigo-50"
              />
            </div>

            <div className="flex-1 ml-2">
              <StatCard
                icon={Calendar}
                title="متوسط الوقت"
                value={`${analytics?.exams.averageExamTime || 0}`}
                subtitle="دقيقة"
                color="bg-pink-500"
                bgColor="bg-pink-50"
              />
            </div>
          </div>
        </div>

        {/* الإيرادات المفصلة */}
        {analytics?.revenue && (
          <div className="mb-6">
            <SectionHeader title="تحليل الإيرادات" icon={DollarSign} />

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              {/* الإيرادات الكلية */}
              <div className="flex flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-gray-600 text-sm font-arabic block">
                    الإيرادات الكلية
                  </span>
                  <span className="text-gray-900 text-2xl font-arabic block">
                    {analytics.revenue.total.toLocaleString("en")} ل.س
                  </span>
                </div>
                <DollarSign size={32} color="#10b981" />
              </div>

              {/* لهذا الفصل */}
              <div className="space-y-3">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 ml-2" />
                    <span className="text-gray-700 text-sm font-arabic">
                      لهذا الفصل
                    </span>
                  </div>

                  <span className="text-gray-900 font-arabic">
                    {analytics.revenue.current.toLocaleString("en")} ل.س
                  </span>
                </div>
              </div>

              {/* حسب النوع */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-row flex-wrap gap-2">
                  <div className="bg-blue-50 w-full px-3 py-2 rounded-lg">
                    <span className="text-blue-700 text-xs font-arabic">
                      <Unlock size={12} color="#2563eb" /> في الوضع المفتوح :{" "}
                      {analytics.revenue.byType.openMode.toLocaleString("en")}
                    </span>
                  </div>

                  <div className="bg-purple-50 w-full  px-3 py-2 rounded-lg">
                    <span className="text-purple-700 text-xs font-arabic">
                      <Lock size={12} color="#9333ea" /> في الوضع المغلق :{" "}
                      {analytics.revenue.byType.closedMode.toLocaleString("en")}
                    </span>
                  </div>

                  <div className="bg-green-50 px-3 w-full  py-2 rounded-lg">
                    <span className="text-green-700 text-xs font-arabic">
                      <Eye size={12} color="#16a34a" /> مرئي :{" "}
                      {analytics.revenue.byType.visible.toLocaleString("en")}
                    </span>
                  </div>

                  <div className="bg-gray-200 px-3 w-full  py-2 rounded-lg">
                    <span className="text-gray-700 text-xs font-arabic">
                      <EyeOff size={12} color="#4b5563" /> مخفي :{" "}
                      {analytics.revenue.byType.hidden.toLocaleString("en")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* الطالب الأكثر نشاطاً */}
        {analytics?.students.mostActiveStudent && (
          <div className="mb-6">
            <SectionHeader title="⭐ الطالب الأكثر تسجيلا" />

            <div className="bg-brand rounded-2xl p-5 shadow-lg">
              {/* الرأس */}
              <div className="flex flex-row items-center mb-3">
                <div className="w-14 h-14 bg-white/30 rounded-full flex items-center justify-center mr-3 ml-3">
                  <Trophy size={28} color="white" />
                </div>

                <div className="flex-1">
                  <span className="text-white text-xl font-arabic block">
                    {analytics.students.mostActiveStudent.name}
                  </span>
                  <span className="text-white/90 text-sm font-arabic block">
                    {analytics.students.mostActiveStudent.nick_name}
                  </span>
                </div>
              </div>

              {/* التفاصيل */}
              <div className="bg-white/20 rounded-xl p-3">
                <div className="flex flex-row justify-between items-center mb-2">
                  <span className="text-white text-sm font-arabic">
                    الامتحانات المسجلة
                  </span>
                  <span className="text-white text-xl font-arabic">
                    {analytics.students.mostActiveStudent.enrolledExams}
                  </span>
                </div>

                <div className="flex flex-row justify-between items-center mb-2">
                  <span className="text-white text-sm font-arabic">النقاط</span>
                  <span className="text-white text-xl font-arabic">
                    {analytics.students.mostActiveStudent.points}
                  </span>
                </div>

                <div className="flex flex-row justify-between items-center">
                  <span className="text-white text-sm font-arabic">الشارة</span>
                  <span className="text-white text-lg font-arabic">
                    {analytics.students.mostActiveStudent.badge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* أفضل 5 طلاب */}
        {analytics?.performance.topPerformers &&
          analytics.performance.topPerformers.length > 0 && (
            <div className="mb-6">
              <SectionHeader title="🏆 أفضل 5 طلاب" />

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                {analytics.performance.topPerformers.map((student, idx) => (
                  <div
                    key={student.ID}
                    className={`flex flex-row items-center py-3 ${
                      idx !== analytics.performance.topPerformers.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    {/* رقم الطالب */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ml-3 ${
                        idx === 0
                          ? "bg-yellow-400"
                          : idx === 1
                          ? "bg-gray-300"
                          : idx === 2
                          ? "bg-orange-400"
                          : "bg-gray-200"
                      }`}
                    >
                      <span className="text-white font-arabic">{idx + 1}</span>
                    </div>

                    {/* اسم الطالب والشارة */}
                    <div className="flex-1">
                      <span className="text-gray-900  font-arabic block">
                        {student.name}
                      </span>
                      <span className="text-gray-500 text-xs font-arabic block">
                        {student.badge} • {student.examsCompleted} امتحان
                      </span>
                    </div>

                    {/* النتيجة والنقاط */}
                    <div className="flex flex-col items-end">
                      <span className="text-green-600 text-lg font-arabic block">
                        {student.averageScore}
                      </span>
                      <span className="text-gray-500 text-xs font-arabic block">
                        {student.points} نقطة
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* توزيع الطلاب */}
        {analytics?.students.distributionByExamCount && (
          <div className="mb-6">
            <SectionHeader title="📈 توزيع الطلاب" />
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              {Object.entries(analytics.students.distributionByExamCount).map(
                ([range, count], idx) => (
                  <div
                    key={range}
                    className={` flex flex-row items-center justify-between py-3 ${
                      idx !== 3 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <span className="text-gray-700 text-sm font-arabic">
                      {range}
                    </span>
                    <div className=" flex flex-row items-center">
                      <div className="bg-purple-100 px-3 py-1 rounded-full">
                        <span className="text-purple-700 font-arabic">
                          {count}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* أكثر المحاضرات */}
        {analytics?.topLectures && analytics.topLectures.length > 0 && (
          <div className="mb-6">
            <SectionHeader title="📚 أكثر المحاضرات تكراراً" />
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              {analytics.topLectures.slice(0, 5).map((lecture, idx) => (
                <div
                  key={idx}
                  className={`flex-row items-center justify-between py-3 ${
                    idx !== Math.min(4, analytics.topLectures.length - 1)
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex-row items-center flex-1">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg items-center justify-center mr-3">
                      <BookOpen size={16} color="#6366f1" />
                    </div>
                    <span
                      className="text-gray-900 font-arabic flex-1"
                      numberOfLines={1}
                    >
                      {lecture.lecture}
                    </span>
                  </div>
                  <div className="bg-indigo-50 px-3 py-1 rounded-full mr-2">
                    <span className="text-indigo-700 text-sm font-arabic">
                      {lecture.questionsCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تحليل الكليات */}
        {analytics?.collegeAnalytics &&
          analytics.collegeAnalytics.length > 0 && (
            <div className="mb-6">
              <SectionHeader title="🏛️ تحليل الكليات" />
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                {analytics.collegeAnalytics.map((college, idx) => (
                  <div
                    key={college.college_id}
                    className={`py-4 ${
                      idx !== analytics.collegeAnalytics.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className=" flex flex-row items-center justify-between mb-2">
                      <span className="text-gray-900 font-arabic text-lg">
                        كلية {college.college_id}
                      </span>
                      <div className="bg-blue-100 px-3 py-1 rounded-full">
                        <span className="text-blue-700 text-xs font-arabic">
                          {college.examsCount} امتحان
                        </span>
                      </div>
                    </div>
                    <div className=" flex flex-row justify-between">
                      <span className="text-gray-600 text-sm font-arabic">
                        👥 {college.studentsCount} طالب
                      </span>
                      <span className="text-green-600 text-sm font-arabic">
                        💰 {college.totalRevenue.toLocaleString("en")} ل.س
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* النمو 
        {analytics?.growth && (
          <div className="mb-6">
            <SectionHeader title="📊 نمو الطلاب" />
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className=" flex flex-row justify-between items-center mb-4">
                <div className=" flex flex-1">
                  <span className="text-gray-600 text-sm mb-1 font-arabic">
                    هذا الشهر
                  </span>
                  <span className="text-gray-900 text-2xl font-arabic">
                    {analytics.growth.thisMonth}
                  </span>
                </div>
                <div className=" flex flex-1 items-end">
                  <span className="text-gray-600 text-sm mb-1 font-arabic">
                    معدل النمو
                  </span>
                  <span
                    className={`text-2xl font-arabic ${
                      parseFloat(analytics.growth.growthRate) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {analytics.growth.growthRate}%
                  </span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <span className="text-gray-600 text-xs font-arabic">
                  الشهر الماضي : {analytics.growth.lastMonth} طالب
                </span>
              </div>
            </div>
          </div>
        )}*/}

        {/* نصيحة ذكية */}
        {(() => {
          const smartTip = getSmartTip(analytics);
          const priorityColors = {
            high: {
              bg: "bg-red-50",
              border: "border-red-200",
              text: "text-red-700",
            },
            medium: {
              bg: "bg-yellow-50",
              border: "border-yellow-200",
              text: "text-yellow-700",
            },
            low: {
              bg: "bg-green-50",
              border: "border-green-200",
              text: "text-green-700",
            },
          };
          const colors = priorityColors[smartTip.priority];

          return (
            <div
              dir="rtl"
              className={`${colors.bg} rounded-2xl p-5 border ${colors.border} mb-6 `}
            >
              <div className="flex flex-row items-start">
                <div className="flex-1 mr-3">
                  <div className="flex flex-row items-center justify-between mb-1">
                    <span className={`${colors.text} font-arabic`}>
                      {smartTip.title}
                    </span>
                  </div>
                  <span className="text-gray-700 text-sm font-arabic leading-5">
                    {smartTip.tip}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Admin;
