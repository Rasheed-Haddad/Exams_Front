import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setActiveTab, toggleSidebar } from "../store/slices/uiSlice";
import { useEffect, useState } from "react";
import { Users, FileText, Sheet, DollarSign, LogOut } from "lucide-react";
import { signOut } from "../store/slices/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen } = useSelector((state) => state.ui);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "profile", label: "الملف الشخصي", icon: Users, path: "/admin" },
    { id: "exams", label: "الاختبارات", icon: FileText, path: "/admin/exams" },
    { id: "top", label: "لوائح الصدارة", icon: Sheet, path: "/admin/top" },
    { id: "money", label: "المالية", icon: DollarSign, path: "/admin/money" },
    { id: "logout", label: "تسجيل الخروج", icon: LogOut, path: "/" },
  ];

  const handleLinkClick = (itemId, path) => {
    if (itemId == "logout") {
      dispatch(signOut());
    }
    dispatch(setActiveTab(itemId));
    navigate(path);
    if (windowWidth < 768 && sidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  const handleOverlayClick = () => {
    if (sidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  const isMobile = windowWidth < 768;

  return (
    <>
      {/* Overlay للموبايل */}
      {sidebarOpen && isMobile && (
        <button
          className="fixed inset-0 bg-black/50 z-[9]"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      {(sidebarOpen || !isMobile) && (
        <div
          className={`fixed font-arabic top-0 right-0 h-full bg-brand z-10 transition-all duration-300 ${
            sidebarOpen ? "w-48" : "w-12"
          }`}
        >
          <div className="mt-4 font-arabic sm:mt-6">
            <div className="gap-1.5 px-1.5 sm:px-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;

                return (
                  <div key={item.id}>
                    <button
                      className={`flex flex-row items-center w-full mb-4 pl-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/10 ${
                        isActive ? "bg-white" : ""
                      }`}
                      onClick={() => handleLinkClick(item.id, item.path)}
                    >
                      <div className="mx-2">
                        <IconComponent
                          size={20}
                          color={isActive ? "#8C52FF" : "#ffffff"}
                        />
                      </div>
                      {sidebarOpen && (
                        <span
                          className={`text-sm font-medium transition-colors ${
                            isActive ? "text-brand" : "text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
