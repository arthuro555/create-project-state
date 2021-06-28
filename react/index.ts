import { useState, useEffect } from "react";
import type { UndoStack, State } from "..";

const useForceUpdate = () => {
  const [fakeState, setFakeState] = useState(false);
  return () => {
    setFakeState(!fakeState);
  };
};

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

// Create a hook to access this state
export const useProjectState = <
  GetStateArgs extends any[],
  StateShape,
  Dispatcher
>(
  state: State<GetStateArgs, StateShape, Dispatcher>,
  ...args: GetStateArgs
): [StateShape, Dispatcher] => {
  const [currentState, setCurrentState] = useState<StateShape>(() =>
    state.getState(...args)
  );
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const update = () => {
      setCurrentState(state.getState(...args));
      // Not sure why the forceUpdate is needed but some components don't update when they should without it.
      forceUpdate();
    };
    state.subscribe(update);
    return () => state.unsubscribe(update);
  }, [state, forceUpdate]);

  return [currentState, state.dispatchers];
};
