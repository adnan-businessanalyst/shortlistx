import type { Locale } from "./locales";

export type QuestionLocaleCopy = {
  label: string;
  hint?: string;
  placeholder?: string;
  options?: Record<string, string>;
};

/** Persistent hardcoded Arabic survey copy keyed by question.key / option.value */
export const QUESTIONS_AR: Record<string, QuestionLocaleCopy> = {
  role: {
    label: "أي وصف يناسب دورك في التوظيف أكثر؟",
    placeholder: "اختر دورك…",
    options: {
      in_house: "مسؤّل توظيف داخلي / اكتساب مواهب",
      agency: "وكالة توظيف / صيّاد رؤوس",
      hr_ops: "موارد بشرية عامة / عمليات الأفراد",
      hiring_manager: "مدير توظيف",
      founder: "مؤسس / تنفيذي",
      other_role: "أخرى",
    },
  },
  role_other: {
    label: "ما هو دورك بكلماتك؟",
    placeholder: "مثلًا: قائد توظيف جامعي…",
  },
  years_experience: {
    label: "كم سنة عملت في التوظيف أو حوله؟",
    placeholder: "اختر…",
    options: {
      lt2: "أقل من سنتين",
      y2_5: "٢–٥ سنوات",
      y6_10: "٦–١٠ سنوات",
      gt10: "أكثر من ١٠ سنوات",
    },
  },
  apps_per_role: {
    label: "في وظيفة مفتوحة نموذجية، كم طلبًا تقريبًا تراجع؟",
    placeholder: "اختر…",
    options: {
      under_50: "أقل من ٥٠",
      a50_150: "٥٠–١٥٠",
      a150_400: "١٥٠–٤٠٠",
      over_400: "أكثر من ٤٠٠",
    },
  },
  screening_time: {
    label: "كم من أسبوعك يذهب لفرز السير / الطلبات؟",
    placeholder: "اختر…",
    options: {
      lt5h: "أقل من ٥ ساعات",
      h5_10: "٥–١٠ ساعات",
      h10_20: "١٠–٢٠ ساعة",
      gt20h: "أكثر من ٢٠ ساعة",
    },
  },
  missed_talent_fear: {
    label: "عندما يكون الحجم كبيرًا، ما أكثر ما يقلقك؟",
    options: {
      miss_good: "تفويت مرشح ممتاز في الكومة",
      inconsistent: "جودة فرز غير متسقة عبر الفريق",
      slow_hire: "التوظيف ببطء وفقدان المرشحين",
      bias: "انحياز يتسلل إلى الفرز السريع",
      other_worry: "شيء آخر",
    },
  },
  agency_placements: {
    label: "تقريبًا كم توظيفًا يستهدف مكتبك / فريقك شهريًا؟",
    placeholder: "اختر…",
    options: {
      p1_3: "١–٣",
      p4_8: "٤–٨",
      p9_15: "٩–١٥",
      p16_plus: "١٦+",
    },
  },
  hm_involvement: {
    label: "ما مدى مشاركتك في أول فرز للسير اليوم؟",
    options: {
      do_it_myself: "أقوم بمعظمه بنفسي",
      review_shortlist: "أراجع قائمة يعدّها غيري",
      light_touch: "مشاركة خفيفة — أتدخل متأخرًا",
      not_involved: "بالكاد أشارك في الفرز",
    },
  },
  team_size_hiring: {
    label: "كم شخصًا يشارك فعليًا في قرارات التوظيف بشركتك؟",
    placeholder: "اختر…",
    options: {
      solo: "أنا فقط",
      t2_5: "٢–٥ أشخاص",
      t6_15: "٦–١٥ شخصًا",
      t16_plus: "١٦+ شخصًا",
    },
  },
  biggest_pain: {
    label: "ما أكثر جزء مؤلم في التوظيف بالنسبة لك الآن؟",
    options: {
      cv_volume: "حجم السير / الطلبات",
      shortlist_quality: "جودة القائمة المختصرة",
      scheduling: "جدولة المقابلات",
      no_shows: "الغياب / الاختفاء",
      video_interview_load: "عبء مقابلات الفيديو",
      sourcing: "توفير مواهب كافية",
      stakeholder_alignment: "محاذاة أصحاب المصلحة",
      other_pain: "شيء آخر",
    },
  },
  pain_detail: {
    label: "أخبرنا أكثر عن هذا الألم — كيف يبدو الأسبوع السيئ؟",
    placeholder:
      "مثلًا: يصلني ٣٠٠ طلب لكل وظيفة وفرزهم يلتهم أسبوعي كله…",
  },
  pain_other: {
    label: "ما هو هذا الألم «الآخر»؟",
  },
  must_haves: {
    label: "ما الذي يجعل Shortlist ضروريًا لك؟",
    hint: "اختر كل ما ينطبق.",
    options: {
      faster_cv: "فرز أسرع للسير",
      better_shortlists: "قوائم مختصرة أفضل جودة",
      less_bias: "انحياز أقل واتساق أكثر",
      outreach_scheduling: "تواصل وجدولة آلية",
      reporting: "تقارير لأصحاب المصلحة",
      sourcing: "البحث عن مرشحين جدد",
      ai_video: "مقابلات فيديو بمساعدة الذكاء الاصطناعي",
    },
  },
  video_interview_today: {
    label: "هل تستخدم مقابلات الفيديو في عملية التوظيف اليوم؟",
    options: {
      yes_live: "نعم — مقابلات فيديو مباشرة",
      yes_async: "نعم — فيديو غير متزامن / مسجّل",
      yes_both: "نعم — مباشرة وغير متزامن",
      not_yet: "ليس بعد",
      no_plans: "لا، ولا توجد خطط",
    },
  },
  video_pain: {
    label: "أين تؤلم مقابلات الفيديو أكثر اليوم؟",
    hint: "اختر كل ما ينطبق.",
    options: {
      time_to_review: "وقت مراجعة التسجيلات",
      inconsistent_scoring: "تقييم غير متسق بين المقابلين",
      scheduling_chaos: "فوضى الجدولة",
      candidate_dropoff: "انسحاب المرشحين",
      note_taking: "تدوين الملاحظات والملخصات",
      other_video: "شيء آخر",
    },
  },
  video_ai_expectation: {
    label: "إذا ساعد الذكاء الاصطناعي مقابلات الفيديو، ماذا يجب أن يفعل أولًا؟",
    placeholder: "مثلًا: يقيّم الإجابات وفق معيار ويبرز العلامات الحمراء…",
  },
  cv_ai_trust: {
    label: "لفلترة السير بالذكاء الاصطناعي، ماذا تحتاج قبل أن تثق به؟",
    options: {
      written_reasons: "أسباب مكتوبة لكل درجة",
      human_override: "تجاوز بشري سهل يعلّم النموذج",
      audit_trail: "سجل تدقيق للامتثال",
      pilot_proof: "إثبات أنه يعمل على وظائفي في تجربة",
      not_sure: "لست متأكدًا بعد",
    },
  },
  willingness_to_pay: {
    label: "إذا حلّ Shortlist أكبر ألم لديك بوضوح، ماذا ستدفع شهريًا؟",
    options: {
      under_25: "أقل من ٢٥ دولارًا",
      b25_75: "٢٥–٧٥ دولارًا",
      b75_200: "٧٥–٢٠٠ دولار",
      b200_500: "٢٠٠–٥٠٠ دولار",
      b500_plus: "٥٠٠+ دولار",
    },
  },
  budget_share: {
    label: "كم نسبة ذلك من ميزانية برمجياتك / اشتراكاتك الشهرية؟",
    placeholder: "اختر…",
    options: {
      under_5: "أقل من ٥٪ — بالكاد يُلاحظ",
      p5_15: "٥–١٥٪ — ملموس لكن مقبول",
      p15_30: "١٥–٣٠٪ — بند جاد",
      over_30: "أكثر من ٣٠٪ — يحتاج أن يستبدل أدوات أخرى",
      no_budget: "لا أتحكم بميزانية",
    },
  },
  buyer: {
    label: "من يوافق عادةً على أداة كهذه؟",
    options: {
      me: "أنا",
      my_manager: "مديري",
      hr_lead: "قائد الموارد البشرية / الأفراد",
      finance: "المالية / المشتريات",
      founder_ceo: "المؤسس / الرئيس التنفيذي",
      unclear: "غير واضح / يختلف",
    },
  },
  current_stack: {
    label: "ماذا تستخدم اليوم للتوظيف؟",
    hint: "اختر كل ما ينطبق.",
    options: {
      ats: "نظام ATS (Greenhouse، Lever، Workable، إلخ)",
      linkedin: "LinkedIn Recruiter",
      email_inbox: "البريد / صندوق مشترك",
      spreadsheets: "جداول بيانات",
      job_boards: "لوحات وظائف",
      video_tool: "أداة مقابلات فيديو مخصصة",
      other_stack: "أخرى",
    },
  },
  ats_name: {
    label: "أي نظام ATS، إن رغبت بالإفصاح؟",
    placeholder: "مثلًا: Greenhouse",
  },
  pilot_interest: {
    label: "هل تنضم لتجربة مجانية إذا بنينا حول سير عملك؟",
    options: {
      yes_asap: "نعم — في أقرب وقت",
      yes_later: "نعم — لاحقًا هذا العام",
      maybe: "ربما — أرسل لي التفاصيل",
      no: "لا شكرًا",
    },
  },
  email: {
    label: "إلى أين نرسل دعوة التجربة / المتابعة؟",
    placeholder: "you@company.com",
  },
  company_context: {
    label: "اسم الشركة أو الوكالة (اختياري)",
    placeholder: "Acme Recruiting",
  },
};

