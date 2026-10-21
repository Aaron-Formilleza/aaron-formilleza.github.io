let language = "en";
try {
  if (localStorage.getItem("archive-language") === "ja") language = "ja";
} catch { /* Language switching also works without browser storage. */ }

const JAPANESE = {
  CLIENT: "クライアント", PROJECT: "作品名", LINK: "リンク", ROLE: "役割",
  PERIOD: "制作期間", RESPONSIBILITIES: "担当業務", SOFTWARE: "使用ソフト",
  "WATCH FILM ↗": "映像を見る ↗", "VIEW PROJECT ↗": "作品を見る ↗",
  "WORK IN PROGRESS": "制作過程", "Work in progress": "制作過程",
  "Animation Supervisor": "アニメーションスーパーバイザー",
  "Designer/Compositor": "デザイナー／コンポジター",
  "Designer / Compositor": "デザイナー／コンポジター",
  Animator: "アニメーター", Director: "ディレクター", Illustrator: "イラストレーター",
  "Preproduction Lead": "プリプロダクションリード",
  "Animation / Technical Production": "アニメーション／テクニカル制作",
  "Previs Artist": "プリビズアーティスト", "Camera / Lighting": "カメラ／ライティング",
  "Background / Food Design": "背景美術／フードデザイン",
  "Visual Development": "ビジュアル開発", Planning: "企画",
  "Character Design": "キャラクターデザイン", "Key Animation": "原画",
  "Coordination & Support": "制作調整・サポート", "Scheduling & Tracking": "スケジュール管理・進行確認",
  "Review & Feedback": "レビュー・フィードバック", "Logo Design": "ロゴデザイン",
  "Cut Design": "カットデザイン", "Background Art": "背景美術", Compositing: "コンポジット",
  Storyboard: "絵コンテ", Storyboarding: "絵コンテ", "Art Direction": "アートディレクション",
  "Character Animation": "キャラクターアニメーション",
  "On-site Projection Setup": "現地でのプロジェクション設営", "Technical support": "技術サポート",
  Direction: "演出", Animation: "アニメーション", "Motion Graphics": "モーショングラフィックス",
  "3D Previsualization": "3Dプリビズ", Camerawork: "カメラワーク", "Scene Composition": "画面構成",
  Lighting: "ライティング", "Scene Layout": "シーンレイアウト", "Client Pitch": "クライアントへの企画提案",
  "Production Systems": "制作体制の構築", "2D Character Animation": "2Dキャラクターアニメーション",
  "2D Effect Animation": "2Dエフェクトアニメーション", "Asset Design": "アセットデザイン",
  "3D Layout": "3Dレイアウト", "Lighting  & Rendering": "ライティング・レンダリング",
  "Food Design": "フードデザイン", "Animation Support": "アニメーション制作サポート",
  "Animation Production": "アニメーション制作", "Jacket Design": "ジャケットデザイン",
  "Overall Production Management": "制作全体の管理", "Motion Design": "モーションデザイン",
  "Effects Animation": "エフェクトアニメーション", "Freelance Illustrator": "フリーランスイラストレーター",
  "2016-present": "2016年〜現在", "2016 – Present": "2016年〜現在",
  "Enter archive": "作品一覧へ", "Aaron — enter archive": "Aaron — 作品一覧へ",
  "Formilleza — enter archive": "Formilleza — 作品一覧へ", "Return to introduction": "イントロへ戻る",
};

function translate(text) {
  return language === "ja" ? (JAPANESE[text] || text) : text;
}

function japanesePeriod(period) {
  if (period === "2016 – Present") return "2016年〜現在";
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const match = period.match(/^(\w+)(?: (\d{4}))? – (\w+) (\d{4})$/);
  if (!match) return period;
  const [, start, startYear, end, endYear] = match;
  return `${startYear || endYear}年${months.indexOf(start) + 1}月〜${startYear && startYear !== endYear ? endYear + "年" : ""}${months.indexOf(end) + 1}月`;
}

function localizedProject(project) {
  if (language === "en") return project;
  return { ...project, role: translate(project.role), period: japanesePeriod(project.period),
    date: translate(project.date), responsibilities: project.responsibilities.map(translate) };
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = language === "ja" ? "アーロン・フォーミレザ — アニメーション・アートディレクション" : "Aaron Formilleza — Animation Director & Art Direction";
  const bio = document.querySelector(".bio-description");
  if (!bio.dataset.english) bio.dataset.english = bio.innerHTML;
  bio.innerHTML = language === "ja"
    ? "アーロン・フォーミレザ / Aaron Formilleza<br>1994年リヤド生まれ。東京を拠点に、さまざまなデジタルメディアを横断して活動するアニメーションディレクター。"
    : bio.dataset.english;
  document.querySelector(".contact-heading").textContent = language === "ja" ? "制作のご依頼・お問い合わせ" : "NEW PROJECTS & INQUIRIES";
  document.querySelector(".intro-discipline span").textContent = language === "ja" ? "アート・ディレクション" : "Art, Direction";
  document.querySelector(".copyright-copy").innerHTML = language === "ja" ? "2026 © Aaron Formilleza<br>無断転載・複製を禁じます。" : "2026 © Aaron Formilleza<br>All rights reserved.";
  document.getElementById("index-nav").setAttribute("aria-label", language === "ja" ? "作品一覧" : "Project archive");
  document.querySelector(".intro-window").setAttribute("aria-label", translate("Enter archive"));
  document.getElementById("intro").setAttribute("aria-label", language === "ja" ? "イントロ" : "Introduction");
  setNameLabels();
  document.querySelectorAll("[data-language]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
}

let languageTextAnimations = [];

function revealLanguageText() {
  languageTextAnimations.forEach(animation => animation.cancel());
  languageTextAnimations = [];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const textBlocks = document.querySelectorAll(
    ".artist-bio, .index-nav, .project-heading, .project-metadata, .wip-label, .copyright-copy, .intro-discipline span, .archive-clock"
  );
  languageTextAnimations = [...textBlocks].map(element => element.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 300, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
  ));
}

function setupLanguageSwitch() {
  applyLanguage();
  document.querySelectorAll("[data-language]").forEach(button => {
    button.addEventListener("click", () => {
      if (changing || button.dataset.language === language) return;
      language = button.dataset.language;
      try { localStorage.setItem("archive-language", language); } catch { /* Optional persistence. */ }
      applyLanguage();
      clearSampleHighlight();
      buildIndex();
      insertInitialProject(activeIndex);
      updateViewerTime();
      revealLanguageText();
    });
  });
}
