import LandingPage, { metadata } from "../page";

// The home page for non-English visitors, rendered per request so it can read their
// language. src/proxy.ts rewrites "/" to here, so visitors never see this URL, and
// the shared canonical points search engines at "/".
export const dynamic = "force-dynamic";

export { metadata };

export default LandingPage;
