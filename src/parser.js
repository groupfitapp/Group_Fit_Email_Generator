/**
 * Raw text / key-value email content parser and formatter for Group Fit Email Generator
 */

export function parseRawText(text) {
  if (!text || typeof text !== 'string') return {};

  const lines = text.split('\n');
  const data = {
    audience: 'customer',
    subject: '',
    previewText: '',
    eyebrow: '',
    heading: '',
    lede: '',
    bodyBlocks: [],
    gateBox: '',
    checklist: [],
    ctaText: '',
    ctaUrl: '',
    calloutBox: { title: '', desc: '' },
    signoffHtml: '',
    signoffName: '',
    signoffTitle: ''
  };

  let currentKey = null;
  let bodyLines = [];
  let gateBoxLines = [];
  let ledeLines = [];
  let inChecklist = false;

  for (let rawLine of lines) {
    const line = rawLine.trim();

    // Check for explicit headers like Subject:, Preview:, Eyebrow:, etc.
    const keyMatch = rawLine.match(/^(Subject|Preview|PreviewText|Eyebrow|Heading|H1|Lede|Subtitle|Body|BodyBlocks|GateBox|Gate-Box|Highlight|Checklist|CTA Text|CTAText|CTA URL|CTAUrl|CTA|Callout Title|CalloutTitle|Callout Desc|CalloutDesc|Signoff Name|SignoffName|Signoff Title|SignoffTitle|Signoff|Audience):\s*(.*)$/i);

    if (keyMatch) {
      currentKey = keyMatch[1].toLowerCase().replace(/[\s\-_]+/g, '');
      const value = keyMatch[2].trim();
      inChecklist = false;

      if (currentKey === 'subject') data.subject = value;
      else if (currentKey === 'preview' || currentKey === 'previewtext') data.previewText = value;
      else if (currentKey === 'eyebrow') data.eyebrow = value;
      else if (currentKey === 'heading' || currentKey === 'h1') data.heading = value;
      else if (currentKey === 'lede' || currentKey === 'subtitle') {
        if (value) ledeLines.push(value);
      } else if (currentKey === 'ctatext' || currentKey === 'cta') data.ctaText = value;
      else if (currentKey === 'ctaurl') data.ctaUrl = value;
      else if (currentKey === 'callouttitle') data.calloutBox.title = value;
      else if (currentKey === 'calloutdesc') data.calloutBox.desc = value;
      else if (currentKey === 'signoffname') data.signoffName = value;
      else if (currentKey === 'signofftitle') data.signoffTitle = value;
      else if (currentKey === 'signoff') data.signoffHtml = value;
      else if (currentKey === 'gatebox' || currentKey === 'highlight') {
        if (value) gateBoxLines.push(value);
      } else if (currentKey === 'checklist') {
        inChecklist = true;
        if (value && value.includes('|')) {
          const parts = value.split('|');
          data.checklist.push({ title: parts[0].trim(), desc: parts[1] ? parts[1].trim() : '' });
        }
      } else if (currentKey === 'audience') {
        data.audience = value.toLowerCase().includes('trainer') ? 'trainer' : 'customer';
      } else if (currentKey === 'body' || currentKey === 'bodyblocks') {
        if (value) bodyLines.push(value);
      }
    } else if (inChecklist && line.includes('|')) {
      const parts = line.split('|');
      data.checklist.push({ title: parts[0].trim(), desc: parts[1] ? parts[1].trim() : '' });
    } else if (currentKey === 'body' || currentKey === 'bodyblocks') {
      if (line) bodyLines.push(line);
    } else if (currentKey === 'gatebox' || currentKey === 'highlight') {
      if (line) gateBoxLines.push(line);
    } else if (currentKey === 'lede' || currentKey === 'subtitle') {
      if (line) ledeLines.push(line);
    }
  }

  if (bodyLines.length > 0) {
    data.bodyBlocks = [bodyLines.join('\n\n')];
  }
  if (gateBoxLines.length > 0) {
    data.gateBox = gateBoxLines.join(' ');
  }
  if (ledeLines.length > 0) {
    data.lede = ledeLines.join(' ');
  }

  return data;
}

export function formatToTextFile(data) {
  const parts = [];
  parts.push(`Audience: ${data.audience || 'customer'}`);
  parts.push(`Subject: ${data.subject || ''}`);
  parts.push(`Preview: ${data.previewText || ''}`);
  parts.push(`Eyebrow: ${data.eyebrow || ''}`);
  parts.push(`Heading: ${data.heading || ''}`);
  parts.push(`Lede: ${data.lede || ''}`);
  parts.push(`Body: ${Array.isArray(data.bodyBlocks) ? data.bodyBlocks.join('\n\n') : (data.bodyBlocks || '')}`);
  parts.push(`GateBox: ${data.gateBox || ''}`);
  
  if (data.checklist && data.checklist.length > 0) {
    const checklistStr = data.checklist.map(item => `${item.title} | ${item.desc}`).join('\n');
    parts.push(`Checklist:\n${checklistStr}`);
  }
  
  parts.push(`CTA Text: ${data.ctaText || ''}`);
  parts.push(`CTA URL: ${data.ctaUrl || ''}`);
  parts.push(`Callout Title: ${data.calloutBox?.title || ''}`);
  parts.push(`Callout Desc: ${data.calloutBox?.desc || ''}`);
  parts.push(`Signoff: ${data.signoffHtml || ''}`);

  return parts.join('\n\n');
}
