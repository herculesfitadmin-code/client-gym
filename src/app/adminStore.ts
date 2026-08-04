import { CoachItem, gymCoaches } from "./components/CoachesStackedCards";

export interface HeroMetric {
  value: string;
  label: string;
}

export interface SiteTagline {
  headlineMain: string;
  headlineHighlight: string;
  subtitle: string;
  heroVideoUrl?: string;
  heroMetrics?: HeroMetric[];
}

export interface SiteOffer {
  enabled: boolean;
  announcementText: string;
  badgeText: string;
  discountPercentage: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  originalPrice?: number;
  period?: string;
  badge: string | null;
  offerTag?: string;
  popular: boolean;
  features: string[];
}

export interface AdminUser {
  id: string;
  email: string;
  password: string;
  role: string;
  addedAt: string;
}

export interface FounderData {
  image: string;
  mediaType?: "image" | "video";
  videoUrl?: string;
  quote: string;
  quoteAuthor: string;
  quoteSubtext: string;
  beforeImage?: string;
  afterImage?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  author?: string;
  date?: string;
  content: string;
}

export interface LegalPolicies {
  privacyPolicy: string;
  termsAndConditions: string;
  refundPolicy: string;
}

export interface EnquiryLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  goal: string;
  preferredCoach?: string;
  planName?: string;
  submittedAt: string;
}

export interface AdminSiteData {
  tagline: SiteTagline;
  offer: SiteOffer;
  plans: PricingPlan[];
  coaches: CoachItem[];
  admins: AdminUser[];
  founder: FounderData;
  blogs: BlogPost[];
  policies: LegalPolicies;
  googleSheetWebhookUrl?: string;
  enquiries?: EnquiryLead[];
}

