import { useEffect } from "react";
import { useForceUpdate } from "./forceUpdate";
import { push } from "./undoStack";

export const createProjectState = <
  State extends any,
  GetStateArgs extends any[],
  Dispatchers extends Record<string, (...args) => () => void>
>(stateDesc: {
  getState: (...args: GetStateArgs) => State;
  dispatchers: Dispatchers;
}): ((...args: GetStateArgs) => [State, Dispatchers]) => {
  // This allows to forceUpdate all components using the state at once
  const onUpdate: (() => void)[] = [];
  const update = () => onUpdate.forEach((updater) => updater());

  // Build dispatchers that call update() and push onto the stack
  const dispatchers: Record<string, (...args) => void> = {};
  for (const [name, func] of Object.entries(stateDesc.dispatchers)) {
    dispatchers[name] = (...args) => {
      const undo = func(...args);
      push({
        name,
        undo: () => {
          undo();
          update();
        },
        redo: () => {
          func(...args);
          update();
        },
      });
      update();
    };
  }

  // Create a hook to access this state
  const useProjectState = (...args: GetStateArgs) => {
    const forceUpdate = useForceUpdate();

    //(Un)register the forceUpdate to be called when the state is modified.
    useEffect(() => {
      onUpdate.push(forceUpdate);
      return () => {
        onUpdate.splice(onUpdate.indexOf(forceUpdate), 1);
      };
    }, [forceUpdate]);

    return [stateDesc.getState(...args), dispatchers] as [State, Dispatchers];
  };

  return useProjectState;
};
