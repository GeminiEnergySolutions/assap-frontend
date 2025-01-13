export interface Response<T = never> {
  message: string;
  data: T;
  errorDetails?: string;
}
