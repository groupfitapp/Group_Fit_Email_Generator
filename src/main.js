import { generateEmailHtml } from './template.js';
import { parseRawText } from './parser.js';

const PRESETS = {
  trainer_preferences: {
    audience: 'customer',
    subject: 'Let top trainers come to you — Introducing Trainer Preferences!',
    previewText: 'Set your activity, format, and trainer preferences so matching local pros can reach out directly.',
    eyebrow: 'New Feature Announcement',
    heading: 'Stop searching. Let top trainers find you, {SUBSCRIBER_FIRST_NAME}.',
    lede: 'Finding your ideal fitness trainer just got effortless. Set your goals once, and let matching pros bring custom training options directly to you.',
    bodyBlocks: 'Searching through dozens of trainer profiles to find the right fit takes time. With our brand-new Trainer Preferences feature, you no longer have to do the heavy lifting.\n\nSimply set your activity goals, preferred workout format, and trainer criteria—and certified trainers who match your profile can reach out directly with tailored session offers.',
    gateBox: '<strong>Where to find it:</strong> Go to <strong>Account > Trainer Preferences</strong> in your Group Fit dashboard. You are always in control and can update your preferences or opt out at any time.',
    checklist: `Select Trainer Preferences | Choose your preferred trainer gender (or select no preference).
Choose Workout Format | Pick how you like to train: In-Person, Virtual, or Studio.
Pick Your Favorite Activities | Select from Swimming, Boxing, Running, Strength & Conditioning, and more.
Let Trainers Reach Out | Qualified trainers matching your exact profile can reach out with custom training options.`,
    ctaText: 'Set My Trainer Preferences',
    ctaUrl: 'https://portal.groupfitapp.com',
    calloutTitle: 'Complete Control & Privacy',
    calloutDesc: 'Your preferences are completely flexible. You can pause trainer matching or opt out anytime under your account settings.',
    signoffHtml: 'Train strong,<br /><strong>Group Fit Team</strong>'
  },
  trainer_activation: {
    audience: 'trainer',
    subject: 'Complete your trainer profile',
    previewText: 'Customers can only book you after your profile is complete and approved.',
    eyebrow: 'Welcome',
    heading: 'Finish your profile first, {SUBSCRIBER_FIRST_NAME}.',
    lede: 'Your profile is the foundation. Once it is complete and approved, you can start sending clients to book you through Group Fit.',
    bodyBlocks: 'Customers can only book you after your profile is complete and approved. The faster you finish the basics, the faster you can start sending clients to your booking link.',
    gateBox: '<strong>Do this first:</strong> add a clear profile picture, complete your required details, set your service locations, add availability, and select your specializations.',
    checklist: `Upload a clear profile picture | Use an individual face shot with good lighting. Profiles are not approved without one.
Set service locations | Add your travel radius. If you train from your own studio or facility, add it and select the studio option.
Add availability | Choose the days, time slots, and location options customers can actually book.
Set specializations and pricing | Add every activity you train and set your own in-person and virtual prices.
Add proof and personality | Certifications, additional images, and social links help customers trust your profile.`,
    ctaText: 'Complete My Profile',
    ctaUrl: 'https://portal.groupfitapp.com/login',
    calloutTitle: 'Missing something?',
    calloutDesc: 'If you do not see your specialization or certification listed, reply to this email and we can add it.',
    signoffHtml: ''
  }
};

function loadPreset(presetKey) {
  const data = PRESETS[presetKey];
  if (!data) return;

  document.getElementById('audience').value = data.audience || 'customer';
  document.getElementById('subject').value = data.subject || '';
  document.getElementById('previewText').value = data.previewText || '';
  document.getElementById('eyebrow').value = data.eyebrow || '';
  document.getElementById('heading').value = data.heading || '';
  document.getElementById('lede').value = data.lede || '';
  document.getElementById('bodyBlocks').value = data.bodyBlocks || '';
  document.getElementById('gateBox').value = data.gateBox || '';
  document.getElementById('checklist').value = data.checklist || '';
  document.getElementById('ctaText').value = data.ctaText || '';
  document.getElementById('ctaUrl').value = data.ctaUrl || '';
  document.getElementById('calloutTitle').value = data.calloutTitle || '';
  document.getElementById('calloutDesc').value = data.calloutDesc || '';
  document.getElementById('signoffHtml').value = data.signoffHtml || '';
}

