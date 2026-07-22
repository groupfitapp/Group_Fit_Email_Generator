import { generateEmailHtml } from './template.js';

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

function updateDefaultsForAudience(audience) {
  const isCustomer = audience === 'customer';
  
  if (isCustomer) {
    document.getElementById('subject').value = "Discover top personal trainers near you";
    document.getElementById('previewText').value = "Book local group sessions, 1-on-1 coaching, or in-home trainers with Group Fit.";
    document.getElementById('eyebrow').value = "Welcome to Group Fit";
    document.getElementById('heading').value = "Ready to achieve your goals, {SUBSCRIBER_FIRST_NAME}?";
    document.getElementById('lede').value = "Browse verified trainers, studio options, and in-home coaches in your neighborhood.";
    document.getElementById('bodyBlocks').value = "Finding the right trainer shouldn't be complicated. Group Fit connects you directly with certified local coaches for in-person, studio, or virtual sessions.";
    document.getElementById('gateBox').value = "";
    document.getElementById('checklist').value = "";
    document.getElementById('ctaText').value = "Find a Trainer Now";
    document.getElementById('ctaUrl').value = "https://groupfitapp.com";
    document.getElementById('calloutTitle').value = "";
    document.getElementById('calloutDesc').value = "";
    document.getElementById('signoffHtml').value = "";
  } else {
    document.getElementById('subject').value = "Complete your trainer profile";
    document.getElementById('previewText').value = "Customers can only book you after your profile is complete and approved.";
    document.getElementById('eyebrow').value = "Welcome";
    document.getElementById('heading').value = "Finish your profile first, {SUBSCRIBER_FIRST_NAME}.";
    document.getElementById('lede').value = "Your profile is the foundation. Once it is complete and approved, you can start sending clients to book you through Group Fit.";
    document.getElementById('bodyBlocks').value = "Customers can only book you after your profile is complete and approved. The faster you finish the basics, the faster you can start sending clients to your booking link.";
    document.getElementById('gateBox').value = "<strong>Do this first:</strong> add a clear profile picture, complete your required details, set your service locations, add availability, and select your specializations.";
    document.getElementById('checklist').value = `Upload a clear profile picture|Use an individual face shot with good lighting. Profiles are not approved without one.
Set service locations|Add your travel radius. If you train from your own studio or facility, add it and select the studio option.
Add availability|Choose the days, time slots, and location options customers can actually book.
Set specializations and pricing|Add every activity you train and set your own in-person and virtual prices.
Add proof and personality|Certifications, additional images, and social links help customers trust your profile.`;
    document.getElementById('ctaText').value = "Complete My Profile";
    document.getElementById('ctaUrl').value = "https://portal.groupfitapp.com/login";
    document.getElementById('calloutTitle').value = "Missing something?";
    document.getElementById('calloutDesc').value = "If you do not see your specialization or certification listed, reply to this email and we can add it.";
    document.getElementById('signoffHtml').value = "";
  }
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
  const audienceSelect = document.getElementById('audience');
  if (audienceSelect) {
    audienceSelect.addEventListener('change', (e) => {
      updateDefaultsForAudience(e.target.value);
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
