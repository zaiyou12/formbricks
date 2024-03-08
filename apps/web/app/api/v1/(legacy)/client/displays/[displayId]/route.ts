import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";

import { updateDisplayLegacy } from "@formbricks/lib/display/service";
import { ZDisplayLegacyUpdateInput } from "@formbricks/types/displays";

export async function OPTIONS(): Promise<Response> {
  return responses.successResponse({}, true);
}

export async function PUT(
  request: Request,
  { params }: { params: { displayId: string } }
): Promise<Response> {
  const { displayId } = params;
  if (!displayId) {
    return responses.badRequestResponse("Missing displayId", undefined, true);
  }
  const displayInput = await request.json();
  const inputValidation = ZDisplayLegacyUpdateInput.safeParse(displayInput);

  if (!inputValidation.success) {
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(inputValidation.error),
      true
    );
  }
  try {
    const display = await updateDisplayLegacy(displayId, inputValidation.data);
    return responses.successResponse(display, true);
  } catch (error) {
    console.error(error);
    return responses.internalServerErrorResponse(error.message, true);
  }
}
