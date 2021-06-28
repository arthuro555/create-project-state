import type { FC } from "react";
import { EventsFunctions } from "./EventsFunctions";
import { ProjectSettings } from "./ProjectSettings";
import UndoStackViewer from "./UndoStackViewer";
import { undoStack } from "../states";

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

export const App: FC = () => {
  return (
    <Center>
      <UndoStackViewer undoStack={undoStack} />
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
