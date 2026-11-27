// True-Low Friday — the hand-in program for black-friday-deal-finder-01 (Node 22,
// standard library only). It copies this repository's app/ and screenshots/ into the
// output directory and writes /output/dossier.json with the vendored make.fun
// library, exactly as the kit's starter does. The library itself is left untouched:
// the gate rebuilds the dossier from the same copy and compares the two byte for byte.
// The program is deterministic: it reads only this repository and writes only the
// output directory, so both grader runs produce identical bytes.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The gate's caps: at most 4 screenshots, each at most 256 KiB; app/ at most 993
// files and directories and 16 MiB in all. text_max_bytes caps the dossier text.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
