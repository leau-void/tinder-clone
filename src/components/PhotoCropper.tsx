import React, {
  useState,
  SyntheticEvent,
  useRef,
  useEffect,
  useCallback,
} from "react";
import styled from "styled-components";
import ModalMenu, { Section, TopButtonLeft, TopButtonSave } from "./ModalMenu";

const Canvas = styled.canvas`
  border: 2px solid black;
  cursor: move;
  background: white;
`;

const PhotoCropper = ({
  editPhoto,
  setEditPhoto,
  handleSavePhoto,
}: {
  editPhoto: null | File;
  setEditPhoto: (val: null | File) => void;
  handleSavePhoto: () => void;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [zoom, setZoom] = useState(1);

  let imgWidth = 0;
  let imgHeight = 0;

  let lastOffsetX = 0;
  let lastOffsetY = 0;

  let lastX: null | number = null;
  let lastY: null | number = null;

  let lastTouchDist: null | number = null;

  const setupCanvas = useCallback((node) => {
    console.log(node);
    if (!node) return;
    setCanvas(node);
    const ctx = node.getContext("2d");
    setCtx(ctx);
  }, []);

  const setupImage = useCallback((node) => {
    console.log(node);
    if (!node) return;
    setImage(node);
  }, []);

  const imageLoaded = () => {
    if (!editPhoto || !image || !canvas || !ctx) return;
    imgHeight = canvas.offsetHeight * 2;
    imgWidth = (image.offsetWidth / image.offsetHeight) * imgHeight;

    ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
  };

  useEffect(() => {
    if (!editPhoto || !image || !canvas || !ctx) return;
    image.addEventListener("load", imageLoaded);
    image.src = URL.createObjectURL(editPhoto);

    return () => image.removeEventListener("load", imageLoaded);
  }, [editPhoto, image, canvas, ctx]);

  useEffect(() => {
    if (!editPhoto || !image || !canvas || !ctx) return;
  }, [zoom]);

  const moveStart = (e: SyntheticEvent) => {
    e.preventDefault();

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", moveEnd);

    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("touchend", moveEnd);
  };

  const moveHandler = (e: MouseEvent | TouchEvent) => {
    if (!editPhoto || !image || !canvas || !ctx) return;

    if (e instanceof TouchEvent && e.touches.length >= 2) {
      const newTouchDist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );

      if (lastTouchDist == null) lastTouchDist = newTouchDist;

      if (newTouchDist > lastTouchDist) {
        setZoom(zoom * 1.1);
      } else if (newTouchDist < lastTouchDist) {
        if (zoom <= 1) return;
        setZoom(zoom * 0.9);
      }

      lastTouchDist = newTouchDist;
      return;
    }

    if (imgWidth > canvas.offsetWidth) {
      let clientX = 0;
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
      } else if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
      }

      const newX = clientX - canvas.offsetLeft;
      if (lastX == null) lastX = newX;
      const newDiff = (newX - lastX) * (imgWidth - canvas.offsetWidth);
      let newPos = newDiff / canvas.offsetWidth + lastOffsetX;

      if (newPos >= 0) newPos = 0;
      if (newPos <= canvas.offsetWidth - imgWidth)
        newPos = canvas.offsetWidth - imgWidth;

      console.log({ newX, newPos });

      //min = -imgWidth max = +imgWidth
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.drawImage(image, newPos, lastOffsetY, imgWidth, imgHeight);
      lastX = newX;
      lastOffsetX = newPos;
    }

    if (imgHeight > canvas.offsetHeight) {
      let clientY = 0;
      if (e instanceof MouseEvent) {
        clientY = e.clientY;
      } else if (e instanceof TouchEvent) {
        clientY = e.touches[0].clientY;
      }

      const newY = clientY - canvas.offsetLeft;
      if (lastY == null) lastY = newY;
      const newDiff = (newY - lastY) * (imgHeight - canvas.offsetHeight);
      let newPos = newDiff / canvas.offsetHeight + lastOffsetY;

      if (newPos >= 0) newPos = 0;
      if (newPos <= canvas.offsetHeight - imgHeight)
        newPos = canvas.offsetHeight - imgHeight;

      console.log({ newY, newPos });

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.drawImage(image, lastOffsetX, newPos, imgWidth, imgHeight);
      lastY = newY;
      lastOffsetY = newPos;
    }
  };

  const moveEnd = (e: MouseEvent | TouchEvent) => {
    lastX = null;
    lastY = null;

    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", moveEnd);

    document.removeEventListener("touchmove", moveHandler);
    document.removeEventListener("touchend", moveEnd);
  };

  return (
    <ModalMenu
      fixed
      title="Photo Editor"
      doOpen={editPhoto ? true : false}
      buttons={{
        left: (
          <TopButtonLeft onClick={() => setEditPhoto(null)}>
            Cancel
          </TopButtonLeft>
        ),
        right: (
          <TopButtonSave onClick={() => handleSavePhoto()}>Save</TopButtonSave>
        ),
      }}>
      <img
        ref={setupImage}
        alt="placeholder"
        style={{ opacity: 0, position: "absolute", left: "100vw" }}></img>
      <Section>
        <Canvas
          onMouseDown={moveStart}
          onTouchStart={moveStart}
          ref={setupCanvas}
          width={350}
          height={467}></Canvas>
        <button onClick={() => setZoom(zoom * 1.1)}>+</button>{" "}
        <button onClick={() => setZoom(zoom * 0.9)}>-</button>
      </Section>
    </ModalMenu>
  );
};

export default PhotoCropper;