export const defaultSiteData: AdminSiteData = {
  tagline: {
    headlineMain: "BUILD A STRONGER BODY",
    headlineHighlight: "WITH RIGHT GUIDANCE",
    subtitle:
      "Looking for a good gym in Kalaburagi? Hercules Fitness offers modern equipment, experienced trainers, a clean workout environment and affordable membership plans built on 19+ years of real coaching experience.",
    heroVideoUrl: "/hergirish_rotated.mp4",
    heroMetrics: [
      { value: "19+ YRS", label: "REAL EXPERIENCE" },
      { value: "100%", label: "PERSONAL ATTENTION" },
      { value: "500+", label: "HAPPY MEMBERS" },
      { value: "5", label: "TRUSTED COACHES" },
    ],
  },
  offer: {
    enabled: true,
    announcementText: "🔥 WEBSITE EXCLUSIVE: GET FLAT 25% OFF ALL MEMBERSHIPS WHEN YOU ENQUIRE ONLINE!",
    badgeText: "25% WEB DISCOUNT",
    discountPercentage: 25,
  },
  plans: [
    {
      id: "plan-1m",
      name: "1 MONTH PLAN",
      price: 2000,
      offerPrice: 1500,
      originalPrice: 2000,
      period: "STANDARD PLAN",
      badge: "STARTER",
      offerTag: "⚡ GET 25% OFF VIA WEBSITE INQUIRY",
      popular: false,
      features: [
        "Full Gym Floor & Equipment Access",
        "Free Cardio Zone & Weight Section",
        "Locker & Shower Facility Included",
        "Personalized Workout Orientation",
        "General Trainer Guidance",
      ],
    },
    {
      id: "plan-3m",
      name: "3 MONTHS PLAN",
      price: 4000,
      offerPrice: 3000,
      originalPrice: 4000,
      period: "QUARTERLY PACKAGE",
      badge: "POPULAR",
      offerTag: "🔥 SAVE ₹1,000 WITH WEB INQUIRY OFFER",
      popular: true,
      features: [
        "All 1-Month Plan Features Included",
        "1-on-1 Form & Posture Coaching",
        "Custom Workout Plan for Weight Loss / Gain",
        "Weekly Progress & Body Measurement Tracking",
        "Dietary & Protein Guidance",
        "Free Locker & Towel Storage Space",
      ],
    },
    {
      id: "plan-6m",
      name: "6 MONTHS PLAN",
      price: 6000,
      offerPrice: 4500,
      originalPrice: 6000,
      period: "HALF-YEARLY PACKAGE",
      badge: "BEST VALUE",
      offerTag: "🔥 SAVE ₹1,500 WITH WEB INQUIRY OFFER",
      popular: false,
      features: [
        "All 3-Month Plan Features Included",
        "Dedicated Transformation Mentorship",
        "Monthly InBody Body Fat Percentage Analysis",
        "Custom Nutrition & Meal Plan Chart",
        "Priority Equipment Access During Peak Hours",
        "1 Free Guest Pass per Month",
      ],
    },
    {
      id: "plan-12m",
      name: "12 MONTHS PLAN",
      price: 10000,
      offerPrice: 7500,
      originalPrice: 10000,
      period: "ANNUAL VIP MEMBERSHIP",
      badge: "MAX SAVINGS",
      offerTag: "⚡ SAVE ₹2,500 WITH WEB INQUIRY OFFER",
      popular: false,
      features: [
        "All 6-Month Plan Features Included",
        "Direct Mentorship under Coach Girish (19+ Yrs Exp)",
        "Complimentary Hercules Fitness Branded Gym Kit",
        "12 Months Complete Gym & Fitness Access",
        "Free 30-Day Membership Freeze / Hold Option",
        "Unlimited Guest Passes (2 Passes per Month)",
      ],
    },
  ],
  coaches: gymCoaches,
  admins: [
    {
      id: "admin-1",
      email: "girish@herculesfitness.in",
      password: "admin",
      role: "Founder / Head Coach",
      addedAt: "2024-01-01",
    },
  ],
  founder: {
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc",
    mediaType: "video",
    videoUrl: "/hergirish_rotated.mp4",
    quote: "Building strength is not just about lifting heavy weights. It is about discipline, correct form, and consistent guidance tailored to your body's specific needs.",
    quoteAuthor: "COACH GIRISH",
    quoteSubtext: "19+ YRS EXPERIENCE — FOUNDER & HEAD COACH",
    beforeImage: "/transformations/girish_before.png",
    afterImage: "/transformations/girish_after.png",
  },
  blogs: [
    {
      id: "blog-1",
      title: "Best Time to Join a Gym in Kalaburagi",
      subtitle: "Morning vs Evening Training & Consistency Secrets",
      category: "GUIDE",
      author: "Coach Girish",
      date: "August 2024",
      content: "When is the best time to start your fitness journey at Hercules Fitness Kalaburagi?\n\nWhether you prefer early morning sessions between 5:00 AM and 8:00 AM or evening workouts from 5:00 PM to 10:00 PM, consistency is key.\n\nMorning Workouts: Great for boosting metabolism early, setting a positive tone for the day, and avoiding evening fatigue or work conflicts.\n\nEvening Workouts: Ideal for post-work stress release, peak core body temperature, and higher muscular strength output after full daily meal fueling.\n\nAt Hercules Fitness on New Jewargi Road, our trainers ensure equal attention and guidance during both morning and evening slots."
    },
    {
      id: "blog-2",
      title: "Gym vs Home Workout: Which is Right for You?",
      subtitle: "Equipment, Trainer Guidance & Motivation Comparison",
      category: "FITNESS",
      author: "Coach Girish",
      date: "August 2024",
      content: "Many beginners in Kalaburagi ask whether home workouts or joining a gym yields faster results.\n\nWhile bodyweight home exercises are good for basic movement, joining a professional gym like Hercules Fitness provides:\n\n1. Progressive Overload: Access to dumbbells, barbells, cable machines, and squat racks that force muscle growth and fat loss.\n2. Expert Supervision: Coach Girish and certified trainers correct posture to prevent injury.\n3. Community Motivation: Training alongside high-energy members pushes you past your perceived limits."
    },
    {
      id: "blog-3",
      title: "Beginner's Guide to Gym Training in Kalaburagi",
      subtitle: "Zero Intimidation, Proper Form & First-Week Survival",
      category: "BEGINNER",
      author: "Coach Girish",
      date: "August 2024",
      content: "Entering a gym for the first time can feel overwhelming, but at Hercules Fitness Kalaburagi, beginners receive dedicated 1-on-1 attention.\n\n1. Start with Master Form: Never worry about how heavy you lift in week one. Focus on mastering the motion of squats, chest presses, and lat pulldowns under trainer supervision.\n2. Hydration & Sleep: Drink at least 3 liters of water daily and aim for 7-8 hours of restful sleep.\n3. Simple Diet: Focus on home-cooked meals with adequate protein (dal, eggs, paneer, chicken, sprouts) rather than fancy supplements."
    },
    {
      id: "blog-4",
      title: "How Much Daily Protein Do You Really Need?",
      subtitle: "Practical Protein Goals for Fat Loss & Muscle Gain",
      category: "NUTRITION",
      author: "Coach Girish",
      date: "August 2024",
      content: "Protein is the essential building block for muscle recovery and fat loss satiety.\n\nFor active gym members in Kalaburagi, aim for approximately 1.2 to 1.6 grams of protein per kilogram of body weight daily. For a 70 kg individual, that means roughly 85 to 110 grams per day.\n\nYou do not need expensive imported supplements to hit this goal. Everyday Indian food sources like boiled eggs, paneer, soya chunks, Greek yogurt, lentils, sprouts, and lean chicken provide rich protein when combined strategically in your daily meals."
    },
    {
      id: "blog-5",
      title: "Top Benefits of Heavy Strength Training",
      subtitle: "Bone Density, Fat Loss, Posture & Longevity",
      category: "STRENGTH",
      author: "Coach Girish",
      date: "August 2024",
      content: "Strength training is not just for bodybuilders—it is essential for long-term health, bone density, and metabolic vitalization for men and women of all ages.\n\nLifting weights increases your Resting Metabolic Rate (RMR), meaning your body continues to burn calories hours after your workout ends. It strengthens joints, corrects desk-job posture issues, and improves insulin sensitivity. At Hercules Fitness, our compound strength zone features squat racks, bench presses, and heavy dumbbell lines guided by experienced coaches."
    },
    {
      id: "blog-6",
      title: "Practical Weight Loss Tips for Beginners",
      subtitle: "Caloric Deficit Without Starvation or Fad Diets",
      category: "WEIGHT LOSS",
      author: "Coach Girish",
      date: "August 2024",
      content: "Sustainable weight loss is about consistency and habit building, not extreme starvation.\n\n1. Maintain a Moderate Caloric Deficit: Reduce daily food intake by 300-500 kcal rather than skipping meals entirely.\n2. Combine Strength & Cardio: Resistance training preserves lean muscle mass while cardio burns additional calories.\n3. Track Liquid Calories: Eliminate sugary cold drinks, heavy tea with excessive sugar, and packaged juices.\n4. Stay Consistent: Aim for 4 to 5 workouts per week at Hercules Fitness for visible results within 4 to 6 weeks."
    }
  ],
  policies: {
    privacyPolicy: `# Privacy Policy\n\n**Effective Date:** August 4, 2026\n\nAt **Hercules Fitness**, we value your privacy and are committed to protecting the personal information you share with us.\n\n## 1. Information We Collect\nWhen you use our website or fill out our enquiry form, we may collect:\n* Full Name\n* Phone Number\n* Email Address (if provided)\n* Fitness goals or enquiry details\n* Any other information you voluntarily submit\n\nWe may also collect basic technical information such as your IP address, browser type, and device information to improve our website.\n\n## 2. How We Use Your Information\nWe use your information to:\n* Respond to your enquiries\n* Contact you regarding memberships, offers, or fitness programs\n* Schedule consultations or gym visits\n* Improve our services and website experience\n* Send important updates related to your enquiry\n\nWe do **not** sell or rent your personal information to third parties.\n\n## 3. Information Sharing\nWe may share your information only:\n* With trusted service providers who help us operate our website or communication systems.\n* When required by law or legal authorities.\n* To protect our legal rights or prevent fraud.\n\n## 4. Data Security\nWe take reasonable measures to protect your personal information from unauthorized access, misuse, or disclosure. While no online system is completely secure, we strive to use industry-standard security practices.\n\n## 5. Cookies\nOur website may use cookies or similar technologies to improve user experience, analyze website traffic, and enhance website performance. You may disable cookies through your browser settings if you prefer.\n\n## 6. Third-Party Services\nOur website may use third-party tools such as Google Maps, Google Analytics, Meta Pixel, or similar services to improve website functionality and marketing performance. These services may collect information according to their own privacy policies.\n\n## 7. Your Rights\nYou may request to:\n* Access the personal information we hold about you.\n* Correct inaccurate information.\n* Delete your personal information, where legally permitted.\n* Withdraw consent for future communications.\n\nTo make any request, please contact us using the details below.\n\n## 8. Contact Us\nIf you have any questions about this Privacy Policy or how your information is handled, please contact us.\n\n**Hercules Fitness**\n2nd Floor, Sy #71/1A, Plot #18, New Jewargi Rd, above Ola Showroom, State Bank Colony, Kalaburagi, Karnataka 585102\nPhone: +91 99008 97907\nEmail: support@herculesfitness.in\n\n## 9. Changes to This Privacy Policy\nWe may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.\n\nBy using this website or submitting the enquiry form, you agree to the terms of this Privacy Policy.`,

    termsAndConditions: `# Terms & Conditions\n\n**Effective Date:** August 4, 2026\n\nWelcome to **Hercules Fitness Kalaburagi**. By accessing our facility or using our website, you agree to comply with the following terms and conditions:\n\n## 1. Membership & Admission\n* Memberships are non-transferable and personal to the registered individual.\n* Operating Hours: Monday to Saturday (5:00 AM – 10:00 PM), Sunday (6:00 AM – 10:00 AM).\n* Members must maintain clean workout attire, athletic footwear, and carry a personal gym towel.\n\n## 2. Code of Conduct & Safety\n* Re-rack all weights and dumbbells after completing your sets.\n* Treat fellow members, trainers, and equipment with care and respect.\n* Misconduct, offensive language, or intentional damage to property will result in immediate termination of membership without refund.\n\n## 3. Physical Health Disclaimer\n* Members are advised to consult a qualified physician prior to starting any intense fitness regimen.\n* Hercules Fitness and its personal trainers are not liable for pre-existing medical conditions or injuries resulting from improper exercise execution.\n\n## 4. Facility Rules\n* Personal training instructions given by Coach Girish and certified trainers must be followed for personal safety.\n* Management reserves the right to adjust operating schedules on public holidays.`,

    refundPolicy: `# Refund & Cancellation Policy\n\n**Effective Date:** August 4, 2026\n\nAt **Hercules Fitness**, we aim to provide maximum value and transparency for all gym members in Kalaburagi:\n\n## 1. Website Inquiry Offers\n* Discounts claimed via website inquiries (e.g. 25% Web Offer) are valid for 7 days from consultation booking.\n\n## 2. Membership Fee Refunds\n* Membership packages (1 Month, 3 Months, 6 Months, 12 Months) are strictly non-refundable once activated.\n* If a cancellation request is submitted before program activation, an administrative fee of ₹500 will be deducted.\n\n## 3. Membership Hold & Pause\n* Members on 6-month or 12-month plans can pause their active membership for up to 30 days due to medical reasons with valid documentation.\n\n## 4. Contact for Support\nFor any billing or membership questions, please contact management at:\nPhone: +91 99008 97907\nEmail: support@herculesfitness.in`,
  },
  googleSheetWebhookUrl: "",
  enquiries: [],
};

