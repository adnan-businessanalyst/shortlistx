import type { Locale } from "./locales";

export type UiMessages = {
  pilotBadge: string;
  eyebrow: string;
  heroHighlight: string;
  heroBefore: string;
  heroSubBefore: string;
  heroSubStrong: string;
  heroSubAfter: string;
  cta: string;
  ctaNote: string;
  stepsAria: string;
  intakeK: string;
  intakeH: string;
  intakeP: string;
  screenK: string;
  screenH: string;
  screenP: string;
  decideK: string;
  decideH: string;
  decideP: string;
  interviewK: string;
  interviewH: string;
  interviewP: string;
  surveyH: string;
  surveyP: string;
  surveyLoadError: string;
  shareH: string;
  shareP: string;
  shareWa: string;
  footer: string;
  language: string;
  submit: string;
  sending: string;
  privacy: string;
  submitError: string;
  submitErrorNetwork: string;
  successStamp: string;
  successH: string;
  successP: string;
  shareText: string;
  requiredField: string;
  selectPlaceholder: string;
  noVisibleQuestions: string;
  resetSimulator: string;
  openPublicForm: string;
};

const en: UiMessages = {
  pilotBadge: "Pilot cohort · 50 seats",
  eyebrow: "HR SaaS for recruiting teams",
  heroBefore: "Stop reading 400 CVs to find ",
  heroHighlight: "the 7 that matter.",
  heroSubBefore:
    "Shortlist reads every application against ",
  heroSubStrong: "your",
  heroSubAfter:
    " criteria, ranks candidates, and explains each call — then helps with AI-assisted video interviewing so you spend your week deciding, not skimming. We're building it now, and shaping it around the people who join the pilot.",
  cta: "Shape the product — 90 seconds",
  ctaNote: "No card. No spam. Pilot invites go out by email.",
  stepsAria: "How Shortlist works",
  intakeK: "Intake",
  intakeH: "Connect your inbox or ATS",
  intakeP:
    "Applications flow in from wherever they land today — no migration, no new workflow.",
  screenK: "Screen",
  screenH: "AI reads like your best recruiter",
  screenP:
    "Every CV is scored against the criteria you set, with the reasoning written out next to it.",
  decideK: "Decide",
  decideH: "You get a shortlist, not a pile",
  decideP:
    "A ranked list with evidence per candidate. Override anything — the model learns your taste.",
  interviewK: "Interview",
  interviewH: "AI-assisted video interviewing",
  interviewP:
    "Run and evaluate candidate video interviews with AI support — so the shortlist turns into confident hire decisions faster.",
  surveyH: "Tell us where hiring hurts. We'll build the fix.",
  surveyP:
    "A short research survey for recruiting teams. Your answers decide what we build first for AI CV screening and video interviewing — and who gets a pilot seat.",
  surveyLoadError:
    "Survey temporarily unavailable — check MongoDB connection and try again.",
  shareH: "Know a recruiter buried in applications?",
  shareP:
    "Forward this to a friend or colleague — every answer sharpens what we build, and pilot seats are limited.",
  shareWa: "Share on WhatsApp",
  footer: "© 2026 Shortlist. Built in the open with our pilot cohort.",
  language: "Language",
  submit: "Request a pilot seat",
  sending: "Sending…",
  privacy:
    "We use your answers only to build Shortlist and invite you to the pilot. Never sold, never shared.",
  submitError: "Couldn't send your answers.",
  submitErrorNetwork:
    "Couldn't send your answers. Check your connection and try again.",
  successStamp: "Advanced to interview",
  successH: "You're on the list.",
  successP:
    "Thanks — your answers just shaped our roadmap. Watch your inbox for the pilot invite. Know someone drowning in CVs? Send this their way:",
  shareText:
    "I just found Shortlist — an AI tool being built to screen CVs and hand recruiters a ranked shortlist with reasons. They're taking pilot signups and shaping it around early users. Worth 90 seconds: ",
  requiredField: "This field is required",
  selectPlaceholder: "Select…",
  noVisibleQuestions: "No visible questions for this path.",
  resetSimulator: "Reset simulator",
  openPublicForm: "Open public form",
};

