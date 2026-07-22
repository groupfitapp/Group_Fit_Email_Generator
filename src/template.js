/**
 * Group Fit SendMails HTML Email Template Generator
 */

export const APP_LINKS = {
  customer: {
    logoUrl: 'https://groupfitapp.com',
    appleUrl: 'https://apps.apple.com/us/app/group-fit-book-a-trainer/id6503181635',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.newcustomer',
    defaultSignoff: 'Train strong,<br /><strong>Group Fit Team</strong>',
    defaultFooter: 'GroupFit Technologies Inc. You are receiving this email because you registered at groupfitapp.com.'
  },
  trainer: {
    logoUrl: 'https://groupfitapp.com/trainer',
    appleUrl: 'https://apps.apple.com/us/app/group-fit-trainer/id6499300864',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.thegroupfittrainer',
    defaultSignoff: 'Regards,<br /><strong>Mohamed M.</strong><br /><span style="font-size: 13px; color: #7a7a8a;">Founder &amp; CEO, Group Fit</span>',
    defaultFooter: 'GroupFit Technologies Inc. You are receiving this email because you signed up as a trainer at groupfitapp.com.'
  }
};

export function generateEmailHtml(data = {}) {
  const audience = data.audience === 'customer' ? 'customer' : 'trainer';
  const defaults = APP_LINKS[audience];

  const {
    subject = audience === 'trainer' ? "Complete your trainer profile" : "Welcome to Group Fit",
    previewText = audience === 'trainer' ? "Customers can only book you after your profile is complete and approved." : "Find and book local fitness trainers near you.",
    eyebrow = "Welcome",
    heading = audience === 'trainer' ? "Finish your profile first, {SUBSCRIBER_FIRST_NAME}." : "Welcome to Group Fit, {SUBSCRIBER_FIRST_NAME}!",
    lede = audience === 'trainer' ? "Your profile is the foundation. Once it is complete and approved, you can start sending clients to book you through Group Fit." : "We are excited to help you achieve your fitness goals with top local coaches.",
    bodyBlocks = [
      audience === 'trainer'
        ? "Customers can only book you after your profile is complete and approved. The faster you finish the basics, the faster you can start sending clients to your booking link."
        : "Start browsing personal trainers, studio options, and in-home fitness specialists available in your area."
    ],
    gateBox = audience === 'trainer'
      ? "<strong>Do this first:</strong> add a clear profile picture, complete your required details, set your service locations, add availability, and select your specializations."
      : "",
    sectionLabel = audience === 'trainer' ? "Profile setup checklist" : "",
    checklist = audience === 'trainer' ? [
      { title: "Upload a clear profile picture", desc: "Use an individual face shot with good lighting. Profiles are not approved without one." },
      { title: "Set service locations", desc: "Add your travel radius. If you train from your own studio or facility, add it and select the studio option." },
      { title: "Add availability", desc: "Choose the days, time slots, and location options customers can actually book." },
      { title: "Set specializations and pricing", desc: "Add every activity you train and set your own in-person and virtual prices." },
      { title: "Add proof and personality", desc: "Certifications, additional images, and social links help customers trust your profile." }
    ] : [],
    ctaText = audience === 'trainer' ? "Complete My Profile" : "Find a Trainer",
    ctaUrl = audience === 'trainer' ? "https://portal.groupfitapp.com/login" : "https://groupfitapp.com",
    calloutBox = audience === 'trainer' ? {
      title: "Missing something?",
      desc: "If you do not see your specialization or certification listed, reply to this email and we can add it."
    } : null,
    showAppBadges = audience === 'customer' || data.showAppBadges === true,
    customSignoff = data.signoffHtml || '',
    signoffName = data.signoffName,
    signoffTitle = data.signoffTitle,
    footerText = data.footerText || defaults.defaultFooter,
    logoUrl = data.logoUrl || defaults.logoUrl,
    appleUrl = data.appleUrl || defaults.appleUrl,
    googleUrl = data.googleUrl || defaults.googleUrl
  } = data;

  const eyebrowHtml = eyebrow
    ? `<span class="eyebrow">${escapeHtml(eyebrow)}</span>`
    : '';

  const ledeHtml = lede
    ? `<p class="lede">${formatText(lede)}</p>`
    : '';

  const bodyHtml = Array.isArray(bodyBlocks)
    ? bodyBlocks.filter(Boolean).map(b => `<p class="text-block">${formatText(b)}</p>`).join('\n')
    : (bodyBlocks ? `<p class="text-block">${formatText(bodyBlocks)}</p>` : '');

  const gateBoxHtml = gateBox
    ? `<div class="gate-box">${formatText(gateBox)}</div>`
    : '';

  const sectionLabelHtml = sectionLabel
    ? `<p class="section-label">${escapeHtml(sectionLabel)}</p>`
    : '';

  const checklistHtml = (Array.isArray(checklist) && checklist.length > 0)
    ? `${sectionLabelHtml}
<table class="checklist" role="presentation">
<tbody>
${checklist.map((item, idx) => `<tr>
<td class="num-cell"><span class="num">${idx + 1}</span></td>
<td><span class="item-title">${escapeHtml(item.title)}</span><span class="item-desc">${formatText(item.desc)}</span></td>
</tr>`).join('\n')}
</tbody>
</table>`
    : '';

  const ctaBtnHtml = ctaText && ctaUrl
    ? `<div class="btn-wrap"><a href="${escapeHtml(ctaUrl)}" class="btn" target="_blank">${escapeHtml(ctaText)}</a></div>`
    : '';

  const calloutHtml = calloutBox && (calloutBox.title || calloutBox.desc)
    ? `<div class="callout-box">${calloutBox.title ? `<strong>${escapeHtml(calloutBox.title)}</strong><br />` : ''}<span class="callout-desc">${formatText(calloutBox.desc)}</span></div>`
    : '';

  let signoffHtml = '';
  if (customSignoff) {
    signoffHtml = `<p class="signoff">${formatText(customSignoff)}</p>`;
  } else if (signoffName) {
    signoffHtml = `<p class="signoff">Regards,<br /><strong>${escapeHtml(signoffName)}</strong><br /><span style="font-size: 13px; color: #7a7a8a;">${escapeHtml(signoffTitle || '')}</span></p>`;
  } else {
    signoffHtml = `<p class="signoff">${defaults.defaultSignoff}</p>`;
  }

  const appBadgesHtml = showAppBadges
    ? `<div class="app-badges" style="text-align: center; margin: 24px 0 16px;">
<a href="${escapeHtml(appleUrl)}" target="_blank" style="display: inline-block; margin: 0 6px;"><img src="https://groupfitapp.com/email-assets/app-store-badge.svg" alt="Download on the App Store" height="40" style="height: 40px; width: auto; border: 0;" /></a>
<a href="${escapeHtml(googleUrl)}" target="_blank" style="display: inline-block; margin: 0 6px;"><img src="https://groupfitapp.com/email-assets/google-play-badge.svg" alt="Get it on Google Play" height="40" style="height: 40px; width: auto; border: 0;" /></a>
</div>`
    : '';

  return `<!--
  Group Fit Themed Email (${audience.toUpperCase()})
  Subject: ${subject}
  Preview: ${previewText}
-->
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(subject)}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
body { margin:0; padding:0; background-color:#fafafa; font-family:'Inter',Helvetica,Arial,sans-serif; color:#1a1a2e; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
a { color:#dc2c36; }
.wrap { width:100%; background-color:#fafafa; padding:48px 16px; box-sizing:border-box; }
.container { max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(20,20,40,0.06); border:1px solid #f2f2f5; }
.logo-block { padding:36px 44px 8px; }
.logo-block img { height:48px; width:auto; display:block; border:0; }
.hero { padding:24px 44px 24px; }
.eyebrow { display:inline-block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#dc2c36; background:rgba(220,44,54,0.08); padding:6px 12px; border-radius:999px; margin:0 0 18px; font-family:'Inter',Helvetica,Arial,sans-serif; }
.h1 { font-family:'Space Grotesk',Helvetica,Arial,sans-serif; font-size:32px; font-weight:700; color:#0a0a1f; line-height:1.15; letter-spacing:-0.5px; margin:0 0 12px; }
.lede { font-size:16px; color:#5a5a72; line-height:1.6; margin:0; }
.body { padding:0 44px 8px; }
.text-block { font-size:15px; line-height:1.7; color:#3a3a4f; margin:0 0 24px; }
.gate-box { background:linear-gradient(135deg, rgba(220,44,54,0.06), rgba(232,87,99,0.03)); border-left:3px solid #dc2c36; padding:16px 20px; margin:0 0 28px; font-size:14.5px; line-height:1.65; color:#3a3a4f; border-radius:0 8px 8px 0; }
.gate-box strong { color:#0a0a1f; }
.btn-wrap { text-align:left; margin:8px 0 28px; }
.btn { display:inline-block; background:#dc2c36; color:#ffffff !important; text-decoration:none; font-size:15px; font-weight:600; padding:14px 28px; border-radius:10px; letter-spacing:0.2px; text-align:center; }
.section-label { font-family:'Space Grotesk',Helvetica,Arial,sans-serif; font-size:13px; font-weight:600; color:#0a0a1f; margin:0 0 12px; letter-spacing:-0.2px; }
.checklist { width:100%; border-collapse:collapse; margin:0 0 24px; }
.checklist td { padding:14px 0; border-bottom:1px solid #f2f2f5; vertical-align:top; }
.checklist tr:last-child td { border-bottom:none; }
.num-cell { width:34px; min-width:34px; }
.num { display:inline-block; width:26px; height:26px; line-height:26px; background:#dc2c36; color:#ffffff; font-size:12px; font-weight:700; text-align:center; border-radius:50%; font-family:'Inter',Helvetica,Arial,sans-serif; }
.item-title { font-size:15px; font-weight:600; color:#0a0a1f; display:block; margin-bottom:3px; }
.item-desc { font-size:14px; color:#5a5a72; line-height:1.55; }
.callout-box { background:#fafafa; border:1px solid #f2f2f5; border-radius:10px; padding:14px 16px; margin:0 0 24px; }
.callout-desc { font-size:14px; color:#5a5a72; line-height:1.6; }
.signoff { font-size:15px; line-height:1.7; color:#3a3a4f; margin:24px 0 8px; }
.signoff strong { color:#0a0a1f; }
.social { text-align:center; padding:24px 44px 8px; border-top:1px solid #f2f2f5; }
.social a { display:inline-block; margin:0 6px; opacity:0.85; text-decoration:none; }
.footer { text-align:center; font-size:12px; color:#9a9aa8; padding:8px 44px 32px; line-height:1.6; }
.footer a { color:#dc2c36; text-decoration:underline; }

@media only screen and (max-width:620px) {
  .wrap { padding:0 !important; }
  .container { border-radius:0 !important; box-shadow:none !important; border:none !important; }
  .logo-block { padding:28px 24px 4px !important; }
  .hero { padding:20px 24px 20px !important; }
  .h1 { font-size:26px !important; }
  .body { padding:0 24px 4px !important; }
  .btn { display:block !important; text-align:center !important; padding:16px 24px !important; }
  .social { padding:20px 24px 8px !important; }
  .footer { padding:8px 24px 28px !important; }
}
</style>
</head>
<body>
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${escapeHtml(previewText)}</div>
<!--[if mso]><center><table><tr><td width="600"><![endif]-->
<div class="wrap">
<div class="container">
<div class="logo-block"><a href="${escapeHtml(logoUrl)}" target="_blank"><img src="https://groupfitapp.com/email-assets/logo-square.png" alt="Group Fit" /></a></div>
<div class="hero">${eyebrowHtml}
<h1 class="h1">${escapeHtml(heading)}</h1>
${ledeHtml}
</div>
<div class="body">
${bodyHtml}
${gateBoxHtml}
${checklistHtml}
${ctaBtnHtml}
${calloutHtml}
${signoffHtml}
${appBadgesHtml}
</div>
<div class="social"><a href="https://facebook.com/groupfit.fb" target="_blank"><img src="https://groupfitapp.com/email-assets/facebook.png" alt="Facebook" height="22" width="22" /></a> <a href="https://www.instagram.com/groupfit_app" target="_blank"><img src="https://groupfitapp.com/email-assets/instagram.png" alt="Instagram" height="22" width="22" /></a> <a href="https://www.youtube.com/@GroupFitApp" target="_blank"><img src="https://groupfitapp.com/email-assets/youtube.png" alt="YouTube" height="22" width="22" /></a> <a href="https://www.tiktok.com/@groupfit.app" target="_blank"><img src="https://groupfitapp.com/email-assets/tiktok.png" alt="TikTok" height="22" width="22" /></a> <a href="https://www.linkedin.com/company/101067588" target="_blank"><img src="https://groupfitapp.com/email-assets/linkedin.png" alt="LinkedIn" height="22" width="22" /></a></div>
<div class="footer">${escapeHtml(footerText)}<br /><a href="{UNSUBSCRIBE_URL}">Click here to unsubscribe</a></div>
</div>
</div>
<!--[if mso]></td></tr></table></center><![endif]-->
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  // Preserve template tags like {SUBSCRIBER_FIRST_NAME} and {UNSUBSCRIBE_URL}
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/&lt;({[A-Z0-9_]+})&gt;/g, '$1');
}

function formatText(str) {
  if (!str) return '';
  return str;
}
