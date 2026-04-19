import type { Site2MarkdownErrorCode } from "@/lib/errors";

export interface ConvertIdleState {
  status: "idle";
}

export interface ConvertErrorState {
  status: "error";
  errorCode: Site2MarkdownErrorCode;
  errorStatus?: number;
}

export type ConvertSourceData =
  | {
      kind: "url";
      url: string;
    }
  | {
      kind: "pdf";
      fileName: string;
      pageCount: number;
    };

export interface ConvertSuccessState {
  status: "success";
  data: {
    source: ConvertSourceData;
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
