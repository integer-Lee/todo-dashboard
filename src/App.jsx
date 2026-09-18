import { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "todo-dashboard-todos";

const defaultTodos = [
  { id: 1, title: "React 화면 구조 살펴보기", category: "학습", done: false },
  { id: 2, title: "오늘 할 일 한 가지 적어 보기", category: "개인", done: false },
];

function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);

    if (!savedTodos) return defaultTodos;

    const parsedTodos = JSON.parse(savedTodos);
    const isValidTodos =
      Array.isArray(parsedTodos) &&
      parsedTodos.every(
        (todo) =>
          typeof todo.id === "number" &&
          typeof todo.title === "string" &&
          typeof todo.category === "string" &&
          typeof todo.done === "boolean",
      );

    return isValidTodos ? parsedTodos : defaultTodos;
  } catch {
    return defaultTodos;
  }
}

function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // 저장 공간이 없거나 브라우저 저장소를 사용할 수 없는 경우에도 앱은 계속 동작합니다.
    }
  }, [todos]);

  const completedTodos = todos.filter((todo) => todo.done);
  const remainingTodos = todos.filter((todo) => !todo.done);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedTodo = newTodo.trim();

    if (!trimmedTodo) return;

    setTodos([
      ...todos,
      { id: Date.now(), title: trimmedTodo, category: "새 할 일", done: false },
    ]);
    setNewTodo("");
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function renderTodoItem(todo) {
    return (
      <li key={todo.id} className={todo.done ? "done" : ""}>
        <button
          type="button"
          className="check-button"
          onClick={() => toggleTodo(todo.id)}
          aria-label={`${todo.title} ${todo.done ? "미완료로 변경" : "완료하기"}`}
        >
          {todo.done ? "✓" : ""}
        </button>
        <div className="todo-content">
          <strong>{todo.title}</strong>
          <span>{todo.category}</span>
        </div>
        <button type="button" className="delete-button" onClick={() => deleteTodo(todo.id)}>
          삭제
        </button>
      </li>
    );
  }

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">MY DAY</p>
        <h1>나의 할 일 대시보드</h1>
        <p className="subtitle">오늘 해야 할 일을 가볍게 확인해 보세요.</p>
      </header>

      <section className="stats" aria-label="할 일 통계">
        <article className="stat-card"><span>전체 할 일</span><strong>{todos.length}</strong></article>
        <article className="stat-card"><span>진행 중</span><strong>{remainingTodos.length}</strong></article>
        <article className="stat-card"><span>완료</span><strong>{completedTodos.length}</strong></article>
      </section>

      <section className="todo-panel" aria-labelledby="todo-heading">
        <div className="panel-heading">
          <div><p className="section-label">TODAY</p><h2 id="todo-heading">오늘의 할 일</h2></div>
          <span className="count-badge">{remainingTodos.length}개 남음</span>
        </div>
        <form className="todo-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="new-todo">새 할 일</label>
          <input id="new-todo" type="text" value={newTodo} onChange={(event) => setNewTodo(event.target.value)} placeholder="새 할 일을 입력하세요" />
          <button type="submit">추가</button>
        </form>
        {todos.length === 0 ? (
          <div className="empty-state">
            <h3>아직 등록된 할 일이 없습니다.</h3>
            <p>위 입력창에 오늘 할 일을 추가해 보세요.</p>
          </div>
        ) : remainingTodos.length > 0 ? (
          <ul className="todo-list">{remainingTodos.map(renderTodoItem)}</ul>
        ) : (
          <p className="list-empty-message">진행 중인 할 일이 없어요.</p>
        )}
      </section>

      <section className="empty-panel" aria-labelledby="completed-heading">
        <h2 id="completed-heading">완료한 할 일</h2>
        {completedTodos.length > 0 ? <ul className="todo-list completed-list">{completedTodos.map(renderTodoItem)}</ul> : <p>아직 완료한 할 일이 없어요. 첫 번째 할 일을 끝내 볼까요?</p>}
      </section>
    </main>
  );
}

export default App;