const STORAGE_KEY = "hercules_admin_site_data_v9";

export function loadSiteData(): AdminSiteData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        tagline: { ...defaultSiteData.tagline, ...(parsed.tagline || {}) },
        offer: { ...defaultSiteData.offer, ...(parsed.offer || {}) },
        plans: parsed.plans && Array.isArray(parsed.plans) && parsed.plans.length === 4
          ? parsed.plans
          : defaultSiteData.plans,
        coaches: parsed.coaches && Array.isArray(parsed.coaches) ? parsed.coaches : defaultSiteData.coaches,
        admins: parsed.admins && Array.isArray(parsed.admins) ? parsed.admins : defaultSiteData.admins,
        founder: { ...defaultSiteData.founder, ...(parsed.founder || {}) },
        blogs: parsed.blogs && Array.isArray(parsed.blogs) ? parsed.blogs : defaultSiteData.blogs,
        policies: { ...defaultSiteData.policies, ...(parsed.policies || {}) },
        googleSheetWebhookUrl: parsed.googleSheetWebhookUrl || "",
        enquiries: parsed.enquiries && Array.isArray(parsed.enquiries) ? parsed.enquiries : [],
      };
    }
  } catch (e) {
    console.error("Failed to load site data from localStorage:", e);
  }
  return defaultSiteData;
}

export function saveSiteData(data: AdminSiteData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save site data to localStorage:", e);
  }
}

export function recordEnquiryLead(
  lead: Omit<EnquiryLead, "id" | "submittedAt">,
  siteData: AdminSiteData,
  onUpdateSiteData?: (updated: AdminSiteData) => void
): EnquiryLead {
  const newLead: EnquiryLead = {
    ...lead,
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    submittedAt: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  const updatedEnquiries = [newLead, ...(siteData.enquiries || [])];
  const updatedData: AdminSiteData = {
    ...siteData,
    enquiries: updatedEnquiries,
  };

  saveSiteData(updatedData);
  if (onUpdateSiteData) {
    onUpdateSiteData(updatedData);
  }

  // Asynchronously post to Google Sheet Webhook if configured
  if (siteData.googleSheetWebhookUrl && siteData.googleSheetWebhookUrl.trim()) {
    try {
      fetch(siteData.googleSheetWebhookUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(newLead),
        mode: "no-cors",
      }).catch((err) => console.log("Google Sheet Webhook async notice:", err));
    } catch (e) {
      console.log("Google Sheet Webhook dispatch notice:", e);
    }
  }

  return newLead;
}
