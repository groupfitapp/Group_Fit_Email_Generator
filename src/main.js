import { generateEmailHtml, APP_LINKS } from './template.js';
import { parseRawText, formatToTextFile } from './parser.js';
import { generateAiEmailDrafts } from './aiGenerator.js';

let currentAudience = 'customer';
let stagedImages = [];

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3200);
}

function setAudience(audience) {
  currentAudience = audience === 'trainer' ? 'trainer' : 'customer';
  
  document.querySelectorAll('.audience-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.audience === currentAudience);
  });

  const aiAudienceSelect = document.getElementById('ai-target-audience');
  if (aiAudienceSelect) aiAudienceSelect.value = currentAudience;

  const audienceTag = document.getElementById('current-audience-tag');
  if (audienceTag) {
    audienceTag.textContent = currentAudience === 'trainer' ? 'Trainer View' : 'Customer View';
    audienceTag.className = `audience-tag ${currentAudience}`;
  }

  const ctaUrlInput = document.getElementById('ctaUrl');
  if (ctaUrlInput && (!ctaUrlInput.value || ctaUrlInput.value === APP_LINKS.customer.defaultCtaUrl || ctaUrlInput.value === APP_LINKS.trainer.defaultCtaUrl)) {
    ctaUrlInput.value = APP_LINKS[currentAudience].defaultCtaUrl;
  }

  updatePreview();
}

function getFormData() {
  const checklistRaw = document.getElementById('checklist').value.trim();
  const checklist = checklistRaw ? checklistRaw.split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('|');
    return {
      title: parts[0] ? parts[0].trim() : '',
      desc: parts[1] ? parts[1].trim() : ''
    };
  }) : [];

  const appBadgesVal = document.getElementById('showAppBadges').value;
  let showAppBadges = true;
  if (appBadgesVal === 'true') showAppBadges = true;
  if (appBadgesVal === 'false') showAppBadges = false;
  if (appBadgesVal === 'auto') showAppBadges = currentAudience === 'customer';

  return {
    audience: currentAudience,
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

function applyParsedDataToForm(parsed) {
  if (parsed.audience) {
    setAudience(parsed.audience);
  }
  if (parsed.subject) document.getElementById('subject').value = parsed.subject;
  if (parsed.previewText) document.getElementById('previewText').value = parsed.previewText;
  if (parsed.eyebrow) document.getElementById('eyebrow').value = parsed.eyebrow;
  if (parsed.heading) document.getElementById('heading').value = parsed.heading;
  if (parsed.lede) document.getElementById('lede').value = parsed.lede;
  if (parsed.bodyBlocks && parsed.bodyBlocks.length > 0) {
    document.getElementById('bodyBlocks').value = parsed.bodyBlocks.join('\n\n');
  }
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
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('active', c.id === tabId);
  });
}

function initTabNavigation() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });
}

function initAudienceToggle() {
  document.querySelectorAll('.audience-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setAudience(btn.dataset.audience);
    });
  });

  const aiAudienceSelect = document.getElementById('ai-target-audience');
  if (aiAudienceSelect) {
    aiAudienceSelect.addEventListener('change', (e) => {
      setAudience(e.target.value);
    });
  }
}

function initTxtImporter() {
  const dropzone = document.getElementById('txt-dropzone');
  const fileInput = document.getElementById('txt-file-input');
  const btnImportRaw = document.getElementById('btn-import-raw');
  const rawInput = document.getElementById('rawTextInput');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileRead(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileRead(e.target.files[0]);
      }
    });
  }

  function handleFileRead(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (rawInput) rawInput.value = content;
      const parsed = parseRawText(content);
      applyParsedDataToForm(parsed);
      switchTab('tab-editor');
      showToast(`Imported ${file.name} into form fields!`);
    };
    reader.readAsText(file);
  }

  if (btnImportRaw && rawInput) {
    btnImportRaw.addEventListener('click', () => {
      const parsed = parseRawText(rawInput.value);
      applyParsedDataToForm(parsed);
      switchTab('tab-editor');
      showToast('Imported text into form fields!');
    });
  }
}

