import React, { useEffect, useRef } from "react";

const CanvasPreview = ({ formImg, glitterImg, decorImg, hexColor }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

    Promise.all([
      loadImage(formImg),
      loadImage(glitterImg),
      loadImage(decorImg)
    ]).then(([form, glitter, decor]) => {
      if (!form) return;

      const baseCanvas = document.createElement("canvas");
      baseCanvas.width = width;
      baseCanvas.height = height;
      const baseCtx = baseCanvas.getContext("2d");

      // 1. Маска по форме
      baseCtx.drawImage(form, 0, 0, width, height);
      baseCtx.globalCompositeOperation = "source-in";

      // 2. Цвет смолы
      drawColor(baseCtx, hexColor, width, height);
      baseCtx.globalCompositeOperation = "source-over";

      // 3. Декор внутри формы
      if (decor) {
        const decorCanvas = document.createElement("canvas");
        decorCanvas.width = width;
        decorCanvas.height = height;
        const decorCtx = decorCanvas.getContext("2d");

        decorCtx.drawImage(decor, 0, 0, width, height);
        decorCtx.globalCompositeOperation = "destination-in";
        decorCtx.drawImage(form, 0, 0, width, height);

        baseCtx.drawImage(decorCanvas, 0, 0);
      }

      // 4. Глиттер внутри формы
      if (glitter) {
        const glitterCanvas = document.createElement("canvas");
        glitterCanvas.width = width;
        glitterCanvas.height = height;
        const glitterCtx = glitterCanvas.getContext("2d");

        glitterCtx.globalAlpha = 0.5;
        glitterCtx.drawImage(glitter, 0, 0, width, height);
        glitterCtx.globalAlpha = 1;

        glitterCtx.globalCompositeOperation = "destination-in";
        glitterCtx.drawImage(form, 0, 0, width, height);

        baseCtx.drawImage(glitterCanvas, 0, 0);
      }

      // 5. Второй слой цвета поверх всего (мягкая заливка)
      if (hexColor) {
        const overlayCanvas = document.createElement("canvas");
        overlayCanvas.width = width;
        overlayCanvas.height = height;
        const overlayCtx = overlayCanvas.getContext("2d");
        drawColor(overlayCtx, hexColor, width, height, 0.35);
        overlayCtx.globalCompositeOperation = "destination-in";
        overlayCtx.drawImage(form, 0, 0, width, height);

        baseCtx.drawImage(overlayCanvas, 0, 0);
      }

      // 6. На главный холст
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(baseCanvas, 0, 0);
    });
  }, [formImg, glitterImg, decorImg, hexColor]);

  const drawColor = (ctx, hexColor, width, height, alpha = 0.5) => {
    if (!hexColor) return;
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fillRect(0, 0, width, height);
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      style={{ border: "1px solid #ccc", borderRadius: 8 }}
    />
  );
};

export default CanvasPreview;
