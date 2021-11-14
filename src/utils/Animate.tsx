import React, { useState, useEffect, useRef } from "react";

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

  const timeout1Ref = useRef(0);
  const timeout2Ref = useRef(0);

  const toggle = (action: string, delay: number) => {
    switch (action) {
      case "open":
        setClassName("open");
        setIsOpen(true);
        break;
      case "close":
        timeout1Ref.current = window.setTimeout(() => {
          setClassName("closing");
          timeout1Ref.current = 0;
        }, 100);
        timeout2Ref.current = window.setTimeout(() => {
          setIsOpen(false);
          timeout2Ref.current = 0;
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

    return () => {
      if (timeout1Ref.current) clearTimeout(timeout1Ref.current);
      if (timeout2Ref.current) clearTimeout(timeout2Ref.current);
    };
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
