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
import { ChevronDown, ChevronUp, Pencil, Users } from "lucide-react";
import { People } from "@mui/icons-material";

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

  return (
    <div className="mb-3">
      <div className="items-center justify-center" style={{ paddingLeft }}>
        {showNumber ? (
          <div className="w-7 h-7 rounded-full bg-brand/10 items-center justify-center flex-shrink-0 mt-0.5 border border-brand/20 mb-2">
            <span className="text-brand text-sm">{numberIndex + 1}</span>
          </div>
        ) : null}

        <div className="items-center w-full">
          {li.emoji && (
            <span className="text-2xl mb-1 text-center">{li.emoji}</span>
          )}
          {li.title && (
            <>
              <span className="text-brand text-lg mb-1 text-center">
                {li.title}
              </span>
              <br />
            </>
          )}
          {li.description && (
            <HighlightedText
              text={li.description}
              keywords={li.keywords}
              className="text-gray-600 text-md leading-relaxed mb-1 text-center"
            />
          )}
          {li.is_example ? (
            <div className="bg-gray-50 p-3 rounded-xl border-l-4 border-brand/30 w-full">
              <HighlightedText
                text={li.text}
                keywords={li.keywords}
                className="text-black text-md leading-relaxed text-center"
              />
            </div>
          ) : li.strong ? (
            <>
              <br />
              <br />
              <span className="text-brand border-2 mb-2 border-brand p-2 rounded-2xl font-arabic_bold text-center">
                {li.strong + " ⭐ "}
              </span>
              <br />
              <br />
              <HighlightedText
                text={li.text}
                keywords={li.keywords}
                className="text-black text-md leading-relaxed text-center"
              />
            </>
          ) : li.text !== li.title ? (
            <HighlightedText
              text={li.text}
              keywords={li.keywords}
              className="text-black text-md leading-relaxed text-center"
            />
          ) : null}
        </div>
      </div>

      {li.items?.length > 0 && (
        <div className="mt-3 items-center">
          {li.items.map((nested, i) => (
            <RecursiveItemRenderer
              key={`nested-${level}-${i}`}
              item={nested}
              level={level + 1}
              showBullet
              showNumber={false}
              numberIndex={i}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Block Renderers ─────────────────────────────────────────

const ProcessList = ({ block }) => (
  <div className="my-6 items-center" style={{ gap: 16 }}>
    {block.emoji && (
      <>
        <span className="text-3xl mb-1 text-center">{block.emoji}</span>
        <br />
      </>
    )}
    {(block.label || block.title) && (
      <>
        <span className="text-black text-lg mb-1 text-center">
          {block.label ?? block.title}
        </span>
        <br />
      </>
    )}
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black text-lg mb-2 text-center"
      />
    )}
    {(block.items ?? []).map((item, i) => (
      <div
        key={`process-${i}`}
        className="items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100 w-full "
      >
        <div className="w-8 h-8 rounded-full bg-brand flex items-center pb-1 justify-center mb-3">
          <span className="text-white self-center">{i + 1}</span>
        </div>
        <RecursiveItemRenderer
          item={item}
          level={0}
          showBullet={false}
          showNumber={false}
        />
      </div>
    ))}
  </div>
);

const BulletList = ({ block }) => (
  <div className="my-4 items-center" style={{ gap: 12 }}>
    {block.emoji && (
      <>
        <span className="text-3xl mb-1 text-center">{block.emoji}</span>
        <br />
      </>
    )}
    {(block.label || block.title) && (
      <span className="text-black text-lg mb-1 text-center">
        {block.label ?? block.title}
      </span>
    )}
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black text-sm mb-2 text-center"
      />
    )}
    {(block.items ?? []).map((item, i) => (
      <RecursiveItemRenderer
        key={`bullet-${i}`}
        item={item}
        level={0}
        showBullet
        showNumber={false}
        numberIndex={i}
      />
    ))}
  </div>
);

const DefinitionBox = ({ block }) => (
  <div className="my-5 justify-center bg-brand/5 rounded-xl px-5 py-5">
    <div className="flex-row text-center justify-center items-center gap-2 mb-2">
      {block.emoji && (
        <>
          <span className="text-2xl">{block.emoji}</span>
          <br />
        </>
      )}
    </div>
    {(block.label || block.title) && (
      <>
        <span className="text-brand text-md text-center justify-center mb-2">
          {block.label ?? block.title}
        </span>
        <br />
        <br />
      </>
    )}
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black text-center justify-center text-md leading-7"
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
  <div className="my-5 bg-secondary/10 rounded-2xl p-5 border border-secondary/20">
    <div className="items-center gap-2 mb-3">
      {block.emoji && (
        <>
          <span className="text-2xl text-center">{block.emoji}</span>
          <br />
        </>
      )}
      {block.badge && (
        <>
          <span className="text-brand text-lg text-center">{block.badge}</span>
          <br />
        </>
      )}
      {block.title && (
        <span className="text-brand text-lg text-center">{block.title}</span>
      )}
    </div>
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black text-md leading-relaxed text-center"
      />
    )}
    {block.items?.length > 0 && (
      <div className="mt-3">
        <BulletList block={{ items: block.items }} />
      </div>
    )}
  </div>
);

