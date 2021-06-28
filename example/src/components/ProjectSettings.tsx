import type { FC } from "react";
import { ProjectSettingsState } from "../states/ProjectSettingsState";
import { useProjectState } from "create-project-state/react";
import { SemiControlledInput } from "./SemiControlledInput";

export const ProjectSettings: FC = () => {
  const [{ name, author }, { setName, setAuthor }] = useProjectState<
    [],
    {
      name: string;
      author: string;
    },
    {
      setName: (newName: string) => void;
      setAuthor: (newName: string) => void;
    }
  >(ProjectSettingsState);
  return (
    <>
      <SemiControlledInput
        placeholder="Project name"
        value={name}
        onCommit={(newValue) => setName(newValue)}
      ></SemiControlledInput>
      <SemiControlledInput
        placeholder="Project Author"
        value={author}
        onCommit={(newValue) => setAuthor(newValue)}
      ></SemiControlledInput>
    </>
  );
};
