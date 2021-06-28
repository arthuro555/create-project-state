import type { FC } from "react";
import { Fragment, useState } from "react";
import { EventsFunctionsState } from "../states/EventsFunctionsState";
import { useProjectState } from "create-project-state/react";

export const EventsFunctions: FC = () => {
  const [eventsFunctions, { add, remove }] = useProjectState<
    [],
    string[],
    { add: (name: string) => void; remove: (index: number) => void }
  >(EventsFunctionsState);
  const [newName, setNewName] = useState("");
  return (
    <ul>
      {eventsFunctions.map((s, i) => (
        <Fragment key={i}>
          <li>{s}</li>
          <button onClick={() => remove(i)}>Remove</button>
        </Fragment>
      ))}
      <li>
        <button onClick={() => add(newName)}>Add new</button>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </li>
    </ul>
  );
};
