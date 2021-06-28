<h1 align="center">create-project-state</h1>

## Installation

```bash
npm i create-project-state
# or
yarn add create-project-state
```

## What is this?

This is an opinionated state management library for editors. It comes with some neat features:

- :white_check_mark: Fully typed
- :white_check_mark: Built-in undo stack
- :white_check_mark: Optional React hooks
- :white_check_mark: Stateless state management
- :white_check_mark: Tiny - around 2KB, <1KB gzipped

### What is "Stateless state management"?

When you use a state management method like `useState`, `useReducer` or `redux`, it will manage both modifying the state and holding the state. In this library, only the management (mutation) of the state is handled, and your state can be held in a separate object, in another library, in a WASM module, on a remote server or really anything accessible in JavaScript. This allows this library to be used in a lot more cases, and to make adding realtime collaboration easier by allowing to decouple the state holding onto a server.

## What is this for?

As the name suggests, this library has a focus on being used inside editors, IDEs, etc. Features like the undo stack, realtime collaboration and serializing the whole project to a file can be harder tasks, which are made easier using this.

- If your state is held in an object representing the project, you can just `JSON.stringify` it.
- If you want to add an undo/redo feature to your editor, it is included with this library.
- If you want to add realtime collaboration to your editor, it can be done in less than an hour using this library.

## Examples

### Basic example

```ts
import { createProjectState } from "create-project-state";

// This is the object that holds the state
const name = { surname: "foo", name: "bar" };

// Create a project state that will manage the states of the individual components
const { createState } = createProjectState();

// Create a state manager for the name object
const NameState = createState({
  name: "nameState",
  getState: () => {
    return `${name.surname} ${name.name}`;
  },
  dispatchers: {
    setSurname: (newName: string) => {
      name.surname = newName;
    },
    setName: (newSurname: string) => {
      name.name = newSurname;
    },
  },
});

console.log(NameState.getState()); // "foo bar"
NameState.dispatchers.setSurname("foobar");
console.log(NameState.getState()); // "foobar bar"
```

### Undo stack example

```ts
import { createProjectState } from "create-project-state";

const { undoStack, createState } = createProjectState();

let myState = "foo";
const state = createState({
  name: "myState",
  getState: () => myState,
  dispatchers: {
    setState: (newState: string) => {
      const oldState = myState;
      myState = newState;
      return () => {
        myState = oldState;
      };
    },
  },
});

const { setState } = state.dispatchers;
console.log(myState); // "foo"
setState("bar");
console.log(myState); // "bar"
undoStack.undo();
console.log(myState); // "foo"
undoStack.redo();
console.log(myState); // "bar"
```

### React example

```tsx
import { createProjectState } from "create-project-state";
import { useProjectState } from "create-project-state/react";

// This is the object that holds the state
const name = { surname: "foo", name: "bar" };

// Create a project state that will manage the states of the individual components
const { createState } = createProjectState();

// Create a state manager for the name object
const NameState = createState({
  name: "nameState",
  getState: () => {
    return `${name.surname} ${name.name}`;
  },
  dispatchers: {
    setSurname: (newName: string) => {
      name.surname = newName;
    },
    setName: (newSurname: string) => {
      name.name = newSurname;
    },
  },
});

// Now we make a React component to display and interact with the state:
const MyComponent = () => {
  // Using this hook, the component will update whenever the state is changed even though it isn't managed by react.
  const [name, { setSurname, setName }] = useProjectState(NameState);

  return (
    <>
      <p>{name}</p>
      <input onChange={(e) => setSurname(e.target.value)}>Surname</input>
      <input onChange={(e) => setName(e.target.value)}>Name</input>
    </>
  );
};
```
