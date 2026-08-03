/**
 * Intelligent Gemini AI Email Generator for Group Fit
 * Supports direct Gemini LLM generation when API Key is provided
 */

export async function generateAiEmailDrafts({ prompt, audience = 'customer', category = 'announcement', apiKey = '' }) {
  const isTrainer = audience === 'trainer';
  const cleanPrompt = (prompt || '').trim();

  // If Gemini API Key is provided, call live Gemini LLM API!
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const llmDrafts = await fetchGeminiLlmDrafts({ prompt: cleanPrompt, audience, category, apiKey: apiKey.trim() });
      if (llmDrafts && llmDrafts.length > 0) {
        return llmDrafts;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart engine:', err);
    }
  }

  // Fallback to offline smart engine
  return generateFallbackDrafts(cleanPrompt, isTrainer, category);
}

async function fetchGeminiLlmDrafts({ prompt, audience, category, apiKey }) {
  const isTrainer = audience === 'trainer';

  const systemInstruction = "You are an elite, world-class conversion copywriter for Group Fit, an on-demand fitness platform in Canada connecting clients with certified personal trainers.\n\n" +
    "TASK: Write 3 distinct, highly persuasive, high-converting HTML-ready email template JSON drafts based on the user's instructions.\n\n" +
    "CRITICAL COPYWRITING RULES:\n" +
    "1. TONE & STYLE: Closely follow all tone, style, and urgency requests in the user prompt (e.g., 'extremely persuasive', 'urgent', 'friendly'). Use proven copywriting frameworks (PAS, AIDA) to maximize engagement and action.\n" +
    "2. DO NOT ECHO: Do NOT copy the user prompt text verbatim into headers or subjects. Synthesize the core offer into compelling, polished marketing copy.\n" +
    "3. RAW URL FOR CTA: The ctaUrl MUST be a plain URL string without markdown formatting or brackets. Output exactly \"https://groupfitapp.com\" or \"https://portal.groupfitapp.com/login\".\n\n" +
    "Target Audience: " + (isTrainer ? 'Trainer (B2B Coach)' : 'Customer (B2C Client)') + "\n" +
    "Category: " + category + "\n" +
    "User Prompt / Goal: \"" + prompt + "\"\n\n" +
    "Return ONLY a valid JSON array of 3 objects containing exact keys:\n" +
    "[\n" +
    "  {\n" +
    "    \"title\": \"Short Strategy Title (e.g. High-Urgency Cash Incentive)\",\n" +
    "    \"audience\": \"" + audience + "\",\n" +
    "    \"subject\": \"Attention-Grabbing Subject Line\",\n" +
    "    \"previewText\": \"Hooking Preview Text Snippet\",\n" +
    "    \"eyebrow\": \"REFERRAL PROGRAM\",\n" +
    "    \"heading\": \"Persuasive Headline with {SUBSCRIBER_FIRST_NAME}\",\n" +
    "    \"lede\": \"Compelling sub-headline highlighting immediate benefit\",\n" +
    "    \"bodyBlocks\": [\"Paragraph 1 driving desire & benefit.\", \"Paragraph 2 explaining the simple action step.\"],\n" +
    "    \"gateBox\": \"Highlighted summary callout box\",\n" +
    "    \"checklist\": [\n" +
    "      { \"title\": \"Step 1 Title\", \"desc\": \"Step 1 description\" },\n" +
    "      { \"title\": \"Step 2 Title\", \"desc\": \"Step 2 description\" }\n" +
    "    ],\n" +
    "    \"ctaText\": \"Action-Oriented CTA Button\",\n" +
    "    \"ctaUrl\": \"" + (isTrainer ? 'https://portal.groupfitapp.com/login' : 'https://groupfitapp.com') + "\",\n" +
    "    \"calloutBox\": { \"title\": \"Pro Tip / Urgency Note\", \"desc\": \"Helpful note or scarcity trigger\" },\n" +
    "    \"showAppBadges\": true,\n" +
    "    \"signoffHtml\": \"Train strong,<br /><strong>Group Fit Team</strong>\"\n" +
    "  }\n" +
    "]\n\n" +
    "Output raw JSON ONLY. Do not wrap in markdown or code blocks.";

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: systemInstruction }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error("Gemini API error: " + response.status);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  const jsonString = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(jsonString);
  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed.map(item => ({
      ...item,
      ctaUrl: cleanUrl(item.ctaUrl) || (isTrainer ? '[https://portal.groupfitapp.com/login](https://portal.groupfitapp.com/login)' : '[https://groupfitapp.com](https://groupfitapp.com)'),
      showAppBadges: true,
      signoffHtml: "Train strong,<br /><strong>Group Fit Team</strong>"
    }));
  }
  return null;
}

