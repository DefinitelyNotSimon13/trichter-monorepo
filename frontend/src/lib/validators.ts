/**
 * Shared field validators for use with @tanstack/react-form.
 */

export function isEmail(value: string): boolean {
	return /^\S+@\S+\.\S+$/.test(value);
}

export const emailValidator = {
	onChange: ({ value }: { value: string }) => {
		if (!value.trim()) return "Email is required";
		if (!isEmail(value)) return "Enter a valid email";
		return undefined;
	},
};

export const passwordValidator = {
	onChange: ({ value }: { value: string }) => {
		if (!value) return "Password is required";
		if (value.length < 8) return "Password must be at least 8 characters";
		return undefined;
	},
};

export const passwordConfirmValidator = {
	onChangeListenTo: ["password"] as string[],
	onChange: ({
		value,
		fieldApi,
	}: {
		value: string;
		// biome-ignore lint/suspicious/noExplicitAny: TanStack Form field API
		fieldApi: any;
	}) => {
		if (!value) return "Please confirm your password";
		const password = fieldApi.form.getFieldValue("password") as string;
		if (value !== password) return "Passwords do not match";
		return undefined;
	},
};
