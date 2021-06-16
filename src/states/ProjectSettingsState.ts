import { project } from ".";
import { createProjectState } from "../lib/createProjectState";

export const useProjectSettingsState = createProjectState({
  getState: () => {
    const { name, author } = project;
    return { name, author };
  },
  dispatchers: {
    setName: (name: string) => {
      const oldName = project.name;
      if (name.length < 1) alert("Invalid name!");
      else project.name = name;
      return () => {
        project.name = oldName;
      };
    },
    setAuthor: (name: string) => {
      const oldName = project.author;
      project.author = name;
      return () => {
        project.author = oldName;
      };
    },
  },
});
