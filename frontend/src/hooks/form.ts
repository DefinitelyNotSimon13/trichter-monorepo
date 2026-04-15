import { createFormHook } from "@tanstack/react-form";

import {
  FormPasswordInput,
  FormSubmitButton,
  FormTextInput,
} from "#/components/form";
import { fieldContext, formContext } from "./form-context";
import { FormOTPInput } from "#/components/form/form-otp-input";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    FormTextInput,
    FormPasswordInput,
    FormOTPInput,
  },
  formComponents: {
    FormSubmitButton,
  },
  fieldContext,
  formContext,
});
