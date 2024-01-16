import Headline from "@/components/general/Headline";
import HtmlBody from "@/components/general/HtmlBody";
import RedirectCountDown from "@/components/general/RedirectCountdown";
import Subheader from "@/components/general/Subheader";

interface ThankYouCardProps {
  headline?: string;
  subheader?: string;
  redirectUrl: string | null;
  isRedirectDisabled: boolean;
}

export default function ThankYouCard({
  headline,
  subheader,
  redirectUrl,
  isRedirectDisabled,
}: ThankYouCardProps) {
  return (
    <div className="text-center">
      <div className="text-brand flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-24 w-24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <span className="bg-shadow mb-[10px] inline-block h-1 w-16 rounded-[100%]"></span>

      <div>
        <Headline alignTextCenter={true} headline={headline} questionId="thankYouCard" />
        <div className="hidden">
          <Subheader subheader={subheader} questionId="thankYouCard" />
        </div>
        <HtmlBody
          htmlString={"<p>정상적으로 제출되었습니다.</p><p>참여해주셔서 감사합니다.</p>"}
          questionId="thankYouCard"
        />
        <RedirectCountDown redirectUrl={redirectUrl} isRedirectDisabled={isRedirectDisabled} />
      </div>
    </div>
  );
}
