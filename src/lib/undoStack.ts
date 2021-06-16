import { useEffect } from "react";
import { useForceUpdate } from "./forceUpdate";

export type StackItem = {
  name: string;
  undo: () => void;
  redo: () => void;
};

export const stack: {
  past: StackItem[];
  present: StackItem;
  future: StackItem[];
} = {
  past: [],
  present: { name: "projectOpen", undo: () => null, redo: () => null },
  future: [],
};

const onUpdateStack: (() => void)[] = [];
const updateStack = () => onUpdateStack.forEach((updater) => updater());
export const useUndoStack = () => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    onUpdateStack.push(forceUpdate);
    return () => {
      onUpdateStack.splice(onUpdateStack.indexOf(forceUpdate), 1);
    };
  }, [forceUpdate]);
  return stack;
};

export const push = (item: StackItem) => {
  // Rewriting the future, old future is discarded
  stack.future = [];

  stack.past.push(stack.present);
  stack.present = item;

  updateStack();
};

export const undo = () => {
  if (stack.past.length === 0) return;

  stack.present.undo();
  stack.future.unshift(stack.present);
  stack.present = stack.past.pop()!;

  updateStack();
};

export const redo = () => {
  if (stack.future.length === 0) return;

  stack.past.push(stack.present);
  stack.present = stack.future.shift()!;
  stack.present.redo();

  updateStack();
};

window.addEventListener("keydown", (e) => {
  if (e.key === "z" && e.ctrlKey) undo();
  if (e.key === "y" && e.ctrlKey) redo();
});