function generateFallbackDrafts(cleanPrompt, isTrainer, category) {
  const topic = extractCleanTopic(cleanPrompt);
  const defaultSignoff = "Train strong,<br /><strong>Group Fit Team</strong>";
  const defaultCtaUrl = isTrainer ? "[https://portal.groupfitapp.com/login](https://portal.groupfitapp.com/login)" : "[https://groupfitapp.com](https://groupfitapp.com)";

  // Dynamic seed so clicking the button multiple times generates new variations
  const seed = Math.floor(Math.random() * 3);

  if (cleanPrompt.toLowerCase().includes('referral') || category === 'promotion') {
    const subjectsP1 = [
      "Give $0, Get $50: Earn Cash Every Time Friends Train! 🏋️",
      "Claim $50 Cash For Every Friend You Invite to Group Fit 💸",
      "Your Friends Workout Free & You Get $50 — Here's How"
    ];

    const headingsP1 = [
      "Earn Unlimited $50 Cash Rewards, {SUBSCRIBER_FIRST_NAME}!",
      "Turn Your Workout Network into $50 Rewards, {SUBSCRIBER_FIRST_NAME}",
      "Pass Along Free Sessions & Claim $50, {SUBSCRIBER_FIRST_NAME}!"
    ];

    return [
      {
        title: "Persuasive Cash Incentive Strategy",
        audience: isTrainer ? "trainer" : "customer",
        subject: subjectsP1[seed % 3],
        previewText: "Your friends get unlimited free try-out sessions, and you collect $50 the moment they complete their first paid workout.",
        eyebrow: "EXCLUSIVE REFERRAL OFFER",
        heading: headingsP1[seed % 3],
        lede: "Fitness is better together — and much more rewarding. Now you can give your friends free access to top certified trainers while earning $50 for every referral.",
        bodyBlocks: [
          "Finding the right personal trainer shouldn't be a gamble. With the Group Fit Referral Program, your friends can book FREE try-out sessions with as many local trainers as they want until they find the coach that matches their exact goals and energy.",
          "The moment your referred friend completes their first paid 60-minute session, we automatically deposit a $50 cash credit into your account. There are zero caps or limits on how much you can earn!"
        ],
        gateBox: "<strong>How it works:</strong> Share code → Friend books FREE sessions with any trainer → You get $50 cash credit after their first paid session.",
        checklist: [
          { title: "Share Your Link", desc: "Send your invite link or referral code to friends, family, and coworkers." },
          { title: "Friend Trains for Free", desc: "They try top local coaches at zero cost using your referral code." },
          { title: "Collect $50 Cash", desc: "Get $50 credited directly to your account after their first paid booking." }
        ],
        ctaText: "Get My Referral Link & Code",
        ctaUrl: defaultCtaUrl,
        calloutBox: { title: "Unlimited Cash Earnings", desc: "Refer 5 friends and earn $250. There is no cap on your referral earnings!" },
        showAppBadges: true,
        signoffHtml: defaultSignoff
      },
      {
        title: "Community Growth Focus",
        audience: isTrainer ? "trainer" : "customer",
        subject: "Help Friends Find Their Ideal Coach (And Collect $50)",
        previewText: "Give your friends free try-outs with certified coaches and earn $50 per paid client.",
        eyebrow: "COMMUNITY REWARDS",
        heading: "Give Free Workouts, Get $50 Cash, {SUBSCRIBER_FIRST_NAME}",
        lede: "Introduce your friends to verified personal trainers, studio coaches, and fitness specialists in your area.",
        bodyBlocks: [
          "Finding a coach you click with makes all the difference. That's why we allow your referred friends to try out different trainers with free session credits until they find the coach that fits.",
          "As a thank you for growing the Group Fit community, you'll earn $50 for every friend who signs up and completes a paid booking."
        ],
        gateBox: "<strong>Exclusive Bonus:</strong> $50 per successful referral credited directly to your account.",
        checklist: [
          { title: "Copy Your Invite Code", desc: "Find your code inside your Group Fit app profile." },
          { title: "Invite Workout Partners", desc: "Send it via text, social media, or email." }
        ],
        ctaText: "Start Referring Friends Now",
        ctaUrl: defaultCtaUrl,
        calloutBox: { title: "100% Risk-Free", desc: "Your friends pay nothing for their initial try-out sessions." },
        showAppBadges: true,
        signoffHtml: defaultSignoff
      },
      {
        title: "Direct Benefit Summary",
        audience: isTrainer ? "trainer" : "customer",
        subject: "Did you know you can earn $50 on Group Fit?",
        previewText: "Pass along free try-out sessions to anyone looking for certified trainers.",
        eyebrow: "GROUP FIT REWARDS",
        heading: "Claim Your $50 Referral Credit, {SUBSCRIBER_FIRST_NAME}",
        lede: "Help your network achieve their fitness goals while earning extra cash.",
        bodyBlocks: [
          "Share Group Fit with anyone interested in in-person or virtual coaching. They get free initial workouts to test out coaches, and you earn $50 after their first paid booking."
        ],
        gateBox: "<strong>Quick Link:</strong> Open your account dashboard to view and share your unique referral link.",
        checklist: [
          { title: "Open Account Dashboard", desc: "Access your referral card inside your account." },
          { title: "Track Pending Payouts", desc: "Monitor earnings as friends complete workouts." }
        ],
        ctaText: "Claim My Referral Code",
        ctaUrl: defaultCtaUrl,
        calloutBox: { title: "No Limits", desc: "Refer as many friends as you like!" },
        showAppBadges: true,
        signoffHtml: defaultSignoff
      }
    ];
  }

  return [
    {
      title: "Primary Update Announcement",
      audience: isTrainer ? "trainer" : "customer",
      subject: topic + ": Important Update for {SUBSCRIBER_FIRST_NAME}",
      previewText: "Latest details and action items regarding " + topic + ".",
      eyebrow: "GROUP FIT ANNOUNCEMENT",
      heading: "Important Update Regarding " + topic + ", {SUBSCRIBER_FIRST_NAME}",
      lede: "We are sharing an update regarding " + topic + " to keep our community informed.",
      bodyBlocks: [
        "We have updated our platform features and guidelines surrounding " + topic + ". These changes are designed to improve your overall experience on Group Fit.",
        "Please log into your account to review any relevant details or update your preferences."
      ],
      gateBox: "Summary: Review the latest details on " + topic + " inside your Group Fit account.",
      checklist: [
        { title: "Review Details", desc: "Check full announcement details inside your dashboard." },
        { title: "Update Settings", desc: "Ensure your profile preferences are current." }
      ],
      ctaText: "Open Dashboard",
      ctaUrl: defaultCtaUrl,
      calloutBox: { title: "Need Help?", desc: "Contact support@groupfitapp.com for assistance." },
      showAppBadges: true,
      signoffHtml: defaultSignoff
    },
    {
      title: "Quick Digest Update",
      audience: isTrainer ? "trainer" : "customer",
      subject: "Quick Notice: " + topic,
      previewText: "A fast summary of changes regarding " + topic + ".",
      eyebrow: "PLATFORM NOTICE",
      heading: "What You Need to Know About " + topic + ", {SUBSCRIBER_FIRST_NAME}",
      lede: "Here is a quick summary of what is happening regarding " + topic + ".",
      bodyBlocks: [
        "To ensure everything runs smoothly, we have outlined key steps regarding " + topic + " inside your account portal."
      ],
      gateBox: "Action Item: Log in to manage your account settings.",
      checklist: [
        { title: "Log In", desc: "Access your dashboard." }
      ],
      ctaText: "View My Account",
      ctaUrl: defaultCtaUrl,
      calloutBox: { title: "Questions?", desc: "Reply to this email with any questions." },
      showAppBadges: true,
      signoffHtml: defaultSignoff
    },
    {
      title: "Action Item Reminder",
      audience: isTrainer ? "trainer" : "customer",
      subject: "Action Required: " + topic,
      previewText: "Please review your settings regarding " + topic + ".",
      eyebrow: "ACTION REQUIRED",
      heading: "Action Required for " + topic + ", {SUBSCRIBER_FIRST_NAME}",
      lede: "Please complete the necessary steps regarding " + topic + ".",
      bodyBlocks: [
        "Taking a moment to review " + topic + " ensures your account remains active and properly configured."
      ],
      gateBox: "Note: Update your profile as soon as possible.",
      checklist: [
        { title: "Complete Action Steps", desc: "Follow instructions inside the app." }
      ],
      ctaText: "Complete Setup",
      ctaUrl: defaultCtaUrl,
      calloutBox: { title: "Support", desc: "We are here to help." },
      showAppBadges: true,
      signoffHtml: defaultSignoff
    }
  ];
}

