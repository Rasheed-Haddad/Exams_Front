import { useDispatch } from "react-redux";
import { toggleSidebar } from "../store/slices/uiSlice";
import { Menu } from "lucide-react";

const Header = () => {
  const dispatch = useDispatch();

  return (
    <div className="bg-white py-3 px-4 sm:py-4 sm:px-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex-row items-center gap-2 sm:gap-3">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 sm:p-2 rounded-md active:opacity-70"
          >
            <Menu size={20} color="#8C52FF" className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <span className="text-brand font-arabic text-lg ">
          رقم الواتسأب للتواصل : 0937922870
        </span>
      </div>
    </div>
  );
};

export default Header;
