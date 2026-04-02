import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
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
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: "-1px",
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          R
        </span>
        {/* 오렌지 닷 */}
        <div
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#F97316",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
