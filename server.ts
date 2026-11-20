import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');

interface BirthdayExportConfig {
  recipientName: string;
  openingTitle: string;
  openingSubtitle: string;
  photoTitle: string;
  photoSubtitle: string;
  photoHandwrittenNote: string;
  photoDataUrl: string | null;
  journeyHeading: string;
  journeyMessages: [string, string, string, string, string];
  letterHeading: string;
  letterBody: string;
  voiceHeading: string;
  voiceSubtitle: string;
  audioDataUrl: string | null;
  audioFileName: string | null;
  giftsHeading: string;
  giftMessages: [string, string, string];
  finaleLine1: string;
  finaleLine2: string;
  finaleGreeting: string;
  finaleClosing: string;
}

function parseDataUrl(dataUrl: string): { mime: string; ext: string; buffer: Buffer } | null {
  const match = /^data:([^;,]+)(?:;[^,]*)?;base64,(.+)$/s.exec(dataUrl);
  if (!match) return null;
  const mime = match[1].toLowerCase();
  const base64 = match[2];

  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/heic': 'heic',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/mp4': 'm4a',
    'audio/x-m4a': 'm4a',
    'audio/aac': 'aac',
    'audio/wav': 'wav',
    'audio/wave': 'wav',
    'audio/ogg': 'ogg',
    'audio/webm': 'webm',
  };

  let ext = mimeToExt[mime];
  if (!ext) {
    const slashParts = mime.split('/');
    ext = (slashParts[1] || 'bin').replace(/[^a-z0-9]/g, '');
  }

  return {
    mime,
    ext,
    buffer: Buffer.from(base64, 'base64'),
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function addDirectoryToZip(zip: JSZip, dirPath: string, zipFolderPath: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relZipPath = zipFolderPath ? `${zipFolderPath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      addDirectoryToZip(zip, fullPath, relZipPath);
    } else {
      zip.file(relZipPath, fs.readFileSync(fullPath));
    }
  }
}

async function ensureProductionDist(): Promise<void> {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    return;
  }
  const { build } = await import('vite');
  await build({
    root: ROOT_DIR,
    logLevel: 'silent',
  });
}

function prepareExportPayload(rawConfig: BirthdayExportConfig) {
  const exportedConfig: BirthdayExportConfig & { hideEditor: boolean } = {
    ...rawConfig,
    hideEditor: true,
  };

  let photoEntry: { path: string; buffer: Buffer } | null = null;
  let audioEntry: { path: string; buffer: Buffer } | null = null;

  if (rawConfig.photoDataUrl && rawConfig.photoDataUrl.startsWith('data:')) {
    const parsed = parseDataUrl(rawConfig.photoDataUrl);
    if (parsed) {
      const relPath = `media/photo.${parsed.ext}`;
      photoEntry = { path: relPath, buffer: parsed.buffer };
      exportedConfig.photoDataUrl = `./${relPath}`;
    }
  } else if (rawConfig.photoDataUrl && rawConfig.photoDataUrl.startsWith('/assets/')) {
    const localPath = path.join(ROOT_DIR, 'public', rawConfig.photoDataUrl.replace(/^\/+/, ''));
    if (fs.existsSync(localPath)) {
      const ext = path.extname(localPath).replace('.', '') || 'jpg';
      const relPath = `media/photo.${ext}`;
      photoEntry = { path: relPath, buffer: fs.readFileSync(localPath) };
      exportedConfig.photoDataUrl = `./${relPath}`;
    }
  }

  if (rawConfig.audioDataUrl && rawConfig.audioDataUrl.startsWith('data:')) {
    const parsed = parseDataUrl(rawConfig.audioDataUrl);
    if (parsed) {
      const relPath = `media/voice.${parsed.ext}`;
      audioEntry = { path: relPath, buffer: parsed.buffer };
      exportedConfig.audioDataUrl = `./${relPath}`;
    }
  } else if (rawConfig.audioDataUrl && rawConfig.audioDataUrl.startsWith('/assets/')) {
    const localPath = path.join(ROOT_DIR, 'public', rawConfig.audioDataUrl.replace(/^\/+/, ''));
    if (fs.existsSync(localPath)) {
      const ext = path.extname(localPath).replace('.', '') || 'mp3';
      const relPath = `media/voice.${ext}`;
      audioEntry = { path: relPath, buffer: fs.readFileSync(localPath) };
      exportedConfig.audioDataUrl = `./${relPath}`;
    }
  }

  return { exportedConfig, photoEntry, audioEntry };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '75mb' }));

  app.post('/api/export-zip', async (req, res) => {
    try {
      const rawConfig = req.body?.config as BirthdayExportConfig | undefined;
      if (!rawConfig) {
        res.status(400).send('Missing configuration payload.');
        return;
      }

      await ensureProductionDist();
      const { exportedConfig, photoEntry, audioEntry } = prepareExportPayload(rawConfig);

      const zip = new JSZip();
      addDirectoryToZip(zip, DIST_DIR, '');

      if (photoEntry) {
        zip.file(photoEntry.path, photoEntry.buffer);
      }
      if (audioEntry) {
        zip.file(audioEntry.path, audioEntry.buffer);
      }

      zip.file('birthday-config.json', JSON.stringify(exportedConfig, null, 2));
      zip.file(
        'vercel.json',
        JSON.stringify(
          {
            cleanUrls: true,
            trailingSlash: false,
          },
          null,
          2,
        ),
      );

      const displayTitle = rawConfig.recipientName?.trim()
        ? `Happy Birthday, ${rawConfig.recipientName.trim()}`
        : 'A Tiny Little World For You';

      const distIndexPath = path.join(DIST_DIR, 'index.html');
      let html = fs.readFileSync(distIndexPath, 'utf-8');
      html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(displayTitle)}</title>`);

      const safeInlineConfig = JSON.stringify(exportedConfig).replace(/<\//g, '<\\/');
      const injectScript = `<script>window.__BIRTHDAY_HIDE_EDITOR__=true;window.__BIRTHDAY_EXPORTED_CONFIG__=${safeInlineConfig};</script>`;
      html = html.replace('</head>', `${injectScript}</head>`);
      zip.file('index.html', html);

      zip.file(
        'README.txt',
        `YOUR PERSONALIZED BIRTHDAY WEBSITE — READY FOR VERCEL\n` +
          `=====================================================\n\n` +
          `This folder contains the complete static website with your photo, voice recording, and messages baked in.\n` +
          `The personalization editor is completely hidden for the recipient.\n\n` +
          `HOW TO DEPLOY TO VERCEL:\n` +
          `Option A (Fastest via Terminal):\n` +
          `  1. Unzip this folder.\n` +
          `  2. Open a terminal inside the unzipped folder.\n` +
          `  3. Run: npx vercel --prod\n\n` +
          `Option B (No Terminal / GitHub):\n` +
          `  Use the "Download GitHub / Vite Source (.zip)" option in the editor, upload to GitHub, and import the repo on vercel.com.\n`,
      );

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="birthday-website-vercel-ready.zip"');
      res.send(zipBuffer);
    } catch (err) {
      console.error('Export static zip error:', err);
      res.status(500).send('Failed to build export ZIP.');
    }
  });

  app.post('/api/export-source-zip', async (req, res) => {
    try {
      const rawConfig = req.body?.config as BirthdayExportConfig | undefined;
      if (!rawConfig) {
        res.status(400).send('Missing configuration payload.');
        return;
      }

      const { exportedConfig, photoEntry, audioEntry } = prepareExportPayload(rawConfig);
      const zip = new JSZip();

      // Add clean src directory
      addDirectoryToZip(zip, path.join(ROOT_DIR, 'src'), 'src');

      // Add public assets so Vite copies them cleanly into dist/
      if (photoEntry) {
        zip.file(`public/${photoEntry.path}`, photoEntry.buffer);
      }
      if (audioEntry) {
        zip.file(`public/${audioEntry.path}`, audioEntry.buffer);
      }
      zip.file('public/birthday-config.json', JSON.stringify(exportedConfig, null, 2));

      // Root Vite config files
      const rootFiles = ['tsconfig.json', 'vite.config.ts'];
      for (const file of rootFiles) {
        const filePath = path.join(ROOT_DIR, file);
        if (fs.existsSync(filePath)) {
          zip.file(file, fs.readFileSync(filePath));
        }
      }

      // Clean static-Vercel index.html
      const displayTitle = rawConfig.recipientName?.trim()
        ? `Happy Birthday, ${rawConfig.recipientName.trim()}`
        : 'A Tiny Little World For You';
      let indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
      indexHtml = indexHtml.replace(
        /<title>.*?<\/title>/i,
        `<title>${escapeHtml(displayTitle)}</title>`,
      );
      zip.file('index.html', indexHtml);

      // Clean Vite package.json for Vercel auto-detection
      const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8'));
      const cleanPkg = {
        name: pkg.name || 'tiny-birthday-world',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
        },
        dependencies: {
          'lucide-react': pkg.dependencies['lucide-react'],
          motion: pkg.dependencies.motion,
          react: pkg.dependencies.react,
          'react-dom': pkg.dependencies['react-dom'],
        },
        devDependencies: {
          '@tailwindcss/vite': pkg.devDependencies['@tailwindcss/vite'],
          '@types/react': pkg.devDependencies['@types/react'],
          '@types/react-dom': pkg.devDependencies['@types/react-dom'],
          '@vitejs/plugin-react': pkg.devDependencies['@vitejs/plugin-react'],
          tailwindcss: pkg.devDependencies.tailwindcss,
          typescript: pkg.devDependencies.typescript,
          vite: pkg.dependencies.vite,
        },
      };
      zip.file('package.json', JSON.stringify(cleanPkg, null, 2));
      zip.file('vercel.json', JSON.stringify({ framework: 'vite', cleanUrls: true }, null, 2));
      zip.file(
        'README.md',
        `# ${displayTitle}\n\n` +
          `## Deploy on Vercel in 3 Easy Steps\n` +
          `1. Unzip this folder and upload all files to a new GitHub repository (private or public).\n` +
          `2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.\n` +
          `3. Click **Deploy** — Vercel detects Vite automatically and publishes your birthday website.\n`,
      );

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="birthday-github-source.zip"');
      res.send(zipBuffer);
    } catch (err) {
      console.error('Export source zip error:', err);
      res.status(500).send('Failed to build source ZIP.');
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(DIST_DIR));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

createServer();
