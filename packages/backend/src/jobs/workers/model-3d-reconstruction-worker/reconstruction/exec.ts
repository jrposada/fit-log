import { spawn } from 'node:child_process';

const OUTPUT_TAIL_CHARS = 2000;

export interface RunBinaryOptions {
  /** Working directory for the process. */
  cwd?: string;
  /** Kills the process (SIGKILL) if it hasn't exited by this point. */
  timeoutMs: number;
  /** Prefixes any thrown error, e.g. "colmap feature_extractor". */
  stageName: string;
}

export interface RunBinaryResult {
  stdout: string;
}

/**
 * Runs an external binary to completion, rejecting with a message that
 * includes the failing stage and a tail of its output — the only signal
 * available for diagnosing a failed reconstruction stage after the fact,
 * since stdout/stderr aren't persisted anywhere else.
 */
export function runBinary(
  command: string,
  args: string[],
  options: RunBinaryOptions
): Promise<RunBinaryResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, options.timeoutMs);

    child.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });

    child.on('error', (error) => {
      clearTimeout(timer);
      reject(
        new Error(
          `${options.stageName}: failed to start "${command}" (${error.message})`
        )
      );
    });

    child.on('close', (code) => {
      clearTimeout(timer);

      if (timedOut) {
        reject(
          new Error(
            `${options.stageName}: "${command}" timed out after ${options.timeoutMs}ms`
          )
        );
        return;
      }

      if (code !== 0) {
        const tail =
          stderr.trim().slice(-OUTPUT_TAIL_CHARS) ||
          stdout.trim().slice(-OUTPUT_TAIL_CHARS);
        reject(
          new Error(
            `${options.stageName}: "${command}" exited with code ${code}${
              tail ? ` — ${tail}` : ''
            }`
          )
        );
        return;
      }

      resolve({ stdout });
    });
  });
}
