import { useEffect, useState } from "react";

export const SemiControlledInput = ({ value, placeholder, onCommit }) => {
  const [input, setInput] = useState(value);
  useEffect(() => {
    setInput(value);
  }, [value]);
  return (
    <input
      placeholder={placeholder}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onBlur={() => onCommit(input)}
    />
  );
};
