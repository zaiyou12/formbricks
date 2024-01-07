import { BackButton } from "@/components/buttons/BackButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import Headline from "@/components/general/Headline";
import Subheader from "@/components/general/Subheader";
import { getUpdatedTtc, useTtc } from "@/lib/ttc";
import { useState } from "preact/hooks";
import { useCallback } from "react";

import { TResponseData, TResponseTtc } from "@formbricks/types/responses";
import type { TSurveyOpenMultipleTextQuestion } from "@formbricks/types/surveys";

interface OpenMultipleTextQuestionProps {
  question: TSurveyOpenMultipleTextQuestion;
  value: string | number | string[];
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  // brandColor: string;
  autoFocus?: boolean;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
}

export default function OpenMultipleTextQuestion({
  question,
  value,
  onChange,
  onSubmit,
  onBack,
  isFirstQuestion,
  isLastQuestion,
  autoFocus = true,
  ttc,
  setTtc,
}: OpenMultipleTextQuestionProps) {
  const [startTime, setStartTime] = useState(performance.now());
  const [curValue, setValue] = useState(new Array((value as string[])?.length));

  useTtc(question.id, ttc, setTtc, startTime, setStartTime);

  const handleInputChange = (inputValue: string, index: number) => {
    if (Array.isArray(curValue)) {
      var newValue = [...curValue];
      newValue[index] = inputValue;
      setValue(newValue);
      onChange({ [question.id]: newValue });
    }
  };
  const openTextRef = useCallback(
    (currentElement: HTMLInputElement | HTMLTextAreaElement | null) => {
      if (currentElement && autoFocus) {
        currentElement.focus();
      }
    },
    [question.id]
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const updatedttc = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
        setTtc(updatedttc);
        onSubmit({ [question.id]: curValue }, updatedttc);
        // }
      }}
      className="w-full">
      {question.imageUrl && (
        <div className="my-4 rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={question.imageUrl} alt="question-image" className={"my-4 rounded-md"} />
        </div>
      )}
      <Headline headline={question.headline} questionId={question.id} required={question.required} />
      <Subheader subheader={question.subheader} questionId={question.id} />
      {question.inputSets.length > 1 &&
        question.inputSets.map((inputSet, inputSetIdx) => (
          <>
            <div className="mt-3"></div>
            <Subheader subheader={inputSet.subheader} questionId={inputSet.id} />
            <div className="mt-4">
              {inputSet.longAnswer === false ? (
                <input
                  ref={openTextRef}
                  tabIndex={1}
                  placeholder={inputSet.placeholder}
                  required={question.required}
                  type={inputSet.inputType}
                  value={curValue[inputSetIdx]}
                  onInput={(e) => {
                    handleInputChange(e.currentTarget.value, inputSetIdx);
                    if (e.currentTarget.value.length > 0) {
                      e.currentTarget.setCustomValidity("");
                    }
                  }}
                  autoFocus={autoFocus}
                  pattern={".*"}
                  className={`block w-full rounded-md border
         border-slate-100
         bg-slate-50 p-2 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-0 sm:text-sm`}
                  onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("정보를 입력해주세요")}
                />
              ) : (
                <textarea
                  ref={openTextRef}
                  rows={3}
                  tabIndex={1}
                  placeholder={inputSet.placeholder}
                  required={question.required}
                  type={inputSet.inputType}
                  value={curValue[inputSetIdx]}
                  onInput={(e) => handleInputChange(e.currentTarget.value, inputSetIdx)}
                  autoFocus={autoFocus}
                  pattern={inputSet.inputType === "phone" ? "[+][0-9 ]+" : ".*"}
                  title={inputSet.inputType === "phone" ? "Please enter a valid phone number" : undefined}
                  className={`block w-full rounded-md border
        border-slate-100
        bg-slate-50 p-2 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-0 sm:text-sm`}></textarea>
              )}
            </div>
          </>
        ))}

      <div className="mt-4 flex w-full justify-between">
        {!isFirstQuestion && (
          <BackButton
            backButtonLabel={question.backButtonLabel}
            onClick={() => {
              onBack();
            }}
          />
        )}
        <div></div>
        <SubmitButton
          buttonLabel={question.buttonLabel}
          isLastQuestion={isLastQuestion}
          // brandColor={brandColor}
          onClick={() => {}}
        />
      </div>
    </form>
  );
}
