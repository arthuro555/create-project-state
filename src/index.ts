import { UndoStack } from "./UndoStack";
export type { UndoStack };

/**
 * A dispatcher declaration, a function that will mutate the state in a specic way and return a function to undoes that mutation.
 */
type DispatcherDeclarationType = (...args: any[]) => () => void;
/**
 * A record of dispatcher declarations.
 */
type DispatchersDeclarationMap = Record<string, DispatcherDeclarationType>;
/**
 * A utility type to convert a dispatcher declarations (functions that mutates the state and return a function to undo the operation)
 * into a dispatcher (function that mutates the states and pushes onto an undo stack a function to undo the operation)
 */
type Dispatcher<Declaration extends DispatcherDeclarationType> = (
  ...args: Parameters<Declaration>
) => void;
/**
 * A utility type to convert a record of dispatcher declarations into a record of dispatchers.
 */
type DispatchersMap<Declarations extends DispatchersDeclarationMap> = {
  [Decl in keyof Declarations]: Dispatcher<Declarations[Decl]>;
};
/**
 * A record of state managers.
 */
type StateManagersMap = Record<string, StateManager<any, any, any>>;

/**
 * A state manager descriptor. It is used to construct an {@link StateManager}.
 */
export interface StateDescriptor<
  GetStateArgs extends any[],
  StateShape extends any,
  Dispatchers extends DispatchersDeclarationMap
> {
  /**
   * The name of a state manager. It is used to identify it in the global states map,
   * which is necessary for server sent state updates to be dispatched to the right state manager.
   */
  name: string;

  /**
   * A function returning the current value of the state.
   */
  getState: (...args: GetStateArgs) => StateShape;

  /**
   * A map of dispatcher functions.
   * A dispatcher is a function that will mutate the state in a specic way and return a function to undo that mutation.
   * It is what is used to interact with the state, undo and redo operations.
   */
  dispatchers: Dispatchers;
}

/**
 * A state that can be subscribed to for whenever it changes, that has a value and dispatchers.
 */
export interface StateManager<
  GetStateArgs extends any[],
  StateManagerShape extends any,
  Dispatchers
> {
  /**
   * Registers a callback to call on any changes to the state.
   */
  subscribe: (fn: () => void) => void;

  /**
   * Unregisters a previously set callback.
   */
  unsubscribe: (fn: () => void) => void;

  /**
   * Get the current value of the state.
   */
  getState: (...args: GetStateArgs) => StateManagerShape;

  /**
   * Calls the update callbacks.
   * To be called whenever the state-holding object is modified without this library.
   * Be careful when using this. On react, this means rerendering all the components that are using this state.
   */
  forceUpdate: () => void;

  /**
   * A map of all dispatchers.
   */
  dispatchers: Dispatchers;
}

/**
 * A controller for states.
 *
 * @description
 * This state comes with multiple features:
 *
 * 1. The state is interacted with via a commander pattern. All commands are undoable and redoable.
 * 2. The state has an undo/redo stack included.
 * 3. The state is stateless, you can have your state in a separated global object.
 * 4. The state can be hooked, to redirect all getState/dispatcher calls to somewhere else, for example a server for realtime collaboration.
 */
export interface ProjectState {
  /**
   * A map of all the states keyed by the state name. This is necessary to dispatch server sent state updates.
   */
  states: StateManagersMap;

  /**
   * The project undo stack. This allows undoing an operation of one of the states.
   *
   * @example
   * ```ts
   * const { undoStack, createState } = createProjectState();
   *
   * let myState = "foo";
   * const state = createState({
   *   name: "myState",
   *   getState: () => myState,
   *   dispatchers: {
   *     setState: (newState: string) => {
   *       const oldState = myState;
   *       myState = newState;
   *       return () => {
   *         myState = oldState;
   *       }
   *     }
   *   }
   * });
   *
   * const { setState } = state.dispatchers;
   * console.log(myState); // "foo"
   * setState("bar");
   * console.log(myState); // "bar"
   * undoStack.undo();
   * console.log(myState); // "foo"
   * undoStack.redo();
   * console.log(myState); // "bar"
   *
   * ```
   */
  undoStack: UndoStack;

