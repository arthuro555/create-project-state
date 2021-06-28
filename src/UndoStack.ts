export type StackItem = {
  name: string;
  undo: () => void;
  redo: () => void;
};

export type StackView = {
  name: string;
  type: "present" | "past" | "future";
}[];

export type RawStack = {
  past: StackItem[];
  present: StackItem;
  future: StackItem[];
};

export class UndoStack {
  private readonly stack: RawStack = {
    past: [],
    present: { name: "begin", undo: () => null, redo: () => null },
    future: [],
  };

  private readonly _onUpdateStack: (() => void)[] = [];
  private _updateStack() {
    this._onUpdateStack.forEach((f) => f());
  }

  constructor() {
    if (typeof window !== "undefined")
      window.addEventListener("keydown", (e) => {
        if (e.key === "z" && e.ctrlKey) this.undo();
        if (e.key === "y" && e.ctrlKey) this.redo();
      });
  }

  subscribe(f: () => void) {
    this._onUpdateStack.push(f);
  }

  unsubscribe(f: () => void) {
    const index = this._onUpdateStack.indexOf(f);
    if (index !== -1) this._onUpdateStack.splice(index, 1);
  }

  push(item: StackItem) {
    // Rewriting the future, old future is discarded
    this.stack.future = [];

    this.stack.past.push(this.stack.present);
    this.stack.present = item;

    this._updateStack();
  }

  undo() {
    if (this.stack.past.length === 0) return;

    this.stack.present.undo();
    this.stack.future.unshift(this.stack.present);
    this.stack.present = this.stack.past.pop()!;

    this._updateStack();
  }

  redo() {
    if (this.stack.future.length === 0) return;

    this.stack.past.push(this.stack.present);
    this.stack.present = this.stack.future.shift()!;
    this.stack.present.redo();

    this._updateStack();
  }

  getStack(): StackView {
    const stack: StackView = this.stack.past.map(({ name }) => ({
      name,
      type: "past",
    }));
    stack.push({ name: this.stack.present.name, type: "present" });
    stack.push.apply(
      stack,
      this.stack.future.map(({ name }) => ({
        name,
        type: "future" as "future",
      }))
    );

    return stack;
  }
}
