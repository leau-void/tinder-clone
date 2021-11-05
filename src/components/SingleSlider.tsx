import React, { useEffect, useRef, useState, SyntheticEvent } from "react";
import styled from "styled-components";

const Slider = styled.div`
  position: relative;
  margin: 3vh auto;
  width: 240px;
  height: 5px;
  background: #f4f4f4;
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

const Thumb = styled.div`
  position: absolute;
  right: -7.5px;
  top: -5px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #3d84a8;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 0 0 6px rgba(39, 70, 132, 0.2);
  }
`;

const SingleSlider = ({
  limits = [0, 100],
  minDiff = 1,
  step = 1,
  values = [25, 75],
  valueSetters = [(n: number) => {}, (n: number) => {}],
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [offsetSliderWidth, setOffsetSliderWidth] = useState(0);

  const slider = useRef<HTMLDivElement>(null);
  const minRange = useRef<HTMLDivElement>(null);
  const maxRange = useRef<HTMLDivElement>(null);
  const minThumb = useRef<HTMLDivElement>(null);
  const maxThumb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!minRange.current || !maxRange.current) return;

    minRange.current.style.width =
      ((values[0] - limits[0]) * 100) / limits[1] + "%";
    maxRange.current.style.width = 100 - (limits[1] - values[1]) + "%";
  }, [minRange, maxRange]);

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
    let pageX = 0;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      pageX = e.pageX;
    } else if (e instanceof TouchEvent) {
      clientX = e.touches[0].clientX;
      pageX = e.touches[0].pageX;
    }

    const dragedWidth = clientX - offsetSliderWidth;
    const dragedWidthInPercent = (dragedWidth * 100) / sliderWidth;
    const newMin: number = Math.round(
      (dragedWidthInPercent * (limits[1] - limits[0])) / 100 + limits[0]
    );

    if (newMin >= limits[0] && newMin <= values[1] - minDiff) {
      if (!minRange || !minRange.current) return;
      minRange.current.style.width = dragedWidthInPercent + "%";

      valueSetters[0](newMin);
    }
  };

  const onMouseUpMin = (): void => {
    document.removeEventListener("mouseup", onMouseUpMin);
    document.removeEventListener("mousemove", onMouseMoveMin);

    document.removeEventListener("touchend", onMouseMoveMin);
    document.removeEventListener("touchmove", onMouseUpMin);
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
    let pageX = 0;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      pageX = e.pageX;
    } else if (e instanceof TouchEvent) {
      clientX = e.touches[0].clientX;
      pageX = e.touches[0].pageX;
    }

    const dragedWidth = clientX - offsetSliderWidth;
    const dragedWidthInPercent = (dragedWidth * 100) / sliderWidth;
    const newMax = Math.round(
      (dragedWidthInPercent * (limits[1] - limits[0])) / 100 + limits[0]
    );

    if (newMax >= values[0] + minDiff && newMax <= limits[1]) {
      if (!maxRange || !maxRange.current) return;
      maxRange.current.style.width = dragedWidthInPercent + "%";

      valueSetters[1](newMax);
    }
  };

  const onMouseUpMax = (): void => {
    document.removeEventListener("mouseup", onMouseUpMax);
    document.removeEventListener("mousemove", onMouseMoveMax);

    document.removeEventListener("touchend", onMouseUpMax);
    document.removeEventListener("touchmove", onMouseMoveMax);
  };

  return (
    <Slider ref={slider}>
      <Range ref={maxRange}>
        <Thumb
          ref={maxThumb}
          onMouseDown={(e) => changeMaxValue(e)}
          onTouchStart={(e) => changeMaxValue(e)}
        />
      </Range>
    </Slider>
  );
};

export default SingleSlider;
