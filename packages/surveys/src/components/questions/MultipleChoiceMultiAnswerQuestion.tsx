import { BackButton } from "@/components/buttons/BackButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import Headline from "@/components/general/Headline";
import QuestionImage from "@/components/general/QuestionImage";
import Subheader from "@/components/general/Subheader";
import { getUpdatedTtc, useTtc } from "@/lib/ttc";
import { cn, shuffleQuestions } from "@/lib/utils";
import { useMemo, useState } from "preact/hooks";

import { TResponseData } from "@formbricks/types/responses";
import { TResponseTtc } from "@formbricks/types/responses";
import type { TSurveyMultipleChoiceMultiAnswerQuestion } from "@formbricks/types/surveys";

interface MultipleChoiceMultiAnswerProps {
  question: TSurveyMultipleChoiceMultiAnswerQuestion;
  value: string | number | string[];
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
}

export default function MultipleChoiceMultiAnswerQuestion({
  question,
  value,
  onChange,
  onSubmit,
  onBack,
  isFirstQuestion,
  isLastQuestion,
  ttc,
  setTtc,
}: MultipleChoiceMultiAnswerProps) {
  const getActives = (value: string | number | string[]) => {
    if (value === undefined) return new Array(question.choices.length);
    return (value as string[]).map((item) => !!item);
  };

  const [startTime, setStartTime] = useState(performance.now());
  const [curActives, setActives] = useState(getActives(value));
  const [curValues, setValues] = useState((value as string[]) ?? new Array(question.choices.length));

  useTtc(question.id, ttc, setTtc, startTime, setStartTime);

  const questionChoices = useMemo(() => {
    if (!question.choices) {
      return [];
    }
    const choicesWithoutOther = question.choices.filter((choice) => choice.id !== "other");
    if (question.shuffleOption) {
      return shuffleQuestions(choicesWithoutOther, question.shuffleOption);
    }
    return choicesWithoutOther;
  }, [question.choices, question.shuffleOption]);

  const checkItem = (idx: number) => {
    const newActives = [...curActives];
    newActives[idx] = true;
    setActives(newActives);

    const newValues = [...curValues];
    newValues[idx] = "";
    setValues(newValues);
    return onChange({ [question.id]: newValues });
  };

  const unCheckItem = (idx: number) => {
    const newActives = [...curActives];
    newActives[idx] = false;
    setActives(newActives);

    const newValues = [...curValues];
    newValues[idx] = "";
    setValues(newValues);
    return onChange({ [question.id]: newValues });
  };

  const writeItem = (item: string, idx: number) => {
    const newValues = [...curValues];
    newValues[idx] = item;
    setValues(newValues);
    console.log("writeItem", newValues);
    return onChange({ [question.id]: newValues });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onChange({ [question.id]: curValues });
        const updatedTtcObj = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
        setTtc(updatedTtcObj);
        onSubmit({ [question.id]: curValues.map((item) => item ?? "0") }, updatedTtcObj);
      }}
      className="w-full">
      {question.imageUrl && <QuestionImage imgUrl={question.imageUrl} />}
      <Headline headline={question.headline} questionId={question.id} required={question.required} />
      <Subheader subheader={question.subheader} questionId={question.id} />
      <div className="mt-4">
        <fieldset>
          <legend className="sr-only">선택</legend>
          <div className="bg-survey-bg relative max-h-[42vh] space-y-2 overflow-y-auto rounded-md py-0.5 pr-2">
            {questionChoices.map((choice, idx) => (
              <label
                key={choice.id}
                tabIndex={idx + 1}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    if (Array.isArray(value) && value.includes(choice.label)) {
                      unCheckItem(idx);
                    } else {
                      checkItem(idx);
                    }
                  }
                }}
                className={cn(
                  value === choice.label
                    ? "border-border-highlight bg-accent-selected-bg z-10"
                    : "border-border",
                  "text-heading focus-within:border-border-highlight hover:bg-accent-bg focus:bg-accent-bg relative flex cursor-pointer flex-col rounded-md border p-4 focus:outline-none"
                )}>
                <span className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    id={choice.id}
                    name={question.id}
                    tabIndex={-1}
                    value={curActives[idx]}
                    className="border-brand text-brand h-4 w-4 border focus:ring-0 focus:ring-offset-0"
                    aria-labelledby={`${choice.id}-label`}
                    onChange={(e) => {
                      if ((e.target as HTMLInputElement)?.checked) {
                        checkItem(idx);
                      } else {
                        unCheckItem(idx);
                      }
                      (e.target as HTMLInputElement).setCustomValidity("");
                    }}
                    checked={curActives[idx] === true}
                    onInvalid={(e) =>
                      question.required &&
                      (e.target as HTMLInputElement).setCustomValidity("항목 확인을 해주세요")
                    }
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                  />
                  <span id={`${choice.id}-label`} className="ml-3 font-medium">
                    {choice.label}
                  </span>
                </span>
                {curActives[idx] && (
                  <input
                    id={`${idx}-label`}
                    name={question.id}
                    tabIndex={questionChoices.length + 1}
                    value={curValues[idx]}
                    onChange={(e) => {
                      writeItem(e.currentTarget.value, idx);
                      (e.target as HTMLInputElement).setCustomValidity("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        const updatedTtcObj = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
                        setTtc(updatedTtcObj);
                        setTimeout(() => {
                          onSubmit({ [question.id]: curValues }, updatedTtcObj);
                        }, 100);
                      }
                    }}
                    placeholder="주식수를 입력해주세요"
                    className="placeholder:text-placeholder border-border bg-survey-bg text-heading focus:ring-focus mt-3 flex h-10 w-full rounded-md border px-3 py-2 text-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-labelledby={`${idx}-label`}
                    onInvalid={(e) =>
                      question.required &&
                      (e.target as HTMLInputElement).setCustomValidity("주식수를 입력해주세요")
                    }
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                  />
                )}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="mt-4 flex w-full justify-between">
        {!isFirstQuestion && (
          <BackButton
            tabIndex={questionChoices.length + 3}
            backButtonLabel={question.backButtonLabel}
            onClick={() => {
              const updatedTtcObj = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
              setTtc(updatedTtcObj);
              onBack();
            }}
          />
        )}
        <div></div>
        <SubmitButton
          tabIndex={questionChoices.length + 2}
          buttonLabel={question.buttonLabel}
          isLastQuestion={isLastQuestion}
          onClick={() => {}}
        />
      </div>
    </form>
  );
}
