import { useState, useEffect } from "react";
import type { UndoStack, State } from "..";

/**
 * A simple hook that returns a function to trigger a rerender for the current component.
 */
const useForceUpdate = () => {
  const [fakeState, setFakeState] = useState(false);
  return () => {
    setFakeState(!fakeState);
  };
};

/**
 * A hook to update the component whenever the stack changes.
 * Useful for a stack/history viewer.
 *
 * @param stack The stack to watch.
 * @returns The stack passed as parameter.
 *
 * @example
 * ```ts
 * const StackDisplay = () => {
 *   useUndoStack(stack);
 *   return stack
 *     .getStack()
 *     .map(entry => entry.name)
 *     .map(entry => <p>{entry}</p>);
 * }
 * ```
 */
export const useUndoStack = (stack: UndoStack) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    stack.subscribe(forceUpdate);
    return () => {
      stack.unsubscribe(forceUpdate);
    };
  }, [forceUpdate, stack]);

  return stack;
};

/**
 * Allows using a state, while rerendering the component when it changes
 * and caching the return value of {@link State.getState} for better performance.
 *
 * @param state The state to use.
 * @param args The arguments for {@link State.getState}.
 * @returns The state and dispatchers in an array.
 *
 * @example
 * ```ts
 * // MyState: State<["name" | "surname"], string, { setState: (newState: string) => void }>
 * const MyComponent = (props: { type: "name" | "surname" }) => {
 *   const [state, dispatchers] = useProjectState(MyState, props.type);
 *   return <p onClick={() => dispatchers.setState("New state")}>{state}</p>;
 * }
 * ```
 */
export const useProjectState = <
  GetStateArgs extends any[],
  StateShape,
  Dispatcher
>(
  state: State<GetStateArgs, StateShape, Dispatcher>,
  ...args: GetStateArgs
): [StateShape, Dispatcher] => {
  // The state is used for caching the return value of getState, as it might be
  // a costly function, so we don't want to recall it on every render, only when
  // it has been marked as modified by the project state.
  const [currentState, setCurrentState] = useState<StateShape>(() =>
    state.getState(...args)
  );

  // If getState always returns a reference to the same object,
  // but the object properties have been changed, react won't
  // know better and won't modify the state or rerender the component
  // as it believe the state hasn't changed. So we use this other forceUpdate
  // state to ensure a rerender will happen.
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const update = () => {
      setCurrentState(state.getState(...args));
      forceUpdate();
    };
    state.subscribe(update);
    return () => state.unsubscribe(update);
  }, [state, forceUpdate]);

  return [currentState, state.dispatchers];
};
