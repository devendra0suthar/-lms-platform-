"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Certificate = {
  certificateId: string;
  userName: string;
  courseName: string;
  completedAt: string;
};

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const formattedDate = new Date(certificate.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  function downloadCertificate() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${certificate.courseName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Montserrat', sans-serif;
              background: #1a1a2e;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .certificate-wrapper {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 8px;
              border-radius: 8px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            }
            .certificate {
              background: linear-gradient(180deg, #fffef9 0%, #fff9e6 50%, #fffef9 100%);
              padding: 60px 80px;
              text-align: center;
              position: relative;
              min-height: 700px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              border-radius: 4px;
            }
            .corner-decoration {
              position: absolute;
              width: 120px;
              height: 120px;
              opacity: 0.15;
            }
            .corner-decoration.top-left { top: 20px; left: 20px; }
            .corner-decoration.top-right { top: 20px; right: 20px; transform: rotate(90deg); }
            .corner-decoration.bottom-left { bottom: 20px; left: 20px; transform: rotate(-90deg); }
            .corner-decoration.bottom-right { bottom: 20px; right: 20px; transform: rotate(180deg); }
            .corner-decoration svg { width: 100%; height: 100%; fill: #b8860b; }
            .header-decoration {
              width: 200px;
              height: 4px;
              background: linear-gradient(90deg, transparent, #b8860b, transparent);
              margin: 0 auto 30px;
            }
            .seal {
              width: 100px;
              height: 100px;
              margin: 0 auto 20px;
              background: linear-gradient(135deg, #f6d365 0%, #b8860b 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 15px rgba(184, 134, 11, 0.4);
            }
            .seal-inner {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #fffef9 0%, #f6d365 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              font-weight: 700;
              color: #b8860b;
            }
            h1 {
              font-family: 'Playfair Display', serif;
              color: #1a1a2e;
              font-size: 42px;
              font-weight: 600;
              letter-spacing: 4px;
              text-transform: uppercase;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #b8860b;
              font-size: 14px;
              letter-spacing: 8px;
              text-transform: uppercase;
              margin-bottom: 40px;
            }
            .certify-text {
              color: #555;
              font-size: 16px;
              margin-bottom: 15px;
            }
            .name {
              font-family: 'Playfair Display', serif;
              color: #1a1a2e;
              font-size: 48px;
              font-weight: 700;
              margin-bottom: 15px;
              border-bottom: 2px solid #b8860b;
              padding-bottom: 10px;
              display: inline-block;
            }
            .completion-text {
              color: #555;
              font-size: 16px;
              margin: 25px 0 15px;
            }
            .course {
              font-family: 'Playfair Display', serif;
              color: #764ba2;
              font-size: 28px;
              font-weight: 600;
              font-style: italic;
              margin-bottom: 40px;
            }
            .footer-decoration {
              width: 200px;
              height: 4px;
              background: linear-gradient(90deg, transparent, #b8860b, transparent);
              margin: 0 auto 30px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 30px;
              padding-top: 20px;
            }
            .info-item {
              text-align: center;
            }
            .info-label {
              color: #888;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 8px;
            }
            .info-value {
              color: #1a1a2e;
              font-size: 14px;
              font-weight: 500;
            }
            .signature-line {
              width: 200px;
              border-top: 1px solid #1a1a2e;
              margin: 0 auto 5px;
            }
            .signature-text {
              font-family: 'Playfair Display', serif;
              font-style: italic;
              color: #1a1a2e;
              font-size: 18px;
            }
            .cert-id {
              position: absolute;
              bottom: 15px;
              right: 25px;
              color: #aaa;
              font-size: 10px;
              letter-spacing: 1px;
            }
            @media print {
              body { background: white; padding: 0; }
              .certificate-wrapper { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-wrapper">
            <div class="certificate">
              <div class="corner-decoration top-left">
                <svg viewBox="0 0 100 100"><path d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z M30,30 L100,30 L100,40 L40,40 L40,100 L30,100 Z"/></svg>
              </div>
              <div class="corner-decoration top-right">
                <svg viewBox="0 0 100 100"><path d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z M30,30 L100,30 L100,40 L40,40 L40,100 L30,100 Z"/></svg>
              </div>
              <div class="corner-decoration bottom-left">
                <svg viewBox="0 0 100 100"><path d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z M30,30 L100,30 L100,40 L40,40 L40,100 L30,100 Z"/></svg>
              </div>
              <div class="corner-decoration bottom-right">
                <svg viewBox="0 0 100 100"><path d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z M30,30 L100,30 L100,40 L40,40 L40,100 L30,100 Z"/></svg>
              </div>

              <div class="seal">
                <div class="seal-inner">LMS</div>
              </div>

              <h1>Certificate</h1>
              <div class="subtitle">of Completion</div>

              <div class="header-decoration"></div>

              <p class="certify-text">This is to certify that</p>
              <div class="name">${certificate.userName}</div>

              <p class="completion-text">has successfully completed the course</p>
              <div class="course">"${certificate.courseName}"</div>

              <div class="footer-decoration"></div>

              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">Date of Completion</div>
                  <div class="info-value">${formattedDate}</div>
                </div>
                <div class="info-item">
                  <div class="signature-line"></div>
                  <div class="signature-text">Course Director</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Certificate ID</div>
                  <div class="info-value">${certificate.certificateId}</div>
                </div>
              </div>

              <div class="cert-id">Verify at: lms-platform.vercel.app/verify/${certificate.certificateId}</div>
            </div>
          </div>
          <script>setTimeout(() => window.print(), 500);</script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  }

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-2 shadow-2xl">
        <div className="relative rounded-xl bg-gradient-to-b from-amber-50 via-white to-amber-50 p-8 sm:p-12">
          {/* Corner decorations */}
          <div className="absolute left-4 top-4 h-16 w-16 border-l-2 border-t-2 border-amber-400/30" />
          <div className="absolute right-4 top-4 h-16 w-16 border-r-2 border-t-2 border-amber-400/30" />
          <div className="absolute bottom-4 left-4 h-16 w-16 border-b-2 border-l-2 border-amber-400/30" />
          <div className="absolute bottom-4 right-4 h-16 w-16 border-b-2 border-r-2 border-amber-400/30" />

          {/* Seal */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-amber-200">
              <span className="font-serif text-2xl font-bold text-amber-600">LMS</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center font-serif text-4xl font-semibold tracking-wider text-slate-800">
            CERTIFICATE
          </h2>
          <p className="mt-1 text-center text-sm tracking-[0.3em] text-amber-600">
            OF COMPLETION
          </p>

          {/* Decorative line */}
          <div className="mx-auto my-6 h-0.5 w-48 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Content */}
          <p className="text-center text-slate-500">This is to certify that</p>
          <p className="mt-3 text-center font-serif text-3xl font-bold text-slate-800">
            {certificate.userName}
          </p>
          <div className="mx-auto mt-2 h-0.5 w-64 bg-amber-400" />

          <p className="mt-6 text-center text-slate-500">has successfully completed the course</p>
          <p className="mt-2 text-center font-serif text-xl font-semibold italic text-purple-600">
            "{certificate.courseName}"
          </p>

          {/* Decorative line */}
          <div className="mx-auto my-6 h-0.5 w-48 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Footer info */}
          <div className="mt-8 flex items-end justify-between text-center text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Date</p>
              <p className="mt-1 font-medium text-slate-700">{formattedDate}</p>
            </div>
            <div>
              <div className="mx-auto mb-1 w-32 border-t border-slate-400" />
              <p className="font-serif italic text-slate-600">Course Director</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Certificate ID</p>
              <p className="mt-1 font-mono text-xs text-slate-500">{certificate.certificateId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={downloadCertificate} className="gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Certificate
        </Button>
        <Button variant="outline" onClick={() => navigator.share?.({
          title: 'My Certificate',
          text: `I completed ${certificate.courseName}!`,
          url: window.location.href
        }).catch(() => {})} className="gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </Button>
      </div>

      {/* Congratulations message */}
      <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
              Congratulations on your achievement!
            </h3>
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
              You've demonstrated your commitment to learning. This certificate is a testament to your hard work and dedication.
            </p>
          </div>
        </div>
      </Card>
    </div>
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
      <Card className="border-dashed">
        <div className="flex flex-col items-center py-8">
          <div className="relative">
            <svg className="h-20 w-20 text-slate-200 dark:text-slate-700" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" />
            </svg>
            <svg className="absolute inset-0 h-20 w-20 -rotate-90 text-indigo-500" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${progress * 2.83} 283`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{progress}%</span>
            </div>
          </div>
          <h3 className="mt-4 font-semibold text-slate-700 dark:text-slate-300">
            Keep Going!
          </h3>
          <p className="mt-1 text-center text-sm text-slate-500">
            Complete the course to earn your certificate
          </p>
          <p className="mt-4 text-xs text-slate-400">
            {100 - progress}% remaining
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-800/20" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-800/20" />

        <div className="relative flex flex-col items-center py-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
            Congratulations!
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            You've completed the course!
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Click below to claim your certificate
          </p>
          {error && (
            <p className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </p>
          )}
          <Button
            className="mt-6 gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            onClick={generateCertificate}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Claim Your Certificate
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
