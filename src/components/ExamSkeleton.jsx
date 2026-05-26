import { useEffect, useRef } from "react";

const useShimmer = (delay = 0) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let start = null;
    let frame;

    const animate = (timestamp) => {
      if (!start) start = timestamp - delay;
      const elapsed = (timestamp - start) % 1600;
      const t = elapsed < 800 ? elapsed / 800 : (1600 - elapsed) / 800;
      const opacity = 0.4 + t * 0.6;
      el.style.opacity = opacity;
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [delay]);

  return ref;
};

const SkeletonBox = ({
  width,
  height,
  borderRadius = 8,
  delay = 0,
  className = "",
  style = {},
}) => {
  const ref = useShimmer(delay);
  return (
    <div
      ref={ref}
      className={`bg-[#E2E2E2] ${className}`}
      style={{ width, height, borderRadius, ...style }}
    />
  );
};

const ExamSkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex flex-col gap-3">
        <div className="flex flex-row justify-center items-center gap-2">
          <SkeletonBox width={80} height={38} borderRadius={8} delay={0} />
          <SkeletonBox width={110} height={38} borderRadius={8} delay={80} />
          <div className="flex flex-row items-center gap-1.5 px-2">
            <SkeletonBox width={24} height={24} borderRadius={12} delay={160} />
            <SkeletonBox width={52} height={20} borderRadius={6} delay={200} />
          </div>
        </div>
      </div>

      {/* Question Panel */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-5">
          {/* Meta row */}
          <div className="flex flex-row justify-between items-center">
            <SkeletonBox width={140} height={14} borderRadius={4} delay={0} />
            <SkeletonBox width={70} height={16} borderRadius={4} delay={80} />
          </div>

          {/* Question text */}
          <div className="flex flex-col items-center gap-2">
            <SkeletonBox width="90%" height={22} borderRadius={6} delay={100} />
            <SkeletonBox width="70%" height={22} borderRadius={6} delay={160} />
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2.5 mt-1">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonBox
                key={i}
                width="100%"
                height={52}
                borderRadius={10}
                delay={200 + i * 80}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-[#E5E7EB] px-4 pt-3 pb-10 flex flex-col items-center gap-2">
        <div className="flex flex-row justify-between w-full max-w-[360px] gap-2">
          <SkeletonBox width="48%" height={48} borderRadius={8} delay={0} />
          <SkeletonBox width="48%" height={48} borderRadius={8} delay={80} />
        </div>
      </div>
    </div>
  );
};

export default ExamSkeleton;
