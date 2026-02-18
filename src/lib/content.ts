export type Locale = "ja" | "en";

export const content = {
  ja: {
    nav: {
      home: "ホーム",
      services: "事業内容",
      process: "導入の流れ",
      company: "会社概要",
      contact: "お問い合わせ",
    },
    hero: {
      badge: "東京発のAI・IT開発会社",
      headline: "業務に最適化された\nAI・ITシステム開発",
      subtitle:
        "株式会社KAIは、中小企業様向けにAI導入支援・業務自動化システムの設計から構築まで、段階的な導入を支援いたします。",
      cta1: "サービスを見る",
      cta2: "お問い合わせ",
    },
    servicesOverview: {
      title: "KAIにできること",
      items: [
        {
          icon: "search",
          title: "AI導入支援（PoC）",
          desc: "小規模な試験導入により、AI活用の効果を検証します。",
        },
        {
          icon: "code",
          title: "業務特化型AIシステム開発",
          desc: "既存業務の効率化を目的としたAI自動化システムを構築します。",
        },
        {
          icon: "shield",
          title: "運用・保守サポート",
          desc: "導入後の安定運用および継続的な改善を支援します。",
        },
        {
          icon: "globe",
          title: "Webシステム開発",
          desc: "コーポレートサイトおよび業務用Webアプリケーションの開発。",
        },
      ],
    },
    strengths: {
      title: "株式会社KAIの特徴",
      items: [
        "業務内容に応じた個別設計",
        "既存システムとの連携対応",
        "法人格による正式契約・NDA対応",
        "補助金活用のご相談対応",
        "英語対応可能",
      ],
    },
    process: {
      title: "導入の流れ",
      steps: [
        {
          num: "1",
          label: "お問い合わせ",
          desc: "まずはお気軽にご連絡ください。ご要望やお悩みをお聞かせいただきます。",
        },
        {
          num: "2",
          label: "ヒアリング",
          desc: "業務内容や課題を詳しくヒアリングし、最適なソリューションを検討します。",
        },
        {
          num: "3",
          label: "要件整理・お見積り",
          desc: "ヒアリング内容をもとに要件を整理し、正式なお見積りを提示いたします。",
        },
        {
          num: "4",
          label: "PoC（必要に応じて）",
          desc: "必要に応じてプロトタイプを構築し、効果を検証いたします。",
        },
        {
          num: "5",
          label: "本格開発",
          desc: "要件に基づき、システムの設計・開発を進めます。",
        },
        {
          num: "6",
          label: "納品・運用開始",
          desc: "テスト完了後に納品し、安定した運用をサポートいたします。",
        },
      ],
    },
    cta: {
      headline: "AIで業務を変革し、\nビジネスの可能性を広げましょう。",
      button: "お問い合わせ",
    },
    services: {
      title: "事業内容",
      sections: [
        {
          title: "AI導入支援（PoC）",
          desc: "業務ヒアリングを行い、AI活用の可能性を検証します。小規模なプロトタイプを構築し、効果を確認した上で本格導入をご検討いただけます。",
        },
        {
          title: "業務特化型AIシステム開発",
          desc: "企業の業務内容に合わせたAI自動化システムを設計・構築します。",
          items: [
            "API連携（Slack、Chatwork、LINE等）",
            "データ処理自動化",
            "業務フロー統合",
            "既存システムとの連携",
          ],
        },
        {
          title: "運用・保守サポート",
          desc: "導入後の安定運用を支援します。",
          items: ["システム監視", "軽微な修正対応", "定期改善提案"],
        },
        {
          title: "Webシステム開発",
          desc: "",
          items: [
            "コーポレートサイト制作",
            "業務用Webアプリケーション開発",
            "データベース設計",
            "クラウド環境構築",
          ],
        },
      ],
      note: "※費用については、要件定義後に正式なお見積りを提示いたします。詳細な料金表をご希望の場合はお問い合わせください。",
    },
    company: {
      title: "会社概要",
      rows: [
        { label: "会社名", value: "株式会社KAI" },
        { label: "英文名", value: "KAI Inc." },
        {
          label: "所在地",
          value:
            "〒100-0006\n東京都千代田区有楽町一丁目5番2号\n東宝日比谷プロムナードビル11階",
        },
        { label: "設立", value: "2026年" },
        { label: "資本金", value: "500万円" },
        { label: "代表取締役", value: "PHAM MINH TRI（ファム ミン チー）" },
        {
          label: "事業内容",
          value:
            "AIシステム開発、業務自動化システム開発、Webシステム開発",
        },
      ],
    },
    contact: {
      title: "お問い合わせ",
      subtitle: "まずはお気軽にご相談ください。通常2営業日以内にご返信いたします。",
      fields: {
        companyName: "会社名",
        contactPerson: "ご担当者名",
        email: "メールアドレス",
        message: "お問い合わせ内容",
      },
      submit: "送信する",
      note: "通常2営業日以内にご返信いたします。",
    },
    footer: {
      companyName: "株式会社KAI",
      address:
        "〒100-0006\n東京都千代田区有楽町一丁目5番2号\n東宝日比谷プロムナードビル11階",
      representative: "代表取締役：PHAM MINH TRI",
      capital: "資本金：500万円",
      email: "info@kaikk.co.jp",
      copyright: "© 2026 KAI Inc.",
    },
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      process: "Process",
      company: "Company",
      contact: "Contact",
    },
    hero: {
      badge: "Tokyo-based AI & IT Development",
      headline: "AI & IT Systems\nBuilt for Your Business",
      subtitle:
        "KAI Inc. provides AI implementation and business automation services for SMEs — from Proof of Concept to full deployment.",
      cta1: "View Services",
      cta2: "Contact Us",
    },
    servicesOverview: {
      title: "What KAI Does",
      items: [
        {
          icon: "search",
          title: "AI Introduction (PoC)",
          desc: "Pilot implementation to validate AI applicability.",
        },
        {
          icon: "code",
          title: "Custom AI Systems",
          desc: "Business-specific automation and AI system development.",
        },
        {
          icon: "shield",
          title: "Operations & Maintenance",
          desc: "Ongoing monitoring and system optimization.",
        },
        {
          icon: "globe",
          title: "Web Development",
          desc: "Corporate websites and business web applications.",
        },
      ],
    },
    strengths: {
      title: "Why KAI Inc.",
      items: [
        "Custom design tailored to your business",
        "Integration with existing systems",
        "Formal contracts and NDA through corporate entity",
        "Government subsidy consultation support",
        "English support available",
      ],
    },
    process: {
      title: "Project Flow",
      steps: [
        {
          num: "1",
          label: "Inquiry",
          desc: "Reach out to us with your requirements and challenges.",
        },
        {
          num: "2",
          label: "Requirement Discussion",
          desc: "We conduct a detailed assessment of your business processes and needs.",
        },
        {
          num: "3",
          label: "Proposal & Quotation",
          desc: "We compile requirements and provide a formal proposal with pricing.",
        },
        {
          num: "4",
          label: "PoC (If Required)",
          desc: "We build a prototype to validate the approach before full investment.",
        },
        {
          num: "5",
          label: "Full Development",
          desc: "We design and build the complete system based on agreed requirements.",
        },
        {
          num: "6",
          label: "Delivery & Operation",
          desc: "After thorough testing, we deploy and provide ongoing support.",
        },
      ],
    },
    cta: {
      headline:
        "Transform your business with AI\nand unlock new possibilities.",
      button: "Contact Us",
    },
    services: {
      title: "Services",
      sections: [
        {
          title: "AI Introduction (PoC)",
          desc: "Initial assessment and prototype development to validate AI use cases before full implementation.",
        },
        {
          title: "Custom AI System Development",
          desc: "Design and development of business-specific automation systems.",
          items: [
            "API integrations",
            "Workflow automation",
            "System integration",
          ],
        },
        {
          title: "Operations & Maintenance",
          desc: "Post-deployment monitoring and system improvements.",
        },
        {
          title: "Web Systems",
          desc: "Corporate websites and business web applications.",
        },
      ],
      note: "Formal quotations are provided after requirement definition.",
    },
    company: {
      title: "Company Profile",
      rows: [
        { label: "Company Name", value: "KAI Inc." },
        {
          label: "Registered Address",
          value:
            "Toho Hibiya Promenade Building 11F\n1-5-2 Yurakucho, Chiyoda-ku\nTokyo 100-0006, Japan",
        },
        { label: "Established", value: "2026" },
        { label: "Capital", value: "JPY 5,000,000" },
        { label: "Representative Director", value: "PHAM MINH TRI" },
        {
          label: "Business Activities",
          value:
            "AI systems development, business automation systems, web systems development",
        },
      ],
    },
    contact: {
      title: "Contact",
      subtitle: "Get in touch with us. We typically respond within two business days.",
      fields: {
        companyName: "Company Name",
        contactPerson: "Contact Person",
        email: "Email Address",
        message: "Message",
      },
      submit: "Submit",
      note: "We typically respond within two business days.",
    },
    footer: {
      companyName: "KAI Inc.",
      address:
        "Toho Hibiya Promenade Building 11F\n1-5-2 Yurakucho, Chiyoda-ku\nTokyo 100-0006, Japan",
      representative: "Representative Director: PHAM MINH TRI",
      capital: "Capital: JPY 5,000,000",
      email: "info@kaikk.co.jp",
      copyright: "© 2026 KAI Inc.",
    },
  },
} as const;
