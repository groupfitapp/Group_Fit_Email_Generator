#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { generateEmailHtml } from './src/template.js';

function parseInputFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const data = {
    subject: 'Welcome to Group Fit',
    previewText: '',
    eyebrow: '',
    heading: '',
    lede: '',
    bodyBlocks: [],
    gateBox: '',
    checklist: [],
    ctaText: '',
    ctaUrl: ''
  };

  const subjectMatch = content.match(/Subject:\s*(.+)/i);
  if (subjectMatch) data.subject = subjectMatch[1].trim();

  const previewMatch = content.match(/Preview:\s*(.+)/i);
  if (previewMatch) data.previewText = previewMatch[1].trim();

  const audienceMatch = content.match(/Audience:\s*(trainer|customer)/i);
  if (audienceMatch) data.audience = audienceMatch[1].toLowerCase();

  return data;
}

async function main() {
  const args = process.argv.slice(2);
  const inputArg = args.find(a => a.startsWith('--input='))?.split('=')[1] || args[0];
  const audienceArg = args.find(a => a.startsWith('--audience='))?.split('=')[1] || 'trainer';
  const outputArg = args.find(a => a.startsWith('--output='))?.split('=')[1] || 'email.html';

  let data = { audience: audienceArg };

  if (inputArg && fs.existsSync(inputArg)) {
    console.log(`Reading input from ${inputArg}...`);
    data = { ...data, ...parseInputFile(inputArg) };
  }

  const html = generateEmailHtml(data);
  fs.writeFileSync(outputArg, html, 'utf-8');
  console.log(`✅ SendMails HTML generated successfully for [${data.audience.toUpperCase()}] at: ${outputArg}`);
}

main().catch(err => {
  console.error('Error generating email HTML:', err);
  process.exit(1);
});
