import type { FC } from "react";
import type { UndoStack } from "create-project-state";
import { useUndoStack } from "create-project-state/react";

type Props = {
  undoStack: UndoStack;
};

const UndoStackViewer: FC<Props> = ({ undoStack }) => {
  const stack = useUndoStack(undoStack);
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
      {stack.getStack().map((item, i) => (
        <p
          key={i}
          style={{
            color:
              item.type === "past"
                ? "gray"
                : item.type === "future"
                ? "red"
                : "green",
          }}
        >
          {item.name}
        </p>
      ))}
      <button onClick={stack.undo.bind(stack)}>Undo</button>
      <button onClick={stack.redo.bind(stack)}>Redo</button>
    </div>
  );
};

export default UndoStackViewer;
