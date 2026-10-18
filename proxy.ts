import { NextResponse, type NextRequest } from "next/server";
import { getRuntimeBindings } from "./lib/v151/bindings";
import { checkRequestPolicy } from "./lib/v2/policy";

// Preserve the request policy previously enforced by the Cloudflare entrypoint.
export async function proxy(request: NextRequest) {
  return (await checkRequestPolicy(request, getRuntimeBindings())) ?? NextResponse.next();
}
