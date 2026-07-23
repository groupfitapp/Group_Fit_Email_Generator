import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'image-staging-and-publish-api',
      configureServer(server) {
        // 1. Stage image locally in Email Generator ONLY (Draft mode)
        server.middlewares.use('/api/stage-image', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            return res.end('Method Not Allowed');
          }

          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });

          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const { filename, base64Data } = data;

              if (!filename || !base64Data) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Missing filename or base64Data' }));
              }

              const ext = path.extname(filename) || '.png';
              const nameWithoutExt = path.basename(filename, ext)
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

              const stagedFilename = `draft-${nameWithoutExt}-${Date.now()}${ext}`;
              const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');

              const stagedDir = path.resolve('public', 'email-assets', 'images', 'staged');
              fs.mkdirSync(stagedDir, { recursive: true });

              const stagedPath = path.join(stagedDir, stagedFilename);
              fs.writeFileSync(stagedPath, buffer);

              const localUrl = `/email-assets/images/staged/${stagedFilename}`;

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                stagedFilename,
                originalName: filename,
                localUrl,
                status: 'staged'
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });

        // 2. Publish assets to Group_Fit_Website repo & update HTML code
        server.middlewares.use('/api/publish-assets', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            return res.end('Method Not Allowed');
          }

          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });

          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const { stagedImages, currentHtml, currentBody } = data;

              const websiteImgDir = path.resolve('..', 'Group_Fit_Website', 'public', 'email-assets', 'images');
              const localFinalImgDir = path.resolve('public', 'email-assets', 'images');

              fs.mkdirSync(websiteImgDir, { recursive: true });
              fs.mkdirSync(localFinalImgDir, { recursive: true });

              const publishedMap = {};
              const publishedResults = [];

              if (Array.isArray(stagedImages)) {
                for (const img of stagedImages) {
                  if (!img.stagedFilename) continue;

                  const stagedPath = path.resolve('public', 'email-assets', 'images', 'staged', img.stagedFilename);
                  if (!fs.existsSync(stagedPath)) continue;

                  const ext = path.extname(img.stagedFilename) || '.png';
                  const baseClean = (img.originalName || 'email-image')
                    .replace(/\.[^/.]+$/, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');

                  const timestamp = Date.now();
                  const finalFilename = `${baseClean}-${timestamp}${ext}`;

                  const websitePath = path.join(websiteImgDir, finalFilename);
                  const localFinalPath = path.join(localFinalImgDir, finalFilename);

                  fs.copyFileSync(stagedPath, websitePath);
                  fs.copyFileSync(stagedPath, localFinalPath);

                  const webUrl = `https://groupfitapp.com/email-assets/images/${finalFilename}`;
                  const localUrl = `/email-assets/images/${finalFilename}`;

                  publishedMap[img.localUrl] = webUrl;
                  publishedMap[img.stagedFilename] = webUrl;

                  publishedResults.push({
                    stagedFilename: img.stagedFilename,
                    finalFilename,
                    webUrl,
                    localUrl,
                    status: 'published'
                  });
                }
              }

              // Update HTML & Body text by replacing local/staged URLs with final web URLs
              let updatedHtml = currentHtml || '';
              let updatedBody = currentBody || '';

              for (const [draftUrl, finalWebUrl] of Object.entries(publishedMap)) {
                updatedHtml = updatedHtml.replaceAll(draftUrl, finalWebUrl);
                updatedBody = updatedBody.replaceAll(draftUrl, finalWebUrl);
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                publishedCount: publishedResults.length,
                publishedResults,
                updatedHtml,
                updatedBody
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });
      }
    }
  ]
});
