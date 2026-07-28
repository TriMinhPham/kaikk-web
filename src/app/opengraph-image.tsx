import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "KAI Inc. | AI & IT Systems Development in Tokyo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#f3f3f3",
          padding: 96,
        }}
      >
        <div
          style={{
            fontSize: 160,
            fontWeight: 700,
            color: "#1b2bb8",
            letterSpacing: -6,
            display: "flex",
          }}
        >
          KAI
        </div>
        <div
          style={{
            fontSize: 44,
            color: "#000000",
            marginTop: 24,
            display: "flex",
          }}
        >
          AI &amp; IT Systems Development
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#6b7280",
            marginTop: 16,
            display: "flex",
          }}
        >
          Tokyo, Japan · kaikk.co.jp
        </div>
      </div>
    ),
    size,
  );
}
