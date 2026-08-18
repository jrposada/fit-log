import path from 'node:path';

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/** Binary/env-driven knobs for the reconstruction pipeline. All optional — sane defaults assume the tools are on PATH. */
export const reconstructionConfig = {
  colmapBin: process.env.COLMAP_BIN || 'colmap',
  ffmpegBin: process.env.FFMPEG_BIN || 'ffmpeg',
  ffprobeBin: process.env.FFPROBE_BIN || 'ffprobe',
  /** OpenMVS tools (DensifyPointCloud, ReconstructMesh, ...) resolved from this dir, or PATH when unset. */
  openMvsBinDir: process.env.OPENMVS_BIN_DIR || '',
  /** Hard cap on extracted frames — keeps SfM/MVS runtime bounded on long capture videos. */
  maxFrames: envInt('MODEL_3D_RECONSTRUCTION_MAX_FRAMES', 200),
  /** Below this many extracted frames, reconstruction is unlikely to succeed and we fail fast with a clear message. */
  minFrames: envInt('MODEL_3D_RECONSTRUCTION_MIN_FRAMES', 15),
  /** Per binary invocation. A full reconstruction runs several of these back to back. */
  stageTimeoutMs: envInt(
    'MODEL_3D_RECONSTRUCTION_STAGE_TIMEOUT_MS',
    30 * 60 * 1000
  ),
};

export function openMvsBinPath(name: string): string {
  return reconstructionConfig.openMvsBinDir
    ? path.join(reconstructionConfig.openMvsBinDir, name)
    : name;
}
