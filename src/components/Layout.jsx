import { Outlet, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSelector } from "react-redux";
import Admin from "./admin";
import ExamsList from "./exams";
import ExamDetails from "./ExamDetails";
import ExamEditor from "./ExamEditor";
import Create_Exam from "./Create_Exam";
import Top_Component from "./Top";
import Money from "./Money";

const Layout = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden" dir="rtl">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-200 ${
          sidebarOpen ? "mr-0 md:mr-48" : "mr-0 md:mr-12"
        }`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* المسارات النسبية - بدون /admin */}
            <Route index element={<Admin />} />
            <Route path="exams" element={<ExamsList />} />
            <Route path="exams/create" element={<Create_Exam />} />
            <Route path="exams/:id" element={<ExamDetails />} />
            <Route path="exams/edit/:id" element={<ExamEditor />} />
            <Route path="top" element={<Top_Component />} />
            <Route path="money" element={<Money />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