function initImageStagingAndPublishing() {
  const dropzone = document.getElementById('img-dropzone');
  const fileInput = document.getElementById('img-file-input');
  const galleryGrid = document.getElementById('image-gallery-grid');
  const imgCountSpan = document.getElementById('img-count');
  const previewBox = document.getElementById('ai-staged-images-preview');
  const btnInsertPrompt = document.getElementById('btn-insert-image-prompt');
  const btnPublishHeader = document.getElementById('btn-publish-assets');

  try {
    const saved = localStorage.getItem('gf_staged_images');
    if (saved) stagedImages = JSON.parse(saved);
  } catch (e) {
    stagedImages = [];
  }

  renderGallery();

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        stageFiles(Array.from(e.dataTransfer.files));
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        stageFiles(Array.from(e.target.files));
      }
    });
  }

  if (btnInsertPrompt) {
    btnInsertPrompt.addEventListener('click', () => {
      if (stagedImages.length === 0) {
        switchTab('tab-ai');
        showToast('Stage an image first in AI Generator tab!');
        return;
      }
      const latestImg = stagedImages[0];
      insertImageTagToBody(latestImg.localUrl);
    });
  }

  if (btnPublishHeader) btnPublishHeader.addEventListener('click', publishAssetsToWebsite);

  async function stageFiles(files) {
    let successCount = 0;
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const base64Data = await readFileAsBase64(file);
        const res = await fetch('/api/stage-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, base64Data })
        });

        if (res.ok) {
          const result = await res.json();
          stagedImages.unshift({
            stagedFilename: result.stagedFilename,
            originalName: result.originalName,
            localUrl: result.localUrl,
            status: 'staged',
            timestamp: Date.now()
          });
          successCount++;
        }
      } catch (err) {
        console.error('Failed to stage image:', err);
      }
    }

    if (successCount > 0) {
      saveGallery();
      renderGallery();
      showToast(`Attached ${successCount} draft image(s). Click "Publish & Sync Assets" when ready!`);
    }
  }

  async function publishAssetsToWebsite() {
    if (stagedImages.length === 0) {
      showToast('No images staged. Attach images in AI Generator first!');
      return;
    }

    const currentData = getFormData();
    const currentHtml = generateEmailHtml(currentData);
    const currentBody = document.getElementById('bodyBlocks').value;

    try {
      showToast('Publishing assets to Group_Fit_Website repo...');
      const res = await fetch('/api/publish-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stagedImages,
          currentHtml,
          currentBody
        })
      });

      if (res.ok) {
        const result = await res.json();
        
        if (result.updatedBody) {
          document.getElementById('bodyBlocks').value = result.updatedBody;
        }

        if (Array.isArray(result.publishedResults)) {
          result.publishedResults.forEach(pub => {
            const img = stagedImages.find(i => i.stagedFilename === pub.stagedFilename);
            if (img) {
              img.status = 'published';
              img.webUrl = pub.webUrl;
              img.localUrl = pub.localUrl;
              img.finalFilename = pub.finalFilename;
            }
          });
        }

        saveGallery();
        renderGallery();
        updatePreview();
        showToast(`🚀 Published ${result.publishedCount} image(s) to Group_Fit_Website repo and updated code!`);
      }
    } catch (err) {
      console.error('Failed to publish assets:', err);
      showToast('Failed to publish assets. Check console logs.');
    }
  }

  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function saveGallery() {
    try {
      localStorage.setItem('gf_staged_images', JSON.stringify(stagedImages));
    } catch (e) {}
  }

  function renderGallery() {
    if (!galleryGrid || !imgCountSpan) return;
    imgCountSpan.textContent = stagedImages.length;

    if (previewBox) {
      previewBox.style.display = stagedImages.length > 0 ? 'block' : 'none';
    }

    if (stagedImages.length === 0) {
      galleryGrid.innerHTML = '';
      return;
    }

    galleryGrid.innerHTML = '';
    stagedImages.forEach((img) => {
      const isPublished = img.status === 'published';
      const displayUrl = isPublished ? img.webUrl : img.localUrl;
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.innerHTML = `
        <span class="gallery-status-badge ${isPublished ? 'published' : 'staged'}">
          ${isPublished ? '✓ Published' : 'Draft'}
        </span>
        <div class="gallery-thumb-wrap">
          <img src="${img.localUrl}" alt="${img.originalName}" />
        </div>
        <div class="gallery-info">
          <span class="gallery-filename" title="${img.originalName}">${img.originalName}</span>
        </div>
        <div class="gallery-actions">
          <button class="btn btn-secondary btn-copy-url" type="button">Copy URL</button>
          <button class="btn btn-primary btn-insert-body" type="button">+ Body</button>
        </div>
      `;

      card.querySelector('.btn-copy-url').addEventListener('click', () => {
        navigator.clipboard.writeText(displayUrl).then(() => {
          showToast(`Copied image URL!`);
        });
      });

      card.querySelector('.btn-insert-body').addEventListener('click', () => {
        insertImageTagToBody(displayUrl);
        switchTab('tab-editor');
        showToast(`Inserted image into body!`);
      });

      galleryGrid.appendChild(card);
    });
  }

  function insertImageTagToBody(imgUrl) {
    const bodyTextarea = document.getElementById('bodyBlocks');
    if (!bodyTextarea) return;

    const imgTag = `<img src="${imgUrl}" alt="Group Fit Image" style="max-width: 100%; border-radius: 8px; margin: 16px 0;" />`;
    bodyTextarea.value = bodyTextarea.value ? `${bodyTextarea.value}\n\n${imgTag}` : imgTag;
    updatePreview();
  }
}

