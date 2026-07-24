import { generateEmailHtml } from '../src/template.js';
import fs from 'fs';

const data = {
  audience: 'customer',
  subject: 'Welcome to the Group Fit Referral Program',
  previewText: 'Introduce new customers to Group Fit and earn cash bonuses. The more you share, the more you earn.',
  eyebrow: 'Referral Program',
  heading: 'Share Group Fit. Earn cash bonuses.',
  lede: 'Introduce new customers to Group Fit and earn cash bonuses. The more you share, the more you earn.',
  gateBox: 'Earn up to <strong>$1,500</strong> total cash bonuses',
  ctaText: 'Get Your Referral Code →',
  ctaUrl: 'https://groupfitapp.com/download',
  bodyBlocks: [
    'Hi {SUBSCRIBER_FIRST_NAME},',
    'Thanks for being a valued part of the Group Fit community! We are excited to announce our limited-time launch referral program. Whether you just joined or have been with us for a while, you can now earn cash bonuses simply by introducing new customers to Group Fit.',
    'To view the full details, milestones, and program FAQs, visit our <a href="https://groupfitapp.com/referral" style="color: #dc2c36; text-decoration: underline;">Referral Program Page</a>.',
    '<strong>HERE\'S WHAT YOU CAN EARN</strong><br /><br />• <strong>3 qualifying referrals:</strong> Earn $300<br />• <strong>5 qualifying referrals:</strong> Earn $600 total<br />• <strong>10 qualifying referrals:</strong> Earn $1,500 total<br /><br />After every 10 qualifying referrals, the cycle starts again, so there\'s no limit to how much you can earn.'
  ],
  sectionLabel: 'To get started',
  checklist: [
    { title: 'Download or open Group Fit', desc: 'Download or open <a href="https://groupfitapp.com/download" style="color: #dc2c36; text-decoration: underline;">Group Fit</a>' },
    { title: 'Go to Account → Refer', desc: 'Navigate to your referral menu in the app' },
    { title: 'Copy your referral link', desc: 'Copy your unique referral link or referral code' },
    { title: 'Share with others', desc: 'Share it with someone who may be interested in personal training' }
  ],
  calloutBox: {
    title: 'Today\'s goal:',
    desc: 'Share your referral link with at least one person. Every referral gets you one step closer to your first bonus.'
  },
  signoffHtml: '<strong>The Group Fit Team</strong>'
};

const html = generateEmailHtml(data);
fs.writeFileSync('./scratch/converted_customer_email.html', html, 'utf-8');
console.log('Successfully updated converted_customer_email.html!');
