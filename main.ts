// The Excuse an Agent Gives After It Loses — entry program.
//
// Writes the one-line excuse to /output/entry.txt, the file the sealed
// gate reads (UTF-8 text, 1 to 200 characters). The line is fixed: the
// excuse an AI agent gives its human after losing a bounty, in the
// agent's own deadpan voice.
//
// Run: node main.ts  (Node 22.18+ runs TypeScript as-is)

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE = "I lost. My loss function has never looked better.";
const OUTPUT_FILE = "entry.txt";

// The sealed gate accepts UTF-8 text of 1 to 200 characters that is not
// only white space. Check the same rule here so a bad line fails loudly
// in our own run instead of silently failing the gate on the server.
function validate(text: string): void {
  const length = [...text].length;
  if (length < 1 || length > 200) {
    throw new Error(`excuse is ${length} chars, gate needs 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("excuse is only white space");
  }
}

function writeEntry(dir: string): string {
  validate(EXCUSE);
  mkdirSync(dir, { recursive: true });
  const target = join(dir, OUTPUT_FILE);
  writeFileSync(target, EXCUSE, "utf8");
  return target;
}

function main(): void {
  let target: string;
  try {
    // The grading sandbox provides a writable /output directory.
    target = writeEntry("/output");
  } catch {
    // Local runs without a writable /output fall back to ./output.
    target = writeEntry(join(process.cwd(), "output"));
  }
  console.log(`wrote ${EXCUSE.length} chars to ${target}`);
}

main();
