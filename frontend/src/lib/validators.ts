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
