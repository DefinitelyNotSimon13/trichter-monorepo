import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef } from "react";

/**
 * Encapsulates the Cloudflare Turnstile captcha ref and produces
 * the fetchOptions object expected by better-auth endpoints.
 */
export function useTurnstile() {
	const ref = useRef<TurnstileInstance | null>(null);

	const getFetchOptions = ():
		| { headers: Record<string, string> }
		| Record<string, never> => {
		if (ref.current?.getResponse) {
			return {
				headers: { "x-captcha-response": ref.current.getResponse() ?? "" },
			};
		}
		return {};
	};

	return { ref, getFetchOptions };
}
