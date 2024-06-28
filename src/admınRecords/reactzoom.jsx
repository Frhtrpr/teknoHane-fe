import React, { useState } from "react";

const imageUrl = "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_120111127/mobile_786_587_png/APPLE-iPhone-15-128-GB-Ak%C4%B1ll%C4%B1-Telefon-Siyah-MTP03TU-A";

function ReactZoom() {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseHover = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setCursorPosition({ x: e.pageX - left, y: e.pageY - top });
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      onMouseMove={handleMouseHover}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", display: "inline-block" }}
    >
      <img src={imageUrl} alt="" />

      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            left: cursorPosition.x - 100,
            top: cursorPosition.y - 100,
            pointerEvents: "none",
            width: "200px",
            height: "200px",
            border: "2px solid #000",
            overflow: "hidden",
            zIndex: "999"
          }}
        >
          <div
            style={{
              width: "400px",
              height: "400px",
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "800px 800px",
              backgroundPosition: `-${cursorPosition.x * 2}px -${cursorPosition.y * 2}px`
            }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default ReactZoom;
