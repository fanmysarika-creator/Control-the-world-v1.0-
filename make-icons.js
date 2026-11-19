// Делает иконку и заставку из icon-bg.svg и icon-fg.svg (запускается в GitHub Actions)
const sharp = require('sharp');
const fs = require('fs');

(async () => {
  fs.mkdirSync('assets', { recursive: true });
  const bg = await sharp('icon-bg.svg').resize(1024, 1024).png().toBuffer();
  const fg = await sharp('icon-fg.svg').resize(1024, 1024).png().toBuffer();
  fs.writeFileSync('assets/icon-background.png', bg);
  fs.writeFileSync('assets/icon-foreground.png', fg);
  await sharp(bg).composite([{ input: fg }]).png().toFile('assets/icon-only.png');

  const logo = await sharp(fg).resize(1000, 1000).png().toBuffer();
  for (const name of ['splash.png', 'splash-dark.png']) {
    await sharp({ create: { width: 2732, height: 2732, channels: 4, background: '#050d1c' } })
      .composite([{ input: logo, gravity: 'center' }])
      .png()
      .toFile('assets/' + name);
  }
  console.log('Иконки готовы');
})().catch(e => { console.error(e); process.exit(1); });
