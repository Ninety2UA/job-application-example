import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dominik Benger x KLAR — An Interactive Job Application";
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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#10b981",
              letterSpacing: "0.15em",
            }}
          >
            AN INTERACTIVE JOB APPLICATION
          </div>
          <div
            style={{
              fontSize: "60px",
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 1.1,
            }}
          >
            Dominik Benger{" "}
            <span style={{ color: "#10b981" }}>x</span> KLAR
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#a1a1aa",
              marginTop: "8px",
            }}
          >
            Deep research. Strategic recommendations. Working prototypes.
          </div>
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "24px",
              fontSize: "16px",
              color: "#10b981",
            }}
          >
            <span>5 Recommendations</span>
            <span style={{ color: "#52525b" }}>|</span>
            <span>5 Interactive MVPs</span>
            <span style={{ color: "#52525b" }}>|</span>
            <span>4 Target Roles</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "14px",
            color: "#52525b",
          }}
        >
          dbenger-job-application-klar.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
