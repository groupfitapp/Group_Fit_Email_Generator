import { generateEmailHtml } from '../src/template.js';
import fs from 'fs';

const data = {
  audience: 'customer',
  subject: 'Important: Tracking Your Referrals Properly',
  previewText: 'Our referral tracking system is fully automated. Make sure your referrals use your link or code during signup so you get credited.',
  eyebrow: 'Referral Tracking',
  heading: 'How to ensure your referrals are tracked.',
  lede: 'Our referral tracking system is fully automated. Make sure your referrals use your link or code during signup so you get credited.',
  gateBox: 'Referrals must use your <strong>LINK</strong> or <strong>CODE</strong>',
  ctaText: 'Get Your Referral Code →',
  ctaUrl: 'https://groupfitapp.com/download',
  bodyBlocks: [
    'Hi {SUBSCRIBER_FIRST_NAME},',
    'Here\'s the most important thing to remember when referring people.',
    'Your referrals <strong>must</strong> create their Group Fit account using <strong>your referral link</strong> or enter <strong>your referral code during signup</strong>.',
    'If they don\'t, the referral won\'t be tracked. Because tracking is fully automated, Group Fit cannot manually add or change referrals after an account has been created.',
    'Before someone signs up on <a href="https://groupfitapp.com/download" style="color: #dc2c36; text-decoration: underline;">Group Fit</a>, simply remind them:',
    '<em>"Please use my referral link or enter my referral code when creating your account."</em>',
    'It only takes a few seconds and ensures your referral is properly credited.'
  ],
  calloutBox: {
    title: 'Today\'s goal:',
    desc: 'Double-check that the next person you refer knows to use your link or code.'
  },
  signoffHtml: '<strong>The Group Fit Team</strong>'
};

const html = generateEmailHtml(data);
fs.writeFileSync('./output/template3.html', html, 'utf-8');
console.log('Generated output/template3.html!');
