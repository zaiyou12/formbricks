import CTAQuestion from "@/components/questions/CTAQuestion";
import CalQuestion from "@/components/questions/CalQuestion";
import ConsentQuestion from "@/components/questions/ConsentQuestion";
import DateQuestion from "@/components/questions/DateQuestion";
import FileUploadQuestion from "@/components/questions/FileUploadQuestion";
import MultipleChoiceAnswerQuestion from "@/components/questions/MultipleChoiceAnswerQuestion";
import MultipleChoiceMultiQuestion from "@/components/questions/MultipleChoiceMultiQuestion";
import MultipleChoiceSingleQuestion from "@/components/questions/MultipleChoiceSingleQuestion";
import NPSQuestion from "@/components/questions/NPSQuestion";
import OpenMultipleTextQuestion from "@/components/questions/OpenMultipleTextQuestion";
import OpenTextQuestion from "@/components/questions/OpenTextQuestion";
import PictureSelectionQuestion from "@/components/questions/PictureSelectionQuestion";
import RatingQuestion from "@/components/questions/RatingQuestion";

import { TResponseData, TResponseTtc } from "@formbricks/types/responses";
import { TUploadFileConfig } from "@formbricks/types/storage";
import { TSurveyQuestion, TSurveyQuestionType } from "@formbricks/types/surveys";

interface QuestionConditionalProps {
  question: TSurveyQuestion;
  value: string | number | string[];
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  onFileUpload: (file: File, config?: TUploadFileConfig) => Promise<string>;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  autoFocus?: boolean;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
  surveyId: string;
}

export default function QuestionConditional({
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
  surveyId,
  onFileUpload,
}: QuestionConditionalProps) {
  return question.type === TSurveyQuestionType.OpenText ? (
    <OpenTextQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      autoFocus={autoFocus}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.OpenMultipleText ? (
    <OpenMultipleTextQuestion
      question={question}
      value={value as string[]}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      autoFocus={autoFocus}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.MultipleChoiceSingle ? (
    <MultipleChoiceSingleQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.MultipleChoiceMulti ? (
    <MultipleChoiceMultiQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.MultipleChoiceAnswer ? (
    <MultipleChoiceAnswerQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.NPS ? (
    <NPSQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.CTA ? (
    <CTAQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.Rating ? (
    <RatingQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.Consent ? (
    <ConsentQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.Date ? (
    <DateQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.PictureSelection ? (
    <PictureSelectionQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.FileUpload ? (
    <FileUploadQuestion
      surveyId={surveyId}
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      onFileUpload={onFileUpload}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TSurveyQuestionType.Cal ? (
    <CalQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : null;
}
