import React, {
  useState,
  SyntheticEvent,
  useRef,
  useEffect,
  useCallback,
  useReducer,
} from "react";
import styled from "styled-components";
import ModalMenu, { Section, TopButtonLeft, TopButtonSave } from "./ModalMenu";
import { getImageUrl } from "../utils/getImageURL";

const Canvas = styled.canvas`
  border: 2px solid black;
  cursor: move;
  background: white;
`;

const Img = styled.img`
  opacity: 0;
  position: absolute;
  z-index: -1;
  left: 100vw;
`;

const ZoomButton = styled.button``;

const initialZoom = { zoom: 1 };

const zoomReducer = (
  state: typeof initialZoom,
  action: { type: "in" } | { type: "out" } | { type: "init" }
) => {
  switch (action.type) {
    case "in":
      return { zoom: state.zoom * 1.1 };
    case "out":
      if (state.zoom * 0.9 <= 1) return { zoom: 1 };
      return { zoom: state.zoom * 0.9 };
    case "init":
      return { zoom: 1 };
    default:
      throw new Error();
  }
};

const PhotoCropper = ({
  editPhoto,
  setEditPhoto,
  handleSavePhoto,
}: {
  editPhoto: null | File;
  setEditPhoto: (val: null | File) => void;
  handleSavePhoto: (
    e: SyntheticEvent,
    { src, file }: { src: string; file: Blob }
  ) => void;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [{ zoom }, dispatchZoom] = useReducer(zoomReducer, initialZoom);
  const imgWidth = useRef<number>(0);
  const imgHeight = useRef<number>(0);

  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);

  const lastTouchDist = useRef<number | null>(null);

  const reset = () => {
    dispatchZoom({ type: "init" });
    setOffsetX(0);
    setOffsetY(0);
    lastX.current = null;
    lastY.current = null;
    lastTouchDist.current = null;
    if (image) image.src = "";
  };

  useEffect(() => {
    if (!editPhoto || !image || !canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    ctx.drawImage(
      image,
      offsetX,
      offsetY,
      imgWidth.current * zoom,
      imgHeight.current * zoom
    );
  }, [
    canvas,
    ctx,
    editPhoto,
    image,
    imgWidth,
    imgHeight,
    zoom,
    offsetX,
    offsetY,
  ]);

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

  useEffect(() => {
    if (!editPhoto || !image || !canvas || !ctx) return;
    const imageLoaded = () => {
      imgHeight.current = canvas.offsetHeight;
      imgWidth.current =
        (image.offsetWidth / image.offsetHeight) * imgHeight.current;

      ctx.drawImage(image, 0, 0, imgWidth.current, imgHeight.current);
    };

    image.addEventListener("load", imageLoaded);

    getImageUrl(editPhoto, undefined).then((url) => {
      image.src = url;
    });

    return () => image.removeEventListener("load", imageLoaded);
  }, [editPhoto, image, canvas, ctx]);

  const moveStart = (e: SyntheticEvent) => {
    e.preventDefault();

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", moveEnd);

    document.addEventListener("touchmove", moveHandler, true);
    document.addEventListener("touchend", moveEnd);
  };

  const moveHandler = (e: MouseEvent | TouchEvent) => {
    if (!editPhoto || !image || !canvas || !ctx) return;

    if (e instanceof TouchEvent) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    if (e instanceof TouchEvent && e.targetTouches.length >= 2) {
      const newTouchDist = Math.hypot(
        e.targetTouches[0].pageX - e.targetTouches[1].pageX,
        e.targetTouches[0].pageY - e.targetTouches[1].pageY
      );

      if (lastTouchDist.current == null) lastTouchDist.current = newTouchDist;

      if (newTouchDist > lastTouchDist.current) {
        dispatchZoom({ type: "in" });
      } else if (newTouchDist < lastTouchDist.current) {
        dispatchZoom({ type: "out" });
      }

      lastTouchDist.current = newTouchDist;
      return;
    }

    if (imgWidth.current * zoom > canvas.offsetWidth) {
      let clientX = 0;
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
      } else if (e instanceof TouchEvent) {
        clientX = e.targetTouches[0].clientX;
      }

      const newX = clientX - canvas.offsetLeft;

      setOffsetX((prev) => {
        if (lastX.current == null) lastX.current = newX;

        const newDiff =
          (newX - lastX.current) *
          (imgWidth.current * zoom - canvas.offsetWidth);

        const newPos = newDiff / canvas.offsetWidth + prev;

        return newPos >= 0
          ? 0
          : newPos <= canvas.offsetWidth - imgWidth.current * zoom
          ? canvas.offsetWidth - imgWidth.current * zoom
          : newPos;
      });

      lastX.current = newX;
    }

    if (imgHeight.current * zoom > canvas.offsetHeight) {
      let clientY = 0;
      if (e instanceof MouseEvent) {
        clientY = e.clientY;
      } else if (e instanceof TouchEvent) {
        clientY = e.targetTouches[0].clientY;
      }

      const newY = clientY - canvas.offsetTop;

      setOffsetY((prev) => {
        if (lastY.current == null) lastY.current = newY;

        const newDiff =
          (newY - lastY.current) *
          (imgHeight.current * zoom - canvas.offsetHeight);

        const newPos = newDiff / canvas.offsetWidth + prev;
        console.log({ newPos });
        console.log(
          canvas.offsetHeight,
          imgHeight.current * zoom,
          canvas.offsetHeight - imgHeight.current * zoom
        );

        return newPos >= 0
          ? 0
          : newPos <= canvas.offsetHeight - imgHeight.current * zoom
          ? canvas.offsetHeight - imgHeight.current * zoom
          : newPos;
      });

      lastY.current = newY;
    }
  };

  const moveEnd = (e: MouseEvent | TouchEvent) => {
    lastX.current = null;
    lastY.current = null;

    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", moveEnd);

    document.removeEventListener("touchmove", moveHandler, true);
    document.removeEventListener("touchend", moveEnd);
  };

  return (
    <ModalMenu
      fixed
      title="Photo Editor"
      doOpen={editPhoto ? true : false}
      buttons={{
        left: (
          <TopButtonLeft
            onClick={() => {
              reset();
              setEditPhoto(null);
            }}>
            Cancel
          </TopButtonLeft>
        ),
        right: (
          <TopButtonSave
            onClick={(e) => {
              canvas!.toBlob((blob) => {
                if (!blob) return new Error();
                handleSavePhoto(e, { src: canvas!.toDataURL(), file: blob });
                reset();
              });
            }}>
            Save
          </TopButtonSave>
        ),
      }}>
      <Img ref={setupImage} src="" alt="placeholder"></Img>
      <Section>
        <Canvas
          onMouseDown={moveStart}
          onTouchStart={moveStart}
          ref={setupCanvas}
          width={350}
          height={467}></Canvas>
        <ZoomButton onClick={() => dispatchZoom({ type: "in" })}>+</ZoomButton>
        <ZoomButton onClick={() => dispatchZoom({ type: "out" })}>-</ZoomButton>
      </Section>
    </ModalMenu>
  );
};

export default PhotoCropper;
