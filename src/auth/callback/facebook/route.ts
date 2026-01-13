import { NextRequest } from "next/server";
import { handleSocialCallback } from "../../social-callback";

export async function GET(request: NextRequest) {
    return handleSocialCallback(request, "facebook");
}
