import z from "zod";

export const ZActionProperties = z.record(z.string());
export { ZActionClassNoCodeConfig } from "@formbricks/types/actionClasses";
export { ZIntegrationConfig } from "@formbricks/types/integration";

export {
  ZResponseData,
  ZResponsePersonAttributes,
  ZResponseMeta,
  ZResponseTtc,
} from "@formbricks/types/responses";

export {
  ZSurveyWelcomeCard,
  ZSurveyQuestions,
  ZSurveyThankYouCard,
  ZSurveyHiddenFields,
  ZSurveyClosedMessage,
  ZSurveyProductOverwrites,
  ZSurveyStyling,
  ZSurveyVerifyEmail,
  ZSurveySingleUse,
  ZSurveyInlineTriggers,
} from "@formbricks/types/surveys";

export { ZSegmentFilters } from "@formbricks/types/segment";
export { ZTeamBilling } from "@formbricks/types/teams";
export { ZUserNotificationSettings } from "@formbricks/types/user";