/**
 * Robust URL Sanitizer to strip any markdown link syntax e.g. [https://url.com](https://url.com)
 */
function cleanUrl(rawUrl) {
  if (!rawUrl) return '';
  let str = String(rawUrl).trim();

  // Extract URL from markdown link syntax [text](http://...)
  const markdownMatch = str.match(/\[.*?\]\((https?:\/\/[^\s\)]+)\)/i);
  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1];
  }

  // Extract first http/https URL if embedded in brackets
  const urlMatch = str.match(/(https?:\/\/[^\s\]\)\>"]+)/i);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }

  return str.replace(/[\[\]\(\)]/g, '');
}

function extractCleanTopic(promptText) {
  if (!promptText || promptText.length < 3) return 'Group Fit Platform Update';

  const text = promptText.toLowerCase();

  if (text.includes('referral')) return 'Group Fit Referral Program';
  if (text.includes('privacy') || text.includes('terms') || text.includes('t&c')) return 'Terms & Privacy Policy Update';
  if (text.includes('calendar') || text.includes('google')) return 'Google Calendar Sync Feature';
  if (text.includes('price') || text.includes('discount') || text.includes('free')) return 'Special Offer & Discounts';

  if (promptText.length > 40) {
    const words = promptText.split(' ').slice(0, 5).join(' ');
    return capitalize(words) + '...';
  }

  return capitalize(promptText);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}