export interface AuthFormState {
  status: "idle" | "error" | "success";
  message?: string;
}

export const initialAuthState: AuthFormState = { status: "idle" };

export interface ContactFormState {
  status: "idle" | "error" | "success";
  message?: string;
}

export const initialContactState: ContactFormState = { status: "idle" };
