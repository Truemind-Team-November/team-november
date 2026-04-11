import { useState } from "react";
import client from "@/lib/client";

const COLORS = {
  bg: "#0f1623",
  card: "#161d2e",
  cardHover: "#1a2235",
  border: "#252f45",
  borderLight: "#2e3a52",
  text: "#e8edf5",
  textMuted: "#7a8aaa",
  textDim: "#4a5a7a",
  accent: "#3b6ef5",
  accentHover: "#2f5de0",
  success: "#1a7a4a",
  successText: "#4ade80",
  error: "#7a1a1a",
  errorText: "#f87171",
  tagBg: "#1e2a42",
  tagBorder: "#2e3d5c",
};

const TAG_COLORS = [
  { bg: "#1a2e4a", border: "#2a4a7a", text: "#60a5fa" },
  { bg: "#2a1a3a", border: "#4a2a6a", text: "#c084fc" },
  { bg: "#1a3a2a", border: "#2a6a4a", text: "#34d399" },
  { bg: "#3a2a1a", border: "#6a4a2a", text: "#fb923c" },
  { bg: "#3a1a1a", border: "#6a2a2a", text: "#f87171" },
];

export default function CreatePostForm({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleFocus, setTitleFocus] = useState(false);
  const [contentFocus, setContentFocus] = useState(false);
  const [tagFocus, setTagFocus] = useState(false);

  const addTag = () => {
    const val = tagInput.trim();
    if (!val || tags.includes(val) || tags.length >= 5) return;
    setTags([...tags, val]);
    setTagInput("");
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleTagKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const reset = () => {
    setTitle("");
    setContent("");
    setTagInput("");
    setTags([]);
    setStatus(null);
    if (onClose) onClose();
  };

  const submit = async () => {
    if (!title.trim()) {
      setStatus({ type: "error", msg: "Please add a title before posting." });
      return;
    }
    if (!content.trim()) {
      setStatus({
        type: "error",
        msg: "Please add some content before posting.",
      });
      return;
    }
    
    // As per the payload structure required by the API
    const p = {
      title: title.trim(),
      content: content.trim(),
      tags: tags, // The C# DTO expects an array of strings (IReadOnlyCollection<string>)
    };
    
    setIsSubmitting(true);
    setStatus(null);
    
    try {
      const response = await client.post('/Discussion', p);
      setStatus({ type: "success", msg: "Post created successfully!" });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        reset();
      }, 1500);
    } catch (error) {
      console.error("Error creating post:", error);
      const errorMsg = error.response?.data?.message || "Failed to create post. Please try again.";
      setStatus({ type: "error", msg: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (focused) => ({
    width: "100%",
    boxSizing: "border-box",
    background: focused ? "#1a2235" : "#131929",
    border: `1px solid ${focused ? COLORS.accent : COLORS.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    color: COLORS.text,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.15s, background 0.15s",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .post-btn:hover { background: ${COLORS.accentHover} !important; }
        .cancel-btn:hover { background: ${COLORS.border} !important; }
        .tag-x:hover { color: ${COLORS.text} !important; }
        .add-tag-btn:hover { background: ${COLORS.border} !important; }
        .copy-btn:hover { background: #1e2a42 !important; }
        ::placeholder { color: ${COLORS.textDim}; }
      `}</style>

      <div
        style={{
          background: COLORS.bg,
          padding: "clamp(1.5rem, 5vw, 2rem)",
          borderRadius: 16,
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: COLORS.textMuted,
                textTransform: "uppercase",
                margin: "0 0 4px",
              }}
            >
              Community
            </p>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: COLORS.text,
                margin: 0,
              }}
            >
              Start a discussion
            </h1>
          </div>

          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "1.5rem",
            }}
          >
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                  letterSpacing: "0.04em",
                }}
              >
                TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setTitleFocus(true)}
                onBlur={() => setTitleFocus(false)}
                placeholder="What's your question or topic?"
                style={inputStyle(titleFocus)}
              />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                  letterSpacing: "0.04em",
                }}
              >
                CONTENT
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setContentFocus(true)}
                onBlur={() => setContentFocus(false)}
                placeholder="Share details, context, or anything helpful..."
                rows={6}
                style={{
                  ...inputStyle(contentFocus),
                  resize: "vertical",
                  lineHeight: 1.65,
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                  letterSpacing: "0.04em",
                }}
              >
                TAGS
              </label>

              {tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  {tags.map((tag, i) => {
                    const c = TAG_COLORS[i % TAG_COLORS.length];
                    return (
                      <span
                        key={tag}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          borderRadius: 99,
                          fontSize: 12,
                          fontWeight: 500,
                          background: c.bg,
                          border: `1px solid ${c.border}`,
                          color: c.text,
                        }}
                      >
                        {tag}
                        <span
                          className="tag-x"
                          onClick={() => removeTag(tag)}
                          style={{
                            cursor: "pointer",
                            color: COLORS.textDim,
                            fontSize: 15,
                            lineHeight: 1,
                            transition: "color 0.1s",
                          }}
                        >
                          &times;
                        </span>
                      </span>
                    );
                  })}
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  onFocus={() => setTagFocus(true)}
                  onBlur={() => setTagFocus(false)}
                  placeholder={
                    tags.length >= 5
                      ? "Maximum tags reached"
                      : "Add a tag and press Enter"
                  }
                  disabled={tags.length >= 5}
                  style={{ ...inputStyle(tagFocus), flex: 1 }}
                />
                <button
                  className="add-tag-btn"
                  onClick={addTag}
                  disabled={tags.length >= 5}
                  style={{
                    padding: "0 16px",
                    fontSize: 13,
                    fontWeight: 500,
                    color: COLORS.textMuted,
                    background: COLORS.tagBg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "background 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add
                </button>
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: COLORS.textDim,
                  margin: "6px 0 0",
                }}
              >
                {tags.length}/5 tags used
              </p>
            </div>

            {status && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: "1rem",
                  background:
                    status.type === "error" ? COLORS.error : COLORS.success,
                  color:
                    status.type === "error"
                      ? COLORS.errorText
                      : COLORS.successText,
                  border: `1px solid ${status.type === "error" ? "#a03030" : "#2a9a5a"}`,
                }}
              >
                {status.msg}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                paddingTop: "1.25rem",
                borderTop: `1px solid ${COLORS.border}`,
              }}
            >
              <button
                className="cancel-btn"
                onClick={reset}
                style={{
                  padding: "9px 20px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  background: "transparent",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.15s",
                }}
              >
                Cancel
              </button>
              <button
                className="post-btn"
                onClick={submit}
                disabled={isSubmitting}
                style={{
                  padding: "9px 22px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  background: isSubmitting ? COLORS.borderLight : COLORS.accent,
                  border: "none",
                  borderRadius: 8,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.15s",
                }}
              >
                {isSubmitting ? "Posting..." : "Post discussion"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
