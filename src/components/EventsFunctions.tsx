import { Fragment, useState } from "react";
import { useEventsFunctionsState } from "../states/EventsFunctionsState";

const EventsFunctions = () => {
  const [eventsFunctions, { add, remove }] = useEventsFunctionsState();
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

export default EventsFunctions;