/** Persistent hardcoded Tagalog survey copy keyed by question.key / option.value */
export const QUESTIONS_TL: Record<string, QuestionLocaleCopy> = {
  role: {
    label: "Alin ang pinakamainam na naglalarawan sa role mo sa hiring?",
    placeholder: "Piliin ang role mo…",
    options: {
      in_house: "In-house recruiter / Talent acquisition",
      agency: "Recruiting agency / Headhunter",
      hr_ops: "HR generalist / People ops",
      hiring_manager: "Hiring manager",
      founder: "Founder / Executive",
      other_role: "Iba pa",
    },
  },
  role_other: {
    label: "Ano ang role mo, sa sarili mong salita?",
    placeholder: "hal. Campus recruiting lead…",
  },
  years_experience: {
    label: "Ilang taon ka nang nagtatrabaho sa o sa paligid ng hiring?",
    placeholder: "Pumili…",
    options: {
      lt2: "Mas mababa sa 2 taon",
      y2_5: "2–5 taon",
      y6_10: "6–10 taon",
      gt10: "Higit sa 10 taon",
    },
  },
  apps_per_role: {
    label:
      "Sa tipikal na open role, humigit-kumulang ilang applications ang sine-review mo?",
    placeholder: "Pumili…",
    options: {
      under_50: "Mas mababa sa 50",
      a50_150: "50–150",
      a150_400: "150–400",
      over_400: "Higit sa 400",
    },
  },
  screening_time: {
    label: "Gaano kalaki ng linggo mo ang napupunta sa CV / application screening?",
    placeholder: "Pumili…",
    options: {
      lt5h: "Mas mababa sa 5 oras",
      h5_10: "5–10 oras",
      h10_20: "10–20 oras",
      gt20h: "Higit sa 20 oras",
    },
  },
  missed_talent_fear: {
    label: "Kapag mataas ang volume, ano ang pinakakinatatakutan mo?",
    options: {
      miss_good: "Makaligtaan ang magaling na kandidato sa tambak",
      inconsistent: "Hindi consistent ang screening quality sa team",
      slow_hire: "Masyadong mabagal ang hiring at nawawala ang kandidato",
      bias: "May bias na pumapasok sa mabilisang screen",
      other_worry: "Iba pa",
    },
  },
  agency_placements: {
    label:
      "Humigit-kumulang ilang placements ang target ng desk / team mo bawat buwan?",
    placeholder: "Pumili…",
    options: {
      p1_3: "1–3",
      p4_8: "4–8",
      p9_15: "9–15",
      p16_plus: "16+",
    },
  },
  hm_involvement: {
    label: "Gaano ka kasangkot sa unang CV screen ngayon?",
    options: {
      do_it_myself: "Ako ang gumagawa ng karamihan",
      review_shortlist: "Nire-review ko ang shortlist na ginawa ng iba",
      light_touch: "Light touch — huli akong sumasali",
      not_involved: "Halos hindi kasali sa screening",
    },
  },
  team_size_hiring: {
    label:
      "Ilang tao ang aktibong kasali sa hiring decisions sa kompanya mo?",
    placeholder: "Pumili…",
    options: {
      solo: "Ako lang",
      t2_5: "2–5 tao",
      t6_15: "6–15 tao",
      t16_plus: "16+ tao",
    },
  },
  biggest_pain: {
    label: "Ano ang pinakamasakit na bahagi ng recruiting para sa iyo ngayon?",
    options: {
      cv_volume: "CV / application volume",
      shortlist_quality: "Kalidad ng shortlist",
      scheduling: "Pag-schedule ng interviews",
      no_shows: "No-shows / ghosting",
      video_interview_load: "Video interview load",
      sourcing: "Hindi sapat ang sourcing",
      stakeholder_alignment: "Stakeholder alignment",
      other_pain: "Iba pa",
    },
  },
  pain_detail: {
    label: "Kwento nang kaunti ang sakit na iyon — ano ang hitsura ng masamang linggo?",
    placeholder:
      "hal. 300 applications bawat role at kain ng buong linggo ang screening…",
  },
  pain_other: {
    label: "Ano ang ‘iba pa’ na sakit na iyon?",
  },
  must_haves: {
    label: "Ano ang magiging must-have ng Shortlist para sa iyo?",
    hint: "Piliin lahat ng naaangkop.",
    options: {
      faster_cv: "Mas mabilis na CV screening",
      better_shortlists: "Mas magandang quality ng shortlists",
      less_bias: "Mas kaunting bias, mas consistent",
      outreach_scheduling: "Automated outreach at scheduling",
      reporting: "Reporting para sa stakeholders",
      sourcing: "Sourcing ng bagong kandidato",
      ai_video: "AI-assisted video interviewing",
    },
  },
  video_interview_today: {
    label: "Gumagamit na ba kayo ng video interviews sa hiring process?",
    options: {
      yes_live: "Oo — live video interviews",
      yes_async: "Oo — async / recorded video",
      yes_both: "Oo — parehong live at async",
      not_yet: "Hindi pa",
      no_plans: "Hindi, at walang plano",
    },
  },
  video_pain: {
    label: "Saan masakit ang video interviewing ngayon?",
    hint: "Piliin lahat ng naaangkop.",
    options: {
      time_to_review: "Oras sa pag-review ng recordings",
      inconsistent_scoring: "Hindi consistent ang scoring sa interviewers",
      scheduling_chaos: "Gulo sa scheduling",
      candidate_dropoff: "Candidate drop-off",
      note_taking: "Note-taking at summaries",
      other_video: "Iba pa",
    },
  },
  video_ai_expectation: {
    label:
      "Kung tutulungan ng AI ang video interviews mo, ano ang dapat nitong gawin muna?",
    placeholder:
      "hal. I-score ang sagot ayon sa rubric at i-flag ang red flags…",
  },
  cv_ai_trust: {
    label:
      "Para sa AI CV screening, ano ang kailangan mo bago mo ito pagkatiwalaan?",
    options: {
      written_reasons: "Nakasulat na reasons sa bawat score",
      human_override: "Madaling human overrides na nagtuturo sa model",
      audit_trail: "Audit trail para sa compliance",
      pilot_proof: "Patunay na gumagana ito sa roles ko sa pilot",
      not_sure: "Hindi pa sigurado",
    },
  },
  willingness_to_pay: {
    label:
      "Kung malinaw na inaayos ng Shortlist ang pinakamalaking sakit mo, magkano ang babayaran mo bawat buwan?",
    options: {
      under_25: "Mas mababa sa $25",
      b25_75: "$25–$75",
      b75_200: "$75–$200",
      b200_500: "$200–$500",
      b500_plus: "$500+",
    },
  },
  budget_share: {
    label:
      "Anong bahagi iyon ng monthly software / subscriptions budget mo?",
    placeholder: "Pumili…",
    options: {
      under_5: "Mas mababa sa 5% — halos hindi napapansin",
      p5_15: "5–15% — makabuluhan pero okay",
      p15_30: "15–30% — seryosong line item",
      over_30: "Higit sa 30% — kailangan nitong palitan ang ibang tools",
      no_budget: "Hindi ako ang may hawak ng budget",
    },
  },
  buyer: {
    label: "Sino ang karaniwang pumapayag sa tool na ganito?",
    options: {
      me: "Ako",
      my_manager: "Manager ko",
      hr_lead: "HR / People lead",
      finance: "Finance / procurement",
      founder_ceo: "Founder / CEO",
      unclear: "Hindi malinaw / nag-iiba",
    },
  },
  current_stack: {
    label: "Ano ang ginagamit mo ngayon para sa recruiting?",
    hint: "Piliin lahat ng naaangkop.",
    options: {
      ats: "ATS (Greenhouse, Lever, Workable, atbp.)",
      linkedin: "LinkedIn Recruiter",
      email_inbox: "Email / shared inbox",
      spreadsheets: "Spreadsheets",
      job_boards: "Job boards",
      video_tool: "Dedicated video interview tool",
      other_stack: "Iba pa",
    },
  },
  ats_name: {
    label: "Aling ATS, kung pwede mong sabihin?",
    placeholder: "hal. Greenhouse",
  },
  pilot_interest: {
    label:
      "Sasali ka ba sa libreng pilot kung bubuuin namin ito sa workflow mo?",
    options: {
      yes_asap: "Oo — sa lalong madaling panahon",
      yes_later: "Oo — mamaya ngayong taon",
      maybe: "Siguro — padalhan mo ako ng details",
      no: "Salamat na lang",
    },
  },
  email: {
    label: "Saan namin ipadadala ang pilot invite / follow-up?",
    placeholder: "you@company.com",
  },
  company_context: {
    label: "Pangalan ng kompanya o agency (opsyonal)",
    placeholder: "Acme Recruiting",
  },
};

export function getQuestionLocaleMap(
  locale: Locale
): Record<string, QuestionLocaleCopy> | null {
  if (locale === "ar") return QUESTIONS_AR;
  if (locale === "tl") return QUESTIONS_TL;
  return null;
}