function initAiGenerator() {
  const btnGenerate = document.getElementById('btn-generate-ai');
  const resultsContainer = document.getElementById('ai-results-container');
  const cardsList = document.getElementById('ai-cards-list');
  const apiKeyInput = document.getElementById('gemini-api-key');
  const statusBadge = document.getElementById('api-key-status-badge');

  function updateApiKeyStatus(val) {
    const clean = (val || '').trim();
    if (statusBadge) {
      if (clean.length > 10) {
        statusBadge.textContent = '✓ Gemini API Key Active';
        statusBadge.className = 'key-badge active';
      } else {
        statusBadge.textContent = 'Offline Engine';
        statusBadge.className = 'key-badge offline';
      }
    }
  }

  // 1. Check environment variable VITE_GEMINI_API_KEY first
  const envKey = import.meta.env?.VITE_GEMINI_API_KEY || '';
  
  // 2. Check localStorage if envKey is not set
  let activeKey = envKey;
  try {
    if (!activeKey) {
      activeKey = localStorage.getItem('gf_gemini_api_key') || '';
    }
  } catch (e) {}

  if (apiKeyInput) {
    if (activeKey) apiKeyInput.value = activeKey;
    updateApiKeyStatus(activeKey);

    const handleKeyChange = (e) => {
      const val = e.target.value.trim();
      updateApiKeyStatus(val);
      try {
        localStorage.setItem('gf_gemini_api_key', val);
      } catch (err) {}
    };

    apiKeyInput.addEventListener('input', handleKeyChange);
    apiKeyInput.addEventListener('change', handleKeyChange);
  }

  if (btnGenerate && cardsList) {
    btnGenerate.addEventListener('click', async () => {
      const prompt = document.getElementById('ai-prompt').value;
      const category = document.getElementById('ai-category').value;
      const targetAudience = document.getElementById('ai-target-audience').value;
      const userKey = apiKeyInput ? apiKeyInput.value.trim() : '';
      const apiKey = userKey || activeKey;

      setAudience(targetAudience);

      btnGenerate.disabled = true;
      btnGenerate.innerHTML = '<span>⏳ Generating AI Email Drafts...</span>';

      try {
        const drafts = await generateAiEmailDrafts({
          prompt: prompt || 'Generate a compelling Group Fit feature announcement email',
          audience: targetAudience,
          category,
          apiKey
        });

        if (stagedImages.length > 0) {
          const topImg = stagedImages[0];
          const imgUrl = topImg.status === 'published' ? topImg.webUrl : topImg.localUrl;
          drafts.forEach(draft => {
            if (draft.bodyBlocks && draft.bodyBlocks.length > 0) {
              const hasImg = draft.bodyBlocks.some(b => typeof b === 'string' && b.includes('<img'));
              if (!hasImg) {
                draft.bodyBlocks.push(`<img src="${imgUrl}" alt="Group Fit Feature Image" style="max-width: 100%; border-radius: 8px; margin: 16px 0;" />`);
              }
            }
          });
        }

        cardsList.innerHTML = '';
        drafts.forEach((draft, index) => {
          const card = document.createElement('div');
          card.className = 'ai-card';
          card.innerHTML = `
            <div class="ai-card-header">
              <h5>Option ${index + 1}: ${draft.title}</h5>
              <span class="audience-tag ${draft.audience}">${draft.audience.toUpperCase()}</span>
            </div>
            <div class="ai-card-body">
              <div><strong>Subject:</strong> ${draft.subject}</div>
              <div style="margin-top: 4px;"><strong>Heading:</strong> ${draft.heading}</div>
              <div style="margin-top: 4px;"><strong>Lede:</strong> ${draft.lede}</div>
            </div>
            <div class="ai-card-actions">
              <button class="btn btn-primary btn-approve-draft">
                ✨ Approve &amp; Apply to Editor
              </button>
            </div>
          `;

          card.querySelector('.btn-approve-draft').addEventListener('click', () => {
            applyParsedDataToForm(draft);
            switchTab('tab-editor');
            showToast(`Approved Option ${index + 1} and applied to editor!`);
          });

          cardsList.appendChild(card);
        });

        resultsContainer.style.display = 'block';
        showToast(apiKey ? `✨ Generated 3 live Gemini Pro AI drafts using your saved API Key!` : `Generated 3 AI email drafts for ${targetAudience.toUpperCase()}`);
      } catch (err) {
        console.error('Failed to generate drafts:', err);
        showToast('Generation error. Falling back to built-in templates.');
      } finally {
        btnGenerate.disabled = false;
        btnGenerate.innerHTML = '<span>✨ Generate Gemini AI Drafts</span>';
      }
    });
  }
}

