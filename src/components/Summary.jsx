import { useState, useCallback, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelExam,
  clearStatus,
  initializeSummary,
  save_note,
  stopTimer,
} from "../store/slices/examSlice";
import ExamInterface from "./ExamInterface";

// ─── Helpers ──────────────────────────────────────────────────

const toListItem = (item) => ({
  text: item.text ?? "",
  keywords: item.keywords ?? [],
  strong: item.strong,
  is_example: item.is_example,
  emoji: item.emoji,
  title: item.title,
  description: item.description,
  type: item.type,
  items: item.items ?? [],
});

const getItemText = (item) => item.text || item.description || item.title || "";

// ─── Keyword Highlighter ──────────────────────────────────────
const HighlightedText = ({ text, keywords = [], className = "" }) => {
  if (!text) return null;
  if (!keywords || keywords.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const sortedKeywords = useMemo(
    () => keywords.slice().sort((a, b) => b.length - a.length),
    [keywords],
  );

  const parts = useMemo(() => {
    const escaped = sortedKeywords.map((k) =>
      k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    const regex = new RegExp(`(${escaped.join("|")})`, "g");
    return text.split(regex);
  }, [text, sortedKeywords]);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        sortedKeywords.includes(part) ? (
          <span key={i} className="text-brand">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

// ─── Universal Item Renderer ──────────────────────────────────
const RecursiveItemRenderer = ({
  item,
  level = 0,
  showBullet = true,
  showNumber = false,
  numberIndex = 0,
}) => {
  const li = toListItem(item);
  const paddingLeft = level * 20;

  const displayTitle = li.title || "";
  const displayDescription = li.description || "";
  const displayText = li.text || "";

  return (
    <div className="mb-3 font-arabic">
      <div className="flex flex-row items-start gap-3" style={{ paddingLeft }}>
        {showNumber ? (
          <div className="w-7 h-7 rounded-full bg-purple-100 items-center justify-center flex-shrink-0 mt-0.5 border border-purple-200 flex">
            <span className="text-brand text-sm">{numberIndex + 1}</span>
          </div>
        ) : showBullet ? (
          <div className="mt-2 w-2 h-2 rounded-full bg-brand/60 flex-shrink-0" />
        ) : null}

        <div className="flex-1">
          {li.emoji && <p className="text-2xl mb-1">{li.emoji}</p>}

          {displayTitle ? (
            <p className="text-brand text-lg mb-1">{displayTitle}</p>
          ) : null}

          {displayDescription ? (
            <HighlightedText
              text={displayDescription}
              keywords={li.keywords}
              className="text-gray-600 text-base leading-relaxed mb-1"
            />
          ) : null}

          {li.is_example ? (
            <div className="bg-gray-50 p-3 rounded-xl border-l-4 border-purple-300">
              <p className="text-black text-base leading-relaxed">
                <span className="text-brand">مثال: </span>
                <HighlightedText
                  text={displayText}
                  keywords={li.keywords}
                  className="text-black"
                />
              </p>
            </div>
          ) : li.strong ? (
            <p className="text-black text-base leading-relaxed">
              <span className="text-brand">{li.strong} </span>
              <HighlightedText
                text={displayText}
                keywords={li.keywords}
                className="text-black"
              />
            </p>
          ) : displayText ? (
            <HighlightedText
              text={displayText}
              keywords={li.keywords}
              className="text-black text-base leading-relaxed"
            />
          ) : null}
        </div>
      </div>

      {li.items && li.items.length > 0 && (
        <div className="mt-3">
          {li.items.map((nestedItem, nestedIndex) => (
            <RecursiveItemRenderer
              key={`nested-${level}-${nestedIndex}`}
              item={nestedItem}
              level={level + 1}
              showBullet={true}
              showNumber={false}
              numberIndex={nestedIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Block Renderers ─────────────────────────────────────────

const ProcessList = ({ block }) => (
  <div className="my-6 flex flex-col gap-4">
    {block.emoji && (
      <p className="text-3xl mb-1 font-arabic px-1">{block.emoji}</p>
    )}
    {block.title && (
      <p className="text-black text-lg font-arabic mb-1 px-1">{block.title}</p>
    )}
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black font-arabic text-lg mb-2 px-1"
      />
    )}
    {(block.items ?? []).map((item, i) => (
      <div
        key={`process-${i}`}
        className="flex font-arabic flex-row items-start bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
      >
        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
          <span className="text-white">{i + 1}</span>
        </div>
        <div className="flex-1 ml-3">
          <RecursiveItemRenderer
            item={item}
            level={0}
            showBullet={false}
            showNumber={false}
          />
        </div>
      </div>
    ))}
  </div>
);

const BulletList = ({ block }) => (
  <div className="my-4 flex flex-col gap-3">
    {block.emoji && <p className="text-3xl mb-1 px-1">{block.emoji}</p>}
    {block.title && (
      <p className="text-black text-lg mb-1 px-1">{block.title}</p>
    )}
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black text-sm mb-2 px-1"
      />
    )}
    {(block.items ?? []).map((item, i) => (
      <RecursiveItemRenderer
        key={`bullet-${i}`}
        item={item}
        level={0}
        showBullet={true}
        showNumber={false}
        numberIndex={i}
      />
    ))}
  </div>
);

const DefinitionBox = ({ block }) => (
  <div className="my-5 font-arabic bg-purple-50 rounded-xl px-5 py-5">
    <div className="flex flex-row items-center gap-2 mb-2">
      {/* book icon */}
      <svg
        className="w-5 h-5 text-brand"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
      <p className="text-brand text-lg">تعريف</p>
    </div>
    {block.title && <p className="text-brand text-base mb-2">{block.title}</p>}
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black text-base leading-7"
      />
    )}
    {block.items && block.items.length > 0 && (
      <div className="mt-3">
        <BulletList block={{ items: block.items }} />
      </div>
    )}
  </div>
);

const HighlightCard = ({ block }) => (
  <div className="my-5 bg-orange-50 font-arabic rounded-2xl p-5 border border-orange-200">
    <div className="flex flex-row items-center gap-2 mb-3">
      {block.emoji && <span className="text-2xl">{block.emoji}</span>}
      {/* star icon */}
      <svg
        className="w-5 h-5 text-orange-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {block.title ? (
        <p className="text-orange-600 font-arabic text-lg">{block.title}</p>
      ) : null}
    </div>
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black text-base font-arabic leading-relaxed"
      />
    )}
    {block.items && block.items.length > 0 && (
      <div className="mt-3 font-arabic">
        <BulletList block={{ items: block.items }} />
      </div>
    )}
  </div>
);

const InfoBox = ({ block }) => (
  <div className="my-4 bg-white border font-arabic border-purple-200 rounded-2xl p-5 shadow-sm">
    {(block.title || block.text) && (
      <div className="flex flex-row items-center gap-2 mb-3">
        {/* info icon */}
        <svg
          className="w-5 h-5 text-brand"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
        {block.title ? (
          <p className="text-brand text-lg">{block.title}</p>
        ) : null}
      </div>
    )}
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black font-arabic text-base leading-relaxed"
      />
    )}
    {block.items && block.items.length > 0 && (
      <div className="mt-3 font-arabic">
        <BulletList block={{ items: block.items }} />
      </div>
    )}
  </div>
);

