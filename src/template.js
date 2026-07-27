/**
 * Group Fit SendMails HTML Email Template Generator
 */

export const APP_LINKS = {
  customer: {
    logoUrl: 'https://groupfitapp.com',
    appleUrl: 'https://apps.apple.com/us/app/group-fit-book-a-trainer/id6503181635',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.newcustomer',
    defaultSignoff: 'Train strong,<br /><strong>Group Fit Team</strong>',
    defaultFooter: 'GroupFit Technologies Inc. You are receiving this email because you registered at groupfitapp.com.',
    defaultCtaUrl: 'https://groupfitapp.com'
  },
  trainer: {
    logoUrl: 'https://groupfitapp.com/trainer',
    appleUrl: 'https://apps.apple.com/us/app/group-fit-trainer/id6499300864',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.thegroupfittrainer',
    defaultSignoff: 'Train strong,<br /><strong>Group Fit Team</strong>',
    defaultFooter: 'GroupFit Technologies Inc. You are receiving this email because you signed up as a trainer at groupfitapp.com.',
    defaultCtaUrl: 'https://portal.groupfitapp.com/login'
  }
};

export function generateTransactionalEmailHtml(data = {}) {
  const {
    subject = "Your Booking is Confirmed - Group Fit",
    previewText = "Great news! Your session booking has been confirmed.",
    customerName = "Alex",
    sessionName = "HIIT & Functional Strength",
    trainerName = "Coach Sarah Jenkins",
    dateTime = "Saturday, Aug 15, 2026 @ 10:00 AM",
    location = "Central Park Athletic Field & Studio B",
    amountPaid = "$45.00",
    ctaText = "View Booking Details",
    ctaUrl = "https://portal.groupfitapp.com/bookings/BK-104928",
    logoUrl = "https://groupfitapp.com"
  } = data;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root { color-scheme: light dark; supported-color-schemes: light dark; }

    /* Client Resets */
    body, table, td, p, div, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f1f5f9; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155; }

    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      body, table[role="presentation"] { background-color: #0f172a !important; }
      .email-card { background-color: #1e293b !important; border-color: #334155 !important; box-shadow: 0 4px 24px rgba(0,0,0,0.45) !important; }
      .header-row { border-bottom-color: #334155 !important; background: transparent !important; }
      .footer-row { border-top-color: #334155 !important; color: #94a3b8 !important; }
      .footer-row div { color: #94a3b8 !important; }
      p, div, td { color: #e2e8f0 !important; }
      p strong, td strong { color: #f8fafc !important; }
      .brand-text { color: #f8fafc !important; }
      .details-box { background-color: #0f172a !important; border-color: #334155 !important; }
      .details-box td[style*="font-weight:600"] { color: #cbd5e1 !important; }
      .details-box td:not([style*="font-weight"]) { color: #f1f5f9 !important; }
      a.gf-cta { background-color: #4d4db8 !important; color: #ffffff !important; box-shadow: 0 4px 14px rgba(77,77,184,0.4) !important; }
    }

    [data-ogsc] body { background-color: #0f172a !important; }
    [data-ogsc] .email-card { background-color: #1e293b !important; border-color: #334155 !important; }
    [data-ogsc] p, [data-ogsc] div, [data-ogsc] td { color: #e2e8f0 !important; }
    [data-ogsc] .brand-text { color: #f8fafc !important; }
    [data-ogsc] .details-box { background-color: #0f172a !important; border-color: #334155 !important; }
    [data-ogsc] a.gf-cta { background-color: #4d4db8 !important; color: #ffffff !important; }
  </style>
  <!--[if mso]>
  <style>
    a.gf-cta { padding:14px 24px !important; background-color:#333399 !important; }
    .email-card { border: 1px solid #e2e8f0 !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;background:#f1f5f9;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:28px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-card" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);border:1px solid #e2e8f0;">

          <!-- 1. Header / Transparent Brand Logo Band -->
          <tr>
            <td class="header-row" style="padding:28px 28px 20px;border-bottom:1px solid #e2e8f0;background:transparent;text-align:center;">
              <a href="${escapeHtml(logoUrl)}" target="_blank" style="text-decoration:none;display:inline-block;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="vertical-align:middle;padding-right:10px;">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;">
                        <rect width="32" height="32" rx="8" fill="#333399"/>
                        <path d="M16 7L24 12V20L16 25L8 20V12L16 7Z" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
                        <circle cx="16" cy="16" r="3.5" fill="white"/>
                      </svg>
                    </td>
                    <td style="vertical-align:middle;">
                      <div class="brand-text" style="font-size:24px;font-weight:800;letter-spacing:-0.03em;color:#0f172a;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                        <span style="color:#333399;">Group</span> Fit
                      </div>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>

          <!-- 2. Main Email Body -->
          <tr>
            <td style="padding:28px 28px 12px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:1.55;color:#334155;">
              <p style="margin:0 0 14px;">Hello ${escapeHtml(customerName)},</p>

              <p style="margin:0 0 14px;">Great news! Your session booking has been confirmed. Below are the details of your upcoming class:</p>

              <!-- Session Details Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="details-box" style="margin:18px 0 20px;border-collapse:collapse;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;overflow:hidden;">
                <tr>
                  <td style="padding:10px 14px;font-weight:600;color:#475569;width:32%;vertical-align:top;font-size:14px;border-bottom:1px solid #e2e8f0;">Session:</td>
                  <td style="padding:10px 14px;color:#0f172a;vertical-align:top;font-weight:600;font-size:14px;border-bottom:1px solid #e2e8f0;">${escapeHtml(sessionName)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-weight:600;color:#475569;width:32%;vertical-align:top;font-size:14px;border-bottom:1px solid #e2e8f0;">Trainer:</td>
                  <td style="padding:10px 14px;color:#0f172a;vertical-align:top;font-size:14px;border-bottom:1px solid #e2e8f0;">${escapeHtml(trainerName)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-weight:600;color:#475569;width:32%;vertical-align:top;font-size:14px;border-bottom:1px solid #e2e8f0;">Date &amp; Time:</td>
                  <td style="padding:10px 14px;color:#0f172a;vertical-align:top;font-size:14px;border-bottom:1px solid #e2e8f0;">${escapeHtml(dateTime)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-weight:600;color:#475569;width:32%;vertical-align:top;font-size:14px;border-bottom:1px solid #e2e8f0;">Location:</td>
                  <td style="padding:10px 14px;color:#0f172a;vertical-align:top;font-size:14px;border-bottom:1px solid #e2e8f0;">${escapeHtml(location)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-weight:600;color:#475569;width:32%;vertical-align:top;font-size:14px;">Amount Paid:</td>
                  <td style="padding:10px 14px;color:#16a34a;vertical-align:top;font-weight:700;font-size:14px;">${escapeHtml(amountPaid)}</td>
                </tr>
              </table>

              <!-- 3. Primary Call-To-Action (CTA) Button with Outlook VML Fallback -->
              <p style="margin:24px 0 16px;text-align:left;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeHtml(ctaUrl)}" style="height:46px;v-text-anchor:middle;width:220px;" arcsize="18%" stroke="f" fillcolor="#333399">
                  <w:anchorlock/>
                  <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${escapeHtml(ctaText)}</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-- -->
                <a href="${escapeHtml(ctaUrl)}" class="gf-cta" style="display:inline-block;background:#333399;color:#ffffff !important;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px;">${escapeHtml(ctaText)}</a>
                <!--<![endif]-->
              </p>

              <p style="margin:0 0 14px;">Please arrive 5 to 10 minutes prior to the start time. Wear comfortable workout shoes and bring a water bottle.</p>

              <p style="margin:16px 0 0;color:#64748b;font-size:14px;">
                Need to reschedule or contact your trainer? Manage your booking directly inside your account portal.
              </p>
            </td>
          </tr>

          <!-- 4. Footer Section -->
          <tr>
            <td class="footer-row" style="padding:20px 28px 32px;border-top:1px solid #e2e8f0;font-family:system-ui,-apple-system,sans-serif;font-size:13px;line-height:1.5;color:#64748b;text-align:center;">
              <div>If you didnt request this booking, please notify our support team immediately.</div>
              <div style="margin-top:12px;">&copy; 2026 Group Fit. All rights reserved.</div>
              <div style="margin-top:14px;line-height:1;">
                <a href="https://instagram.com/groupfitapp" aria-label="Instagram" style="display:inline-block;margin:0 8px;text-decoration:none;">
                  <img src="https://cdn.simpleicons.org/instagram/333399" alt="Instagram" width="20" height="20" style="display:inline-block;border:0;outline:none;vertical-align:middle;" />
                </a>
                <a href="https://facebook.com/groupfitapp" aria-label="Facebook" style="display:inline-block;margin:0 8px;text-decoration:none;">
                  <img src="https://cdn.simpleicons.org/facebook/333399" alt="Facebook" width="20" height="20" style="display:inline-block;border:0;outline:none;vertical-align:middle;" />
                </a>
                <a href="https://x.com/groupfitapp" aria-label="X" style="display:inline-block;margin:0 8px;text-decoration:none;">
                  <img src="https://cdn.simpleicons.org/x/333399" alt="X" width="20" height="20" style="display:inline-block;border:0;outline:none;vertical-align:middle;" />
                </a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function generateEmailHtml(data = {}) {
  if (data.templateType === 'transactional' || data.type === 'transactional') {
    return generateTransactionalEmailHtml(data);
  }

  const audience = data.audience === 'trainer' ? 'trainer' : 'customer';
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
    ctaUrl = data.ctaUrl || defaults.defaultCtaUrl,
    calloutBox = data.calloutBox || (audience === 'trainer' ? {
      title: "Missing something?",
      desc: "If you do not see your specialization or certification listed, reply to this email and we can add it."
    } : null),
    customSignoff = data.signoffHtml || '',
    signoffName = data.signoffName,
    signoffTitle = data.signoffTitle,
    footerText = data.footerText || defaults.defaultFooter,
    logoUrl = data.logoUrl || defaults.logoUrl,
    appleUrl = data.appleUrl || defaults.appleUrl,
    googleUrl = data.googleUrl || defaults.googleUrl
  } = data;

  // Show App Badges by default for both Customer (Customer App) and Trainer (Trainer App)
  const showAppBadges = data.showAppBadges !== false;

  const eyebrowHtml = eyebrow
    ? `<span class="eyebrow">${escapeHtml(eyebrow)}</span>`
    : '';

  const ledeHtml = lede
    ? `<p class="lede">${formatText(lede)}</p>`
    : '';

  const bodyHtml = Array.isArray(bodyBlocks)
    ? bodyBlocks.filter(Boolean).map(b => `<p class="text-block">${formatText(b)}</p>`).join('\n\n')
    : (bodyBlocks ? `<p class="text-block">${formatText(bodyBlocks)}</p>` : '');

  const gateBoxHtml = gateBox
    ? `\n<!-- HIGHLIGHT GATE BOX -->\n<div class="gate-box">${formatText(gateBox)}</div>`
    : '';

  const sectionLabelHtml = sectionLabel
    ? `<p class="section-label">${escapeHtml(sectionLabel)}</p>`
    : '';

  const checklistHtml = (Array.isArray(checklist) && checklist.length > 0)
    ? `\n<!-- CHECKLIST SECTION -->\n${sectionLabelHtml}
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
    ? `\n<!-- CTA BUTTON -->\n<div class="btn-wrap">
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeHtml(ctaUrl)}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="20%" stroke="f" fillcolor="#4f46e5">
  <w:anchorlock/>
  <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${escapeHtml(ctaText)}</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-- -->
<a href="${escapeHtml(ctaUrl)}" class="btn gf-cta" target="_blank">${escapeHtml(ctaText)}</a>
<!--<![endif]-->
</div>`
    : '';

  const calloutHtml = calloutBox && (calloutBox.title || calloutBox.desc)
    ? `\n<!-- CALLOUT BOX -->\n<div class="callout-box">${calloutBox.title ? `<strong>${escapeHtml(calloutBox.title)}</strong><br />` : ''}<span class="callout-desc">${formatText(calloutBox.desc)}</span></div>`
    : '';

  let signoffHtml = '';
  if (customSignoff) {
    signoffHtml = `\n<!-- SIGNOFF -->\n<p class="signoff">${formatText(customSignoff)}</p>`;
  } else if (signoffName) {
    signoffHtml = `\n<!-- SIGNOFF -->\n<p class="signoff">Regards,<br /><strong>${escapeHtml(signoffName)}</strong><br /><span style="font-size: 13px; color: #64748b;">${escapeHtml(signoffTitle || '')}</span></p>`;
  } else {
    signoffHtml = `\n<!-- SIGNOFF -->\n<p class="signoff">${defaults.defaultSignoff}</p>`;
  }

  const appBadgesHtml = showAppBadges
    ? `\n<!-- APP STORE / GOOGLE PLAY BADGES (${audience.toUpperCase()}) -->\n<div class="app-badges" style="text-align: center; margin: 28px 0 16px;">
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
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(subject)}</title>
<!--[if mso]>
<xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<![endif]-->
<style>
:root { color-scheme: light dark; supported-color-schemes: light dark; }
body { margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#0f172a; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
a { color:#4f46e5; text-decoration:none; }

.wrap { width:100%; background-color:#f8fafc; padding:40px 16px; box-sizing:border-box; }
.container { max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(15,23,42,0.06); border:1px solid #e2e8f0; }

.logo-block { padding:32px 40px 12px; border-bottom:1px solid #f1f5f9; background:transparent; text-align:left; }
.brand-mark { display:inline-flex; align-items:center; gap:10px; text-decoration:none; }
.logo-icon-svg { width:32px; height:32px; vertical-align:middle; }
.brand-title { font-size:22px; font-weight:800; letter-spacing:-0.03em; color:#0f172a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; vertical-align:middle; display:inline-block; }
.brand-accent { color:#4f46e5; }

.hero { padding:28px 40px 16px; }
.eyebrow { display:inline-block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#4f46e5; background:#eef2ff; padding:6px 12px; border-radius:999px; margin:0 0 16px; }
.h1 { font-size:28px; font-weight:800; color:#0f172a; line-height:1.2; letter-spacing:-0.03em; margin:0 0 12px; }
.lede { font-size:16px; color:#475569; line-height:1.6; margin:0; }

.body { padding:0 40px 8px; }
.text-block { font-size:15px; line-height:1.65; color:#334155; margin:0 0 20px; }
.gate-box { background:#f8fafc; border-left:4px solid #4f46e5; padding:16px 20px; margin:0 0 24px; font-size:14.5px; line-height:1.6; color:#334155; border-radius:0 10px 10px 0; border-top:1px solid #e2e8f0; border-right:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0; }
.gate-box strong { color:#0f172a; }

.btn-wrap { text-align:left; margin:12px 0 28px; }
.btn { display:inline-block; background:#4f46e5; color:#ffffff !important; text-decoration:none; font-size:15px; font-weight:600; padding:14px 28px; border-radius:10px; text-align:center; box-shadow:0 4px 12px rgba(79,70,229,0.25); }

.section-label { font-size:13px; font-weight:700; color:#0f172a; text-transform:uppercase; letter-spacing:0.8px; margin:0 0 12px; }
.checklist { width:100%; border-collapse:collapse; margin:0 0 24px; }
.checklist td { padding:14px 0; border-bottom:1px solid #f1f5f9; vertical-align:top; }
.checklist tr:last-child td { border-bottom:none; }
.num-cell { width:34px; min-width:34px; }
.num { display:inline-block; width:26px; height:26px; line-height:26px; background:#4f46e5; color:#ffffff; font-size:12px; font-weight:700; text-align:center; border-radius:50%; }
.item-title { font-size:15px; font-weight:600; color:#0f172a; display:block; margin-bottom:3px; }
.item-desc { font-size:14px; color:#64748b; line-height:1.55; }

.callout-box { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px 20px; margin:0 0 24px; }
.callout-desc { font-size:14px; color:#475569; line-height:1.6; }
.signoff { font-size:15px; line-height:1.65; color:#334155; margin:24px 0 8px; }
.signoff strong { color:#0f172a; }

.social { text-align:center; padding:24px 40px 12px; border-top:1px solid #f1f5f9; }
.social a { display:inline-block; margin:0 8px; text-decoration:none; }
.footer { text-align:center; font-size:12px; color:#94a3b8; padding:8px 40px 32px; line-height:1.6; }
.footer a { color:#4f46e5; text-decoration:underline; }

@media (prefers-color-scheme: dark) {
  body, .wrap { background-color:#0b0f19 !important; }
  .container { background-color:#161e2e !important; border-color:#273549 !important; box-shadow:0 10px 30px rgba(0,0,0,0.5) !important; }
  .logo-block { border-bottom-color:#273549 !important; }
  .brand-title { color:#ffffff !important; }
  .h1 { color:#f8fafc !important; }
  .lede, .text-block, .signoff { color:#cbd5e1 !important; }
  .signoff strong, .item-title, .section-label, .gate-box strong { color:#f8fafc !important; }
  .eyebrow { background-color:rgba(99,102,241,0.15) !important; color:#818cf8 !important; }
  .gate-box { background-color:#0f172a !important; border-color:#273549 !important; color:#cbd5e1 !important; }
  .callout-box { background-color:#0f172a !important; border-color:#273549 !important; color:#cbd5e1 !important; }
  .callout-desc, .item-desc { color:#94a3b8 !important; }
  .checklist td { border-bottom-color:#273549 !important; }
  .btn, a.gf-cta { background-color:#6366f1 !important; color:#ffffff !important; }
  .social { border-top-color:#273549 !important; }
  .footer { color:#64748b !important; }
}

[data-ogsc] body, [data-ogsc] .wrap { background-color:#0b0f19 !important; }
[data-ogsc] .container { background-color:#161e2e !important; border-color:#273549 !important; }
[data-ogsc] .brand-title, [data-ogsc] .h1 { color:#ffffff !important; }
[data-ogsc] .lede, [data-ogsc] .text-block { color:#cbd5e1 !important; }
[data-ogsc] .btn { background-color:#6366f1 !important; color:#ffffff !important; }

@media only screen and (max-width:620px) {
  .wrap { padding:0 !important; }
  .container { border-radius:0 !important; box-shadow:none !important; border:none !important; }
  .logo-block { padding:24px 20px 12px !important; }
  .hero { padding:20px 20px 16px !important; }
  .h1 { font-size:24px !important; }
  .body { padding:0 20px 8px !important; }
  .btn { display:block !important; text-align:center !important; padding:15px 24px !important; }
  .social { padding:20px 20px 8px !important; }
  .footer { padding:8px 20px 28px !important; }
}
</style>
</head>
<body>
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${escapeHtml(previewText)}</div>
<!--[if mso]><center><table><tr><td width="600"><![endif]-->

<div class="wrap">
<div class="container">

<!-- LOGO HEADER (Transparent SVG / Brand Mark - Flawless on Dark & Light) -->
<div class="logo-block">
  <a href="${escapeHtml(logoUrl)}" target="_blank" class="brand-mark">
    <!-- Clean transparent athletic vector logo mark -->
    <svg class="logo-icon-svg" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#4F46E5"/>
      <path d="M16 7L24 12V20L16 25L8 20V12L16 7Z" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="16" cy="16" r="3.5" fill="white"/>
    </svg>
    <span class="brand-title"><span class="brand-accent">Group</span> Fit</span>
  </a>
</div>

<!-- HERO -->
<div class="hero">
  ${eyebrowHtml}
  <h1 class="h1">${escapeHtml(heading)}</h1>
  ${ledeHtml}
</div>

<!-- BODY -->
<div class="body">
${bodyHtml}
${gateBoxHtml}
${checklistHtml}
${ctaBtnHtml}
${calloutHtml}
${signoffHtml}
${appBadgesHtml}
</div>

<!-- SOCIAL LINKS -->
<div class="social">
  <a href="https://www.facebook.com/groupfitapp" target="_blank"><img src="https://cdn.simpleicons.org/facebook/6366f1" alt="Facebook" height="20" width="20" style="display:inline-block;vertical-align:middle;" /></a>
  <a href="https://www.instagram.com/groupfit_app" target="_blank"><img src="https://cdn.simpleicons.org/instagram/6366f1" alt="Instagram" height="20" width="20" style="display:inline-block;vertical-align:middle;" /></a>
  <a href="https://www.youtube.com/@GroupFitApp" target="_blank"><img src="https://cdn.simpleicons.org/youtube/6366f1" alt="YouTube" height="20" width="20" style="display:inline-block;vertical-align:middle;" /></a>
  <a href="https://www.tiktok.com/@groupfit.app" target="_blank"><img src="https://cdn.simpleicons.org/tiktok/6366f1" alt="TikTok" height="20" width="20" style="display:inline-block;vertical-align:middle;" /></a>
  <a href="https://www.linkedin.com/company/101067588" target="_blank"><img src="https://cdn.simpleicons.org/linkedin/6366f1" alt="LinkedIn" height="20" width="20" style="display:inline-block;vertical-align:middle;" /></a>
</div>

<!-- FOOTER -->
<div class="footer">
  <div>&copy; 2026 GroupFit Technologies Inc. All rights reserved.</div>
  <div style="margin-top: 6px;"><a href="{UNSUBSCRIBE_URL}">Click here to unsubscribe</a></div>
</div>

</div>
</div>

<!--[if mso]></td></tr></table></center><![endif]-->
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
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
  return str.replace(/\r\n/g, '\n').replace(/\n/g, '<br />');
}
