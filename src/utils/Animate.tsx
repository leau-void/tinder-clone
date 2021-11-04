import React, { useState, useEffect } from "react";

const Animate = ({
  children,
  doOpen,
  animationDuration,
}: {
  children: JSX.Element;
  doOpen: boolean;
  animationDuration: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [className, setClassName] = useState("");

  const toggle = (action: string, delay: number) => {
    switch (action) {
      case "open":
        setClassName("open");
        setIsOpen(true);
        break;
      case "close":
        window.setTimeout(() => setClassName("closing"), 10);
        window.setTimeout(() => {
          setIsOpen(false);
        }, delay);
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    if (doOpen) {
      toggle("open", animationDuration);
    } else {
      setClassName("closing-setup");
      toggle("close", animationDuration);
    }
  }, [doOpen, animationDuration]);

  const childrenArr = Array.isArray(children) ? children : [children];
  return (
    (isOpen && (
      <>
        {childrenArr.map((child, index) =>
          React.cloneElement(child, {
            className,
            key: index,
          })
        )}
      </>
    )) ||
    null
  );
};

export default Animate;