/** Persistent hardcoded Arabic UI copy */
const ar: UiMessages = {
  pilotBadge: "دفعة تجريبية · 50 مقعدًا",
  eyebrow: "برمجيات موارد بشرية لفرق التوظيف",
  heroBefore: "توقف عن قراءة 400 سيرة ذاتية لتجد ",
  heroHighlight: "الـ7 المهمين.",
  heroSubBefore: "Shortlist يقرأ كل طلب توظيف وفق ",
  heroSubStrong: "معاييرك",
  heroSubAfter:
    "، يرتّب المرشحين، ويشرح كل قرار — ثم يساعد في مقابلات الفيديو بمساعدة الذكاء الاصطناعي حتى تقضي أسبوعك في اتخاذ القرار لا في التصفح. نحن نبنيه الآن ونشكّله مع من ينضمون للتجربة.",
  cta: "شكّل المنتج — 90 ثانية",
  ctaNote: "بدون بطاقة. بدون رسائل مزعجة. دعوات التجربة تُرسل بالبريد.",
  stepsAria: "كيف يعمل Shortlist",
  intakeK: "الاستقبال",
  intakeH: "اربط بريدك أو نظام التوظيف",
  intakeP:
    "تتدفق الطلبات من حيث تصل اليوم — بلا ترحيل بيانات وبلا سير عمل جديد.",
  screenK: "الفرز",
  screenH: "ذكاء اصطناعي يقرأ كأفضل مسؤّل توظيف لديك",
  screenP:
    "تُقيَّم كل سيرة ذاتية وفق معاييرك، مع كتابة سبب التقييم بجانبها.",
  decideK: "القرار",
  decideH: "تحصل على قائمة مختصرة لا على كومة",
  decideP:
    "قائمة مرتّبة مع أدلة لكل مرشح. تجاوز أي قرار — والنموذج يتعلم ذوقك.",
  interviewK: "المقابلة",
  interviewH: "مقابلات فيديو بمساعدة الذكاء الاصطناعي",
  interviewP:
    "أدِر وقيم مقابلات المرشحين بالفيديو بدعم الذكاء الاصطناعي — لتحويل القائمة المختصرة إلى قرارات توظيف أسرع بثقة.",
  surveyH: "أخبرنا أين يؤلم التوظيف. سنبني الحل.",
  surveyP:
    "استبيان بحثي قصير لفرق التوظيف. إجاباتك تقرر ما نبنيه أولاً لفرز السير ومقابلات الفيديو — ومن يحصل على مقعد تجريبي.",
  surveyLoadError:
    "الاستبيان غير متاح مؤقتًا — تحقق من اتصال قاعدة البيانات وحاول مجددًا.",
  shareH: "تعرف مسؤّل توظيف غارقًا في الطلبات؟",
  shareP:
    "أرسل هذا لصديق أو زميل — كل إجابة تصقل ما نبنيه، والمقاعد محدودة.",
  shareWa: "شارك عبر واتساب",
  footer: "© 2026 Shortlist. نبنيه علنًا مع دفعتنا التجريبية.",
  language: "اللغة",
  submit: "اطلب مقعدًا تجريبيًا",
  sending: "جارٍ الإرسال…",
  privacy:
    "نستخدم إجاباتك فقط لبناء Shortlist ودعوتك للتجربة. لا نبيعها ولا نشاركها.",
  submitError: "تعذّر إرسال إجاباتك.",
  submitErrorNetwork: "تعذّر إرسال إجاباتك. تحقق من الاتصال وحاول مجددًا.",
  successStamp: "انتقلت إلى المقابلة",
  successH: "أنت على القائمة.",
  successP:
    "شكرًا — إجاباتك شكّلت خارطة طريقنا. راقب بريدك لدعوة التجربة. تعرف شخصًا غارقًا في السير؟ أرسل هذا له:",
  shareText:
    "وجدت للتو Shortlist — أداة ذكاء اصطناعي تُبنى لفرز السير وتقديم قائمة مختصرة مرتّبة مع الأسباب لمسؤولي التوظيف. يقبلون التسجيل في التجربة ويبنونها مع المستخدمين الأوائل. تستحق 90 ثانية: ",
  requiredField: "هذا الحقل مطلوب",
  selectPlaceholder: "اختر…",
  noVisibleQuestions: "لا توجد أسئلة ظاهرة لهذا المسار.",
  resetSimulator: "إعادة ضبط المحاكي",
  openPublicForm: "افتح النموذج العام",
};

