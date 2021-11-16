import React, { useEffect, useRef, useState, SyntheticEvent } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  position: relative;
  margin: 3vh auto;
  width: ${({ width }: { width?: string }) => width || "240px"};
  height: 5px;
  background: lightgrey;
  border-radius: 5px;
  cursor: pointer;
`;

const Range = styled.div`
  position: absolute;
  top: 0;
  z-index: 1;
  width: 0;
  height: 5px;
  border-radius: 5px;
  background: #46cdcf;
`;

const MinRange = styled(Range)`
  z-index: 2;
  background: lightgrey;
`;

const Thumb = styled.div`
  position: absolute;
  right: -12.5px;
  top: -10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #fafafa;
  transition: all 0.3s;
  box-shadow: 0 0 0 2px rgba(39, 70, 132, 0.2);

  &:hover,
  &:active {
    box-shadow: 0 0 0 6px rgba(39, 70, 132, 0.2);
  }
`;

const Slider = ({
  min = 0,
  max = 100,
  minDiff = 1,
  step = 1,
  lo = [0, (n: number) => {}],
  hi = [100, (n: number) => {}],
  double = false,
  width,
}: {
  min?: number;
  max: number;
  minDiff?: number;
  step?: number;
  lo?: [number, (n: number) => void];
  hi: [number, (n: number) => void];
  double?: boolean;
  width?: string;
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [offsetSliderWidth, setOffsetSliderWidth] = useState(0);

  const slider = useRef<HTMLDivElement>(null);
  const minRange = useRef<HTMLDivElement>(null);
  const maxRange = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!maxRange.current) return;
    maxRange.current.style.width = ((hi[0] - min) / (max - min)) * 100 + "%";

    if (!minRange.current) return;
    minRange.current.style.width = ((lo[0] - min) / (max - min)) * 100 + "%";
  }, [minRange, maxRange, lo, hi, min, max]);

  useEffect(() => {
    if (!slider.current) return;
    setSliderWidth(slider.current.offsetWidth);
    setOffsetSliderWidth(slider.current.offsetLeft);
  }, [slider]);

  const changeMinValue = (e: SyntheticEvent) => {
    e.preventDefault();

    document.addEventListener("mousemove", onMouseMoveMin);
    document.addEventListener("mouseup", onMouseUpMin);

    document.addEventListener("touchmove", onMouseMoveMin);
    document.addEventListener("touchend", onMouseUpMin);
  };

  const onMouseMoveMin = (e: MouseEvent | TouchEvent): void => {
    let clientX = 0;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
    } else if (e instanceof TouchEvent) {
      clientX = e.touches[0].clientX;
    }

    const dragedWidth = clientX - offsetSliderWidth;
    const dragedWidthInPercent = (dragedWidth * 100) / sliderWidth;
    const newMin: number = Math.round(
      (dragedWidthInPercent * (max - min)) / 100 + min
    );

    if (newMin >= min && newMin <= hi[0] - minDiff) {
      if (!minRange || !minRange.current) return;
      minRange.current.style.width = dragedWidthInPercent + "%";

      lo[1](newMin);
    }
  };

  const onMouseUpMin = (): void => {
    document.removeEventListener("mouseup", onMouseUpMin);
    document.removeEventListener("mousemove", onMouseMoveMin);

    document.removeEventListener("touchend", onMouseUpMin);
    document.removeEventListener("touchmove", onMouseMoveMin);
  };

  const changeMaxValue = (e: SyntheticEvent): void => {
    e.preventDefault();

    document.addEventListener("mousemove", onMouseMoveMax);
    document.addEventListener("mouseup", onMouseUpMax);

    document.addEventListener("touchmove", onMouseMoveMax);
    document.addEventListener("touchend", onMouseUpMax);
  };

  const onMouseMoveMax = (e: MouseEvent | TouchEvent): void => {
    let clientX = 0;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
    } else if (e instanceof TouchEvent) {
      clientX = e.touches[0].clientX;
    }

    const dragedWidth = clientX - offsetSliderWidth;
    const dragedWidthInPercent = (dragedWidth * 100) / sliderWidth;
    const newMax = Math.round((dragedWidthInPercent * (max - min)) / 100 + min);

    if (newMax >= lo[0] + minDiff && newMax <= max) {
      if (!maxRange || !maxRange.current) return;
      maxRange.current.style.width = dragedWidthInPercent + "%";

      hi[1](newMax);
    }
  };

  const onMouseUpMax = (): void => {
    document.removeEventListener("mouseup", onMouseUpMax);
    document.removeEventListener("mousemove", onMouseMoveMax);

    document.removeEventListener("touchend", onMouseUpMax);
    document.removeEventListener("touchmove", onMouseMoveMax);
  };

  return (
    <Wrap width={width} ref={slider}>
      {double && (
        <MinRange ref={minRange}>
          <Thumb
            onMouseDown={(e) => changeMinValue(e)}
            onTouchStart={(e) => changeMinValue(e)}
          />
        </MinRange>
      )}
      <Range ref={maxRange}>
        <Thumb
          onMouseDown={(e) => changeMaxValue(e)}
          onTouchStart={(e) => changeMaxValue(e)}
        />
      </Range>
    </Wrap>
  );
};

export default Slider;
