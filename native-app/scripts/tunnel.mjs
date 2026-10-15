// `npm run tunnel`: like `expo start --tunnel`, but through a free Cloudflare
// quick tunnel instead of ngrok. Use it when the phone can't reach the laptop
// directly (laptop on wired LAN, college Wi-Fi isolation, ngrok blocked).
// Requires cloudflared: `winget install Cloudflare.cloudflared`.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const port = process.env.PORT || '8081';
const windowsDefault = 'C:\\Program Files (x86)\\cloudflared\\cloudflared.exe';
const cloudflared = process.platform === 'win32' && existsSync(windowsDefault) ? windowsDefault : 'cloudflared';

console.log('Starting Cloudflare tunnel…');
const tunnel = spawn(cloudflared, ['tunnel', '--no-autoupdate', '--url', `http://localhost:${port}`], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let expo = null;
function onOutput(chunk) {
  const url = chunk.toString().match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)?.[0];
  if (url && !expo) startExpo(url);
}
tunnel.stdout.on('data', onOutput);
tunnel.stderr.on('data', onOutput);
tunnel.on('error', (e) => {
  console.error(`Could not run cloudflared (${e.message}). Install it with: winget install Cloudflare.cloudflared`);
  process.exit(1);
});
tunnel.on('exit', (code) => {
  if (!expo) {
    console.error(`cloudflared stopped before the tunnel was ready (exit ${code}).`);
    process.exit(1);
  }
});

function startExpo(url) {
  console.log(`Tunnel ready: ${url}`);
  console.log(`If the QR code doesn't work, type this in Expo Go: ${url.replace('https://', 'exps://')}\n`);
  // One command string (not an args array) so `shell: true` works on Windows without a warning.
  expo = spawn(['npx expo start --port', port, ...process.argv.slice(2)].join(' '), {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, EXPO_PACKAGER_PROXY_URL: url },
  });
  expo.on('exit', (code) => {
    tunnel.kill();
    process.exit(code ?? 0);
  });
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    tunnel.kill();
    expo?.kill();
    process.exit(0);
  });
}
