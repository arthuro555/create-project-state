import { project } from "./Project";
import { createState } from ".";

const { eventsFunctions } = project;

export const EventsFunctionsState = createState({
  name: "eventsFunctions",
  getState: () => eventsFunctions,
  dispatchers: {
    add: (name: string) => {
      project.eventsFunctions.push(name);
      return () => project.eventsFunctions.pop();
    },
    remove: (index: number) => {
      const oldValue = project.eventsFunctions[index];
      project.eventsFunctions.splice(index, 1);
      return () => {
        project.eventsFunctions.splice(index, 0, oldValue);
      };
    },
  },
});