function getFormData() {
  const audience = document.getElementById('audience').value;
  const checklistRaw = document.getElementById('checklist').value.trim();
  const checklist = checklistRaw ? checklistRaw.split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('|');
    return {
      title: parts[0] ? parts[0].trim() : '',
      desc: parts[1] ? parts[1].trim() : ''
    };
  }) : [];

  const appBadgesVal = document.getElementById('showAppBadges').value;
  let showAppBadges = audience === 'customer';
  if (appBadgesVal === 'true') showAppBadges = true;
  if (appBadgesVal === 'false') showAppBadges = false;

  return {
    audience,
    subject: document.getElementById('subject').value,
    previewText: document.getElementById('previewText').value,
    eyebrow: document.getElementById('eyebrow').value,
    heading: document.getElementById('heading').value,
    lede: document.getElementById('lede').value,
    bodyBlocks: [document.getElementById('bodyBlocks').value],
    gateBox: document.getElementById('gateBox').value,
    checklist,
    ctaText: document.getElementById('ctaText').value,
    ctaUrl: document.getElementById('ctaUrl').value,
    calloutBox: {
      title: document.getElementById('calloutTitle').value,
      desc: document.getElementById('calloutDesc').value
    },
    signoffHtml: document.getElementById('signoffHtml').value,
    showAppBadges
  };
}

function updatePreview() {
  const data = getFormData();
  const html = generateEmailHtml(data);
  
  const iframe = document.getElementById('preview-frame');
  if (iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }

  const codeOutput = document.getElementById('code-output');
  if (codeOutput) {
    codeOutput.value = html;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Load Trainer Preferences Announcement preset by default
  loadPreset('trainer_preferences');

  const presetSelect = document.getElementById('preset-loader');
  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => {
      if (e.target.value !== 'custom') {
        loadPreset(e.target.value);
        updatePreview();
      }
    });
  }

  const audienceSelect = document.getElementById('audience');
  if (audienceSelect) {
    audienceSelect.addEventListener('change', () => {
      updatePreview();
    });
  }

  const btnImportRaw = document.getElementById('btn-import-raw');
  const rawInput = document.getElementById('rawTextInput');
  if (btnImportRaw && rawInput) {
    btnImportRaw.addEventListener('click', () => {
      const parsed = parseRawText(rawInput.value);
      if (parsed.audience) document.getElementById('audience').value = parsed.audience;
      if (parsed.subject) document.getElementById('subject').value = parsed.subject;
      if (parsed.previewText) document.getElementById('previewText').value = parsed.previewText;
      if (parsed.eyebrow) document.getElementById('eyebrow').value = parsed.eyebrow;
      if (parsed.heading) document.getElementById('heading').value = parsed.heading;
      if (parsed.lede) document.getElementById('lede').value = parsed.lede;
      if (parsed.bodyBlocks && parsed.bodyBlocks[0]) document.getElementById('bodyBlocks').value = parsed.bodyBlocks[0];
      if (parsed.gateBox) document.getElementById('gateBox').value = parsed.gateBox;
      if (parsed.checklist && parsed.checklist.length > 0) {
        document.getElementById('checklist').value = parsed.checklist.map(c => `${c.title} | ${c.desc}`).join('\n');
      }
      if (parsed.ctaText) document.getElementById('ctaText').value = parsed.ctaText;
      if (parsed.ctaUrl) document.getElementById('ctaUrl').value = parsed.ctaUrl;
      if (parsed.calloutBox?.title) document.getElementById('calloutTitle').value = parsed.calloutBox.title;
      if (parsed.calloutBox?.desc) document.getElementById('calloutDesc').value = parsed.calloutBox.desc;
      if (parsed.signoffHtml) document.getElementById('signoffHtml').value = parsed.signoffHtml;
      
      updatePreview();
    });
  }

  const inputs = document.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.addEventListener('input', updatePreview);
  });

  const btnCopy = document.getElementById('btn-copy-html');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const data = getFormData();
      const html = generateEmailHtml(data);
      navigator.clipboard.writeText(html).then(() => {
        const originalText = btnCopy.textContent;
        btnCopy.textContent = 'Copied to Clipboard!';
        btnCopy.style.background = '#28a745';
        setTimeout(() => {
          btnCopy.textContent = originalText;
          btnCopy.style.background = '';
        }, 2000);
      });
    });
  }

  const btnViewCode = document.getElementById('btn-view-code');
  const modalCode = document.getElementById('modal-code');
  const btnCloseModal = document.getElementById('btn-close-modal');

  if (btnViewCode && modalCode) {
    btnViewCode.addEventListener('click', () => {
      modalCode.classList.add('active');
    });
  }

  if (btnCloseModal && modalCode) {
    btnCloseModal.addEventListener('click', () => {
      modalCode.classList.remove('active');
    });
  }

  const modeDesktop = document.getElementById('mode-desktop');
  const modeMobile = document.getElementById('mode-mobile');
  const iframe = document.getElementById('preview-frame');

  if (modeDesktop && modeMobile && iframe) {
    modeDesktop.addEventListener('click', () => {
      modeDesktop.classList.add('active');
      modeMobile.classList.remove('active');
      iframe.style.maxWidth = '680px';
    });

    modeMobile.addEventListener('click', () => {
      modeMobile.classList.add('active');
      modeDesktop.classList.remove('active');
      iframe.style.maxWidth = '375px';
    });
  }

  updatePreview();
});
