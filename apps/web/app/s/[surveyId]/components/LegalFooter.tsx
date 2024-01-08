import Link from "next/link";

interface LegalFooterProps {
  bgColor?: string | null;
  TERMS_URL?: string;
  PRIVACY_URL?: string;
}

export default function LegalFooter({ bgColor, TERMS_URL, PRIVACY_URL }: LegalFooterProps) {
  if (!TERMS_URL && !PRIVACY_URL) return null;

  return (
    <div
      className={`fixed bottom-0 h-12 w-full`}
      style={{
        backgroundColor: `${bgColor}`,
      }}>
      <div className="mx-auto max-w-lg p-3 text-center text-xs text-slate-400">
        {TERMS_URL && (
          <Link href={TERMS_URL} target="_blank" className="hover:underline">
            서비스 이용약관
          </Link>
        )}
        {TERMS_URL && PRIVACY_URL && <span className="px-2">|</span>}
        {PRIVACY_URL && (
          <Link href={PRIVACY_URL} target="_blank" className="hover:underline">
            개인정보처리방침
          </Link>
        )}
      </div>
    </div>
  );
}
