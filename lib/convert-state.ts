import type { Site2MarkdownErrorCode } from "@/lib/errors";

export interface ConvertIdleState {
  status: "idle";
}

export interface ConvertErrorState {
  status: "error";
  errorCode: Site2MarkdownErrorCode;
  errorStatus?: number;
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
};
