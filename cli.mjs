#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { generateEmailHtml } from './src/template.js';

function parseInputFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
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

  const lines = content.split('\n');
  let currentKey = null;
  let currentBuffer = [];

  function flushKey() {
    if (!currentKey) return;
    const textVal = currentBuffer.join('\n').trim();
    if (!textVal) return;

    switch (currentKey.toLowerCase()) {
      case 'subject':
        data.subject = textVal;
        break;
      case 'preview':
      case 'previewtext':
        data.previewText = textVal;
        break;
      case 'eyebrow':
        data.eyebrow = textVal;
        break;
      case 'heading':
      case 'h1':
        data.heading = textVal;
        break;
      case 'lede':
      case 'subtitle':
        data.lede = textVal;
        break;
      case 'body':
      case 'bodyblocks':
        data.bodyBlocks = textVal.split('\n\n').filter(Boolean);
        break;
      case 'gatebox':
      case 'gate-box':
      case 'highlight':
        data.gateBox = textVal;
        break;
      case 'checklist':
        data.checklist = textVal.split('\n').filter(Boolean).map(line => {
          const parts = line.replace(/^[-\*\d+\.]\s*/, '').split('|');
          return {
            title: parts[0] ? parts[0].trim() : '',
            desc: parts[1] ? parts[1].trim() : ''
          };
        });
        break;
      case 'ctatext':
      case 'cta text':
      case 'cta':
        data.ctaText = textVal;
        break;
      case 'ctaurl':
      case 'cta url':
      case 'link':
        data.ctaUrl = textVal;
        break;
      case 'callouttitle':
      case 'callout title':
        data.calloutBox.title = textVal;
        break;
      case 'calloutdesc':
      case 'callout desc':
        data.calloutBox.desc = textVal;
        break;
      case 'signoffname':
      case 'signoff name':
        data.signoffName = textVal;
        break;
      case 'signofftitle':
      case 'signoff title':
        data.signoffTitle = textVal;
        break;
    }
  }

  const keyRegex = /^(Subject|Preview|PreviewText|Eyebrow|Heading|H1|Lede|Subtitle|Body|BodyBlocks|GateBox|Gate-Box|Highlight|Checklist|CTAText|CTA Text|CTA|CTAUrl|CTA URL|Link|CalloutTitle|Callout Title|CalloutDesc|Callout Desc|SignoffName|Signoff Name|SignoffTitle|Signoff Title):\s*(.*)$/i;

  for (const line of lines) {
    const match = line.match(keyRegex);
    if (match) {
      flushKey();
      currentKey = match[1];
      currentBuffer = [match[2]];
    } else if (currentKey) {
      currentBuffer.push(line);
    }
  }
  flushKey();

  return data;
}

function openInBrowser(filePath) {
  const absolutePath = path.resolve(filePath);
  const fileUrl = `file:///${absolutePath.replace(/\\/g, '/')}`;
  
  let command;
  if (process.platform === 'win32') {
    command = `start chrome "${fileUrl}" || start "" "${fileUrl}"`;
  } else if (process.platform === 'darwin') {
    command = `open -a "Google Chrome" "${fileUrl}" || open "${fileUrl}"`;
  } else {
    command = `google-chrome "${fileUrl}" || xdg-open "${fileUrl}"`;
  }

  exec(command, (err) => {
    if (err) {
      console.log(`⚠️ Could not auto-open Chrome: ${err.message}`);
    } else {
      console.log(`🚀 Opened email preview in Google Chrome!`);
    }
  });
}

async function main() {
  const args = process.argv.slice(2);
  const inputArg = args.find(a => a.startsWith('--input='))?.split('=')[1] || args.find(a => !a.startsWith('--'));
  const outputArg = args.find(a => a.startsWith('--output='))?.split('=')[1] || 'email.html';
  const noOpen = args.includes('--no-open');

  let data = {};
  if (inputArg && fs.existsSync(inputArg)) {
    console.log(`Reading input from ${inputArg}...`);
    data = parseInputFile(inputArg);
  }

  const html = generateEmailHtml(data);
  fs.writeFileSync(outputArg, html, 'utf-8');
  console.log(`✅ SendMails HTML generated successfully at: ${outputArg}`);

  if (!noOpen) {
    openInBrowser(outputArg);
  }
}

main().catch(err => {
  console.error('Error generating email HTML:', err);
  process.exit(1);
});
