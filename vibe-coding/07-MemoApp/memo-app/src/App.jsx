import React, { useState } from "react";
import "./App.css";

function App() {
  const [memos, setMemos] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newText, setNewText] = useState("");

  // 새 메모 추가
  const addMemo = () => {
    const newMemo = {
      id: Date.now(),
      text: "",
    };
    setMemos([newMemo, ...memos]);
    setEditingId(newMemo.id);
    setNewText("");
  };

  // 메모 수정 모드 전환
  const editMemo = (id, text) => {
    setEditingId(id);
    setNewText(text);
  };

  // 메모 저장
  const saveMemo = (id) => {
    setMemos(
      memos.map((memo) =>
        memo.id === id ? { ...memo, text: newText } : memo
      )
    );
    setEditingId(null);
    setNewText("");
  };

  // 메모 삭제
  const deleteMemo = (id) => {
    setMemos(memos.filter((memo) => memo.id !== id));
  };

  // 검색된 메모
  const filteredMemos = memos.filter((memo) =>
    memo.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      <h1>메모 앱11</h1>
      <div className="controls">
        <button onClick={addMemo}>새 메모</button>
        <input
          type="text"
          placeholder="메모 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul>
        {filteredMemos.map((memo) => (
          <li key={memo.id}>
            {editingId === memo.id ? (
              <>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows="3"
                />
                <button onClick={() => saveMemo(memo.id)}>저장</button>
              </>
            ) : (
              <>
                <span>{memo.text || <i>(빈 메모)</i>}</span>
                <button onClick={() => editMemo(memo.id, memo.text)}>수정</button>
                <button onClick={() => deleteMemo(memo.id)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
