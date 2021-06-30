/**
 * An operation in the undo stack, it has a name for display, and functions to undo or redo it.
 */
export interface StackItem {
  name: string;
  undo: () => void;
  redo: () => void;
}

/**
 * An undo stack, separating future, present and past operations.
 */
export interface RawStack {
  past: StackItem[];
  present: StackItem;
  future: StackItem[];
}

/**
 * An array of names of stack entries from oldest to newest.
 */
export type StackView = {
  name: string;
  type: "present" | "past" | "future";
}[];

export class UndoStack {
  /** The raw stack. */
  private readonly stack: RawStack = {
    past: [],
    present: { name: "begin", undo: () => null, redo: () => null },
    future: [],
  };

  /** The update callbacks list. */
  private readonly _onUpdateStack: (() => void)[] = [];
  /** Calls the update callbacks. */
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

  /**
   * Adds a callback for whenever the undo stack is changed.
   */
  subscribe(f: () => void) {
    this._onUpdateStack.push(f);
  }

  /**
   * Removes a callback for whenever the undo stack is changed.
   */
  unsubscribe(f: () => void) {
    const index = this._onUpdateStack.indexOf(f);
    if (index !== -1) this._onUpdateStack.splice(index, 1);
  }

  /**
   * Adds an opearation to the stack.
   * Called automatically when a ProjectState dispatcher is used.
   */
  push(item: StackItem) {
    // Rewriting the future, old future is discarded
    this.stack.future = [];

    this.stack.past.push(this.stack.present);
    this.stack.present = item;

    this._updateStack();
  }

  /**
   * Undoes the last operation on the stack.
   */
  undo() {
    if (this.stack.past.length === 0) return;

    this.stack.present.undo();
    this.stack.future.unshift(this.stack.present);
    this.stack.present = this.stack.past.pop()!;

    this._updateStack();
  }

  /**
   * Redoes the last undone operation on the stack.
   */
  redo() {
    if (this.stack.future.length === 0) return;

    this.stack.past.push(this.stack.present);
    this.stack.present = this.stack.future.shift()!;
    this.stack.present.redo();

    this._updateStack();
  }

  /**
   * Gets a view of the stack for visualizing the undo stack.
   */
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
