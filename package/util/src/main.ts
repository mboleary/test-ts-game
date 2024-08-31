import {program} from 'commander';
import { buildExports } from './export_builder/main';

program.name('game_util').description('CLI to assist with game engine development').version('0');

program.command('exports').description('Generates exports for a library by using index.ts files').argument('<start_dir>', 'Start Directory').action(async (startDir, options) => {
  await buildExports(startDir, startDir);
})
