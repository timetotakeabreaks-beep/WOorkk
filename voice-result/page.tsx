"use client";

import { useSearchParams } from "next/navigation";

export default function VoiceResultPage() {
  const params = useSearchParams();
  const percent = params.get("percent") || "N/A";

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "3rem 1.5rem",
        background: "#e2ecff",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "1.75rem",
          padding: "2.5rem",
          boxShadow: "0 30px 80px rgba(15,23,42,0.25)",
          border: "1px solid rgba(148,163,184,0.4)",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: "1rem",
            color: "#0f172a",
          }}
        >
          ผลการวิเคราะห์เบื้องต้น
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "#475569",
            marginBottom: "2rem",
            lineHeight: 1.7,
          }}
        >
          นี่เป็นหน้าผลลัพธ์ชั่วคราวเพื่อทดสอบระบบการนำทาง
          หน้านี้จะแสดงผลจริงภายหลังเมื่อเราเชื่อมโมเดลพาร์กินสันเข้ากับการบันทึกเสียง
        </p>

        <div
          style={{
            background: "#f8fafc",
            padding: "1.5rem",
            borderRadius: "1rem",
            border: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#1e293b",
            }}
          >
            เปอร์เซ็นต์ที่ได้รับจากการทดสอบ:
          </p>

          <p
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#16a34a",
            }}
          >
            {percent}%
          </p>
        </div>
      </div>
    </main>
  );
}
