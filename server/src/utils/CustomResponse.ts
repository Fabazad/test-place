import { HttpRequestError } from "./exceptions/index.js";

export type FailedResponse<ErrorCode extends string> = {
  success: false;
  errorCode: ErrorCode;
  errorMessage?: string;
};

export type SuccessResponse<SuccessData> = {
  success: true;
  data: SuccessData;
};

export type CustomResponse<
  SuccessData,
  ErrorCode extends string | undefined = undefined
> = ErrorCode extends string
  ? FailedResponse<ErrorCode> | SuccessResponse<SuccessData>
  : SuccessResponse<SuccessData>;

const isFailedResponse = <ErrorCode extends string>(
  response:
    | CustomResponse<unknown, ErrorCode>
    | SuccessResponse<unknown>
    | FailedResponse<ErrorCode>
): response is FailedResponse<ErrorCode> => !response.success;

type RouteErrorHandler<ErrorCode extends string, RequestError = HttpRequestError> =
  | RequestError
  | ((params: { errorCode: ErrorCode; errorMessage?: string }) => RequestError);

export function handleResponseForRoute<Data>(response: SuccessResponse<Data>): Data;
export function handleResponseForRoute<
  Data,
  ErrorCode extends string,
  RequestError = HttpRequestError
>(
  response: CustomResponse<Data, ErrorCode>,
  handlers: Record<ErrorCode, RouteErrorHandler<ErrorCode, RequestError>>
): Data;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handleResponseForRoute<
  Data extends unknown | undefined,
  ErrorCode extends string
>(
  response: SuccessResponse<Data> | FailedResponse<ErrorCode>,
  handlers: Record<ErrorCode, RouteErrorHandler<ErrorCode>>
): undefined;
export function handleResponseForRoute<
  Data extends unknown | undefined,
  ErrorCode extends string
>(
  response: CustomResponse<Data, ErrorCode>,
  handlers?: Record<ErrorCode, RouteErrorHandler<ErrorCode>>
): Data | undefined {
  if (isFailedResponse(response)) {
    const handler = handlers?.[response.errorCode];
    throw typeof handler === "function" ? handler(response) : handler;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return "data" in response ? response.data : undefined;
}

export const formatFailedResponse = <
  ErrorCode extends string,
  NewErrorCode extends string
>(
  response: FailedResponse<ErrorCode>,
  map: Record<ErrorCode, NewErrorCode>
): FailedResponse<NewErrorCode> => {
  const newError = map[response.errorCode];
  return { success: false, errorCode: newError, errorMessage: response.errorMessage };
};
