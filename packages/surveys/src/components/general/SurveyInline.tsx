import { SurveyInlineProps } from "@formbricks/types/formbricksSurveys";

import { Survey } from "./Survey";

export function SurveyInline(props: SurveyInlineProps) {
  return (
    <div id="fbjs" className="formbricks-form h-full w-full">
      <Survey {...props} />
    </div>
  );
}
