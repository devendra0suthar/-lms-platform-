"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Certificate = {
  certificateId: string;
  userName: string;
  courseName: string;
  completedAt: string;
};

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const certificateRef = useRef<HTMLDivElement>(null);

  function downloadCertificate() {
    if (!certificateRef.current) return;

    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${certificate.courseName}</title>
          <style>
            body { margin: 0; padding: 40px; font-family: Georgia, serif; }
            .certificate {
              border: 8px double #4f46e5;
              padding: 60px;
              text-align: center;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              min-height: 600px;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            h1 { color: #4f46e5; font-size: 48px; margin: 0; font-weight: normal; }
            h2 { color: #1e293b; font-size: 24px; margin: 30px 0 10px; font-weight: normal; }
            .name { color: #1e293b; font-size: 36px; font-weight: bold; margin: 20px 0; }
            .course { color: #4f46e5; font-size: 28px; font-style: italic; margin: 20px 0; }
            .date { color: #64748b; font-size: 16px; margin-top: 40px; }
            .id { color: #94a3b8; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <h1>Certificate of Completion</h1>
            <h2>This is to certify that</h2>
            <div class="name">${certificate.userName}</div>
            <h2>has successfully completed the course</h2>
            <div class="course">${certificate.courseName}</div>
            <div class="date">Completed on ${new Date(certificate.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div class="id">Certificate ID: ${certificate.certificateId}</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  }

  return (
    <Card className="overflow-hidden">
      {/* Certificate Preview */}
      <div
        ref={certificateRef}
        className="relative border-4 border-double border-indigo-500 bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center dark:from-slate-800 dark:to-slate-900"
      >
        <div className="absolute inset-4 border border-indigo-200 dark:border-indigo-800" />

        <h2 className="text-3xl font-serif text-indigo-600 dark:text-indigo-400">
          Certificate of Completion
        </h2>

        <p className="mt-6 text-slate-600 dark:text-slate-400">
          This is to certify that
        </p>

        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          {certificate.userName}
        </p>

        <p className="mt-4 text-slate-600 dark:text-slate-400">
          has successfully completed the course
        </p>

        <p className="mt-2 text-xl font-semibold italic text-indigo-600 dark:text-indigo-400">
          {certificate.courseName}
        </p>

        <p className="mt-6 text-sm text-slate-500">
          Completed on {new Date(certificate.completedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        <p className="mt-4 text-xs text-slate-400">
          Certificate ID: {certificate.certificateId}
        </p>
      </div>

      {/* Download Button */}
      <div className="mt-4 flex justify-center">
        <Button onClick={downloadCertificate}>
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Certificate
        </Button>
      </div>
    </Card>
  );
}

export function GenerateCertificateButton({ courseId, progress }: { courseId: string; progress: number }) {
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState("");

  async function generateCertificate() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setCertificate(data.certificate);
  }

  if (certificate) {
    return <CertificateCard certificate={certificate} />;
  }

  if (progress < 100) {
    return (
      <Card className="border-dashed text-center">
        <div className="py-4">
          <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Complete the course to earn your certificate
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Progress: {progress}%
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="text-center">
      <div className="py-4">
        <svg className="mx-auto h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <p className="mt-3 font-medium text-slate-900 dark:text-white">
          Congratulations! You've completed the course!
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Click below to generate your certificate
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        <Button className="mt-4" onClick={generateCertificate} disabled={loading}>
          {loading ? "Generating..." : "Get Your Certificate"}
        </Button>
      </div>
    </Card>
  );
}
