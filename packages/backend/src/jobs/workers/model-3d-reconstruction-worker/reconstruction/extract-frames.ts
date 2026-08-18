import fs from 'node:fs/promises';
import path from 'node:path';

import { reconstructionConfig } from './config.ts';
import { runBinary } from './exec.ts';

/** Frame sampling rate is clamped to this range regardless of video length. */
const MIN_FPS = 0.5;
const MAX_FPS = 4;

async function getVideoDurationSeconds(videoPath: string): Promise<number> {
  const { stdout } = await runBinary(
    reconstructionConfig.ffprobeBin,
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      videoPath,
    ],
    {
      stageName: 'ffprobe duration',
      timeoutMs: reconstructionConfig.stageTimeoutMs,
    }
  );

  const duration = Number(stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(
      `ffprobe duration: could not determine a valid duration for "${videoPath}"`
    );
  }
  return duration;
}

/**
 * Extracts a bounded, roughly evenly-spaced set of frames from the capture
 * video for SfM. Sampling rate is derived from the video length so short and
 * long captures both land under `reconstructionConfig.maxFrames`.
 */
export async function extractFrames(
  videoPath: string,
  framesDir: string
): Promise<string[]> {
  await fs.mkdir(framesDir, { recursive: true });

  const duration = await getVideoDurationSeconds(videoPath);
  const rawFps = reconstructionConfig.maxFrames / duration;
  const fps = Math.min(Math.max(rawFps, MIN_FPS), MAX_FPS);

  await runBinary(
    reconstructionConfig.ffmpegBin,
    [
      '-y',
      '-i',
      videoPath,
      '-vf',
      `fps=${fps}`,
      '-frames:v',
      String(reconstructionConfig.maxFrames),
      '-qscale:v',
      '2',
      path.join(framesDir, 'frame_%05d.jpg'),
    ],
    {
      stageName: 'ffmpeg frame extraction',
      timeoutMs: reconstructionConfig.stageTimeoutMs,
    }
  );

  const frames = (await fs.readdir(framesDir)).filter((name) =>
    name.endsWith('.jpg')
  );

  if (frames.length < reconstructionConfig.minFrames) {
    throw new Error(
      `ffmpeg frame extraction: only extracted ${frames.length} frame(s) ` +
        `(need at least ${reconstructionConfig.minFrames}) — video is too ` +
        'short or too low quality for reconstruction'
    );
  }

  return frames.sort();
}
