import { authenticateRequest, handleErrorResponse } from "@/app/api/v1/auth";
import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";

import { deleteSurvey, getSurvey, updateSurvey } from "@formbricks/lib/survey/service";
import { TSurvey, ZSurvey } from "@formbricks/types/surveys";

async function fetchAndAuthorizeSurvey(authentication: any, surveyId: string): Promise<TSurvey | null> {
  const survey = await getSurvey(surveyId);
  if (!survey) {
    return null;
  }
  if (survey.environmentId !== authentication.environmentId) {
    throw new Error("Unauthorized");
  }
  return survey;
}

export async function GET(request: Request, { params }: { params: { surveyId: string } }): Promise<Response> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const survey = await fetchAndAuthorizeSurvey(authentication, params.surveyId);
    if (survey) {
      return responses.successResponse(survey);
    }
    return responses.notFoundResponse("Survey", params.surveyId);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { surveyId: string } }
): Promise<Response> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const survey = await fetchAndAuthorizeSurvey(authentication, params.surveyId);
    if (!survey) {
      return responses.notFoundResponse("Survey", params.surveyId);
    }
    const deletedSurvey = await deleteSurvey(params.surveyId);
    return responses.successResponse(deletedSurvey);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: { surveyId: string } }): Promise<Response> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const survey = await fetchAndAuthorizeSurvey(authentication, params.surveyId);
    if (!survey) {
      return responses.notFoundResponse("Survey", params.surveyId);
    }
    const surveyUpdate = await request.json();
    const inputValidation = ZSurvey.safeParse({
      ...survey,
      ...surveyUpdate,
    });
    if (!inputValidation.success) {
      return responses.badRequestResponse(
        "Fields are missing or incorrectly formatted",
        transformErrorToDetails(inputValidation.error)
      );
    }
    return responses.successResponse(await updateSurvey(inputValidation.data));
  } catch (error) {
    return handleErrorResponse(error);
  }
}
