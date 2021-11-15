import React, {
  useState,
  SyntheticEvent,
  useRef,
  useEffect,
  useCallback,
  useReducer,
} from "react";
import styled from "styled-components";
import ModalMenu, { Section, TopButtonBack, TopButtonDone } from "./ModalMenu";
import { getImageUrl } from "../utils/getImageURL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus, faSearchMinus } from "@fortawesome/free-solid-svg-icons";

const Canvas = styled.canvas`
  border: 2px solid black;
  cursor: move;
  background: #f5f5f5;
  border-radius: 20px;
  margin: 1rem;
  max-width: 80%;
  max-height: 80%;
`;

const Img = styled.img`
  opacity: 0;
  position: absolute;
  z-index: -1;
  left: 100vw;
`;

const ZoomButton = styled.button`
  padding: 0.5rem;
  border: 0;
  background: 0;
  margin-top: 1rem;
`;

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

const CroppingTool = ({
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
  const imgLoadStatus = useRef<boolean>(false);

  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);

  const lastTouchDist = useRef<number | null>(null);

  const reset = () => {
    dispatchZoom({ type: "init" });
    setOffsetX(0);
    setOffsetY(0);
    imgWidth.current = 0;
    imgLoadStatus.current = false;
    imgHeight.current = 0;
    lastX.current = null;
    lastY.current = null;
    lastTouchDist.current = null;
    if (image) image.src = "";
  };

  useEffect(() => {
    if (!editPhoto || !image || !canvas || !ctx || !imgLoadStatus.current)
      return;
    ctx.clearRect(
      0,
      0,
      Number(canvas.getAttribute("width")),
      Number(canvas.getAttribute("height"))
    );

    const actualOffsetX =
      offsetX >= 0
        ? 0
        : offsetX <=
          Number(canvas.getAttribute("width")) - imgWidth.current * zoom
        ? Number(canvas.getAttribute("width")) - imgWidth.current * zoom
        : offsetX;

    const actualOffsetY =
      offsetY >= 0
        ? 0
        : offsetY <=
          Number(canvas.getAttribute("height")) - imgHeight.current * zoom
        ? Number(canvas.getAttribute("height")) - imgHeight.current * zoom
        : offsetY;

    ctx.drawImage(
      image,
      actualOffsetX,
      actualOffsetY,
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
    imgLoadStatus,
  ]);

  const setupCanvas = useCallback((node) => {
    if (!node) return;
    setCanvas(node);
    const ctx = node.getContext("2d");
    setCtx(ctx);
  }, []);

  const setupImage = useCallback((node) => {
    if (!node) return;
    setImage(node);
  }, []);

  useEffect(() => {
    if (!editPhoto || !image || !canvas || !ctx) return;
    const imageLoaded = () => {
      imgLoadStatus.current = true;
      imgHeight.current = Number(canvas.getAttribute("height"));
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

    document.addEventListener("mousemove", moveHandler, { passive: false });
    document.addEventListener("mouseup", moveEnd);

    document.addEventListener("touchmove", moveHandler, { passive: false });
    document.addEventListener("touchend", moveEnd);
  };

  const moveHandler = (e: MouseEvent | TouchEvent) => {
    if (!editPhoto || !image || !canvas || !ctx) return;

    if (e instanceof TouchEvent) {
      e.preventDefault();
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

    if (imgWidth.current * zoom > Number(canvas.getAttribute("width"))) {
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
          (imgWidth.current * zoom - Number(canvas.getAttribute("width")));

        const newPos = newDiff / Number(canvas.getAttribute("width")) + prev;

        return newPos;
      });

      lastX.current = newX;
    }

    if (imgHeight.current * zoom > Number(canvas.getAttribute("height"))) {
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
          (imgHeight.current * zoom - Number(canvas.getAttribute("height")));

        const newPos = newDiff / Number(canvas.getAttribute("width")) + prev;

        return newPos;
      });

      lastY.current = newY;
    }
  };

  const moveEnd = (e: MouseEvent | TouchEvent) => {
    lastX.current = null;
    lastY.current = null;

    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", moveEnd);

    document.removeEventListener("touchmove", moveHandler);
    document.removeEventListener("touchend", moveEnd);
  };

  return (
    <ModalMenu
      title="Photo Editor"
      doOpen={editPhoto ? true : false}
      buttons={{
        left: (
          <TopButtonBack
            onClick={() => {
              reset();
              setEditPhoto(null);
            }}
          />
        ),
        right: (
          <TopButtonDone
            onClick={(e) => {
              canvas!.toBlob((blob) => {
                if (!blob) return new Error();
                handleSavePhoto(e, { src: canvas!.toDataURL(), file: blob });
                reset();
              });
            }}
          />
        ),
      }}
      animation="horizontal">
      <Img ref={setupImage} src="" alt="placeholder"></Img>
      <Section>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "1rem 0",
            }}>
            <Canvas
              onMouseDown={moveStart}
              onTouchStart={moveStart}
              ref={setupCanvas}
              width={350}
              height={467}></Canvas>
            <small>Chose how your image will apear.</small>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}>
            <ZoomButton onClick={() => dispatchZoom({ type: "in" })}>
              <FontAwesomeIcon icon={faSearchPlus} />
            </ZoomButton>
            <ZoomButton onClick={() => dispatchZoom({ type: "out" })}>
              <FontAwesomeIcon icon={faSearchMinus} />
            </ZoomButton>
          </div>
        </div>
      </Section>
    </ModalMenu>
  );
};

export default CroppingTool;
