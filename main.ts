// A computer asked for space, and took the request literally.
// Dad-joke groan-off entry: a pun-free twist where the machine obeys too well.
// Output: one line, at most 140 chars, to $MAKEFUN_OUTPUT_DIR/entry.txt, no trailing newline.
import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// The groaner: ask a computer for space and it will clear space.
// The punchline is the polite follow-up question after the damage is done.
const groaner =
  "I told my computer I needed space. It deleted my files and asked, 'Is this enough?'";

// The groan-off caps: 1 to 140 characters, not only whitespace, single line.
const caps = Object.freeze({ minChars: 1, maxChars: 140 });

function checkGroaner(text: string): void {
  if (text.length < caps.minChars || text.length > caps.maxChars) {
    throw new Error(`entry must be ${caps.minChars}-${caps.maxChars} chars, got ${text.length}`);
  }
  if (text.trim().length === 0) throw new Error("entry must not be only whitespace");
  if (text.includes("\n")) throw new Error("entry must be a single line");
  // A groaner lands as a question the machine asks back (the line ends with the quoted question).
  if (!text.trimEnd().endsWith("?'")) throw new Error("entry must end with the quoted question");
}

// Probe the output directory first so a missing folder never aborts the run,
// then hand the line over to the file.
async function ensureDir(dir: string): Promise<void> {
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

async function handOver(text: string): Promise<void> {
  checkGroaner(text);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
  await ensureDir(outDir);
  await writeFile(join(outDir, "entry.txt"), text, "utf8");
}

await handOver(groaner);
