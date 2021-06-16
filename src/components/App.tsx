import { FC } from "react";
import EventsFunctions from "./EventsFunctions";
import ProjectSettings from "./ProjectSettings";
import UndoStack from "./UndoStackViewer";

const Center: FC = ({ children }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

const Box: FC = ({ children }) => (
  <div
    style={{
      boxSizing: "border-box",
      border: "1px double black",
      margin: "5px",
    }}
  >
    <Center>{children}</Center>
  </div>
);

const App: FC = () => {
  return (
    <Center>
      <UndoStack />
      <Box>
        <ProjectSettings />
      </Box>
      <Box>
        <EventsFunctions />
      </Box>
      <Box>
        <EventsFunctions />
      </Box>
      <Box>
        <ProjectSettings />
      </Box>
    </Center>
  );
};

export default App;
