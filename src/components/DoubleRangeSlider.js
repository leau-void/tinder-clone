import React from "react";
import "../assets/styles/DoubleRangeSlider.css";

class DoubleRangeSlider extends React.Component {
  state = {
    sliderWidth: 0,
    offsetSliderWidth: 0,
    min: 0,
    max: 200,
    minValueBetween: 10,

    currentMin: 55,

    currentMax: 100,
  };

  componentDidMount() {
    const { currentMin, currentMax, max } = this.state;

    this.minValue.style.width = (currentMin * 100) / max + "%";
    this.maxValue.style.width = (currentMax * 100) / max + "%";

    this.setState({
      sliderWidth: this.slider.offsetWidth,
      offsetSliderWidth: this.slider.offsetLeft,
    });
  }

  changeMinValue = (e) => {
    e.preventDefault();

    document.addEventListener("mousemove", this.onMouseMoveMin);
    document.addEventListener("mouseup", this.onMouseUpMin);

    document.addEventListener("touchmove", this.onMouseMoveMin);
    document.addEventListener("touchend", this.onMouseUpMin);
  };

  onMouseMoveMin = (e) => {
    const {
      min,
      max,
      currentMax,
      minValueBetween,
      sliderWidth,
      offsetSliderWidth,
    } = this.state;

    const dragedWidht = e.clientX - offsetSliderWidth;
    const dragedWidhtInPercent = (dragedWidht * 100) / sliderWidth;
    const currentMin = Math.abs(parseInt((max * dragedWidhtInPercent) / 100));

    console.log(e.pageX, e.clientX, offsetSliderWidth);

    console.log(currentMin, currentMax - minValueBetween);

    console.log((max * dragedWidhtInPercent) / 100);

    if (currentMin >= min && currentMin <= currentMax - minValueBetween) {
      this.minValue.style.width = dragedWidhtInPercent + "%";
      this.minValue.dataset.content = currentMin;

      this.setState({
        currentMin,
      });
    }
  };

  onMouseUpMin = () => {
    document.removeEventListener("mouseup", this.onMouseUpMin);
    document.removeEventListener("mousemove", this.onMouseMoveMin);

    document.removeEventListener("touchend", this.onMouseMoveMin);
    document.removeEventListener("touchmove", this.onMouseUpMin);
  };

  changeMaxValue = (e) => {
    e.preventDefault();

    document.addEventListener("mousemove", this.onMouseMoveMax);
    document.addEventListener("mouseup", this.onMouseUpMax);

    document.addEventListener("touchmove", this.onMouseMoveMax);
    document.addEventListener("touchend", this.onMouseUpMax);
  };

  onMouseMoveMax = (e) => {
    const { max, currentMin, minValueBetween, sliderWidth, offsetSliderWidth } =
      this.state;
    const maxWalueThumb = this.maxValue;
    const dragedWidht = e.clientX - offsetSliderWidth;
    const dragedWidhtInPercent = (dragedWidht * 100) / sliderWidth;
    const currentMax = Math.abs(parseInt((max * dragedWidhtInPercent) / 100));

    if (currentMax >= currentMin + minValueBetween && currentMax <= max) {
      maxWalueThumb.style.width = dragedWidhtInPercent + "%";
      maxWalueThumb.dataset.content = currentMax;
      this.setState({
        currentMax,
      });
    }
  };

  onMouseUpMax = () => {
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("mousemove", this.onMouseMoveMax);

    document.removeEventListener("touchend", this.onMouseUp);
    document.removeEventListener("touchmove", this.onMouseMoveMax);
  };

  maxForMin = () => {
    const { currentMax, minValueBetween } = this.state;
    return currentMax - minValueBetween;
  };

  minForMax = () => {
    const { currentMin, minValueBetween } = this.state;
    return currentMin + minValueBetween;
  };

  render() {
    return (
      <div ref={(ref) => (this.slider = ref)} id="slider">
        <div ref={(ref) => (this.minValue = ref)} id="min">
          <div
            ref={(ref) => (this.minValueDrag = ref)}
            id="min-drag"
            onMouseDown={this.changeMinValue}
            onTouchStart={this.changeMinValue}></div>
        </div>

        <div ref={(ref) => (this.maxValue = ref)} id="max">
          <div
            ref={(ref) => (this.maxValueDrag = ref)}
            id="max-drag"
            onMouseDown={this.changeMaxValue}
            onTouchStart={this.changeMaxValue}></div>
        </div>
      </div>
    );
  }
}

export default DoubleRangeSlider;
