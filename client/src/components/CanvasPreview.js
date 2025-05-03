import React, { useEffect, useRef } from "react";

const CanvasPreview = ({ formImg, glitterImg, decorImg, hexColor, baseColor, view }) => {
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

      // canvas под подложку
      const baseLayer = document.createElement("canvas");
      baseLayer.width = width;
      baseLayer.height = height;
      const baseCtx = baseLayer.getContext("2d");

      // canvas под всё остальное
      const contentLayer = document.createElement("canvas");
      contentLayer.width = width;
      contentLayer.height = height;
      const contentCtx = contentLayer.getContext("2d");

      // ⬛ 1. Подложка (по форме)
      baseCtx.drawImage(form, 0, 0, width, height);
      baseCtx.globalCompositeOperation = "source-in";

      if (baseColor) {
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        baseCtx.fillStyle = `rgba(${r},${g},${b},1.0)`;
      
        if (view === "front" || view === "back") {
          baseCtx.fillRect(0, 0, width, height);
        } else if (view === "side") {
          // 1. Создаем маску — только правая половина
          const mask = document.createElement("canvas");
          mask.width = width;
          mask.height = height;
          const maskCtx = mask.getContext("2d");
          maskCtx.drawImage(form, 0, 0, width, height);
          maskCtx.globalCompositeOperation = "destination-in";
          maskCtx.fillStyle = "black";
          maskCtx.fillRect(width / 1.95, 0, width / 2, height);
      
          // 2. Маску на baseCtx
          baseCtx.drawImage(mask, 0, 0);
      
          // 3. Цвет по уже обрезанной форме
          baseCtx.globalCompositeOperation = "source-in";
          baseCtx.fillRect(0, 0, width, height);
        }
      }
      

      // ⬜ 2. Слой формы
      contentCtx.drawImage(form, 0, 0, width, height);
      contentCtx.globalCompositeOperation = "source-in";

      // 🟦 3. Основной цвет
      drawColor(contentCtx, hexColor, width, height);
      contentCtx.globalCompositeOperation = "source-over";

      // 🌸 4. Декор
      if (decor) {
        const decorCanvas = document.createElement("canvas");
        decorCanvas.width = width;
        decorCanvas.height = height;
        const decorCtx = decorCanvas.getContext("2d");

        decorCtx.drawImage(decor, 0, 0, width, height);
        decorCtx.globalCompositeOperation = "destination-in";
        decorCtx.drawImage(form, 0, 0, width, height);

        contentCtx.drawImage(decorCanvas, 0, 0);
      }

      // ✨ 5. Глиттер
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

        contentCtx.drawImage(glitterCanvas, 0, 0);
      }

      // 🧴 6. Цветовая заливка поверх как фильтр
      if (hexColor) {
        const overlay = document.createElement("canvas");
        overlay.width = width;
        overlay.height = height;
        const overlayCtx = overlay.getContext("2d");

        drawColor(overlayCtx, hexColor, width, height, 0.35);
        overlayCtx.globalCompositeOperation = "destination-in";
        overlayCtx.drawImage(form, 0, 0, width, height);

        contentCtx.drawImage(overlay, 0, 0);
      }

      // 🖼️ 7. Итоговая сборка на основной холст
      ctx.clearRect(0, 0, width, height);
      if (view === "front") {
        if (baseColor) ctx.drawImage(baseLayer, 0, 0);
        ctx.drawImage(contentLayer, 0, 0);
      } if (view === "side") {
        ctx.drawImage(contentLayer, 0, 0);
        if (baseColor) ctx.drawImage(baseLayer, 0, 0); // ← отрисовывать только если есть цвет подложки
      }
      if (view === "back") {
        ctx.drawImage(contentLayer, 0, 0);
        if (baseColor) ctx.drawImage(baseLayer, 0, 0);
      }
    });
  }, [formImg, glitterImg, decorImg, hexColor, baseColor, view]);

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
      //style={{ border: "1px solid #ccc", borderRadius: 8 }}
    />
  );
};

export default CanvasPreview;