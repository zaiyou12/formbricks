import { responses } from "@/app/lib/api/response";

import { markDisplayRespondedLegacy } from "@formbricks/lib/display/service";

export async function OPTIONS(): Promise<Response> {
  return responses.successResponse({}, true);
}

export async function POST(_: Request, { params }: { params: { displayId: string } }): Promise<Response> {
  const { displayId } = params;

  if (!displayId) {
    return responses.badRequestResponse("Missing displayId");
  }

  try {
    await markDisplayRespondedLegacy(displayId);
    return responses.successResponse({}, true);
  } catch (error) {
    return responses.internalServerErrorResponse(error.message);
  }
}
