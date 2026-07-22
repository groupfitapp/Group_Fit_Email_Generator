/**
 * Raw text / key-value email content parser for Group Fit Email Generator
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
  let inChecklist = false;

  for (let rawLine of lines) {
    const line = rawLine.trim();

    // Check for explicit headers like Subject:, Preview:, Eyebrow:, etc.
    const keyMatch = rawLine.match(/^(Subject|Preview|Eyebrow|Heading|Lede|Body|GateBox|Checklist|CTA Text|CTA URL|Callout Title|Callout Desc|Signoff Name|Signoff Title|Signoff|Audience):\s*(.*)$/i);

    if (keyMatch) {
      currentKey = keyMatch[1].toLowerCase().replace(/\s+/g, '');
      const value = keyMatch[2].trim();
      inChecklist = false;

      if (currentKey === 'subject') data.subject = value;
      else if (currentKey === 'preview') data.previewText = value;
      else if (currentKey === 'eyebrow') data.eyebrow = value;
      else if (currentKey === 'heading') data.heading = value;
      else if (currentKey === 'lede') data.lede = value;
      else if (currentKey === 'ctatext') data.ctaText = value;
      else if (currentKey === 'ctaurl') data.ctaUrl = value;
      else if (currentKey === 'callouttitle') data.calloutBox.title = value;
      else if (currentKey === 'calloutdesc') data.calloutBox.desc = value;
      else if (currentKey === 'signoffname') data.signoffName = value;
      else if (currentKey === 'signofftitle') data.signoffTitle = value;
      else if (currentKey === 'signoff') data.signoffHtml = value;
      else if (currentKey === 'gatebox') {
        if (value) data.gateBox = value;
      } else if (currentKey === 'checklist') {
        inChecklist = true;
        if (value && value.includes('|')) {
          const [title, desc] = value.split('|');
          data.checklist.push({ title: title.trim(), desc: desc ? desc.trim() : '' });
        }
      } else if (currentKey === 'audience') {
        data.audience = value.toLowerCase();
      } else if (currentKey === 'body') {
        if (value) bodyLines.push(value);
      }
    } else if (inChecklist && line.includes('|')) {
      const [title, desc] = line.split('|');
      data.checklist.push({ title: title.trim(), desc: desc ? desc.trim() : '' });
    } else if (currentKey === 'body' && line) {
      bodyLines.push(line);
    } else if (currentKey === 'gatebox' && line) {
      data.gateBox = data.gateBox ? `${data.gateBox} ${line}` : line;
    } else if (currentKey === 'lede' && line) {
      data.lede = `${data.lede} ${line}`;
    }
  }

  if (bodyLines.length > 0) {
    data.bodyBlocks = [bodyLines.join(' ')];
  }

  return data;
}