const InfoBox = ({ block }) => (
  <div className="my-4 bg-white border border-brand/20 rounded-2xl p-5 shadow-sm">
    {(block.emoji || block.label) && (
      <div className="items-center gap-2 mb-3">
        {block.emoji && (
          <>
            <span className="text-2xl text-center">{block.emoji}</span>
            <br />
          </>
        )}
        {(block.label || block.title) && (
          <span className="text-brand text-lg text-center font-arabic_bold">
            {block.label ?? block.title}
          </span>
        )}
      </div>
    )}
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black text-md leading-relaxed text-center"
      />
    )}
    {block.items?.length > 0 && (
      <div className="mt-3">
        <BulletList block={{ items: block.items }} />
      </div>
    )}
  </div>
);

const WarningBox = ({ block }) => (
  <div className="my-5 bg-red-50 border border-red-100 rounded-2xl p-5">
    <div className="items-center gap-2 mb-2">
      {block.emoji && (
        <>
          <span className="text-2xl text-center">{block.emoji}</span>
          <br />
        </>
      )}
      <span className="text-red-600 text-lg text-center">
        {block.label ?? block.title ?? "هام"}
      </span>
    </div>
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-gray-800 text-md leading-7 text-center"
      />
    )}
    {block.items?.length > 0 && (
      <div className="mt-3">
        <BulletList block={{ items: block.items }} />
      </div>
    )}
  </div>
);

