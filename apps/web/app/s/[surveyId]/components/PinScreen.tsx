"use client";

import { validateSurveyPinAction } from "@/app/s/[surveyId]/actions";
import LegalFooter from "@/app/s/[surveyId]/components/LegalFooter";
import LinkSurvey from "@/app/s/[surveyId]/components/LinkSurvey";
import { MediaBackground } from "@/app/s/[surveyId]/components/MediaBackground";
import { TSurveyPinValidationResponseError } from "@/app/s/[surveyId]/types";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@formbricks/lib/cn";
import { TProduct } from "@formbricks/types/product";
import { TResponse } from "@formbricks/types/responses";
import { TSurvey } from "@formbricks/types/surveys";
import { OTPInput } from "@formbricks/ui/OTPInput";

interface LinkSurveyPinScreenProps {
  surveyId: string;
  product: TProduct;
  userId?: string;
  emailVerificationStatus?: string;
  prefillAnswer?: string;
  singleUseId?: string;
  singleUseResponse?: TResponse;
  webAppUrl: string;
  IMPRINT_URL?: string;
  PRIVACY_URL?: string;
  IS_FORMBRICKS_CLOUD: boolean;
  verifiedEmail?: string;
}

const LinkSurveyPinScreen: NextPage<LinkSurveyPinScreenProps> = (props) => {
  const {
    surveyId,
    product,
    webAppUrl,
    emailVerificationStatus,
    userId,
    prefillAnswer,
    singleUseId,
    singleUseResponse,
    IMPRINT_URL,
    PRIVACY_URL,
    IS_FORMBRICKS_CLOUD,
    verifiedEmail,
  } = props;

  const [localPinEntry, setLocalPinEntry] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<TSurveyPinValidationResponseError>();
  const [survey, setSurvey] = useState<TSurvey>();

  const _validateSurveyPinAsync = useCallback(async (surveyId: string, pin: string) => {
    const response = await validateSurveyPinAction(surveyId, pin);
    if (response.error) {
      setError(response.error);
    } else if (response.survey) {
      setSurvey(response.survey);
    }
    setLoading(false);
  }, []);

  const resetState = useCallback(() => {
    setError(undefined);
    setLoading(false);
    setLocalPinEntry("");
  }, []);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => resetState(), 2 * 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [error, resetState]);

  useEffect(() => {
    const validPinRegex = /^\d{4}$/;
    const isValidPin = validPinRegex.test(localPinEntry);

    if (isValidPin) {
      // Show loading and check against the server
      setLoading(true);
      _validateSurveyPinAsync(surveyId, localPinEntry);
      return;
    }

    setError(undefined);
    setLoading(false);
  }, [_validateSurveyPinAsync, localPinEntry, surveyId]);

  if (!survey) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="my-4 font-semibold">
            <h4>This survey is protected. Enter the PIN below</h4>
          </div>
          <OTPInput
            disabled={Boolean(error) || loading}
            value={localPinEntry}
            onChange={(value) => setLocalPinEntry(value)}
            valueLength={4}
            inputBoxClassName={cn({ "border-red-400": Boolean(error) })}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <MediaBackground survey={survey}>
        <LinkSurvey
          survey={survey}
          product={product}
          userId={userId}
          emailVerificationStatus={emailVerificationStatus}
          prefillAnswer={prefillAnswer}
          singleUseId={singleUseId}
          singleUseResponse={singleUseResponse}
          webAppUrl={webAppUrl}
          verifiedEmail={verifiedEmail}
        />
      </MediaBackground>
      <LegalFooter
        bgColor={survey.styling?.background?.bg || "#ffff"}
        TERMS_URL={IMPRINT_URL}
        PRIVACY_URL={PRIVACY_URL}
        IS_FORMBRICKS_CLOUD={IS_FORMBRICKS_CLOUD}
        surveyUrl={webAppUrl + "/s/" + survey.id}
      />
    </div>
  );
};

export default LinkSurveyPinScreen;
