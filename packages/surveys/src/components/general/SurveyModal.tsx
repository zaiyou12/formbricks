import Modal from "@/components/wrappers/Modal";
import { useState } from "preact/hooks";

import { SurveyModalProps } from "@formbricks/types/formbricksSurveys";

import { Survey } from "./Survey";

export function SurveyModal({
  survey,
  isBrandingEnabled,
  activeQuestionId,
  getSetIsError,
  placement,
  clickOutside,
  darkOverlay,
  highlightBorderColor,
  onDisplay,
  getSetIsResponseSendingFinished,
  onActiveQuestionChange,
  onResponse,
  onClose,
  onFinished = () => {},
  onFileUpload,
  onRetry,
  isRedirectDisabled = false,
  responseCount,
}: SurveyModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const close = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 1000); // wait for animation to finish}
  };

  return (
    <div id="fbjs" className="formbricks-form">
      <Modal
        placement={placement}
        clickOutside={clickOutside}
        darkOverlay={darkOverlay}
        highlightBorderColor={highlightBorderColor}
        isOpen={isOpen}
        onClose={close}>
        <Survey
          survey={survey}
          isBrandingEnabled={isBrandingEnabled}
          activeQuestionId={activeQuestionId}
          onDisplay={onDisplay}
          getSetIsResponseSendingFinished={getSetIsResponseSendingFinished}
          onActiveQuestionChange={onActiveQuestionChange}
          onResponse={onResponse}
          onClose={close}
          onFinished={() => {
            onFinished();
            setTimeout(() => {
              if (!survey.redirectUrl) {
                close();
              }
            }, 3000); // close modal automatically after 3 seconds
          }}
          onRetry={onRetry}
          getSetIsError={getSetIsError}
          onFileUpload={onFileUpload}
          isRedirectDisabled={isRedirectDisabled}
          responseCount={responseCount}
        />
      </Modal>
    </div>
  );
}
