"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/voice-testing"); // <- change here
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b1120",
          color: "white",
        }}
      >
        <p>กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #1e293b 0, #020617 55%, #000 100%)",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(15,23,42,0.96)",
          padding: "2.5rem 3rem",
          borderRadius: "1.5rem",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.75rem",
          maxWidth: "420px",
          width: "100%",
          border: "1px solid rgba(148,163,184,0.25)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.85rem",
              fontWeight: 700,
              color: "white",
            }}
          >
            เข้าสู่ระบบ SixtyScan
          </h1>
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.9rem",
              color: "rgb(148,163,184)",
              lineHeight: 1.6,
            }}
          >
            กรุณาเข้าสู่ระบบด้วยบัญชี Google ของคุณ
            เพื่อเริ่มต้นทดสอบเสียงและดูผลการประเมินความเสี่ยง
          </p>
        </div>

        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: "/voice-testing", // <- and here
            })
          }
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "0.85rem 1.9rem",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "white",
            fontSize: "0.96rem",
            fontWeight: 600,
            color: "#111827",
            width: "100%",
            maxWidth: "320px",
          }}
        >
          <span
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "9999px",
              background: "white",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.85rem",
              boxShadow: "0 0 0 1px rgba(148,163,184,0.6)",
            }}
          >
            G
          </span>
          <span>เข้าสู่ระบบด้วย Google</span>
        </button>

        <p
          style={{
            fontSize: "0.75rem",
            color: "rgb(148,163,184)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          ระบบจะใช้เพียงอีเมลและชื่อของคุณสำหรับสร้างบัญชีใน SixtyScan
          และเก็บประวัติการทดสอบ/การชำระเงินเท่านั้น
        </p>
      </div>
    </main>
  );
}
