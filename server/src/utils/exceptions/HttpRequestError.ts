export class HttpRequestError extends Error {
  constructor(
    public status: number = 500,
    public code: string,
    public message: string = "Internal Error"
  ) {
    super();
  }

  toString(): string {
    return this.message;
  }
}
