import { ImageResponse } from "next/og";

export const alt = "Derrick Ratnaharan — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(700px 500px at 10% 0%, rgba(118,58,128,0.55), transparent 70%), radial-gradient(700px 500px at 100% 100%, rgba(38,104,116,0.45), transparent 70%), #09090c",
          color: "#f2f2f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#a3a3b0", letterSpacing: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#5fd08a" }} />
          SOFTWARE ENGINEER · U OF T &apos;28
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, letterSpacing: -4, lineHeight: 1 }}>Derrick Ratnaharan</div>
          <div style={{ fontSize: 40, color: "#a3a3b0", marginTop: 28 }}>
            LLM inference in C++ · Static analysis in Rust · Apps people use
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {["Kestrel", "RepoGraph", "Campify"].map((p) => (
            <div
              key={p}
              style={{
                display: "flex",
                padding: "12px 26px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                fontSize: 26,
                color: "#f2f2f5",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
