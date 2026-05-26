import { BookOpen } from "lucide-react";

const EmptyState = () => (
  <div className="items-center justify-center py-16">
    <div className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
      <BookOpen size={48} color="#9ca3af" />
    </div>
    <span className="text-white text-lg text-center font-arabic mb-2">
      حاليا لا توجد مكثفات لمواد كليتك
    </span>
  </div>
);

export { EmptyState };
