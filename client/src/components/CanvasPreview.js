import React, { useEffect, useRef } from "react";

const CanvasPreview = ({ formImg, glitterImg, decorImg, hexColor, baseColor, view, scale = 1 }) => {
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

      const baseLayer = document.createElement("canvas");
      const baseCtx = baseLayer.getContext("2d");
      baseLayer.width = width;
      baseLayer.height = height;

      const contentLayer = document.createElement("canvas");
      const contentCtx = contentLayer.getContext("2d");
      contentLayer.width = width;
      contentLayer.height = height;

      const drawScaled = (ctx, image) => {
        const w = width * scale;
        const h = height * scale;
        const x = (width - w) / 2;
        const y = (height - h) / 2;
        ctx.drawImage(image, x, y, w, h);
      };

      // 1. Подложка
      if (baseColor) {
        drawScaled(baseCtx, form);
        baseCtx.globalCompositeOperation = "source-in";

        const [r, g, b] = parseHex(baseColor);
        baseCtx.fillStyle = `rgba(${r},${g},${b},1)`;

        if (view === "front" || view === "back") {
          baseCtx.fillRect(0, 0, width, height);
        } else if (view === "side") {
          const mask = document.createElement("canvas");
          mask.width = width;
          mask.height = height;
          const maskCtx = mask.getContext("2d");

          maskCtx.drawImage(form, 0, 0, width, height);
          maskCtx.globalCompositeOperation = "destination-in";
          maskCtx.fillStyle = "black";
          maskCtx.fillRect(width / 1.95, 0, width / 2, height);

          baseCtx.drawImage(mask, 0, 0);
          baseCtx.globalCompositeOperation = "source-in";
          baseCtx.fillRect(0, 0, width, height);
        }
      }

      // 2. Форма
      drawScaled(contentCtx, form);
      contentCtx.globalCompositeOperation = "source-in";

      drawColor(contentCtx, hexColor || "#D9D9D9", width, height);
      contentCtx.globalCompositeOperation = "source-over";

      // 3. Декор
      if (decor) {
        const decorCanvas = document.createElement("canvas");
        const decorCtx = decorCanvas.getContext("2d");
        decorCanvas.width = width;
        decorCanvas.height = height;

        decorCtx.drawImage(decor, 0, 0, width, height);
        decorCtx.globalCompositeOperation = "destination-in";
        drawScaled(decorCtx, form);

        contentCtx.drawImage(decorCanvas, 0, 0);
      }

      // 4. Глиттер
      if (glitter) {
        const glitterCanvas = document.createElement("canvas");
        const glitterCtx = glitterCanvas.getContext("2d");
        glitterCanvas.width = width;
        glitterCanvas.height = height;

        glitterCtx.globalAlpha = 0.5;
        glitterCtx.drawImage(glitter, 0, 0, width, height);
        glitterCtx.globalAlpha = 1;
        glitterCtx.globalCompositeOperation = "destination-in";
        drawScaled(glitterCtx, form);

        contentCtx.drawImage(glitterCanvas, 0, 0);
      }

      // 5. Цветовая полупрозрачная заливка
      const overlay = document.createElement("canvas");
      const overlayCtx = overlay.getContext("2d");
      overlay.width = width;
      overlay.height = height;

      drawColor(overlayCtx, hexColor || "#D9D9D9", width, height, 0.35);
      overlayCtx.globalCompositeOperation = "destination-in";
      drawScaled(overlayCtx, form);

      contentCtx.drawImage(overlay, 0, 0);

      // 6. Финальный рендер
      ctx.clearRect(0, 0, width, height);
      if (view === "front") {
        if (baseColor) ctx.drawImage(baseLayer, 0, 0);
        ctx.drawImage(contentLayer, 0, 0);
      } else if (view === "side") {
        ctx.drawImage(contentLayer, 0, 0);
        if (baseColor) ctx.drawImage(baseLayer, 0, 0);
      } else if (view === "back") {
        ctx.drawImage(contentLayer, 0, 0);
        if (baseColor) ctx.drawImage(baseLayer, 0, 0);
      }
    });
  }, [formImg, glitterImg, decorImg, hexColor, baseColor, view, scale]);

  const drawColor = (ctx, hexColor, width, height, alpha = 0.5) => {
    if (!hexColor) return;
    const [r, g, b] = parseHex(hexColor);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fillRect(0, 0, width, height);
  };

  const parseHex = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];

  return <canvas ref={canvasRef} width={300} height={300} />;
};

export default CanvasPreview;
