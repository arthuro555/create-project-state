import { useProjectSettingsState } from "../states/ProjectSettingsState";
import { SemiControlledInput } from "./SemiControlledInput";

function ProjectSettings() {
  const [{ name, author }, { setName, setAuthor }] = useProjectSettingsState();
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
}

export default ProjectSettings;
