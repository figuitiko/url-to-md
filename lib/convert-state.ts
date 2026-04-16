export interface ConvertIdleState {
  status: "idle";
  message: string;
}

export interface ConvertErrorState {
  status: "error";
  error: string;
}

export interface ConvertSuccessState {
  status: "success";
  data: {
    sourceUrl: string;
    title: string | null;
    siteName: string | null;
    markdown: string;
    filename: string;
  };
}

export type ConvertState = ConvertIdleState | ConvertErrorState | ConvertSuccessState;

export const initialConvertState: ConvertState = {
  status: "idle",
  message: "Paste a public URL to extract markdown.",
};
