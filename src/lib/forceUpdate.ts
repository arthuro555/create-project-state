import { useState } from "react";

export const useForceUpdate = () => {
  const [t, a] = useState(false);
  return () => a(!t);
};
