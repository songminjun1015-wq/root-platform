import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          backgroundColor: "#0A1628",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-4px",
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          R
        </span>
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            width: 22,
            height: 22,
            borderRadius: "50%",
            backgroundColor: "#F97316",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
