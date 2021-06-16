import { useUndoStack, undo, redo } from "../lib/undoStack";

const UndoStack = () => {
  const stack = useUndoStack();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 230,
        width: 200,
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
        border: "1px double black",
        backgroundColor: "beige",
        padding: 5,
      }}
    >
      <h2>Undo history</h2>
      {stack.past.map((item, i) => (
        <p key={`past-${i}`} style={{ color: "gray" }}>
          {item.name}
        </p>
      ))}
      <p style={{ color: "blue" }}>{stack.present.name}</p>
      {stack.future.map((item, i) => (
        <p key={`future-${i}`} style={{ color: "red" }}>
          {item.name}
        </p>
      ))}
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </div>
  );
};

export default UndoStack;
