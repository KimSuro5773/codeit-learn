// src/components/TodoItem/index.tsx
export default function TodoItem({ task, completed }: { task: string; completed: boolean }) {
  return (
    <li className={completed ? "completed" : ""}>
      <input type="checkbox" checked={completed} disabled={completed} />
      <span>{task}</span>
      <button disabled={completed}>수정</button>
    </li>
  );
}
