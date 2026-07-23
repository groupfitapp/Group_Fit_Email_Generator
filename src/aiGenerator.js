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

  const systemInstruction = `You are a world-class conversion email copywriter for Group Fit (an app connecting clients with certified fitness trainers).
Your task is to generate 3 distinct, highly engaging, professional email options based on the user's prompt.

Target Audience: ${isTrainer ? 'Trainer (B2B/Coach)' : 'Customer (B2C/Member)'}
Email Strategy: ${category}
User Prompt: ${prompt}

Format your output MUST be a valid JSON array containing exactly 3 objects with these keys:
- title: Short strategy title (string)
- audience: "${audience}"
- subject: Catchy subject line (string)
- previewText: Compelling inbox preview text snippet (string)
- eyebrow: Uppercase badge text e.g. "NEW FEATURE", "WELCOME" (string)
- heading: Attention-grabbing main H1 title with placeholder {SUBSCRIBER_FIRST_NAME} (string)
- lede: Subtitle paragraph line (string)
- bodyBlocks: Array of 2 distinct paragraph strings (array of strings)
- gateBox: Highlighted notice or callout box text (string)
- checklist: Array of 3 items with { "title": "...", "desc": "..." }
- ctaText: High-converting CTA button text (string)
- ctaUrl: "${isTrainer ? 'https://portal.groupfitapp.com/login' : 'https://groupfitapp.com'}"
- calloutBox: Object with { "title": "...", "desc": "..." }
- showAppBadges: true
- signoffHtml: "Train strong,<br /><strong>Group Fit Team</strong>"

Output JSON array ONLY without markdown formatting or code blocks.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: systemInstruction }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);
  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed.map(item => ({
      ...item,
      showAppBadges: true,
      signoffHtml: "Train strong,<br /><strong>Group Fit Team</strong>"
    }));
  }
  return null;
}

function generateFallbackDrafts(cleanPrompt, isTrainer, category) {
  let topic = cleanPrompt.length > 3 ? cleanPrompt : 'Group Fit Feature Update';
  const option1 = generateOptionByGoal(topic, isTrainer, category, 'primary');
  const option2 = generateOptionByGoal(topic, isTrainer, category, 'secondary');
  const option3 = generateOptionByGoal(topic, isTrainer, category, 'tertiary');

  return [option1, option2, option3];
}

function generateOptionByGoal(topic, isTrainer, category, variant) {
  const capTopic = capitalize(topic);
  const defaultSignoff = "Train strong,<br /><strong>Group Fit Team</strong>";

  if (category === 'announcement') {
    if (isTrainer) {
      if (variant === 'primary') {
        return {
          title: "Official Feature Announcement",
          audience: "trainer",
          subject: `New Feature Announcement: ${capTopic} is Live! 🚀`,
          previewText: "Log in to your portal to try out our newest trainer tools today.",
          eyebrow: "New Feature Announcement",
          heading: `Upgrade Your Business with ${capTopic}, {SUBSCRIBER_FIRST_NAME}!`,
          lede: "We're excited to roll out new updates designed to help certified Group Fit trainers connect with more local clients faster.",
          bodyBlocks: [
            `We've added powerful new tools to your Group Fit Trainer Portal to streamline your client outreach and manage your bookings effortlessly.`,
            "Take advantage of these new capabilities today to keep your weekly schedule full and boost your overall earnings."
          ],
          gateBox: "<strong>Where to find it:</strong> Log into your Group Fit Trainer Dashboard and check out the new feature tab.",
          checklist: [
            { title: "Explore New Dashboard Tools", desc: "Test the updated controls tailored for certified coaches." },
            { title: "Update Your Availability", desc: "Make sure open time slots reflect your current weekly schedule." },
            { title: "Respond to Client Inquiries", desc: "Connect with new prospective clients looking for your training format." }
          ],
          ctaText: "Explore New Feature",
          ctaUrl: "https://portal.groupfitapp.com/login",
          calloutBox: { title: "Pro Tip", desc: "Trainers who complete setup within 48 hours see highest client conversion!" },
          showAppBadges: true,
          signoffHtml: defaultSignoff
        };
      } else {
        return {
          title: "Concise Feature Digest",
          audience: "trainer",
          subject: `Trainer Feature Update: ${capTopic}`,
          previewText: "See how this update makes finding and managing clients easier.",
          eyebrow: "Product Update",
          heading: `New Capabilities for Group Fit Trainers, {SUBSCRIBER_FIRST_NAME}.`,
          lede: "Here is a quick overview of what's new in your trainer portal this week.",
          bodyBlocks: [
            "Our latest release focuses on helping you present your certified skills effectively and connect directly with local fitness clients."
          ],
          gateBox: "<strong>Quick Action:</strong> Check your portal settings to ensure your specializations are up to date.",
          checklist: [
            { title: "Verify Your Travel Radius", desc: "Confirm the ZIP codes where you offer in-person coaching." },
            { title: "Review Specializations", desc: "Select all activities you coach to maximize your search matches." }
          ],
          ctaText: "Open Trainer Portal",
          ctaUrl: "https://portal.groupfitapp.com/login",
          calloutBox: { title: "Questions?", desc: "Reply directly to this email to reach our trainer support team." },
          showAppBadges: true,
          signoffHtml: defaultSignoff
        };
      }
    } else {
      return {
        title: "Customer Feature Spotlight",
        audience: "customer",
        subject: `Introducing ${capTopic} — Built for Your Fitness Goals! ✨`,
        previewText: "Check out the newest feature designed to make finding top trainers effortless.",
        eyebrow: "New Feature Alert",
        heading: `Discover ${capTopic}, {SUBSCRIBER_FIRST_NAME}!`,
        lede: "Finding and booking the right certified fitness trainer just got whole lot easier.",
        bodyBlocks: [
          "We've launched new features inside Group Fit so you can connect with verified personal trainers, studio coaches, and fitness specialists on your terms.",
          "Set your workout goals, choose your preferred format (In-Person, Virtual, or Studio), and let top local coaches bring custom options to you."
        ],
        gateBox: "<strong>Try it now:</strong> Open the Group Fit app to set your preferences and explore newly matched trainers.",
        checklist: [
          { title: "Set Your Preferences", desc: "Choose your favorite activities and workout formats." },
          { title: "Compare Verified Coaches", desc: "Explore ratings, certifications, and specialties." },
          { title: "Book Flexible Sessions", desc: "Schedule workouts that fit seamlessly into your week." }
        ],
        ctaText: "Explore New Feature",
        ctaUrl: "https://groupfitapp.com",
        calloutBox: { title: "Always in Control", desc: "You can update your preferences or pause trainer matching anytime." },
        showAppBadges: true,
        signoffHtml: defaultSignoff
      };
    }
  }

  if (category === 'onboarding') {
    if (isTrainer) {
      return {
        title: "Trainer Setup & Verification Guide",
        audience: "trainer",
        subject: `Action Required: Complete Your Trainer Profile, {SUBSCRIBER_FIRST_NAME}`,
        previewText: "Customers can only book you after your profile is complete and approved.",
        eyebrow: "Profile Onboarding",
        heading: `Finish Your Profile First, {SUBSCRIBER_FIRST_NAME}.`,
        lede: "Your trainer profile is your digital storefront. Completing these required steps allows clients to book you through Group Fit.",
        bodyBlocks: [
          "Customers can only book you after your profile is complete and verified. The faster you finish the basics, the faster you can start accepting client bookings.",
          "Make sure your profile picture, service locations, and pricing reflect your exact coaching offerings."
        ],
        gateBox: "<strong>Do this first:</strong> Add a clear profile photo, complete your bio, set your travel radius, and add your specializations.",
        checklist: [
          { title: "Upload Profile Picture", desc: "Use a clear individual face shot with good lighting." },
          { title: "Set Service Locations", desc: "Define your travel radius or studio location." },
          { title: "Add Availability & Pricing", desc: "Set the days, time slots, and rates clients can book." }
        ],
        ctaText: "Complete My Profile",
        ctaUrl: "https://portal.groupfitapp.com/login",
        calloutBox: { title: "Need Assistance?", desc: "If you don't see your specific certification listed, reply to us and we will add it for you." },
        showAppBadges: true,
        signoffHtml: defaultSignoff
      };
    } else {
      return {
        title: "Customer Welcome & Getting Started",
        audience: "customer",
        subject: `Welcome to Group Fit, {SUBSCRIBER_FIRST_NAME}! Let's Get Started 🏋️`,
        previewText: "Here is your quick 3-step guide to finding and booking top local trainers.",
        eyebrow: "Welcome to Group Fit",
        heading: `Welcome Aboard, {SUBSCRIBER_FIRST_NAME}!`,
        lede: "We're thrilled to help you reach your fitness goals with certified personal trainers and specialized coaches.",
        bodyBlocks: [
          "Whether you train at home, in a studio, or virtually, Group Fit connects you with verified fitness professionals tailored to your needs.",
          "Here are the quick steps to finding your ideal trainer and scheduling your first workout."
        ],
        gateBox: "<strong>Quick Start:</strong> Download the Group Fit mobile app or log into your web dashboard to start browsing coaches near you.",
        checklist: [
          { title: "Download the App", desc: "Get Group Fit on iOS or Android for easy booking on the go." },
          { title: "Set Your Goals", desc: "Select from boxing, running, strength, yoga, and swimming." },
          { title: "Book Your First Session", desc: "Schedule directly with certified coaches in your area." }
        ],
        ctaText: "Find My Trainer",
        ctaUrl: "https://groupfitapp.com",
        calloutBox: { title: "100% Flexible", desc: "Cancel or reschedule sessions with full peace of mind." },
        showAppBadges: true,
        signoffHtml: defaultSignoff
      };
    }
  }

  if (category === 'promotion') {
    return {
      title: "High-Urgency Promo Campaign",
      audience: isTrainer ? "trainer" : "customer",
      subject: isTrainer ? `Limited Time Promo: ${capTopic} for Trainers!` : `Special Offer: ${capTopic} — Limited Time! 🎉`,
      previewText: "Don't miss out on this exclusive offer designed for Group Fit members.",
      eyebrow: "Limited Time Offer",
      heading: isTrainer ? `Boost Your Earnings Today, {SUBSCRIBER_FIRST_NAME}!` : `Exclusive Savings Inside, {SUBSCRIBER_FIRST_NAME}!`,
      lede: isTrainer
        ? "Take advantage of our special promotional boost to get featured at the top of local client search results."
        : "For a limited time, enjoy special promotional offers when booking certified trainers through Group Fit.",
      bodyBlocks: [
        isTrainer
          ? "We are running a special promotion to connect top active trainers with high-intent client inquiries across all major workout formats."
          : "Whether you're starting a new workout routine or pushing for new personal records, now is the perfect time to book a certified coach."
      ],
      gateBox: "<strong>Promo Details:</strong> This limited-time promotion expires soon. Claim your offer today before open slots fill up!",
      checklist: [
        { title: "Claim Offer", desc: "Apply promo details directly in your account." },
        { title: "Select Workout Slots", desc: "Lock in your preferred training times." }
      ],
      ctaText: isTrainer ? "Claim Trainer Offer" : "Claim Offer Now",
      ctaUrl: isTrainer ? "https://portal.groupfitapp.com/login" : "https://groupfitapp.com",
      calloutBox: { title: "Offer Conditions", desc: "Terms and conditions apply. Offer valid for active Group Fit accounts." },
      showAppBadges: true,
      signoffHtml: defaultSignoff
    };
  }

  return {
    title: "Friendly Re-engagement Digest",
    audience: isTrainer ? "trainer" : "customer",
    subject: `We Missed You, {SUBSCRIBER_FIRST_NAME}! See What's New at Group Fit`,
    previewText: "Check out updated features, new coaches, and client leads waiting for you.",
    eyebrow: "Welcome Back",
    heading: `Ready to Pick Things Back Up, {SUBSCRIBER_FIRST_NAME}?`,
    lede: "Your fitness journey doesn't have to pause. We've added new features and expanded our network!",
    bodyBlocks: [
      isTrainer
        ? "New local clients are searching for certified trainers on Group Fit every day. Update your calendar and start connecting with active leads again."
        : "New certified trainers have joined Group Fit in your area! Whether you want to restart your routine or try a new activity, coaches are ready."
    ],
    gateBox: "<strong>What's waiting for you:</strong> Log into your dashboard to check out recent updates and new matches.",
    checklist: [
      { title: "Review What's New", desc: "Check out newly added tools and local coach profiles." },
      { title: "Reactivate Your Schedule", desc: "Set open availability or request custom session offers." }
    ],
    ctaText: "Welcome Back — Open Dashboard",
    ctaUrl: isTrainer ? "https://portal.groupfitapp.com/login" : "https://groupfitapp.com",
    calloutBox: { title: "Need Help?", desc: "Our support team is always here to answer your questions." },
    showAppBadges: true,
    signoffHtml: defaultSignoff
  };
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