/** Persistent hardcoded Tagalog UI copy */
const tl: UiMessages = {
  pilotBadge: "Pilot cohort · 50 seats",
  eyebrow: "HR SaaS para sa mga recruiting team",
  heroBefore: "Itigil ang pagbabasa ng 400 CV para mahanap ",
  heroHighlight: "ang 7 na mahalaga.",
  heroSubBefore: "Binabasa ng Shortlist ang bawat application ayon sa ",
  heroSubStrong: "iyong",
  heroSubAfter:
    " criteria, niraranggo ang mga kandidato, at ipinapaliwanag ang bawat desisyon — tapos tumutulong sa AI-assisted video interviewing para sa pagdedesisyon ang linggo mo, hindi sa pag-skim. Binubuo namin ito ngayon, at hinuhubog kasama ang mga sasali sa pilot.",
  cta: "Hubugin ang produkto — 90 segundo",
  ctaNote: "Walang card. Walang spam. Email ang pilot invites.",
  stepsAria: "Paano gumagana ang Shortlist",
  intakeK: "Intake",
  intakeH: "Ikonekta ang inbox o ATS mo",
  intakeP:
    "Dumadaloy ang applications mula sa kung saan sila bumabagsak ngayon — walang migration, walang bagong workflow.",
  screenK: "Screen",
  screenH: "Nagbabasa ang AI na parang best recruiter mo",
  screenP:
    "Bawat CV ay nisko-score ayon sa criteria mo, kasama ang nakasulat na reasoning sa tabi nito.",
  decideK: "Decide",
  decideH: "Makakakuha ka ng shortlist, hindi ng tambak",
  decideP:
    "Rangadong listahan na may ebidensya sa bawat kandidato. I-override ang kahit ano — natututo ang model sa panlasa mo.",
  interviewK: "Interview",
  interviewH: "AI-assisted video interviewing",
  interviewP:
    "Patakbuhin at suriin ang candidate video interviews sa tulong ng AI — para mas mabilis maging confident na hire decision ang shortlist.",
  surveyH: "Sabihin kung saan masakit ang hiring. Kami ang magbuo ng solusyon.",
  surveyP:
    "Maikling research survey para sa recruiting teams. Ang sagot mo ang magdedesisyon kung ano ang unang bubuuin para sa AI CV screening at video interviewing — at kung sino ang makakaupo sa pilot.",
  surveyLoadError:
    "Pansamantalang hindi available ang survey — tingnan ang MongoDB connection at subukan ulit.",
  shareH: "May kilala kang recruiter na lubog sa applications?",
  shareP:
    "I-forward ito sa kaibigan o kasamahan — bawat sagot ay nagpapatalas sa binubuo namin, at limitado ang pilot seats.",
  shareWa: "I-share sa WhatsApp",
  footer: "© 2026 Shortlist. Binubuo nang bukas kasama ang pilot cohort.",
  language: "Wika",
  submit: "Humiling ng pilot seat",
  sending: "Ipinapadala…",
  privacy:
    "Ginagamit lang ang sagot mo para buuin ang Shortlist at imbitahan ka sa pilot. Hindi ibinebenta, hindi ibinabahagi.",
  submitError: "Hindi maipadala ang mga sagot mo.",
  submitErrorNetwork:
    "Hindi maipadala ang mga sagot mo. Suriin ang connection at subukan ulit.",
  successStamp: "Advanced to interview",
  successH: "Nasa listahan ka na.",
  successP:
    "Salamat — hinubog ng sagot mo ang roadmap namin. Bantayan ang inbox para sa pilot invite. May kilala kang nalulunod sa CV? Ipadala ito sa kanya:",
  shareText:
    "Nakakita ako ng Shortlist — AI tool na binubuo para mag-screen ng CV at magbigay sa recruiters ng ranked shortlist na may reasons. Tumatanggap sila ng pilot signups at hinuhubog ito kasama ang early users. Sulit sa 90 segundo: ",
  requiredField: "Kinakailangan ang field na ito",
  selectPlaceholder: "Pumili…",
  noVisibleQuestions: "Walang nakikitang tanong para sa path na ito.",
  resetSimulator: "I-reset ang simulator",
  openPublicForm: "Buksan ang public form",
};

export const UI: Record<Locale, UiMessages> = { en, ar, tl };