function initExportTxt() {
  const btnExport = document.getElementById('btn-export-txt');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const data = getFormData();
      const txtContent = formatToTextFile(data);
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `group_fit_email_${data.audience}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Downloaded formatted .txt file!');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initAudienceToggle();
  initTxtImporter();
  initImageStagingAndPublishing();
  initAiGenerator();
  initExportTxt();

  // Initial load
  setAudience('customer');
  document.getElementById('subject').value = 'Let top trainers come to you — Introducing Trainer Preferences!';
  document.getElementById('previewText').value = 'Set your activity, format, and trainer preferences so matching local pros can reach out directly.';
  document.getElementById('eyebrow').value = 'New Feature Announcement';
  document.getElementById('heading').value = 'Stop searching. Let top trainers find you, {SUBSCRIBER_FIRST_NAME}.';
  document.getElementById('lede').value = 'Finding your ideal fitness trainer just got effortless. Set your goals once, and let matching pros bring custom training options directly to you.';
  document.getElementById('bodyBlocks').value = 'Searching through dozens of trainer profiles to find the right fit takes time. With our brand-new Trainer Preferences feature, you no longer have to do the heavy lifting.\n\nSimply set your activity goals, preferred workout format, and trainer criteria—and certified trainers who match your profile can reach out directly with tailored session offers.';
  document.getElementById('gateBox').value = '<strong>Where to find it:</strong> Go to <strong>Account > Trainer Preferences</strong> in your Group Fit dashboard. You are always in control and can update your preferences or opt out at any time.';
  document.getElementById('checklist').value = `Select Trainer Preferences | Choose your preferred trainer gender (or select no preference).\nChoose Workout Format | Pick how you like to train: In-Person, Virtual, or Studio.\nPick Your Favorite Activities | Select from Swimming, Boxing, Running, Strength & Conditioning, and more.\nLet Trainers Reach Out | Qualified trainers matching your exact profile can reach out with custom training options.`;
  document.getElementById('ctaText').value = 'Set My Trainer Preferences';
  document.getElementById('ctaUrl').value = 'https://groupfitapp.com';
  document.getElementById('calloutTitle').value = 'Complete Control & Privacy';
  document.getElementById('calloutDesc').value = 'Your preferences are completely flexible. You can pause trainer matching or opt out anytime under your account settings.';
  document.getElementById('signoffHtml').value = 'Train strong,<br /><strong>Group Fit Team</strong>';

  const inputs = document.querySelectorAll('.editor-panel .form-control');
  inputs.forEach(input => {
    input.addEventListener('input', updatePreview);
  });

  const btnCopy = document.getElementById('btn-copy-html');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const data = getFormData();
      const html = generateEmailHtml(data);
      navigator.clipboard.writeText(html).then(() => {
        showToast('SendMails HTML copied to clipboard!');
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
