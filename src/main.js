import { generateEmailHtml } from './template.js';

function getFormData() {
  const checklistRaw = document.getElementById('checklist').value.trim();
  const checklist = checklistRaw.split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('|');
    return {
      title: parts[0] ? parts[0].trim() : '',
      desc: parts[1] ? parts[1].trim() : ''
    };
  });

  return {
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
    signoffName: document.getElementById('signoffName').value,
    signoffTitle: document.getElementById('signoffTitle').value,
    footerText: "GroupFit Technologies Inc. You are receiving this email because you signed up at groupfitapp.com."
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
