import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoDir = join(__dirname, "../public/logo");

const svg = readFileSync(join(logoDir, "root-instagram-profile.svg"));

// 인스타그램 권장 사이즈: 1080x1080
await sharp(svg)
  .resize(1080, 1080)
  .png()
  .toFile(join(logoDir, "root-instagram-profile.png"));

console.log("✓ root-instagram-profile.png (1080x1080)");
console.log("완료! public/logo/ 폴더를 확인해주세요.");
