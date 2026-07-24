import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Shortlist — AI screening for recruiting teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#F5F7FA",
          color: "#0B1F3A",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 40,
            color: "#0050D0",
          }}
        >
          Shortlist{" "}
          <span style={{ color: "#F86800" }}>X</span>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 870,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            maxWidth: 900,
          }}
        >
          Stop reading 400 CVs to find{" "}
          <span style={{ background: "#FFD400", padding: "0 8px" }}>
            the 7 that matter.
          </span>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 28,
            color: "#5A6B82",
            maxWidth: 800,
          }}
        >
          AI CV screening · Ranked shortlists · AI-assisted video interviewing
        </div>
      </div>
    ),
    { ...size }
  );
}
