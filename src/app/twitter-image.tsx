import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Shortlist X — AI CV screening and video interviewing for recruiters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#F5F7FA",
          color: "#0B1F3A",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Soft brand wash */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -40,
            width: 420,
            height: 420,
            borderRadius: 420,
            background: "rgba(0, 80, 208, 0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -60,
            width: 480,
            height: 480,
            borderRadius: 480,
            background: "rgba(248, 104, 0, 0.07)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 34,
            fontWeight: 800,
            color: "#0050D0",
            zIndex: 1,
          }}
        >
          Shortlist <span style={{ color: "#F86800" }}>X</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            zIndex: 1,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 870,
              lineHeight: 1.08,
              letterSpacing: -1.4,
            }}
          >
            Stop reading 400 CVs to find{" "}
            <span
              style={{
                background: "#FFD400",
                padding: "2px 10px",
                borderRadius: 6,
              }}
            >
              the 7 that matter.
            </span>
          </div>
          <div style={{ fontSize: 26, color: "#5A6B82", lineHeight: 1.35 }}>
            AI CV screening · Ranked shortlists · AI-assisted video interviewing
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: "#0050D0",
              fontWeight: 600,
            }}
          >
            getshortlist.app
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0F3D2A",
              background: "#FFD400",
              border: "2px solid #0B1F3A",
              borderRadius: 999,
              padding: "8px 16px",
            }}
          >
            Pilot cohort · 50 seats
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
