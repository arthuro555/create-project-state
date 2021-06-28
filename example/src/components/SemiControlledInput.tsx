import type { FC } from "react";
import { useEffect, useState } from "react";

type Props = {
  value: string;
  onCommit: (newValue: string) => void;
  placeholder?: string;
};

export const SemiControlledInput: FC<Props> = ({
  value,
  placeholder,
  onCommit,
}) => {
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
