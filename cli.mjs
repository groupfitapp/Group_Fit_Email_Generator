#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { generateEmailHtml } from './src/template.js';

function parseInputFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Basic parsing for structured sections if text/markdown formatted
  const data = {
    subject: 'Complete your trainer profile',
    previewText: 'Customers can only book you after your profile is complete and approved.',
    eyebrow: 'Welcome',
    heading: 'Finish your profile first, {SUBSCRIBER_FIRST_NAME}.',
    lede: '',
    bodyBlocks: [],
    gateBox: '',
    checklist: [],
    ctaText: 'Complete My Profile',
    ctaUrl: 'https://portal.groupfitapp.com/login',
    calloutBox: { title: '', desc: '' },
    signoffName: 'Mohamed M.',
    signoffTitle: 'Founder & CEO, Group Fit'
  };

  const subjectMatch = content.match(/Subject:\s*(.+)/i);
  if (subjectMatch) data.subject = subjectMatch[1].trim();

  const previewMatch = content.match(/Preview:\s*(.+)/i);
  if (previewMatch) data.previewText = previewMatch[1].trim();

  return data;
}

async function main() {
  const args = process.argv.slice(2);
  const inputArg = args.find(a => a.startsWith('--input='))?.split('=')[1] || args[0];
  const outputArg = args.find(a => a.startsWith('--output='))?.split('=')[1] || 'email.html';

  let data = {};
  if (inputArg && fs.existsSync(inputArg)) {
    console.log(`Reading input from ${inputArg}...`);
    data = parseInputFile(inputArg);
  }

  const html = generateEmailHtml(data);
  fs.writeFileSync(outputArg, html, 'utf-8');
  console.log(`✅ SendMails HTML generated successfully at: ${outputArg}`);
}

main().catch(err => {
  console.error('Error generating email HTML:', err);
  process.exit(1);
});
