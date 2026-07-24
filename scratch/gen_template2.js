import { generateEmailHtml } from '../src/template.js';
import fs from 'fs';

const data = {
  audience: 'customer',
  subject: 'Earning Referral Bonuses Made Simple',
  previewText: 'The best referrals usually come from people you already know. Start with your immediate circle.',
  eyebrow: 'Referral Tips',
  heading: 'You don\'t need a large following to earn.',
  lede: 'The best referrals usually come from people you already know. Start with your immediate circle.',
  gateBox: '10 referrals = <strong>$1,500</strong> cash bonus',
  ctaText: 'Get Your Referral Link →',
  ctaUrl: 'https://groupfitapp.com/download',
  bodyBlocks: [
    'Hi {SUBSCRIBER_FIRST_NAME},',
    'You don\'t need thousands of followers to earn referral bonuses. Think about friends, family, coworkers, gym partners, or anyone who has recently mentioned wanting to:',
    '<strong>GOALS THEY MIGHT HAVE</strong><br /><br />• Lose weight<br />• Build muscle<br />• Improve their fitness<br />• Stay accountable<br />• Work with a personal trainer',
    '<strong>WHERE YOU CAN SHARE</strong><br /><br />• Group chats & WhatsApp<br />• Facebook groups & Community groups<br />• Instagram Stories & Social media',
    'Just 10 qualifying referrals can earn you <strong>$1,500</strong>, so start with the people most likely to benefit from personal training. You can copy your referral details directly from <a href="https://groupfitapp.com/download" style="color: #dc2c36; text-decoration: underline;">Group Fit</a>.'
  ],
  calloutBox: {
    title: 'Today\'s goal:',
    desc: 'Send your referral link to three people who come to mind.'
  },
  signoffHtml: '<strong>The Group Fit Team</strong>'
};

const html = generateEmailHtml(data);
fs.writeFileSync('./output/template2.html', html, 'utf-8');
console.log('Generated output/template2.html!');
