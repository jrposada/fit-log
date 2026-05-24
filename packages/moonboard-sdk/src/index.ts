const PROBLEMS_URL = '/Problem/GetProblems';
const BENCHMARKS_URL = '/Problem/GetBenchmarkProblems';

export interface MoonboardProblem {
  Id: number;
  Name: string;
  Grade: string;
  UserName: string;
  HoldSetup: {
    Id: number;
    Description: string;
  };
  IsBenchmark: boolean;
  Moves: Array<{
    Description: string;
    IsStart: boolean;
    IsEnd: boolean;
  }>;
}

export interface MoonboardFetchResult {
  problems: MoonboardProblem[];
  benchmarks: MoonboardProblem[];
}

class MoonboardClient {
  private readonly baseUrl = 'https://www.moonboard.com';
  private cookies: string | null = null;

  // NOTE: www.moonboard.com is protected by Cloudflare's JS challenge.
  // Plain HTTP clients (axios, fetch) receive a 403 before reaching the login
  // form. A headless-browser approach (e.g. Playwright) is needed to pass the
  // challenge. This method is intentionally left as a stub until that work is
  // done on a dedicated branch.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async connect(_username: string, _password: string): Promise<void> {
    throw new Error(
      'Moonboard login is blocked by Cloudflare bot protection.\n' +
        'A headless-browser implementation is required. See docs/designs/moonboard-backend.md.'
    );
  }

  public disconnect(): void {
    this.cookies = null;
  }

  public async getProblems(): Promise<MoonboardProblem[]> {
    const data = await this.fetchWithSession<{ Data: MoonboardProblem[] }>(
      PROBLEMS_URL,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    );
    return data.Data ?? [];
  }

  public async getBenchmarks(): Promise<MoonboardProblem[]> {
    const data = await this.fetchWithSession<{ Data: MoonboardProblem[] }>(
      BENCHMARKS_URL,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    );
    return data.Data ?? [];
  }

  public async fetchAll(): Promise<MoonboardFetchResult> {
    const [problems, benchmarks] = await Promise.all([
      this.getProblems(),
      this.getBenchmarks(),
    ]);
    return { problems, benchmarks };
  }

  private async fetchWithSession<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.cookies) {
      throw new Error('Not connected. Call connect() first.');
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Cookie: this.cookies,
      },
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error('Moonboard session expired. Call connect() again.');
    }

    if (!response.ok) {
      throw new Error(`Moonboard request failed: ${response.status} ${url}`);
    }

    return response.json() as Promise<T>;
  }
}

export { MoonboardClient };
