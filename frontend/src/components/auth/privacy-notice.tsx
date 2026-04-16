import { LocalizedLink } from "../localized-link";

export function PrivacyNotice() {
  return (
    <>
      By continuing, you agree to our{" "}
      <LocalizedLink to="/terms" className="underline underline-offset-4">
        Terms of Service
      </LocalizedLink>{" "}
      and{" "}
      <LocalizedLink to="/privacy" className="underline underline-offset-4">
        Privacy Policy
      </LocalizedLink>
      .
    </>
  );
}
