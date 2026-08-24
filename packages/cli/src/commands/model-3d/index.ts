import type { Command } from 'commander';

import { registerReconstructCommand } from './reconstruct.ts';

export default function registerModel3dCommand(program: Command): void {
  const model3dCmd = program
    .command('model-3d')
    .description('Video-to-3D reconstruction utilities');

  registerReconstructCommand(model3dCmd);

  model3dCmd.action(() => {
    console.log();
    console.log('Available model-3d commands:');
    console.log();
    console.log(
      '  cli model-3d reconstruct <video>   Queue a reconstruction job and watch it run'
    );
    console.log();
  });
}
