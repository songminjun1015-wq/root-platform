import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

mkdirSync(join(publicDir, "logo"), { recursive: true });

const variants = [
  { input: "root-logo-dark.svg",                output: "logo/root-logo-dark.png" },
  { input: "root-logo-light.svg",               output: "logo/root-logo-light.png" },
  { input: "root-logo-transparent-white.svg",   output: "logo/root-logo-transparent-white.png" },
];

const sizes = [
  { suffix: "@1x", width: 320 },
  { suffix: "@2x", width: 640 },
  { suffix: "@3x", width: 960 },
];

for (const { input, output } of variants) {
  const svgBuffer = readFileSync(join(publicDir, input));
  const baseName = output.replace(".png", "");

  for (const { suffix, width } of sizes) {
    const outPath = join(publicDir, `${baseName}${suffix}.png`);
    await sharp(svgBuffer)
      .resize(width)
      .png()
      .toFile(outPath);
    console.log(`✓ ${baseName}${suffix}.png (${width}px)`);
  }
}

// 파비콘용 소형 버전
const darkSvg = readFileSync(join(publicDir, "root-logo-dark.svg"));
await sharp(darkSvg).resize(64).png().toFile(join(publicDir, "logo/favicon-64.png"));
await sharp(darkSvg).resize(512).png().toFile(join(publicDir, "logo/icon-512.png"));
console.log("✓ favicon-64.png");
console.log("✓ icon-512.png");
console.log("\n완료! public/logo/ 폴더를 확인해주세요.");
