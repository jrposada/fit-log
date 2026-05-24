// ⚠️  Upstream API is currently unreachable.
// `restapimoonboard.ems-x.com` was retired by Moonboard when their new
// official mobile app shipped. Every path on this host now returns HTTP 200
// with an empty body. The code below is shaped correctly for the legacy
// OAuth2 + paginated-list flow and is expected to need only URL / field
// renames once the new mobile API is captured via a proxy on the new app.
// See docs/designs/moonboard-backend.md → "Current Blocker".

import axios, { type AxiosInstance, isAxiosError } from 'axios';

const API_HOST = 'https://restapimoonboard.ems-x.com';
const CLIENT_ID = 'com.moonclimbing.mb';
const USER_AGENT = 'MoonBoard/1.0';
const API_VERSION = '8.3.4';
const PAGE_SIZE = 5000;

export type MoonboardHoldset =
  | 'MoonBoard 2016'
  | 'MoonBoard Masters 2017'
  | 'MoonBoard Masters 2019'
  | 'Mini MoonBoard 2020';

export type MoonboardAngle = 0 | 25 | 40;

export interface MoonboardSetup {
  holdset: MoonboardHoldset;
  angle: MoonboardAngle;
}

// Layout/angle codes used by the mobile API. Mapping reverse-engineered from
// the Moonboard mobile app (see spookykat/MoonBoard).
const SETUP_CODES: Record<string, { layout: number; angle: number }> = {
  'MoonBoard 2016|0': { layout: 1, angle: 0 },
  'MoonBoard Masters 2017|40': { layout: 15, angle: 1 },
  'MoonBoard Masters 2017|25': { layout: 15, angle: 2 },
  'MoonBoard Masters 2019|40': { layout: 17, angle: 1 },
  'MoonBoard Masters 2019|25': { layout: 17, angle: 2 },
  'Mini MoonBoard 2020|40': { layout: 19, angle: 1 },
};

export const DEFAULT_SETUPS: MoonboardSetup[] = [
  { holdset: 'MoonBoard 2016', angle: 0 },
  { holdset: 'MoonBoard Masters 2017', angle: 40 },
  { holdset: 'MoonBoard Masters 2017', angle: 25 },
  { holdset: 'MoonBoard Masters 2019', angle: 40 },
  { holdset: 'MoonBoard Masters 2019', angle: 25 },
  { holdset: 'Mini MoonBoard 2020', angle: 40 },
];

export interface MoonboardMove {
  description: string;
  isStart: boolean;
  isEnd: boolean;
}

export interface MoonboardProblem {
  apiId: number;
  name: string;
  grade: string;
  userGrade?: string;
  userRating?: number;
  repeats?: number;
  isBenchmark: boolean;
  isMaster: boolean;
  setter?: { nickname?: string };
  moves: MoonboardMove[];
  holdsetup: MoonboardHoldset;
  angle: MoonboardAngle;
  // The raw payload also includes timestamps, etc. Keep additional keys.
  [key: string]: unknown;
}

export interface MoonboardSetupProblems {
  setup: MoonboardSetup;
  problems: MoonboardProblem[];
}

export interface MoonboardFetchResult {
  setups: MoonboardSetupProblems[];
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface ProblemsResponse {
  data: Array<Record<string, unknown>>;
}

class MoonboardClient {
  private readonly http: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.http = axios.create({
      baseURL: API_HOST,
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Encoding': 'gzip',
      },
      // The mobile API returns JSON but doesn't always send Content-Type.
      responseType: 'json',
    });
  }

  public async connect(username: string, password: string): Promise<void> {
    const body = new URLSearchParams({
      username,
      password,
      grant_type: 'password',
      client_id: CLIENT_ID,
    });

    const tokens = await this.tokenRequest(body);
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
  }

  public disconnect(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }

  public async getProblems(setup: MoonboardSetup): Promise<MoonboardProblem[]> {
    const code = SETUP_CODES[`${setup.holdset}|${setup.angle}`];
    if (!code) {
      throw new Error(
        `Unsupported holdset/angle combination: ${setup.holdset} @ ${setup.angle}°`
      );
    }

    const problems: MoonboardProblem[] = [];
    let cursor = 0;

    // The mobile API pages by "give me everything with apiId > cursor". When
    // the response is shorter than PAGE_SIZE we've reached the end.
    while (true) {
      const url =
        `/v1/_moonapi/problems/v3/${code.layout}/${code.angle}/${cursor}` +
        `?v=${API_VERSION}`;
      const response = await this.authenticatedGet<ProblemsResponse>(url);
      const batch = response.data ?? [];

      for (const raw of batch) {
        problems.push({
          ...raw,
          holdsetup: setup.holdset,
          angle: setup.angle,
        } as MoonboardProblem);
      }

      if (batch.length < PAGE_SIZE) break;

      const last = batch[batch.length - 1] as { apiId?: number };
      if (typeof last.apiId !== 'number') break;
      cursor = last.apiId;
    }

    return problems;
  }

  public async fetchAll(
    setups: MoonboardSetup[] = DEFAULT_SETUPS
  ): Promise<MoonboardFetchResult> {
    const results: MoonboardSetupProblems[] = [];
    for (const setup of setups) {
      const problems = await this.getProblems(setup);
      results.push({ setup, problems });
    }
    return { setups: results };
  }

  private async authenticatedGet<T>(url: string): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Not connected. Call connect() first.');
    }

    try {
      const response = await this.http.get<T>(url, {
        headers: { Authorization: `BEARER ${this.accessToken}` },
      });
      return response.data;
    } catch (err) {
      if (
        isAxiosError(err) &&
        (err.response?.status === 401 || err.response?.status === 403) &&
        this.refreshToken
      ) {
        await this.refreshAccessToken();
        const response = await this.http.get<T>(url, {
          headers: { Authorization: `BEARER ${this.accessToken}` },
        });
        return response.data;
      }
      throw err;
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available.');
    }
    const body = new URLSearchParams({
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
    });
    const tokens = await this.tokenRequest(body);
    this.accessToken = tokens.access_token;
    if (tokens.refresh_token) {
      this.refreshToken = tokens.refresh_token;
    }
  }

  private async tokenRequest(body: URLSearchParams): Promise<TokenResponse> {
    try {
      // The Moonboard mobile API expects a GET with a form-encoded body
      // (matches the Python reference impl). axios needs an explicit `data`
      // option for GET requests with a body.
      const response = await this.http.request<TokenResponse>({
        url: '/token',
        method: 'POST',
        data: body.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transformResponse: [(d) => d],
      });

      const raw = response.data as unknown as string;
      let parsed: TokenResponse;
      try {
        parsed = JSON.parse(raw);
      } catch {
        throw new Error(
          `Moonboard auth: non-JSON response (status ${response.status}, ` +
            `content-type ${response.headers['content-type']}): ${raw.slice(0, 500)}`
        );
      }

      if (!parsed?.access_token) {
        throw new Error(
          `Moonboard auth returned no access_token (status ${response.status}): ` +
            JSON.stringify(parsed)
        );
      }
      return parsed;
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        throw new Error(
          `Moonboard auth failed: ${err.response.status} ${JSON.stringify(
            err.response.data
          )}`
        );
      }
      throw err;
    }
  }
}

export { MoonboardClient };
