import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "personal", label: "Personal", emoji: "🏠", color: "#FF6B9D" },
  { id: "work", label: "Work", emoji: "💼", color: "#4ECDC4" },
  { id: "health", label: "Health", emoji: "💪", color: "#45B7D1" },
  { id: "shopping", label: "Shopping", emoji: "🛒", color: "#FFA07A" },
  { id: "other", label: "Other", emoji: "✨", color: "#A78BFA" },
];

const PRIORITIES = [
  { id: "low", label: "Low", color: "#6EE7B7", bg: "#ECFDF5" },
  { id: "medium", label: "Medium", color: "#FCD34D", bg: "#FFFBEB" },
  { id: "high", label: "High", color: "#F87171", bg: "#FEF2F2" },
];

const priorityOrder = { high: 0, medium: 1, low: 2 };

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr + "T00:00:00") < new Date(new Date().toDateString());
}

export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Welcome to your to-do app! 🎉", category: "personal", priority: "high", dueDate: "", done: false },
    { id: 2, text: "Try adding a new task below", category: "work", priority: "medium", dueDate: "", done: false },
  ]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("personal");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterPri, setFilterPri] = useState("all");
  const [showDone, setShowDone] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [confetti, setConfetti] = useState([]);

  function spawnConfetti() {
    const pieces = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: ["#FF6B9D","#4ECDC4","#FCD34D","#A78BFA","#F87171","#6EE7B7"][Math.floor(Math.random()*6)],
      delay: Math.random() * 0.4,
      size: 8 + Math.random() * 8,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 1200);
  }

  function addTodo() {
    if (!text.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: text.trim(), category, priority, dueDate, done: false }]);
    setText(""); setDueDate("");
  }

  function toggleDone(id) {
    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.done) spawnConfetti();
        return { ...t, done: !t.done };
      }
      return t;
    }));
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function saveEdit(id) {
    if (!editText.trim()) return;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: editText.trim() } : t));
    setEditId(null);
  }

  const filtered = todos
    .filter(t => filterCat === "all" || t.category === filterCat)
    .filter(t => filterPri === "all" || t.priority === filterPri)
    .filter(t => showDone || !t.done)
    .sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const doneCount = todos.filter(t => t.done).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #f093fb 50%, #4facfe 100%)",
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      padding: "24px 16px",
    }}>
      {/* Confetti */}
      {confetti.map(c => (
        <div key={c.id} style={{
          position: "fixed", left: `${c.x}vw`, top: "-20px",
          width: c.size, height: c.size, borderRadius: "2px",
          background: c.color, zIndex: 9999, pointerEvents: "none",
          animation: `fall 1.1s ease-in forwards`,
          animationDelay: `${c.delay}s`,
        }} />
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
        @keyframes pop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
        @keyframes slideIn { from{transform:translateY(-8px);opacity:0} to{transform:translateY(0);opacity:1} }
        .todo-card { animation: slideIn 0.25s ease; }
        .todo-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.13) !important; }
        .add-btn:hover { transform: scale(1.04); }
        .del-btn:hover { background: #FEE2E2 !important; }
        .check-box:hover { transform: scale(1.15); }
        * { box-sizing: border-box; transition: box-shadow 0.2s, transform 0.15s; }
        input[type=date]::-webkit-calendar-picker-indicator { cursor: pointer; }
      `}</style>

      <div style={{ maxWidth: 620, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 4 }}>📋</div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1, textShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
            My Tasks
          </h1>
          <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600 }}>
            {doneCount}/{todos.length} completed 🎯
          </p>
        </div>

        {/* Add Task Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTodo()}
              placeholder="What needs to be done? ✍️"
              style={{ flex: 1, border: "2px solid #E9D5FF", borderRadius: 12, padding: "10px 14px", fontSize: 15, fontFamily: "inherit", outline: "none", fontWeight: 600 }}
              onFocus={e => e.target.style.borderColor="#A78BFA"}
              onBlur={e => e.target.style.borderColor="#E9D5FF"}
            />
            <button className="add-btn" onClick={addTodo} style={{
              background: "linear-gradient(135deg,#667eea,#f093fb)", color: "#fff", border: "none",
              borderRadius: 12, padding: "10px 18px", fontSize: 22, cursor: "pointer", fontWeight: 900,
            }}>+</button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {/* Category */}
            <select value={category} onChange={e => setCategory(e.target.value)} style={{
              flex: 1, minWidth: 110, border: "2px solid #E9D5FF", borderRadius: 10, padding: "8px 10px",
              fontSize: 13, fontFamily: "inherit", fontWeight: 700, cursor: "pointer", background: "#fafafa",
            }}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
            {/* Priority */}
            <select value={priority} onChange={e => setPriority(e.target.value)} style={{
              flex: 1, minWidth: 100, border: "2px solid #E9D5FF", borderRadius: 10, padding: "8px 10px",
              fontSize: 13, fontFamily: "inherit", fontWeight: 700, cursor: "pointer", background: "#fafafa",
            }}>
              {PRIORITIES.map(p => <option key={p.id} value={p.id}>🔥 {p.label}</option>)}
            </select>
            {/* Due date */}
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{
              flex: 1, minWidth: 130, border: "2px solid #E9D5FF", borderRadius: 10, padding: "8px 10px",
              fontSize: 13, fontFamily: "inherit", fontWeight: 700, cursor: "pointer", background: "#fafafa",
            }} />
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 16, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 13, marginRight: 4 }}>Filter:</span>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{
            border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontFamily: "inherit", fontWeight: 700, cursor: "pointer",
          }}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>
          <select value={filterPri} onChange={e => setFilterPri(e.target.value)} style={{
            border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontFamily: "inherit", fontWeight: 700, cursor: "pointer",
          }}>
            <option value="all">All Priorities</option>
            {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <button onClick={() => setShowDone(v => !v)} style={{
            border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontFamily: "inherit",
            fontWeight: 700, cursor: "pointer", background: showDone ? "#fff" : "rgba(255,255,255,0.4)",
            color: showDone ? "#667eea" : "#fff",
          }}>
            {showDone ? "Hide Done ✅" : "Show Done ✅"}
          </button>
        </div>

        {/* Task List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 16 }}>
              No tasks here! 🎉 Add one above.
            </div>
          )}
          {filtered.map(todo => {
            const cat = CATEGORIES.find(c => c.id === todo.category);
            const pri = PRIORITIES.find(p => p.id === todo.priority);
            const overdue = !todo.done && isOverdue(todo.dueDate);
            return (
              <div key={todo.id} className="todo-card" style={{
                background: todo.done ? "#F9FAFB" : "#fff",
                borderRadius: 16, padding: "14px 16px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                borderLeft: `5px solid ${todo.done ? "#D1D5DB" : cat.color}`,
                opacity: todo.done ? 0.7 : 1,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  {/* Checkbox */}
                  <button className="check-box" onClick={() => toggleDone(todo.id)} style={{
                    width: 26, height: 26, borderRadius: 8, border: `2.5px solid ${todo.done ? "#9CA3AF" : cat.color}`,
                    background: todo.done ? "#9CA3AF" : "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, color: "#fff", flexShrink: 0, marginTop: 1,
                    transition: "all 0.15s",
                  }}>
                    {todo.done ? "✓" : ""}
                  </button>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {editId === todo.id ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <input value={editText} onChange={e => setEditText(e.target.value)}
                          onKeyDown={e => { if(e.key==="Enter") saveEdit(todo.id); if(e.key==="Escape") setEditId(null); }}
                          autoFocus style={{ flex: 1, border: "2px solid #A78BFA", borderRadius: 8, padding: "4px 8px", fontSize: 14, fontFamily: "inherit", fontWeight: 600 }} />
                        <button onClick={() => saveEdit(todo.id)} style={{ background: "#A78BFA", color: "#fff", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontWeight: 700 }}>✓</button>
                        <button onClick={() => setEditId(null)} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontWeight: 700 }}>✕</button>
                      </div>
                    ) : (
                      <p onDoubleClick={() => { setEditId(todo.id); setEditText(todo.text); }}
                        style={{ margin: 0, fontSize: 15, fontWeight: 700, color: todo.done ? "#9CA3AF" : "#1F2937",
                          textDecoration: todo.done ? "line-through" : "none", cursor: "text", wordBreak: "break-word" }}>
                        {todo.text}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                      {/* Category badge */}
                      <span style={{ background: cat.color + "22", color: cat.color, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>
                        {cat.emoji} {cat.label}
                      </span>
                      {/* Priority badge */}
                      <span style={{ background: pri.bg, color: pri.color, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 800, border: `1px solid ${pri.color}40` }}>
                        🔥 {pri.label}
                      </span>
                      {/* Due date */}
                      {todo.dueDate && (
                        <span style={{ background: overdue ? "#FEE2E2" : "#F3F4F6", color: overdue ? "#EF4444" : "#6B7280", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>
                          {overdue ? "⚠️ " : "📅 "}{formatDate(todo.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button onClick={() => { setEditId(todo.id); setEditText(todo.text); }} style={{
                      background: "#F3F4F6", border: "none", borderRadius: 8, width: 30, height: 30,
                      cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✏️</button>
                    <button className="del-btn" onClick={() => deleteTodo(todo.id)} style={{
                      background: "#FEF2F2", border: "none", borderRadius: 8, width: 30, height: 30,
                      cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>🗑️</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700 }}>
            Double-tap any task to edit it ✏️
          </div>
        )}
      </div>
    </div>
  );
}
