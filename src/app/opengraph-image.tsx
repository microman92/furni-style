import { ImageResponse } from "next/og";
export const alt = "Furni Style — мебель с вашим характером";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#14110d",
        color: "#f1ece3",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 30, letterSpacing: 6 }}>FURNI STYLE</div>
      <div
        style={{
          fontSize: 86,
          lineHeight: 1.1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>Ваш дом.</span>
        <span>Ваш характер.</span>
      </div>
      <div style={{ color: "#c9a067", fontSize: 26 }}>
        Мебель на заказ · Ташкент
      </div>
    </div>,
    size,
  );
}