const TwoColumnItem = ({ item }) => {
  const subItems = item.items ?? [];

  return (
    <div className="bg-white border text-center justify-center border-gray-200 rounded-2xl p-4 mb-3 shadow-sm">
      {item.title && (
        <>
          <span className="text-brand text-center justify-center text-lg mb-2">
            {item.title}
          </span>
          <br />
        </>
      )}
      {item.description && (
        <HighlightedText
          text={item.description}
          keywords={item.keywords ?? []}
          className="text-gray-700  text-center justify-center text-md leading-relaxed mb-3"
        />
      )}
      {subItems.length > 0 && (
        <div className="mt-2" style={{ gap: 10 }}>
          {subItems.map((sub, i) => (
            <div key={`two-sub-${i}`} className="flex-row items-start gap-2">
              <div className="mt-2 w-2 h-2 rounded-full bg-brand/60" />
              <div className="flex-1">
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
  <div className="my-4 gap-4 text-center justify-center" style={{ gap: 16 }}>
    {block.emoji && (
      <>
        <span className="text-3xl text-center justify-center mb-3 px-1">
          {block.emoji}
        </span>
        <br />
      </>
    )}
    {block.title && (
      <>
        <span className="text-black text-center justify-center text-lg px-1">
          {block.title}
        </span>
        <br />
      </>
    )}
    {block.text && (
      <HighlightedText
        text={block.text}
        keywords={block.keywords ?? []}
        className="text-black text-center justify-center text-md leading-relaxed px-1"
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
    <div className="my-5 text-center" style={{ gap: 12 }}>
      {block.emoji && (
        <>
          <span className="text-3xl mb-1 px-1 self-center">{block.emoji}</span>
          <br />
        </>
      )}
      {(block.label || block.title) && (
        <>
          <span className="text-black self-center text-lg px-1 mb-1">
            {block.label ?? block.title}
          </span>
          <br />
          <br />
        </>
      )}
      {block.text && (
        <HighlightedText
          text={block.text}
          keywords={block.keywords ?? []}
          className="text-black text-md leading-relaxed px-1 mb-2"
        />
      )}
      {items.map((item, i) => {
        const displayText = getItemText(item);
        return (
          <div
            key={`grid-${i}`}
            className="bg-white border border-gray-100 rounded-2xl p-5 items-center justify-center shadow-sm w-full"
          >
            {item.emoji && (
              <>
                <span className="text-4xl mb-2">{item.emoji}</span>
                <br />
              </>
            )}
            {item.title && (
              <>
                <span className="text-brand text-xl text-center mb-1 font-arabic_bold">
                  {item.title}
                </span>
                <br />
                <br />
              </>
            )}
            {displayText ? (
              <HighlightedText
                text={displayText}
                keywords={item.keywords ?? []}
                className="text-gray-600 text-lg text-center leading-6"
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

const BADGE_STYLES = {
  warning: {
    container: "bg-orange-100 border-orange-200",
    text: "text-orange-600",
  },
  success: {
    container: "bg-green-100 border-green-200",
    text: "text-green-600",
  },
  info: {
    container: "bg-blue-100 border-blue-200",
    text: "text-blue-600",
  },
  default: {
    container: "bg-brand/10 border-brand/20",
    text: "text-brand",
  },
};

const BadgeCard = ({ block }) => {
  const styles = BADGE_STYLES[block.style] ?? BADGE_STYLES.default;

  return (
    <div className="my-4 items-center">
      <div className={`px-6 py-2.5 rounded-full border ${styles.container}`}>
        <span className={`text-lg ${styles.text}`}>
          {block.emoji && `${block.emoji} `}
          {block.badge && (
            <span className="text-lg text-brand">{block.badge}</span>
          )}
          {block.text}
        </span>
        <br />
      </div>

      {block.items?.length > 0 && (
        <div className="mt-3 w-full">
          <BulletList block={{ items: block.items }} />
        </div>
      )}
    </div>
  );
};

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
    <div
      className="mt-8 bg-[#FFF9E6] rounded-b-xl overflow-hidden border border-[#FFE4A3] shadow-sm"
      style={{ direction: "rtl" }}
    >
      <div className="p-5">
        {/* حاوية الورقة المسطّرة */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            position: "relative", // ← الإصلاح الأساسي
            backgroundColor: "#FFF9E6",
            minHeight: 200,
          }}
        >
          {/* الخطوط الأفقية */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 8 + i * 32,
                height: 1,
                backgroundColor: "#FFE4A3",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          ))}

          {/* textarea فوق الخطوط */}
          <textarea
            placeholder={`ملاحظات ${user?.nick_name} للطلاب بخصوص هذه الفقرة.........`}
            value={draftNote}
            onChange={(e) => {
              setDraftNote(e.target.value); // ← e.target.value مش e مباشرة
              if (error || status) dispatch(clearStatus());
            }}
            style={{
              position: "relative", // ← يطفو فوق الخطوط
              zIndex: 1,
              width: "100%", // ← ملء العرض
              boxSizing: "border-box", // ← يحسب الـ padding ضمن العرض
              minHeight: 200,
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              textAlign: "right",
              lineHeight: "32px",
              fontSize: 14,
              color: "#1f2937",
            }}
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: 16,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            padding: "8px 0",
            borderRadius: "0 0 12px 12px",
            border: "none",
            cursor: "pointer",
            backgroundColor: saved ? "#22c55e" : "#e7ab1f",
            color: "white",
            fontSize: 18,
          }}
        >
          {saved ? "تم الحفظ" : "حفظ"}
        </button>

        {error && (
          <p
            style={{
              color: "#ef4444",
              textAlign: "center",
              fontSize: 14,
              marginTop: 8,
            }}
          >
            {error}
          </p>
        )}
        {status && (
          <p
            style={{
              color: "#16a34a",
              textAlign: "center",
              fontSize: 14,
              marginTop: 8,
            }}
          >
            {status}
          </p>
        )}
      </div>

      {otherNotes.length > 0 && (
        <div style={{ borderTop: "1px solid #FFE4A3" }}>
          <button
            onClick={() => setShowOthers((v) => !v)}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px",
              width: "100%",
              background: "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <People size={20} color="#8c52ff" />
            <span style={{ color: "#8c52ff", flex: 1, textAlign: "right" }}>
              نصائح الزملاء ({otherNotes.length})
            </span>
            {showOthers ? (
              <ChevronUp size={20} color="#8c52ff" />
            ) : (
              <ChevronDown size={20} color="#8c52ff" />
            )}
          </button>

          {showOthers && (
            <div
              style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {otherNotes.map((n) => (
                <div
                  key={n.student_ID}
                  style={{
                    backgroundColor: "#8c52ff",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <button
                    onClick={() => toggleStudent(n.student_ID)}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <span style={{ color: "white" }}>
                      {n.student_nick_name}
                    </span>
                    {expandedStudents.has(n.student_ID) ? (
                      <ChevronUp size={18} color="#fff" />
                    ) : (
                      <ChevronDown size={18} color="#fff" />
                    )}
                  </button>

                  {expandedStudents.has(n.student_ID) && (
                    <div
                      style={{
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        {n.note}
                      </span>
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
        <div className="mt-8 mb-2">
          <div className="items-center gap-2 mb-4">
            {block.emoji && (
              <>
                <span className="text-2xl text-center">{block.emoji}</span>
                <br />
              </>
            )}
            <span className="text-brand text-xl text-center">
              {block.text ?? block.title}
            </span>
          </div>
          {block.items?.length > 0 && (
            <BulletList block={{ items: block.items }} />
          )}
        </div>
      );

    case "h4":
      return (
        <div className="mt-6 mb-2 items-center">
          <span className="text-brand text-lg text-center">
            {block.emoji ? `${block.emoji} ` : ""}
            {block.title ?? block.text}
          </span>
          <br />
          {block.items?.length > 0 && (
            <BulletList block={{ items: block.items }} />
          )}
        </div>
      );

    case "paragraph":
      return (
        <div className="my-4 items-center">
          {block.emoji && (
            <>
              <span className="text-3xl mb-1 text-center">{block.emoji}</span>
              <br />
            </>
          )}
          {(block.label || block.title) && (
            <span className="text-brand text-lg mb-3 text-center">
              {block.label ?? block.title}
            </span>
          )}
          {block.text && (
            <HighlightedText
              text={block.text}
              keywords={block.keywords ?? []}
              className="text-gray-800 text-md leading-8 text-center"
            />
          )}
          {block.items?.length > 0 && (
            <div className="mt-3 w-full">
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

const SectionCard = ({ section, subjectId }) => (
  <div className="pb-10">
    <div className="flex flex-col items-center justify-center gap-4 text-center mb-8">
      <div className="w-10 h-10 self-center rounded-2xl text-center bg-brand flex items-center justify-center shadow-lg shadow-brand/30">
        <span className="text-white self-center text-center text-lg">
          {section.number}
        </span>
      </div>
      <span className="text-brand text-xl self-center text-center flex-1 leading-relaxed">
        {section.title}
      </span>
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

  const { selectedLectures } = useSelector((state) => state.exam);
  const { selectedSubject } = useSelector((state) => state.selection);

  const summaryData = useMemo(
    () =>
      selectedSubject?.summary?.filter((s) =>
        selectedLectures.includes(s.meta?.lecture_title),
      ) ?? [],
    [selectedSubject, selectedLectures],
  );

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
  console.log(summaryData);
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
          مقرر
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
          تسميع
        </span>
      </button>
    </div>
  );

  return (
    <div dir="rtl" className="flex font-arabic flex-col h-screen bg-brand">
      <div>
        <TabSwitch />
      </div>

      <div
        className={`${activeTab === "summary" ? "flex" : "hidden"} flex-col flex-1 bg-white overflow-hidden`}
      >
        {!hasSummary ? (
          <div className="flex-1 bg-brand flex items-center justify-center">
            <EmptyState type="summary" />
          </div>
        ) : (
          <>
            <div className="bg-brand px-5 pb-6 ">
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center flex-1 px-4">
                  <p className="text-white/70 text-lg">
                    {currentSection?.lectureTitle}
                  </p>
                </div>
              </div>

              <div className="h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / allSections.length) * 100}%`,
                  }}
                />
              </div>
            </div>

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
