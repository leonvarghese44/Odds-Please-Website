import { rm } from 'node:fs/promises';

const stage = process.argv[2];
const distDirectory = new URL('../dist/', import.meta.url);

if (stage === 'clean') {
  await rm(distDirectory, { recursive: true, force: true });
} else if (stage === 'finalize') {
  await rm(new URL('server/.dev.vars', distDirectory), { force: true });
} else {
  throw new Error('Expected build stage "clean" or "finalize".');
}
