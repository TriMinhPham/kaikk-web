import type { Locale } from "@/lib/content";

/**
 * Use-case pages that answer real search intent (e.g. 中小企業 AI導入, 業務自動化,
 * 生成AI 社内活用). Content describes how KAI works and what a prospect should
 * know. It deliberately contains no client names, results, prices or guarantees:
 * KAI has no verified case studies yet.
 */
export const solutionSlugs = ["ai-adoption", "business-automation", "generative-ai"] as const;
export type SolutionSlug = (typeof solutionSlugs)[number];

type Solution = {
  navLabel: string;
  metaTitle: string;
  description: string;
  title: string;
  lead: string;
  summary: string;
  concernsTitle: string;
  concerns: string[];
  examplesTitle: string;
  examples: string[];
  stepsTitle: string;
  steps: { title: string; desc: string }[];
  deliverablesTitle: string;
  deliverables: string[];
  cautionsTitle: string;
  cautions: string[];
  faqs: { q: string; a: string }[];
  serviceType: string;
};

export const solutions: Record<Locale, Record<SolutionSlug, Solution>> = {
  ja: {
    "ai-adoption": {
      navLabel: "AI導入支援",
      metaTitle: "中小企業のAI導入支援｜小さく検証してから始める",
      description:
        "中小企業様のAI導入を、対象業務の選定から小規模な検証（PoC）、システム開発、運用まで支援します。何から始めるべきか決まっていない段階からご相談いただけます。",
      title: "中小企業のAI導入支援",
      lead: "「AIを活用したいが、何から始めればよいか分からない」。そのような段階からご相談いただけます。業務の棚卸しから始め、効果が見込める一つの業務で小さく検証し、その結果をもとに本格導入をご判断いただけるよう支援します。",
      summary: "何から始めるかを決め、一つの業務で小さく検証してから本格導入を判断。",
      concernsTitle: "このようなお悩みはありませんか",
      concerns: [
        "AIに関心はあるが、自社のどの業務に使えるのか分からない",
        "AIツールを契約したものの、社内であまり使われていない",
        "最初から大きな開発費をかけることに不安がある",
        "社内に、AIやシステムに詳しい担当者がいない",
      ],
      examplesTitle: "検討の対象になりやすい業務",
      examples: [
        "問い合わせやメールへの回答案の作成",
        "請求書・注文書などの書類からの情報の読み取り",
        "社内規程やマニュアルの検索",
        "日報・議事録・報告書の下書きや要約",
      ],
      stepsTitle: "進め方",
      steps: [
        { title: "業務の棚卸し", desc: "現在の業務の流れ、かかっている手間、お使いのツールを伺い、AIやシステム化の候補を整理します。" },
        { title: "対象業務の選定", desc: "期待できる効果、実現のしやすさ、データの状態、リスクを踏まえ、最初に取り組む業務を一つに絞ります。" },
        { title: "小規模な検証（PoC）", desc: "実際の業務データ、またはそれに近いサンプルで試作し、精度・使い勝手・運用上の課題を確認します。" },
        { title: "本格導入の判断", desc: "検証結果と費用・期間の見通しをもとに、本格導入するか、範囲を変えるか、見送るかをご判断いただけます。" },
      ],
      deliverablesTitle: "検証でお渡しするもの",
      deliverables: ["対象業務と評価基準の整理", "試作（プロトタイプ）と評価結果", "本格導入に向けた課題と、費用・期間の見通し"],
      cautionsTitle: "事前にお伝えしていること",
      cautions: [
        "AIの出力は常に正しいとは限りません。重要な判断や社外への送信には、人が確認する工程を設計します。",
        "検証の結果、AIよりも既存ツールの設定見直しや簡単な自動化の方が適している場合は、そのようにご提案します。",
        "社内データを外部のAIサービスに送信してよいかどうかは、事前に範囲を取り決めてから進めます。",
      ],
      faqs: [
        { q: "社内にIT担当者がいなくても進められますか？", a: "はい。実際に業務を担当されている方から、現在の手順や困っていることを伺えれば進められます。判断に必要な技術的な内容は、できるだけ専門用語を使わずにご説明します。" },
        { q: "検証（PoC）だけを依頼することはできますか？", a: "はい、PoC単体でのご依頼も承ります。本格導入に進むかどうかは、検証結果をご確認いただいたうえでご判断いただけます。" },
        { q: "どのような業務がAI導入に向いていますか？", a: "手順がある程度決まっていて件数が多い業務や、文章・書類を扱う業務は候補になりやすい傾向があります。実際に向いているかどうかは、業務の内容とデータを確認したうえで判断します。" },
      ],
      serviceType: "AI導入支援",
    },
    "business-automation": {
      navLabel: "業務自動化・システム連携",
      metaTitle: "業務自動化・システム連携｜転記・集計・通知の手作業を減らす",
      description:
        "複数ツールへの転記、定期的な集計、関係者への通知など、手作業でつないでいる業務を、既存のシステムやスプレッドシートを生かしながら自動化します。中小企業様向け。",
      title: "業務自動化・システム連携",
      lead: "複数のツールへの転記、毎週の集計、関係者への連絡。担当者の手作業でつないでいる業務を、既存のシステムやスプレッドシートを生かしながら自動化します。必要に応じて、AIによる書類の読み取りや分類も組み合わせます。",
      summary: "転記・集計・通知など、手作業でつないでいる業務を既存ツールを生かして自動化。",
      concernsTitle: "このようなお悩みはありませんか",
      concerns: [
        "同じ内容を、複数のシステムやExcelに何度も入力している",
        "毎週・毎月の集計やレポート作成に時間がかかっている",
        "受注や問い合わせの共有が、担当者のメールやチャットに頼っている",
        "特定の担当者しか手順を知らない業務がある",
      ],
      examplesTitle: "自動化の例",
      examples: [
        "フォームやメールの内容を、スプレッドシートやデータベースへ自動で登録",
        "定期的な集計・レポートの作成と、Slack・Chatwork・LINE等への通知",
        "書類やメールから必要な項目をAIで抽出し、担当者が確認してから登録",
        "既存の業務システムとの、APIやデータ入出力による連携",
      ],
      stepsTitle: "進め方",
      steps: [
        { title: "現状の手順を可視化", desc: "誰が、いつ、どのツールで何をしているかを整理し、自動化する範囲を決めます。" },
        { title: "連携方法の確認", desc: "各システムのAPI、データの入出力形式、アクセス権限を確認し、実現方法をご提案します。" },
        { title: "構築と動作検証", desc: "実際の運用に近い条件で動作を確認し、エラー時の通知や手動での対応手順も用意します。" },
        { title: "運用・改善", desc: "運用開始後の監視や、業務の変化に合わせた修正を支援します。" },
      ],
      deliverablesTitle: "お渡しするもの",
      deliverables: ["業務フロー図と自動化範囲の整理", "連携・自動化の仕組みと動作検証の結果", "運用手順書（エラー時の対応を含む）"],
      cautionsTitle: "事前にお伝えしていること",
      cautions: [
        "連携先のシステムがAPIやデータ出力に対応していない場合、実現方法や費用が変わります。開発前に確認します。",
        "すべてを自動化するのではなく、人が確認すべき工程は残す設計を基本としています。",
      ],
      faqs: [
        { q: "今使っているExcelやスプレッドシートは使い続けられますか？", a: "多くの場合、使い続けられます。既存のファイルや運用を生かせるかを確認し、置き換えが必要な場合はその理由をご説明します。" },
        { q: "RPAとの違いは何ですか？", a: "RPAは画面操作を記録して再現する仕組みです。KAIでは可能な限りAPIやデータ連携で仕組みを作り、画面の変更に影響されにくい構成を検討します。業務によってはRPAが適している場合もあります。" },
        { q: "自動化した後に業務の手順が変わったら、どうなりますか？", a: "運用・保守サポートとして、業務の変更に合わせた修正や改善のご相談を承ります。" },
      ],
      serviceType: "業務自動化システム開発",
    },
    "generative-ai": {
      navLabel: "生成AIの社内活用",
      metaTitle: "生成AIの社内活用支援｜社内文書検索・回答案作成・文書作成",
      description:
        "ChatGPTなどの生成AIを、個人の試用で終わらせず業務の仕組みとして使える形に。社内文書の検索（RAG）、問い合わせ回答案の作成、定型文書の下書きなどを、情報管理のルールとあわせて導入支援します。",
      title: "生成AIの社内活用支援",
      lead: "ChatGPTなどの生成AIを、個人の試用で終わらせず、業務の仕組みとして使える形にします。社内文書の検索、問い合わせへの回答案の作成、定型文書の下書きなど、目的を一つに絞って検証し、情報管理のルールとあわせて導入を支援します。",
      summary: "社内文書の検索や回答案の作成など、生成AIを情報管理のルールとあわせて業務に組み込む。",
      concernsTitle: "このようなお悩みはありませんか",
      concerns: [
        "社員が個別に生成AIを使っており、情報管理のルールが決まっていない",
        "社内規程やマニュアルが多く、必要な情報を探すのに時間がかかる",
        "問い合わせ対応やメール作成に、毎日多くの時間を取られている",
        "生成AIの回答の正確さに不安があり、業務に組み込めていない",
      ],
      examplesTitle: "活用の例",
      examples: [
        "社内規程やマニュアルを根拠として示しながら回答する、社内文書検索（RAG）",
        "問い合わせやメールへの回答案を作成し、担当者が確認して送信する仕組み",
        "議事録・報告書・提案書など、定型文書の下書き作成",
        "既存のチャットツールや業務システムからの利用",
      ],
      stepsTitle: "進め方",
      steps: [
        { title: "用途とルールの整理", desc: "どの業務で、どの情報を扱うかを決め、外部サービスに送信してよいデータの範囲を整理します。" },
        { title: "小規模な検証", desc: "対象を一つの業務と一部の文書に絞って試作し、回答の正確さや使い勝手を評価します。" },
        { title: "社内向けの導入", desc: "利用者の権限、利用記録、確認の手順を設計し、既存のツールから使える形にします。" },
        { title: "定着と改善", desc: "利用状況や回答の誤りを確認し、文書や設定を改善します。" },
      ],
      deliverablesTitle: "お渡しするもの",
      deliverables: ["利用目的とデータ取り扱いの整理", "試作と評価結果（回答の正確さ・課題）", "社内利用の手順と運用ルールの案"],
      cautionsTitle: "事前にお伝えしていること",
      cautions: [
        "生成AIは、誤った内容をもっともらしく出力することがあります。根拠となる文書の提示や、人による確認を前提に設計します。",
        "個人情報や機密情報を扱う場合は、利用するAIサービスの規約やデータの保存先を確認したうえで進めます。",
      ],
      faqs: [
        { q: "社員にChatGPTを使わせるだけでは不十分ですか？", a: "個人の作業効率を上げることが目的であれば、まずはそれで十分な場合もあります。社内文書を根拠に回答させたい、業務の手順に組み込みたい、利用状況を管理したいといった場合に、仕組みとしての導入が役立ちます。" },
        { q: "社内文書をAIに学習させる必要がありますか？", a: "多くの場合、AIそのものに学習させるのではなく、質問に関連する文書を検索してAIに渡す方式（RAG）で実現します。文書を更新すれば、回答にも反映しやすい方式です。" },
        { q: "どのAIサービスを使いますか？", a: "特定のサービスを前提にはしていません。データの取り扱い、費用、精度、既存環境との相性を比較したうえでご提案します。" },
      ],
      serviceType: "生成AI活用支援",
    },
  },
  en: {
    "ai-adoption": {
      navLabel: "AI adoption",
      metaTitle: "AI Adoption Support for SMEs in Japan: Start Small",
      description:
        "KAI Inc. helps Japanese small and medium-sized businesses adopt AI: choosing the right workflow, running a focused proof of concept, then building and supporting the system. Talk to us before your requirements are defined.",
      title: "AI adoption support for SMEs",
      lead: "“We want to use AI, but we don’t know where to start.” That is a good place to talk to us. We review your workflows, test AI on one promising task, and give you the evidence to decide whether a full rollout is worth it.",
      summary: "Decide where to start, test one workflow, then decide on a full rollout.",
      concernsTitle: "Sound familiar?",
      concerns: [
        "You are interested in AI but unsure which parts of your business it fits",
        "You subscribed to AI tools, but your team rarely uses them",
        "You are wary of committing a large development budget up front",
        "Nobody in-house specialises in AI or systems",
      ],
      examplesTitle: "Workflows that are often good candidates",
      examples: [
        "Drafting replies to inquiries and emails",
        "Reading information from invoices, orders and other documents",
        "Searching internal policies and manuals",
        "Drafting or summarising daily reports, minutes and reports",
      ],
      stepsTitle: "How we work",
      steps: [
        { title: "Review your workflows", desc: "We learn how work flows today, where time goes and which tools you use, then list candidates for AI or automation." },
        { title: "Choose one target", desc: "Weighing expected value, feasibility, data readiness and risk, we narrow the first project to a single workflow." },
        { title: "Proof of concept", desc: "We build a prototype on real (or realistic sample) data and evaluate accuracy, usability and operational issues." },
        { title: "Decide what’s next", desc: "With the results and a view of cost and timing, you decide whether to roll out, rescope or stop." },
      ],
      deliverablesTitle: "What you receive from a PoC",
      deliverables: ["Defined target workflow and evaluation criteria", "Working prototype and evaluation results", "Open issues, plus a view of cost and timing for rollout"],
      cautionsTitle: "What we tell every client up front",
      cautions: [
        "AI output is not always correct. We design human review into important decisions and anything sent outside your company.",
        "If simpler automation or better use of your existing tools is the right answer, we will say so.",
        "We agree in advance which data, if any, may be sent to external AI services.",
      ],
      faqs: [
        { q: "Can we do this without an in-house IT team?", a: "Yes. We need the people who do the work to walk us through it. We explain technical trade-offs in plain language." },
        { q: "Can we commission only a proof of concept?", a: "Yes. A standalone PoC is available, and you decide whether to proceed after reviewing the results." },
        { q: "Which tasks suit AI?", a: "High-volume tasks with fairly fixed steps, and tasks involving text and documents, are often good candidates. We confirm fit only after reviewing the actual workflow and data." },
      ],
      serviceType: "AI adoption consulting",
    },
    "business-automation": {
      navLabel: "Business automation",
      metaTitle: "Business Automation and System Integration for SMEs",
      description:
        "Automate copy-and-paste data entry, recurring reports and notifications while keeping your existing systems and spreadsheets. Business automation and integration for SMEs in Japan by KAI Inc., Tokyo.",
      title: "Business automation and integration",
      lead: "Re-keying data between tools, compiling weekly reports, chasing colleagues with updates. We automate the work your team does by hand to connect systems — keeping the systems and spreadsheets you already use, and adding AI for reading or classifying documents where it helps.",
      summary: "Automate data entry, reporting and notifications while keeping your existing tools.",
      concernsTitle: "Sound familiar?",
      concerns: [
        "The same data is entered into several systems or spreadsheets",
        "Weekly and monthly reporting takes hours",
        "Orders and inquiries are shared through individual email and chat",
        "Only one person knows how certain tasks are done",
      ],
      examplesTitle: "Automation examples",
      examples: [
        "Registering form and email submissions in a spreadsheet or database",
        "Scheduled reports with notifications to Slack, Chatwork, LINE and similar tools",
        "Extracting fields from documents or emails with AI, confirmed by staff before saving",
        "Integrating existing business systems via APIs or data import/export",
      ],
      stepsTitle: "How we work",
      steps: [
        { title: "Map the current process", desc: "Who does what, when and in which tool — then agree what to automate." },
        { title: "Check integration options", desc: "We review APIs, data formats and access permissions for each system and propose an approach." },
        { title: "Build and verify", desc: "We test under realistic conditions and prepare error alerts and manual fallback procedures." },
        { title: "Operate and improve", desc: "We monitor after launch and adjust as your process changes." },
      ],
      deliverablesTitle: "What you receive",
      deliverables: ["Process map and agreed automation scope", "Working integration with verification results", "Operating guide, including error handling"],
      cautionsTitle: "What we tell every client up front",
      cautions: [
        "If a system lacks an API or data export, the approach and cost change. We check before development starts.",
        "We do not automate everything: steps that need human judgement stay with people.",
      ],
      faqs: [
        { q: "Can we keep using our Excel files and spreadsheets?", a: "Usually, yes. We check whether your current files and routines can stay, and explain why if something needs replacing." },
        { q: "How is this different from RPA?", a: "RPA records and replays screen operations. Where possible we integrate through APIs and data so that screen changes are less likely to break things. For some tasks, RPA is the right choice." },
        { q: "What if our process changes after automation?", a: "Changes and improvements can be handled as part of our operations and maintenance support." },
      ],
      serviceType: "Business process automation",
    },
    "generative-ai": {
      navLabel: "Generative AI at work",
      metaTitle: "Generative AI for Internal Use: Search and Drafting",
      description:
        "Turn ChatGPT-style generative AI from individual experiments into a managed business tool: internal document search (RAG), drafted replies and document drafting, introduced with clear data-handling rules. KAI Inc., Tokyo.",
      title: "Generative AI for internal use",
      lead: "We help you move generative AI such as ChatGPT beyond individual experiments into a tool your business can rely on. Pick one purpose — internal document search, drafting replies or routine documents — test it, and roll it out with clear rules for handling information.",
      summary: "Put generative AI to work on search and drafting, with clear data-handling rules.",
      concernsTitle: "Sound familiar?",
      concerns: [
        "Staff use generative AI individually, with no rules on information handling",
        "Finding the right policy or manual takes too long",
        "Inquiries and email drafting take up hours every day",
        "Concerns about accuracy keep AI out of real workflows",
      ],
      examplesTitle: "Use cases",
      examples: [
        "Internal document search (RAG) that cites the policy or manual behind each answer",
        "Drafted replies to inquiries and emails, reviewed and sent by staff",
        "First drafts of minutes, reports and proposals",
        "Access from the chat tools and business systems you already use",
      ],
      stepsTitle: "How we work",
      steps: [
        { title: "Agree purpose and rules", desc: "Decide which workflow and information are in scope, and which data may be sent to external services." },
        { title: "Small-scale test", desc: "Prototype on one workflow and a subset of documents, then evaluate accuracy and usability." },
        { title: "Internal rollout", desc: "Design permissions, usage logs and review steps, and make it available from your existing tools." },
        { title: "Adopt and improve", desc: "Review usage and incorrect answers, then improve documents and configuration." },
      ],
      deliverablesTitle: "What you receive",
      deliverables: ["Defined purpose and data-handling scope", "Prototype with evaluation results (accuracy and issues)", "Draft usage procedures and operating rules"],
      cautionsTitle: "What we tell every client up front",
      cautions: [
        "Generative AI can produce wrong answers that sound convincing. We design around cited sources and human review.",
        "Where personal or confidential data is involved, we check the AI service’s terms and data storage before proceeding.",
      ],
      faqs: [
        { q: "Isn’t giving staff ChatGPT enough?", a: "For personal productivity, it may be. A managed setup helps when answers must be grounded in your documents, built into a workflow, or monitored." },
        { q: "Do we need to train the AI on our documents?", a: "Usually not. Most setups retrieve relevant documents and pass them to the model at question time (RAG), so updating a document updates the answers." },
        { q: "Which AI service do you use?", a: "We don’t assume one. We compare data handling, cost, accuracy and fit with your environment before recommending a service." },
      ],
      serviceType: "Generative AI implementation",
    },
  },
};
