import { IsInt, Min } from 'class-validator';

const MIN_MAX_REDIRECTS = 0;
const MIN_TIMEOUT = 0;

export class HttpEnv {
  @IsInt({
    message: 'HTTP client max redirects is required',
  })
  @Min(MIN_MAX_REDIRECTS)
  public maxRedirects: number;

  @IsInt({
    message: 'HTTP client timeout is required',
  })
  @Min(MIN_TIMEOUT)
  public timeout: number;
}