const WarningBox = ({ block }) => {
  const text = block.text ?? "";
  const keywords = block.keywords ?? [];

  return (
    <div className="my-5 bg-red-50 border border-red-100 rounded-2xl p-5">
      <div className="flex flex-row items-center gap-2 mb-2">
        {block.emoji && (
          <span className="text-2xl font-arabic">{block.emoji}</span>
        )}
        {/* warning icon */}
        <svg
          className="w-5 font-arabic h-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
        <p className="text-red-600 text-lg font-arabic">
          {block.title ?? "انتباه"}
        </p>
      </div>
      {text ? (
        <HighlightedText
          text={text}
          keywords={keywords}
          className="text-gray-800 font-arabic text-base leading-7"
        />
      ) : null}
      {block.items && block.items.length > 0 && (
        <div className="mt-3 font-arabic">
          <BulletList block={{ items: block.items }} />
        </div>
      )}
    </div>
  );
};

// ─── Two Column Item Renderer ─────────────────────────────────
const TwoColumnItem = ({ item }) => {
  const subItems = item.items ?? [];

  return (
    <div className="bg-white border font-arabic border-gray-200 rounded-2xl p-4 mb-3 shadow-sm">
      {item.title && <p className="text-brand text-lg mb-2">{item.title}</p>}
      {item.description && (
        <HighlightedText
          text={item.description}
          keywords={item.keywords ?? []}
          className="text-gray-700 font-arabic text-base leading-relaxed mb-3"
        />
      )}
      {subItems.length > 0 && (
        <div className="mt-2 flex font-arabic flex-col gap-2">
          {subItems.map((sub, i) => (
            <div
              key={`two-sub-${i}`}
              className="flex flex-row items-start gap-2"
            >
              <div className="mt-2 w-2 h-2 font-arabic rounded-full bg-brand/60 flex-shrink-0" />
              <div className="flex-1 font-arabic">
                <RecursiveItemRenderer
                  item={sub}
                  level={0}
                  showBullet={false}
                  showNumber={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TwoColumn = ({ block }) => (
  <div className="my-4 font-arabic flex flex-col gap-4">
    {block.emoji && <p className="text-3xl mb-1 px-1">{block.emoji}</p>}
    {block.title && <p className="text-black text-lg px-1">{block.title}</p>}
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black font-arabic text-base leading-relaxed px-1"
      />
    )}
    {(block.items ?? []).map((item, i) => (
      <TwoColumnItem key={`two-${i}`} item={item} />
    ))}
  </div>
);

const ItemsGrid = ({ block }) => {
  const items = block.items ?? [];
  if (items.length === 0 && block.text) return <InfoBox block={block} />;

  return (
    <div className="my-5 font-arabic flex flex-col gap-3">
      {block.emoji && <p className="text-3xl mb-1 px-1">{block.emoji}</p>}
      {block.title && (
        <p className="text-black text-lg px-1 mb-1">{block.title}</p>
      )}
      {block.text && (
        <HighlightedText
          text={block.text}
          keywords={block.keywords ?? []}
          className="text-black font-arabic text-base leading-relaxed px-1 mb-2"
        />
      )}
      {items.map((item, i) => {
        const displayText = getItemText(item);
        return (
          <div
            key={`grid-${i}`}
            className="bg-white border font-arabic border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm w-full"
          >
            {item.emoji && <p className="text-4xl mb-2">{item.emoji}</p>}
            {item.title && (
              <p className="text-brand text-xl text-center mb-1">
                {item.title}
              </p>
            )}
            {displayText ? (
              <HighlightedText
                text={displayText}
                keywords={item.keywords ?? []}
                className="text-gray-600 font-arabic text-base text-center leading-6"
              />
            ) : null}
            {item.items && item.items.length > 0 && (
              <div className="mt-3 w-full">
                {item.items.map((nested, idx) => (
                  <RecursiveItemRenderer
                    key={`grid-nested-${idx}`}
                    item={nested}
                    level={0}
                    showBullet={true}
                    showNumber={false}
                    numberIndex={idx}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const BadgeCard = ({ block }) => (
  <div className="my-4 font-arabic flex flex-col items-center">
    <div
      className={`px-6 py-2.5 rounded-full border ${
        block.style === "warning"
          ? "bg-orange-100 border-orange-200"
          : block.style === "success"
            ? "bg-green-100 border-green-200"
            : block.style === "info"
              ? "bg-blue-100 border-blue-200"
              : "bg-purple-100 border-purple-200"
      }`}
    >
      <p
        className={`text-lg ${
          block.style === "warning"
            ? "text-orange-600"
            : block.style === "success"
              ? "text-green-600"
              : block.style === "info"
                ? "text-blue-600"
                : "text-brand"
        }`}
      >
        {block.emoji ? `${block.emoji} ` : ""}
        {block.text}
      </p>
    </div>
    {block.items && block.items.length > 0 && (
      <div className="mt-3 font-arabic w-full">
        <BulletList block={{ items: block.items }} />
      </div>
    )}
  </div>
);

// ─── Notes Field ─────────────────────────────────────────────

const NotesField = ({ sectionId, subjectId, lectureTitle }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { error, status, summary } = useSelector((state) => state.exam);

  let notes = [];
  for (const lecture of summary) {
    if (lecture.meta?.lecture_title !== lectureTitle) continue;
    const section = lecture.sections?.find(
      (s) => s.id?.toString() === sectionId?.toString(),
    );
    if (section) {
      notes = section.notes ?? [];
      break;
    }
  }

  const myNote = notes.find((n) => n.student_ID === user?.ID)?.note ?? "";
  const otherNotes = notes.filter((n) => n.student_ID !== user?.ID);

  const [draftNote, setDraftNote] = useState(myNote);
  const [showOthers, setShowOthers] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedStudents, setExpandedStudents] = useState(new Set());

  useEffect(() => {
    setDraftNote(myNote);
  }, [sectionId, myNote]);

  const handleSave = useCallback(async () => {
    if (!draftNote.trim()) return;
    await dispatch(
      save_note({
        student_ID: user?.ID,
        subject_id: subjectId,
        section_id: sectionId,
        note: draftNote.trim(),
        student_nick_name: user?.nick_name,
        lecture_title: lectureTitle,
      }),
    );
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      dispatch(clearStatus());
    }, 2000);
  }, [draftNote, dispatch, user, subjectId, sectionId, lectureTitle]);

  const toggleStudent = useCallback((id) => {
    setExpandedStudents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="mt-8 font-arabic bg-[#FFF9E6] rounded-xl overflow-hidden border border-[#FFE4A3] shadow-sm">
      <div className="p-5">
        <div className="flex flex-row items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#FFD93D] flex items-center justify-center">
            {/* pencil icon */}
            <svg
              className="w-5 h-5 text-[#856404]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <p className="text-[#856404] text-sm">ملاحظاتي</p>
        </div>

        <textarea
          className="w-full px-4 py-4 text-sm text-gray-800 bg-white/60 rounded-xl leading-relaxed border border-[#FFE4A3] resize-none min-h-[100px] text-right outline-none focus:ring-2 focus:ring-[#FFD93D]"
          placeholder="أضف معلومة أو نصيحة وسيراها باقي الطلاب"
          value={draftNote}
          onChange={(e) => {
            setDraftNote(e.target.value);
            if (error || status) dispatch(clearStatus());
          }}
          rows={4}
          dir="rtl"
        />

        <button
          onClick={handleSave}
          className={`mt-4 w-full flex flex-row justify-center items-center gap-4 py-3 rounded-xl transition-colors ${
            saved ? "bg-green-500" : "bg-brand hover:bg-purple-700"
          }`}
        >
          <span className="text-white">{saved ? "تم الحفظ" : "حفظ"}</span>
        </button>

        {error && (
          <p className="text-red-500 text-center text-sm mt-2">{error}</p>
        )}
        {status && (
          <p className="text-green-600 text-center text-sm mt-2 ">{status}</p>
        )}
      </div>

      {otherNotes.length > 0 && (
        <div className="border-t border-[#FFE4A3]">
          <button
            onClick={() => setShowOthers((v) => !v)}
            className="flex flex-row items-center gap-3 px-5 py-4 bg-white/40 w-full text-right"
          >
            {/* people icon */}
            <svg
              className="w-5 h-5 text-brand"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span className="text-brand flex-1">
              نصائح الزملاء ({otherNotes.length})
            </span>
            <svg
              className={`w-5 h-5 text-brand transition-transform ${showOthers ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showOthers && (
            <div className="p-4 flex flex-col gap-3">
              {otherNotes.map((n) => (
                <div
                  key={n.student_ID}
                  className="bg-brand rounded-2xl p-4 border border-gray-100 shadow-sm"
                >
                  <button
                    onClick={() => toggleStudent(n.student_ID)}
                    className="flex flex-row items-center justify-between w-full"
                  >
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-white">{n.student_nick_name}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-white transition-transform ${
                        expandedStudents.has(n.student_ID) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedStudents.has(n.student_ID) && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-white text-sm leading-relaxed">
                        {n.note}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Block Router ────────────────────────────────────────────

const RenderBlock = memo(({ block }) => {
  if (!block || !block.type) return null;

  switch (block.type) {
    case "process_list":
      return <ProcessList block={block} />;
    case "bullet_list":
      return <BulletList block={block} />;
    case "definition":
      return <DefinitionBox block={block} />;
    case "highlight_card":
      return <HighlightCard block={block} />;
    case "info_box":
      return <InfoBox block={block} />;
    case "warning_box":
      return <WarningBox block={block} />;
    case "two_column":
      return <TwoColumn block={block} />;
    case "items_grid":
      return <ItemsGrid block={block} />;
    case "badge_card":
      return <BadgeCard block={block} />;
    case "h3":
      return (
        <div className="mt-8 font-arabic mb-2 pr-4">
          <div className="flex flex-row items-center gap-2 mb-4">
            {block.emoji && (
              <span className="text-2xl font-arabic">{block.emoji}</span>
            )}
            <p className="text-brand text-xl font-arabic">{block.text}</p>
          </div>
          {block.items && block.items.length > 0 && (
            <BulletList block={{ items: block.items }} />
          )}
        </div>
      );
    case "h4":
      return (
        <div className="mt-6 mb-2">
          <p className="text-brand font-arabic text-lg">
            {block.emoji ? `${block.emoji} ` : ""}
            {block.title ?? block.text}
          </p>
          {block.items && block.items.length > 0 && (
            <BulletList block={{ items: block.items }} />
          )}
        </div>
      );
    case "paragraph":
      return (
        <div className="my-4 font-arabic">
          {block.text && (
            <HighlightedText
              text={block.text}
              keywords={block.keywords ?? []}
              className="text-gray-800 font-arabic text-base leading-8"
            />
          )}
          {block.items && block.items.length > 0 && (
            <div className="mt-3 font-arabic">
              <BulletList block={{ items: block.items }} />
            </div>
          )}
        </div>
      );
    default:
      if (
        block.text ||
        block.title ||
        (block.items && block.items.length > 0)
      ) {
        return <InfoBox block={block} />;
      }
      return null;
  }
});

// ─── Section Card ─────────────────────────────────────────────

const SectionCard = ({ section, subjectId }) => (
  <div className="pb-10 font-arabic">
    <div className="flex flex-row items-center gap-4 mb-8">
      <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center flex-shrink-0">
        <span className="text-white text-2xl">{section.number}</span>
      </div>
      <p className="text-brand text-xl flex-1 leading-relaxed">
        {section.title}
      </p>
    </div>

    {section.content_blocks.map((block, i) => (
      <RenderBlock key={`block-${section.id}-${i}`} block={block} />
    ))}

    <NotesField
      sectionId={section.id}
      subjectId={subjectId}
      lectureTitle={section.lectureTitle}
    />
  </div>
);

const isEmpty = (val) => {
  if (val === null || val === undefined) return true;
  if (typeof val === "string" && val.trim() === "") return true;
  if (Array.isArray(val) && val.length === 0) return true;
  if (
    typeof val === "object" &&
    !Array.isArray(val) &&
    Object.keys(val).length === 0
  )
    return true;
  return false;
};

const EmptyState = ({ type }) => (
  <div className="flex-1 font-arabic flex flex-col items-center justify-center px-8 py-20">
    <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mb-5">
      {type === "summary" ? (
        // BookOpen icon
        <svg
          className="w-9 h-9 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ) : (
        // HelpCircle icon
        <svg
          className="w-9 h-9 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
    </div>
    <p className="text-white text-xl text-center mb-2">
      {type === "summary" ? "لا يوجد ملخص" : "لا توجد أسئلة"}
    </p>
    <p className="text-white/60 text-base text-center leading-7">
      {type === "summary"
        ? "لم يتم إضافة ملخص لهذه المادة بعد"
        : "لم يتم إضافة أسئلة لهذه المادة بعد"}
    </p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────

const Summary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [examEverOpened, setExamEverOpened] = useState(false);

  const next_sound = useMemo(() => new Audio("/next.mp3"), []);
  const swap_sound = useMemo(() => new Audio("/swap.mp3"), []);

  const safePlay = useCallback((sound) => {
    if (!sound) return;
    try {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } catch {
      // ignore
    }
  }, []);

  const dispatch = useDispatch();

  const { summary: examSummary } = useSelector((state) => state.exam);
  const { selectedSubject: subjectForInit } = useSelector(
    (state) => state.selection,
  );

  useEffect(() => {
    if (subjectForInit?.summary && examSummary.length === 0) {
      dispatch(initializeSummary(subjectForInit.summary));
    }
  }, [subjectForInit, examSummary.length, dispatch]);

  // Get selectedLectures from location state or search params
  const { selectedLectures } = useSelector((state) => state.exam);

  const { selectedSubject } = useSelector((state) => state.selection);

  const summaryData = useMemo(
    () =>
      selectedSubject?.summary?.filter((s) =>
        selectedLectures.includes(s.meta?.lecture_title),
      ) ?? [],
    [selectedSubject, selectedLectures],
  );

  // صلّح allSections (كان فيه bug واضح - كود ميت):
  const allSections = useMemo(() => {
    const filtered = summaryData.flatMap((lecture) =>
      (lecture.sections ?? []).map((section) => ({
        ...section,
        lectureTitle: lecture.meta?.lecture_title,
        uniqueId: `${lecture.meta?.lecture_title}__${section.id}`,
      })),
    );

    if (!selectedLectures.length || selectedLectures.includes("الكل")) {
      return (selectedSubject?.summary ?? []).flatMap((lecture) =>
        (lecture.sections ?? []).map((section) => ({
          ...section,
          lectureTitle: lecture.meta?.lecture_title,
          uniqueId: `${lecture.meta?.lecture_title}__${section.id}`,
        })),
      );
    }

    return filtered;
  }, [summaryData, selectedLectures, selectedSubject]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSection = allSections[currentIndex];

  const hasSummary = !isEmpty(allSections);
  const hasQuestions = !isEmpty(selectedSubject?.questions);

  const goToNext = useCallback(() => {
    if (currentIndex < allSections.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      safePlay(next_sound);
    }
  }, [currentIndex, allSections.length, next_sound, safePlay]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      safePlay(next_sound);
    }
  }, [currentIndex, next_sound, safePlay]);

  const handleTabChange = useCallback(
    (tab) => {
      if (tab === "exam" && !examEverOpened) {
        setExamEverOpened(true);
      }
      setActiveTab(tab);
      safePlay(swap_sound);
    },
    [examEverOpened, swap_sound, safePlay],
  );

  const handleExitExam = useCallback(() => {
    dispatch(cancelExam());
    dispatch(stopTimer());
    navigate("/subject");
  }, [dispatch, navigate]);

  const TabSwitch = () => (
    <div className="flex flex-row bg-white/20 p-1 mb-3">
      <button
        onClick={() => handleTabChange("summary")}
        className={`flex-1 py-2.5 flex items-center justify-center transition-colors ${
          activeTab === "summary" ? "bg-white" : ""
        }`}
      >
        <span
          className={`text-sm font-arabic ${activeTab === "summary" ? "text-brand" : "text-white"}`}
        >
          الملخص
        </span>
      </button>
      <button
        onClick={() => handleTabChange("exam")}
        className={`flex-1 py-2.5 flex items-center justify-center transition-colors ${
          activeTab === "exam" ? "bg-white" : ""
        }`}
      >
        <span
          className={`text-sm font-arabic ${activeTab === "exam" ? "text-brand" : "text-white"}`}
        >
          الأسئلة
        </span>
      </button>
    </div>
  );

  return (
    <div dir="rtl" className="flex font-arabic flex-col h-screen bg-brand">
      <div>
        <TabSwitch />
      </div>

      {/* تاب الملخص */}
      <div
        className={`${activeTab === "summary" ? "flex" : "hidden"} flex-col flex-1 bg-white overflow-hidden`}
      >
        {!hasSummary ? (
          <div className="flex-1 bg-brand flex items-center justify-center">
            <EmptyState type="summary" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-brand px-5 pb-6 ">
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center flex-1 px-4">
                  <p className="text-white/70 text-lg">
                    {currentSection?.lectureTitle}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / allSections.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* المحتوى */}
            <div
              key={currentIndex}
              className="flex-1 overflow-y-auto px-6 pt-8"
            >
              <SectionCard
                section={currentSection}
                subjectId={selectedSubject?._id}
              />
              <div className="h-32" />
            </div>

            {/* Navigation Footer */}
            <div className="flex flex-row border-t border-gray-100">
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className={`flex flex-row items-center justify-center gap-2 py-3 w-1/2 transition-colors ${
                  currentIndex === 0
                    ? "bg-gray-100"
                    : "bg-brand hover:bg-purple-700"
                }`}
              >
                <span
                  className={`text-lg ${currentIndex === 0 ? "text-gray-400" : "text-white"}`}
                >
                  السابق
                </span>
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex === allSections.length - 1}
                className={`flex flex-row items-center justify-center gap-2 py-3 w-1/2 transition-colors ${
                  currentIndex === allSections.length - 1
                    ? "bg-gray-200"
                    : "bg-brand hover:bg-purple-700"
                }`}
              >
                <span
                  className={`text-lg ${
                    currentIndex === allSections.length - 1
                      ? "text-gray-400"
                      : "text-white"
                  }`}
                >
                  {currentIndex === allSections.length - 1
                    ? "النهاية"
                    : "التالي"}
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* تاب الأسئلة */}
      {examEverOpened && (
        <div
          className={`${activeTab === "exam" ? "flex" : "hidden"} flex-col flex-1 bg-white overflow-hidden`}
        >
          {!hasQuestions ? (
            <div className="flex-1 bg-brand flex items-center justify-center">
              <EmptyState type="exam" />
            </div>
          ) : (
            <ExamInterface isTabVisible={activeTab === "exam"} />
          )}
        </div>
      )}
    </div>
  );
};

export default Summary;
