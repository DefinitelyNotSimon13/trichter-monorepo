import { Link } from "@tanstack/react-router";

export function PrivacyNotice() {
  return (
    <>
      By continuing, you agree to our{" "}
      <Link
        to="/{-$locale}/policy/terms"
        className="underline underline-offset-4"
      >
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link
        to="/{-$locale}/policy/privacy"
        className="underline underline-offset-4"
      >
        Privacy Policy
      </Link>
      .
    </>
  );
}