  /**
   * Creates a new state for the project.
   *
   * @example
   * ```ts
   * const nameState = createState({
   *   name: "nameState",
   *   getState: () => {
   *     return `${name.surname} ${name.name}`;
   *   },
   *   dispatchers: {
   *     setSurname: (newName: string) => {
   *       name.surname = newName;
   *     },
   *     setName: (newSurname: string) => {
   *       name.name = newSurname;
   *     }
   *   }
   * });
   * ```
   */
  createState: <
    GetStateArgs extends any[],
    StateShape extends any,
    DispatchersDecls extends DispatchersDeclarationMap
  >(
    stateDesc: StateDescriptor<GetStateArgs, StateShape, DispatchersDecls>
  ) => StateManager<GetStateArgs, StateShape, DispatchersMap<DispatchersDecls>>;

  /**
   * Calls the update callback of all states.
   * BE VERY CAREFUL! ON REACT, THIS MEANS RERENDERING ALL THE COMPONENTS THAT USE ANY OF THE STATES!
   */
  forceUpdateAll: () => void;
}

/**
 * Creates a project state.
 *
 * @description
 * This state comes with multiple features:
 *
 * 1. The state is interacted with via a commander pattern. All commands are undoable and redoable.
 * 2. The state has an undo/redo stack included.
 * 3. The state is stateless, you can have your state in a separated global object.
 * 4. The state can be hooked, to redirect all getState/dispatcher calls to somewhere else, for example a server for realtime collaboration.
 *
 * @example
 * ```ts
 * const name = { surname: "foo", name: "bar", };
 * const { createState } = createProjectState();
 * const useNameState = createState({
 *   name: "nameState",
 *   getState: () => {
 *     return `${name.surname} ${name.name}`;
 *   },
 *   dispatchers: {
 *     setSurname: (newName: string) => {
 *       name.surname = newName;
 *     },
 *     setName: (newSurname: string) => {
 *       name.name = newSurname;
 *     }
 *   }
 * });
 *
 * const MyComponent = () => {
 *   const [name, { setSurname, setName, }] = useNameState();
 *   return (<>
 *     <p>{name}</p>
 *     <input onChange={e => setSurname(e.target.value)}>Surname</input>
 *     <input onChange={e => setName(e.target.value)}>Name</input>
 *   </>);
 * }
 * ```
 */
export const createProjectState = (): ProjectState => {
  const undoStack: UndoStack = new UndoStack();
  const states: StateManagersMap = {};

  const forceUpdateAll = () =>
    Object.values(states).map(({ forceUpdate }) => forceUpdate());

  const createState = <
    GetStateArgs extends any[],
    StateShape extends any,
    DispatchersDecls extends DispatchersDeclarationMap
  >(
    stateDesc: StateDescriptor<GetStateArgs, StateShape, DispatchersDecls>
  ): StateManager<
    GetStateArgs,
    StateShape,
    DispatchersMap<DispatchersDecls>
  > => {
    // Create basic subscription API
    const onUpdate = new Set<() => void>();
    const subscribe = (func: () => void) => {
      onUpdate.add(func);
    };
    const unsubscribe = (func: () => void) => {
      onUpdate.delete(func);
    };
    const forceUpdate = () => onUpdate.forEach((updater) => updater());

    const { getState } = stateDesc;
    // Build dispatchers that call forceUpdate() and integrate with the undo stack
    type Dispatchers = DispatchersMap<DispatchersDecls>;
    const dispatchers: Partial<Dispatchers> = {};
    for (const name in stateDesc.dispatchers) {
      const func = stateDesc.dispatchers[name];
      dispatchers[name] = ((...args) => {
        const undo = func(...args);
        undoStack.push({
          name,
          undo: () => {
            undo();
            forceUpdate();
          },
          redo: () => {
            func(...args);
            forceUpdate();
          },
        });
        forceUpdate();
      }) as Dispatcher<typeof func>;
    }

    const state: StateManager<GetStateArgs, StateShape, Dispatchers> = {
      getState,
      subscribe,
      unsubscribe,
      forceUpdate,
      dispatchers: dispatchers as Dispatchers,
    };

    // Cache the state for (as an example) handling server sent state updates.
    states[stateDesc.name] = state;

    return state;
  };

  return {
    states,
    undoStack,
    createState,
    forceUpdateAll,
  };
};
