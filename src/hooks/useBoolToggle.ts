import { useState } from "react";

const useBoolToggle = (
  value: boolean
): [boolean, (newVal?: boolean) => void] => {
  const [current, setCurrent] = useState<boolean>(value);

  const toggleCurrent = (newVal?: boolean) =>
    setCurrent(typeof newVal == "boolean" ? newVal : !current);

  return [current, toggleCurrent];
};

export default useBoolToggle;
