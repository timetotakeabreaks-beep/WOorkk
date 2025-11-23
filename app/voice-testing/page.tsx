"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type RecordingKey =
  | "aa"
  | "ee"
  | "eu"
  | "uu"
  | "ai"
  | "am"
  | "ao";

type RecordingMap = Partial<Record<RecordingKey, Blob | null>>;

interface VoiceRecorderCardProps {
  title: string;
  label: string;
  example: string;
  description: string;
  required?: boolean;
  onChange: (blob: Blob | null) => void;
}

function VoiceRecorderCard({
  title,
  label,
  example,
  description,
  required = true,
  onChange,
}: VoiceRecorderCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onChange(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาตรวจสอบการตั้งค่าเบราว์เซอร์");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  const handleDelete = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    onChange(null);
  };

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <section
      style={{
        backgroundColor: "white",
        borderRadius: "1.25rem",
        padding: "1.5rem 1.75rem",
        boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
        border: "1px solid rgba(148,163,184,0.25)",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {title}
            </h3>
            {required && (
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px",
                  backgroundColor: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  fontWeight: 600,
                }}
              >
                จำเป็น
              </span>
            )}
          </div>
          <p
            style={{
              marginTop: "0.25rem",
              fontSize: "0.85rem",
              color: "#475569",
              fontWeight: 600,
            }}
          >
            {label}
          </p>
          <p
            style={{
              marginTop: "0.15rem",
              fontSize: "0.85rem",
              color: "#64748b",
            }}
          >
            ตัวอย่าง:{" "}
            <span style={{ fontWeight: 600, color: "#0f172a" }}>{example}</span>
          </p>
          <p
            style={{
              marginTop: "0.25rem",
              fontSize: "0.85rem",
              color: "#64748b",
            }}
          >
            {description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            minWidth: "160px",
          }}
        >
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              borderRadius: "9999px",
              border: "none",
              padding: "0.55rem 1.3rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              color: "white",
              backgroundColor: isRecording ? "#ef4444" : "#4f46e5",
              boxShadow: "0 12px 20px rgba(79,70,229,0.35)",
              transition: "background-color 0.15s ease",
            }}
          >
            {isRecording ? "หยุดบันทึก" : "เริ่มบันทึกเสียง"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!audioUrl && !isRecording}
            style={{
              borderRadius: "9999px",
              padding: "0.5rem 1.3rem",
              fontSize: "0.8rem",
              fontWeight: 500,
              border: "1px solid rgba(148,163,184,0.7)",
              backgroundColor: "white",
              color: "#475569",
              cursor:
                !audioUrl && !isRecording ? "not-allowed" : "pointer",
              opacity: !audioUrl && !isRecording ? 0.45 : 1,
            }}
          >
            ลบเสียง
          </button>
        </div>
      </div>

      {/* status + audio */}
      <div
        style={{
          marginTop: "0.5rem",
          paddingTop: "0.8rem",
          borderTop: "1px solid rgba(226,232,240,1)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.8rem",
            color: "#64748b",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}
          >
            <span
              style={{
                width: "0.55rem",
                height: "0.55rem",
                borderRadius: "9999px",
                backgroundColor: isRecording ? "#ef4444" : "#94a3b8",
                boxShadow: isRecording
                  ? "0 0 0 4px rgba(248,113,113,0.45)"
                  : "none",
              }}
            />
            <span style={{ fontWeight: 600 }}>
              สถานะ:{" "}
              {isRecording
                ? "กำลังบันทึก..."
                : audioUrl
                ? "บันทึกสำเร็จ"
                : "ยังไม่มีเสียงที่บันทึก"}
            </span>
          </div>
          <span>
            ระยะเวลา:{" "}
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular" }}>
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
            </span>
          </span>
        </div>

        {audioUrl && (
          <audio
            controls
            src={audioUrl}
            style={{
              width: "100%",
              marginTop: "0.25rem",
              borderRadius: "0.75rem",
              backgroundColor: "#e5e7eb",
            }}
          />
        )}

        {error && (
          <p
            style={{
              marginTop: "0.25rem",
              fontSize: "0.78rem",
              color: "#b91c1c",
              backgroundColor: "#fef2f2",
              borderRadius: "0.75rem",
              padding: "0.5rem 0.75rem",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

export default function VoiceTestingPage() {
  const [recordings, setRecordings] = useState<RecordingMap>({});
  const [predictError, setPredictError] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const router = useRouter();

  const handleChange = (key: RecordingKey) => (blob: Blob | null) => {
    setRecordings((prev) => ({ ...prev, [key]: blob }));
  };

  const handlePredict = async () => {
    console.log("Predict clicked");
    setPredictError(null);

    const blobs = Object.values(recordings).filter(
      (b): b is Blob => b != null
    );

    if (blobs.length === 0) {
      setPredictError("กรุณาบันทึกเสียงอย่างน้อยหนึ่งเสียงก่อน");
      return;
    }

    setIsPredicting(true);

    // later: send blobs to backend + get real percent
    await new Promise((r) => setTimeout(r, 500));

    setIsPredicting(false);

    const fakePercent = 70;
    router.push(`/voice-result?percent=${fakePercent}`);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#e2ecff",
        padding: "5rem 1.5rem 3rem",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "rgba(248,250,252,0.9)",
          borderRadius: "1.75rem",
          padding: "2.25rem 2.5rem 2.5rem",
          boxShadow: "0 30px 80px rgba(15,23,42,0.25)",
          border: "1px solid rgba(148,163,184,0.4)",
        }}
      >
        {/* header */}
        <div style={{ marginBottom: "1.8rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.2rem 0.7rem",
              borderRadius: "9999px",
              backgroundColor: "#eef2ff",
              border: "1px solid #c7d2fe",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#4f46e5",
            }}
          >
            <span
              style={{
                width: "0.45rem",
                height: "0.45rem",
                borderRadius: "9999px",
                backgroundColor: "#4f46e5",
              }}
            />
            ขั้นตอนที่ 1 · การทดสอบเสียงสระ
          </div>
          <h1
            style={{
              marginTop: "0.75rem",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            การทดสอบเสียง SixtyScan
          </h1>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.95rem",
              color: "#475569",
              lineHeight: 1.7,
            }}
          >
            กรุณาบันทึกเสียงตามคำแนะนำในแต่ละหัวข้อ
            โดยยืดเสียงต่อเนื่องประมาณ 5–8 วินาที
            ระบบจะใช้เสียงเหล่านี้ในการประเมินความผิดปกติของเสียงพูดที่สัมพันธ์กับโรคพาร์กินสัน
          </p>
        </div>

        {/* cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <VoiceRecorderCard
            title='ออกเสียง "อา"'
            label="สระที่ 1"
            example="อา…"
            description="ออกเสียง “อา” ต่อเนื่อง 5–8 วินาที โดยออกเสียงให้ชัดเจน เสียงคงที่"
            onChange={handleChange("aa")}
          />
          <VoiceRecorderCard
            title='ออกเสียง "อี"'
            label="สระที่ 2"
            example="อี…"
            description="ออกเสียง “อี” ต่อเนื่อง 5–8 วินาที โดยรักษาระดับเสียงให้สม่ำเสมอ"
            onChange={handleChange("ee")}
          />
          <VoiceRecorderCard
            title='ออกเสียง "อือ"'
            label="สระที่ 3"
            example="อือ…"
            description="ออกเสียง “อือ” ต่อเนื่อง 5–8 วินาที พยายามไม่ให้เสียงสั่นหรือเบาเกินไป"
            onChange={handleChange("eu")}
          />
          <VoiceRecorderCard
            title='ออกเสียง "อู"'
            label="สระที่ 4"
            example="อู…"
            description="ออกเสียง “อู” ต่อเนื่อง 5–8 วินาที โดยออกเสียงให้ดังฟังชัด"
            onChange={handleChange("uu")}
          />
          <VoiceRecorderCard
            title='ออกเสียง "ไอ"'
            label="สระที่ 5"
            example="ไอ…"
            description="ออกเสียง “ไอ” ต่อเนื่อง 5–8 วินาที โดยไม่เร่งหรือหยุดกลางคัน"
            onChange={handleChange("ai")}
          />
          <VoiceRecorderCard
            title='ออกเสียง "อำ"'
            label="สระที่ 6"
            example="อำ…"
            description="ออกเสียง “อำ” ต่อเนื่อง 5–8 วินาที ให้เสียงมีความคงที่ตลอดช่วงเวลา"
            onChange={handleChange("am")}
          />
          <VoiceRecorderCard
            title='ออกเสียง "เอา"'
            label="สระที่ 7"
            example="เอา…"
            description="ออกเสียง “เอา” ต่อเนื่อง 5–8 วินาที โดยรักษาจังหวะการหายใจให้เป็นปกติ"
            onChange={handleChange("ao")}
          />
        </div>

        {/* Predict button */}
        <div
          style={{
            marginTop: "1.8rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={handlePredict}
            disabled={isPredicting}
            style={{
              borderRadius: "9999px",
              border: "none",
              padding: "0.7rem 1.7rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: isPredicting ? "wait" : "pointer",
              color: "white",
              backgroundColor: "#16a34a",
              boxShadow: "0 12px 24px rgba(22,163,74,0.35)",
              opacity: isPredicting ? 0.7 : 1,
            }}
          >
            {isPredicting ? "กำลังวิเคราะห์..." : "ทดสอบเสียง (Predict)"}
          </button>
        </div>

        {predictError && (
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.9rem",
              color: "#b91c1c",
              backgroundColor: "#fef2f2",
              borderRadius: "0.75rem",
              padding: "0.8rem 1rem",
              border: "1px solid #fecaca",
            }}
          >
            {predictError}
          </p>
        )}
      </div>
    </main>
  );
}
