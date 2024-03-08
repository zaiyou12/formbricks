import { BackButton } from "@/components/buttons/BackButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import Headline from "@/components/general/Headline";
import HtmlBody from "@/components/general/HtmlBody";
import QuestionImage from "@/components/general/QuestionImage";
import { getUpdatedTtc, useTtc } from "@/lib/ttc";
import { useState } from "react";

import { TResponseData } from "@formbricks/types/responses";
import { TResponseTtc } from "@formbricks/types/responses";
import type { TSurveyCTAQuestion } from "@formbricks/types/surveys";

interface CTAQuestionProps {
  question: TSurveyCTAQuestion;
  value: string | number | string[];
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
}

export default function CTAQuestion({
  question,
  onSubmit,
  onChange,
  onBack,
  isFirstQuestion,
  isLastQuestion,
  ttc,
  setTtc,
}: CTAQuestionProps) {
  const [startTime, setStartTime] = useState(performance.now());

  useTtc(question.id, ttc, setTtc, startTime, setStartTime);

  return (
    <div key={question.id}>
      {question.imageUrl && <QuestionImage imgUrl={question.imageUrl} />}
      <Headline headline={question.headline} questionId={question.id} required={question.required} />
      <HtmlBody htmlString={question.html} questionId={question.id} />

      <div className="mt-4 flex w-full justify-between">
        {!isFirstQuestion && (
          <BackButton
            backButtonLabel={question.backButtonLabel}
            onClick={() => {
              const updatedTtcObj = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
              setTtc(updatedTtcObj);
              onSubmit({ [question.id]: "" }, updatedTtcObj);
              onBack();
            }}
          />
        )}
        <div className="flex w-full justify-end">
          {!question.required && (
            <button
              tabIndex={0}
              type="button"
              onClick={() => {
                const updatedTtcObj = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
                setTtc(updatedTtcObj);
                onSubmit({ [question.id]: "dismissed" }, updatedTtcObj);
                onChange({ [question.id]: "dismissed" });
              }}
              className="text-heading focus:ring-focus mr-4 flex items-center rounded-md px-3 py-3 text-base font-medium leading-4 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2">
              {question.dismissButtonLabel || "Skip"}
            </button>
          )}
          <SubmitButton
            buttonLabel={question.buttonLabel}
            isLastQuestion={isLastQuestion}
            focus={true}
            onClick={() => {
              if (question.buttonExternal && question.buttonUrl) {
                window?.open(question.buttonUrl, "_blank")?.focus();
              }
              const updatedTtcObj = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
              setTtc(updatedTtcObj);
              onSubmit({ [question.id]: "clicked" }, updatedTtcObj);
              onChange({ [question.id]: "clicked" });
            }}
            type="button"
          />
        </div>
      </div>
    </div>
  );
}
