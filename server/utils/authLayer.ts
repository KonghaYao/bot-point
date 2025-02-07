import { AuthorizationError, ComposeEventHandler } from "endpoint-kit";
import { sha256 } from "ohash";

export const authLayer = (): ComposeEventHandler => (event) => {
  const userKey = event.headers.get("authorization");
  if ("Bearer " + encryptToken(process.env.BOTPOINT_TOKEN) !== userKey) {
    throw new AuthorizationError("Invalid token");
  }
};

export const encryptToken = (token: string, timespace = 60 * 1000) => {
  return sha256(token + Date.now() / timespace);
};
