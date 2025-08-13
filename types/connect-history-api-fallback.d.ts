declare module "connect-history-api-fallback" {
  import { NextHandleFunction } from "connect";

  interface HistoryApiFallbackOptions {
    index?: string;
    verbose?: boolean;
    rewrites?: Array<{
      from: RegExp;
      to: string | ((context: { parsedUrl: URL; match: RegExpMatchArray }) => string);
    }>;
    disableDotRule?: boolean;
    htmlAcceptHeaders?: string[];
  }

  function history(options?: HistoryApiFallbackOptions): NextHandleFunction;

  export = history;
}
