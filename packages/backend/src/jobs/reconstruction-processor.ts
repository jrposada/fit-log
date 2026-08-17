export type ReconstructionResult = {
  /** Absolute path to the produced glTF/GLB (or similar) on disk. */
  modelPath: string;
  mimeType: string;
};

export interface ReconstructionProcessor {
  /** Runs the SfM -> MVS -> mesh -> texture pipeline against a source video. */
  reconstruct(videoPath: string): Promise<ReconstructionResult>;
}

/**
 * No self-hosted COLMAP/GLOMAP/OpenMVS pipeline is wired up yet. This stub
 * fails clearly so a queued job's failure path (status 'failed' + a real
 * error message) is exercised honestly, rather than faking a placeholder
 * model that would misrepresent what the pipeline actually produced.
 *
 * Swap this for a real implementation (shelling out to COLMAP/GLOMAP +
 * OpenMVS via child_process) once those binaries are available on the host
 * running the worker.
 */
class StubReconstructionProcessor implements ReconstructionProcessor {
  reconstruct(): Promise<ReconstructionResult> {
    return Promise.reject(
      new Error(
        'Video-to-3D reconstruction is not configured on this server ' +
          '(no COLMAP/GLOMAP/OpenMVS pipeline wired up yet). Upload a ' +
          'finished 3D model instead.'
      )
    );
  }
}

export const reconstructionProcessor: ReconstructionProcessor =
  new StubReconstructionProcessor();
