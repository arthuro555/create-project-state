import { states } from "../src/states";
import { Server } from "ws";

const port = 6969;
const server = new Server({ port });

server.on("connection", (c) =>
  c.on("message", (json) => {
    try {
      var event = JSON.parse(json.toString());
      if (!event.type) throw new Error("No event type provided");
    } catch (e) {
      console.error("Received invalid event: ", event, e);
      return;
    }

    switch (event.type) {
      case "requestUpdate":
        if (!event.state || !states[event.state])
          return console.warn("Received invalid event: ", event);

        c.send(
          JSON.stringify({
            type: "stateUpdate",
            stateName: event.state,
            newState: states[event.state].getState()[0],
          })
        );
        break;

      case "dispatch":
        if (
          !Array.isArray(event.args) ||
          !event.state ||
          !states[event.state] ||
          !event.dispatcher
        )
          return console.warn("Received invalid event, ", event);

        const dispatcher = states[event.state].getState()[1][event.dispatcher];
        if (!dispatcher) return console.warn("Invalid dispatcher: ", event);
        dispatcher(...event.args);
        break;

      default:
        console.warn("Invalid event type: ", event.type, event);
    }
  })
);

Object.entries(states).forEach(([stateName, { getState, subscribe }]) => {
  subscribe(() => {
    const newState = getState()[0];
    console.info(`${stateName} has changed: `, newState);
    server.clients.forEach((c) =>
      c.send(JSON.stringify({ type: "stateUpdate", stateName, newState }))
    );
  });
});

console.log("Server started on port " + port);
