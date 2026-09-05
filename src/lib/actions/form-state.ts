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

export interface CommentFormState {
  status: "idle" | "error" | "auth_required" | "success";
  message?: string;
}

export const initialCommentState: CommentFormState = { status: "idle" };

export interface ArticleFormState {
  status: "idle" | "error" | "success";
  message?: string;
  articleId?: string;
}

export const initialArticleFormState: ArticleFormState = { status: "idle" };

export interface MediaFormState {
  status: "idle" | "error" | "success";
  message?: string;
}

export const initialMediaFormState: MediaFormState = { status: "idle" };

export interface TickerFormState {
  status: "idle" | "error" | "success";
  message?: string;
}

export const initialTickerFormState: TickerFormState = { status: "idle" };
