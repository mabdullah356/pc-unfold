import sharp from "sharp";

const NAMES = ["setup", "monitor", "cpu", "keyboard", "mouse"];
const SRC_DIR = "src/assets/images";
const OUT_DIR = "src/assets/images";

for (const name of NAMES) {
  const src = `${SRC_DIR}/${name}.jpg`;
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // White-key: alpha rises as the pixel moves away from white.
    const mn = r < g ? (r < b ? r : b) : g < b ? g : b;
    const a = 255 - mn;

    if (a <= 0) {
      out[i + 3] = 0;
      continue;
    }

    // Unmix from white so semi-transparent edges keep their true color.
    const inv = 255 - a;
    const f = 255 / a;
    const nr = (r - inv) * f;
    const ng = (g - inv) * f;
    const nb = (b - inv) * f;

    out[i] = nr < 0 ? 0 : nr > 255 ? 255 : nr;
    out[i + 1] = ng < 0 ? 0 : ng > 255 ? 255 : ng;
    out[i + 2] = nb < 0 ? 0 : nb > 255 ? 255 : nb;
    out[i + 3] = a;
  }

  const dest = `${OUT_DIR}/${name}.webp`;
  const isSetup = name === "setup";
  const pipeline = sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });

  if (!isSetup) pipeline.resize(720, 720);

  const file = await pipeline
    .webp({
      quality: isSetup ? 82 : 72,
      alphaQuality: 75,
      effort: 6,
    })
    .toFile(dest);

  const meta = await sharp(dest).metadata();
  const kb = (file.size / 1024).toFixed(1);
  console.log(`${name}.webp — ${kb} kB, alpha: ${meta.hasAlpha}`);
}

console.log("done");
