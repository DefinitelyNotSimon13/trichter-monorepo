import { createFormHook } from "@tanstack/react-form";

import {
  FormPasswordInput,
  FormSubmitButton,
  FormTextInput,
} from "#/components/form";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    FormTextInput,
    FormPasswordInput,
  },
  formComponents: {
    FormSubmitButton,
  },
  fieldContext,
  formContext,
});
