import Link from "next/link";

interface LegalFooterProps {
  bgColor?: string | null;
  TERMS_URL?: string;
  PRIVACY_URL?: string;
  IS_FORMBRICKS_CLOUD: boolean;
  surveyUrl: string;
}

export default function LegalFooter({
  bgColor,
  IMPRINT_URL,
  PRIVACY_URL,
  IS_FORMBRICKS_CLOUD,
  surveyUrl,
}: LegalFooterProps) {
  if (!IMPRINT_URL && !PRIVACY_URL && !IS_FORMBRICKS_CLOUD) return null;

  const createMailToLink = (surveyLink) => {
    const subject = encodeURIComponent("Reporting this survey");
    const body = encodeURIComponent(
      `I report the survey to the Formbricks team as it is spam, abusive or violates the terms.\n\n${surveyLink}`
    );
    return `mailto:hola@formbricks.com?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className={`absolute bottom-0 h-12 w-full`}
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
        {PRIVACY_URL && IS_FORMBRICKS_CLOUD && <span className="px-2">|</span>}
        {IS_FORMBRICKS_CLOUD && (
          <Link href={createMailToLink(surveyUrl)} target="_blank" className="hover:underline">
            Report Survey
          </Link>
        )}
      </div>
    </div>
  );
}
