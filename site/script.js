const indexNav = document.getElementById("index-nav");
const indexIndicator = document.getElementById("index-indicator");
const activeProjectContainer = document.getElementById("active-project");
const projectColumn = document.getElementById("project-column");
const intro = document.getElementById("intro");
const introCopy = document.getElementById("intro-copy");
const siteShell = document.getElementById("site-shell");
const homeLink = document.getElementById("home-link");
const viewerTime = document.getElementById("viewer-time");

let activeIndex = 0;
let requestedIndex = 0;
let changing = false;
let introOpen = true;
let wheelAccumulator = 0;
let wheelResetTimer = null;
let wheelLock = false;
let touchStartY = null;
let slideshowTimer = null;

const SWITCH_DURATION = 700;
const INTRO_DURATION = 850;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let introTransitionTimer;
const SLIDESHOW_INTERVAL = 3200;

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createTextList(items) {
  return (items || []).map(escapeHTML).join("<br>");
}

function linkLabel(url) {
  if (/youtu(be\.com|\.be)|vimeo\.com/i.test(url)) return translate("WATCH FILM ↗");
  return translate("VIEW PROJECT ↗");
}

function slideshowFigure(project, images, extraClass = "") {
  if (!images.length) return "";
  return (
    '<figure class="project-hero hero-slideshow ' +
    extraClass +
    '">' +
    images
      .map(
        (path, index) =>
          '<img class="hero-slide' +
          (index === 0 ? " is-active" : "") +
          '" src="' +
          escapeHTML(path) +
          '" alt="' +
          escapeHTML(project.title) +
          (language === "ja" ? " 画像 " : " image ") +
          (index + 1) +
          '" loading="eager">',
      )
      .join("") +
    "</figure>"
  );
}

function stillFigure(path, project, extraClass = "") {
  return (
    '<figure class="project-sample ' +
    extraClass +
    '"><img src="' +
    escapeHTML(path) +
    '" alt="' +
    escapeHTML(project.title) +
    '" loading="eager"></figure>'
  );
}

function projectMedia(project) {
  const images = project.images || [];
  if (project.id === "001") {
    return (
      '<div class="project-media media-standard media-curated">' +
      stillFigure(images[0], project) +
      '<div class="project-gallery" style="--sample-count:6">' +
      images
        .slice(1)
        .map((path) => stillFigure(path, project))
        .join("") +
      "</div></div>"
    );
  }
  if (project.id === "003")
    return (
      '<div class="project-media media-lotte-feature">' +
      stillFigure(images[0], project) +
      '<div class="project-gallery" style="--sample-count:2">' +
      images
        .slice(1, 3)
        .map((path) => stillFigure(path, project))
        .join("") +
      "</div></div>"
    );
  if (project.id === "007")
    return (
      '<div class="project-media media-wide-stack media-curated">' +
      slideshowFigure(project, images) +
      '<div class="project-gallery">' +
      images
        .slice(1)
        .map((path) => stillFigure(path, project))
        .join("") +
      "</div></div>"
    );
  if (project.id === "010")
    return (
      '<div class="project-media media-bookshelf"><div class="media-grid" style="--portrait-count:' +
      images.length +
      '">' +
      images.map((path) => stillFigure(path, project)).join("") +
      "</div></div>"
    );
  if (project.id === "011")
    return (
      '<div class="project-media media-portrait-hero media-curated">' +
      stillFigure(images[0], project) +
      '<div class="project-gallery" style="--sample-count:' +
      (images.length - 1) +
      '">' +
      images
        .slice(1)
        .map((path) => stillFigure(path, project))
        .join("") +
      "</div></div>"
    );
  if (project.id === "013")
    return (
      '<div class="project-media media-standard media-curated">' +
      slideshowFigure(project, images) +
      '<div class="project-gallery" style="--sample-count:' +
      (images.length - 1) +
      '">' +
      images
        .slice(1)
        .map((path) => stillFigure(path, project))
        .join("") +
      "</div></div>"
    );
  if (project.id === "005")
    return (
      '<div class="project-media media-single">' +
      stillFigure("images/005/004.png", project) +
      "</div>"
    );
  if (project.id === "012")
    return (
      '<div class="project-media media-mixed"><div class="media-grid">' +
      stillFigure(images[3], project, "instagram-portrait") +
      slideshowFigure(
        project,
        [images[2], images[6], images[7], images[8]],
        "instagram-wide",
      ) +
      slideshowFigure(project, [images[0], images[1]], "instagram-square-a") +
      slideshowFigure(project, [images[4], images[5]], "instagram-square-b") +
      "</div></div>"
    );
  if (project.id === "014")
    return (
      '<div class="project-media media-square-feature media-curated"><div class="media-grid">' +
      [0, 1, 2, 3, 5, 6]
        .map((i, index) =>
          stillFigure(images[i], project, index === 0 ? "square-lead" : ""),
        )
        .join("") +
      "</div></div>"
    );
  if (project.id === "023")
    return (
      '<div class="project-media media-standard media-curated media-wip">' +
      stillFigure(images[0], project) +
      '<div class="project-gallery" style="--sample-count:4" aria-label="' + translate("Work in progress") + '"><span class="wip-label">' + translate("WORK IN PROGRESS") + '</span>' +
      images
        .slice(1)
        .map((path) => stillFigure(path, project))
        .join("") +
      "</div></div>"
    );
  if (project.id === "021")
    return (
      '<div class="project-media media-square-spread">' +
      slideshowFigure(project, images, "square-lead") +
      '<div class="project-gallery" style="--sample-count:2">' +
      images
        .slice(1)
        .map((path) => stillFigure(path, project))
        .join("") +
      "</div></div>"
    );
  if (project.id === "019")
    return (
      '<div class="project-media media-digicon">' +
      stillFigure(images[0], project) +
      "</div>"
    );
  const samples = images.slice(1, 4);
  return (
    '<div class="project-media media-standard' +
    (!samples.length ? " media-no-samples" : "") +
    '">' +
    slideshowFigure(
      project,
      images,
      project.id === "021" ? "square-first" : "",
    ) +
    (samples.length
      ? '<div class="project-gallery" style="--sample-count:' +
        samples.length +
        '">' +
        samples.map((path) => stillFigure(path, project)).join("") +
        "</div>"
      : "") +
    "</div>"
  );
}

function projectDetails(project) {
  const parts = project.title.split(/\s*\/\s*/);
  const parsedClient = parts.shift();
  const client = project.client || parsedClient;
  const title = project.projectTitle || parts.join(" / ") || project.title;
  const formatDetail = (label, value) =>
    project.id === "001" && label === "PROJECT"
      ? escapeHTML(value).replace(" Marionette", "<br>Marionette")
      : escapeHTML(value);
  const period = project.period;
  const rows = [
    ["CLIENT", client],
    ["PROJECT", title],
  ];

  const link = project.links?.[0];
  return (
    '<div class="project-metadata"><dl class="detail-basics">' +
    rows
      .map(
        ([label, value]) =>
          "<dt>" + translate(label) + "</dt><dd>" + formatDetail(label, value) + "</dd>",
      )
      .join("") +
    (link
      ? '<dt class="detail-link-label">' + translate("LINK") + '</dt><dd><a class="project-link" href="' +
        escapeHTML(link) +
        '" target="_blank" rel="noopener noreferrer">' +
        linkLabel(link) +
        "</a></dd>"
      : "") +
    '</dl><dl class="detail-role-period"><dt>' + translate("ROLE") + '</dt><dd>' +
    escapeHTML(project.role) +
    "</dd><dt>" + translate("PERIOD") + "</dt><dd>" +
    escapeHTML(period) +
    '</dd></dl><dl class="detail-responsibilities"><dt>' + translate("RESPONSIBILITIES") + '</dt><dd>' +
    createTextList(project.responsibilities) +
    '</dd></dl><dl class="detail-software"><dt>' + translate("SOFTWARE") + '</dt><dd>' +
    createTextList(project.software) +
    "</dd></dl></div>"
  );
}

function buildIndex() {
  indexNav.innerHTML = PROJECTS.map(
    (project, index) => `
    <a class="index-item" href="#${escapeHTML(project.id)}" data-index="${index}">
      <span>${escapeHTML(project.id)}</span>
      <span class="index-title">${escapeHTML(project.client || project.title.split(/\s*\/\s*/)[0])}</span>
      <span class="index-date">${escapeHTML(translate(project.date))}</span>
    </a>
  `,
  ).join("");
}

function projectMarkup(project, classes = "") {
  project = localizedProject(project);
  const client = project.client || project.title.split(/\s*\/\s*/)[0];
  return `<article class="project-view project-card ${classes}" data-project-id="${escapeHTML(project.id)}"><header class="project-heading"><div class="project-number">${escapeHTML(project.id)}</div><div class="project-client">${escapeHTML(client)}</div></header><div class="project-content">${projectMedia(project)}${projectDetails(project)}</div></article>`;
}
function revealLoadedImages(view) {
  view?.querySelectorAll(".project-media figure").forEach((figure) => {
    figure.classList.add("image-loading");
    const images = [...figure.querySelectorAll("img")];
    const reveal = () => {
      if (!images.some((image) => image.complete && image.naturalWidth)) return;
      requestAnimationFrame(() => {
        figure.classList.add("image-loaded");
        fitProjectMedia();
      });
    };
    images.forEach((image) =>
      image.addEventListener("load", reveal, { once: true }),
    );
    reveal();
  });
}

function startHeroSlideshow(view) {
  clearInterval(slideshowTimer);
  slideshowTimer = null;
  const groups = [...(view?.querySelectorAll(".hero-slideshow") || [])]
    .map((hero) => ({
      hero,
      slides: [...hero.querySelectorAll(".hero-slide")],
      current: 0,
    }))
    .filter((group) => group.slides.length > 1);
  groups.forEach((group) =>
    group.slides.forEach((slide, index) =>
      slide.classList.toggle("is-active", index === 0),
    ),
  );
  if (!groups.length || reducedMotion.matches) return;
  slideshowTimer = window.setInterval(() => {
    if (introOpen || document.hidden) return;
    groups.forEach((group) => {
      if (group.hero.classList.contains("sample-highlighted")) return;
      group.slides[group.current].classList.remove("is-active");
      group.current = (group.current + 1) % group.slides.length;
      group.slides[group.current].classList.add("is-active");
    });
  }, SLIDESHOW_INTERVAL);
}

function moveIndexIndicator(index, animate = true) {
  const items = [...document.querySelectorAll(".index-item")];
  const item = items[index];
  items.forEach((entry, itemIndex) => {
    entry.classList.toggle(
      "pending",
      itemIndex === index && index !== activeIndex,
    );
    entry.classList.toggle("active", itemIndex === activeIndex);
  });
  if (!item) {
    indexIndicator.style.opacity = "0";
    return;
  }
  const navRect = indexNav.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const offset = itemRect.top - navRect.top;
  indexIndicator.style.transitionDuration = animate ? "300ms" : "0ms";
  indexIndicator.style.height = `${itemRect.height}px`;
  indexIndicator.style.transform = `translateY(${offset}px)`;
  indexIndicator.style.opacity = "1";
}

function commitIndexState(index) {
  activeIndex = index;
  requestedIndex = index;
  document.querySelectorAll(".index-item").forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
    item.classList.remove("pending");
  });
}

function insertInitialProject(index) {
  activeIndex = Math.max(0, Math.min(index, PROJECTS.length - 1));
  requestedIndex = activeIndex;
  activeProjectContainer.innerHTML = projectMarkup(
    PROJECTS[activeIndex],
    "is-incoming",
  );
  revealLoadedImages(activeProjectContainer.querySelector(".project-view"));
  commitIndexState(activeIndex);
  moveIndexIndicator(activeIndex, false);
  history.replaceState(null, "", `#${PROJECTS[activeIndex].id}`);
  startHeroSlideshow(activeProjectContainer.querySelector(".project-view"));
  requestAnimationFrame(fitProjectMedia);
}

function changeProject(index, directionHint = null) {
  index = ((index % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;
  if (changing || index === activeIndex) return;
  clearSampleHighlight();
  changing = true;
  requestedIndex = index;
  clearInterval(slideshowTimer);
  moveIndexIndicator(index, true);
  const direction = directionHint ?? (index > activeIndex ? 1 : -1);
  const oldView = activeProjectContainer.querySelector(".project-view");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = projectMarkup(
    PROJECTS[index],
    direction > 0 ? "enter-from-bottom" : "enter-from-top",
  );
  const newView = wrapper.firstElementChild;
  activeProjectContainer.appendChild(newView);
  revealLoadedImages(newView);
  fitProjectMedia();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      newView.classList.add("is-sliding-in", "is-incoming");
      if (oldView)
        oldView.classList.add(direction > 0 ? "exit-to-top" : "exit-to-bottom");
    }),
  );
  window.setTimeout(() => {
    if (oldView) oldView.remove();
    newView.classList.remove(
      "enter-from-bottom",
      "enter-from-top",
      "is-sliding-in",
    );
    commitIndexState(index);
    moveIndexIndicator(index, false);
    history.replaceState(null, "", `#${PROJECTS[index].id}`);
    changing = false;
    startHeroSlideshow(newView);
    fitProjectMedia();
  }, SWITCH_DURATION + 50);
}

function navigateByDelta(delta) {
  changeProject(activeIndex + delta, Math.sign(delta));
}

function setupIndexClicks() {
  indexNav.addEventListener("click", (event) => {
    const item = event.target.closest(".index-item");
    if (!item) return;
    event.preventDefault();
    changeProject(Number(item.dataset.index));
  });
}

function setupWheelNavigation() {
  projectColumn.addEventListener(
    "wheel",
    (event) => {
      if (introOpen || changing || wheelLock) return;
      const view = activeProjectContainer.querySelector(".project-view");
      if (!view) return;
      event.preventDefault();
      wheelAccumulator += event.deltaY;
      clearTimeout(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => {
        wheelAccumulator = 0;
      }, 180);
      if (Math.abs(wheelAccumulator) < 42) return;
      wheelLock = true;
      navigateByDelta(wheelAccumulator > 0 ? 1 : -1);
      wheelAccumulator = 0;
      window.setTimeout(() => {
        wheelLock = false;
      }, SWITCH_DURATION + 180);
    },
    { passive: false },
  );
}

function setupTouchNavigation() {
  projectColumn.addEventListener(
    "touchstart",
    (event) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    },
    { passive: true },
  );
  projectColumn.addEventListener(
    "touchend",
    (event) => {
      if (touchStartY === null || introOpen || changing) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      const difference = touchStartY - endY;
      touchStartY = null;
      if (Math.abs(difference) < 50) return;
      navigateByDelta(difference > 0 ? 1 : -1);
    },
    { passive: true },
  );
}

function setupKeyboardNavigation() {
  window.addEventListener("keydown", (event) => {
    if (introOpen) return;
    if (event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();
      navigateByDelta(1);
    }
    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      navigateByDelta(-1);
    }
  });
}

function loadInitialProject() {
  const hashId = window.location.hash.replace("#", "");
  const index = PROJECTS.findIndex((project) => project.id === hashId);
  insertInitialProject(index >= 0 ? index : 0);
}

function updateBrandGeometry() {
  const brandWidth = homeLink.offsetWidth;
  const narrow = window.innerWidth < 700;
  const scale = Math.min(1, (narrow ? 190 : 260) / brandWidth);
  const rootY = window.innerHeight * 0.45 - homeLink.offsetHeight / 2;
  const lines = homeLink.querySelectorAll(".brand-line");
  homeLink.style.setProperty("--dock-scale", scale);
  homeLink.style.setProperty("--dock-width", (narrow ? 190 : 260) + "px");
  homeLink.style.setProperty(
    "--top-home-shift",
    18 - rootY - lines[0].offsetTop + "px",
  );
  homeLink.style.setProperty(
    "--bottom-home-shift",
    18 + lines[0].offsetHeight * scale - rootY - lines[1].offsetTop + "px",
  );
  const logoBottom =
    18 + (lines[0].offsetHeight + lines[1].offsetHeight) * scale;
  homeLink.style.setProperty("--jp-top", logoBottom + 4 - rootY + "px");
}

function fitProjectMedia() {
  activeProjectContainer.querySelectorAll(".project-card").forEach((card) => {
    const content = card.querySelector(".project-content");
    const media = card.querySelector(".project-media");
    const details = card.querySelector(".project-metadata");
    const available = content.clientHeight - details.offsetHeight - 8;
    let ratio = 16 / 9;
    const fill =
      media.classList.contains("media-bookshelf") ||
      media.classList.contains("media-wide-stack") ||
      media.classList.contains("media-lotte-feature");
    if (media.classList.contains("media-square-spread")) ratio = 2;
    else if (media.classList.contains("media-bookshelf")) ratio = 1.5;
    else if (media.classList.contains("media-wide-stack")) ratio = 1.6;
    else if (media.classList.contains("media-square-feature")) ratio = 1;
    else if (media.classList.contains("media-portrait-hero")) {
      const count = media.querySelectorAll(".project-gallery figure").length;
      ratio = 1 / (9 / 16 + 16 / (9 * count));
      media.style.gridTemplateRows =
        "minmax(0," + (count * 81) / 256 + "fr) minmax(0,1fr)";
    } else if (media.classList.contains("media-montage")) ratio = 2.85;
    else if (media.classList.contains("media-lotte")) ratio = 2.7;
    else if (
      media.classList.contains("media-squares") ||
      media.classList.contains("media-digicon")
    )
      ratio = 1;
    else if (media.classList.contains("media-mixed")) ratio = 1.56;
    else if (media.classList.contains("media-single")) {
      const image = media.querySelector("img");
      if (image.naturalWidth && image.naturalHeight)
        ratio = image.naturalWidth / image.naturalHeight;
    } else {
      const count = media.querySelectorAll(".project-gallery figure").length;
      if (count) {
        ratio = 16 / 9 / (1 + 1 / count);
        media.style.gridTemplateRows =
          "minmax(0," + count + "fr) minmax(0,1fr)";
      }
    }
    const width =
      !fill &&
      (media.classList.contains("media-portrait-hero") ||
        media.classList.contains("media-square-feature") ||
        media.classList.contains("media-square-spread"))
        ? Math.min(content.clientWidth, Math.max(0, available) * ratio)
        : content.clientWidth;
    media.style.width = width + "px";
    media.style.height =
      Math.max(0, fill ? available : Math.min(available, width / ratio)) + "px";
    if (media.classList.contains("media-square-spread"))
      media.style.height =
        Math.max(0, Math.min(available, (width - 6) / 2)) + "px";
  });
}

function setNameLabels() {
  homeLink.querySelectorAll("[data-name-line]").forEach((button, index) => {
    button.setAttribute(
      "aria-label",
      translate(introOpen
        ? index === 0
          ? "Aaron — enter archive"
          : "Formilleza — enter archive"
        : "Return to introduction"),
    );
  });
}

let transitionPhotoStack = () => {};
let restartPhotoStack = () => {};
function enterIndex() {
  if (!introOpen || document.body.classList.contains("returning-intro")) return;
  clearTimeout(introTransitionTimer);
  homeLink.classList.remove("stack-restarted");
  intro.style.backgroundColor = getComputedStyle(intro).backgroundColor;
  document.body.classList.remove("returning-intro");
  introOpen = false;
  transitionPhotoStack(false);
  startHeroSlideshow(activeProjectContainer.querySelector(".project-view"));
  updateViewerTime();
  updateBrandGeometry();
  siteShell.classList.add("is-ready");
  siteShell.removeAttribute("inert");
  siteShell.setAttribute("aria-hidden", "false");
  document.body.classList.add("archive-open");
  setNameLabels();
  requestAnimationFrame(() => {
    if (introOpen) return;
    homeLink.classList.add("is-shrinking", "is-docked");
    intro.classList.add("is-opening");
    siteShell.classList.add("content-arrived");
    fitProjectMedia();
    introTransitionTimer = window.setTimeout(
      () => {
        if (introOpen) return;
        intro.classList.add("is-gone");
        intro.setAttribute("aria-hidden", "true");
        fitProjectMedia();
      },
      reducedMotion.matches ? 0 : INTRO_DURATION,
    );
  });
}

function returnToIntro(event) {
  if (event) event.preventDefault();
  if (introOpen) return;
  clearTimeout(introTransitionTimer);
  homeLink.classList.remove("stack-restarted");
  introOpen = true;
  clearSampleHighlight();
  document.body.classList.add("returning-intro");
  intro.style.removeProperty("background-color");
  intro.classList.remove("is-gone");
  intro.removeAttribute("aria-hidden");
  siteShell.setAttribute("inert", "");
  intro.getBoundingClientRect();
  requestAnimationFrame(() => {
    if (!introOpen) return;
    homeLink.classList.remove("is-docked", "is-shrinking");
    intro.classList.remove("is-opening");
    siteShell.classList.remove("content-arrived");
    document.body.classList.remove("archive-open");
    introTransitionTimer = setTimeout(
      () => {
        if (!introOpen) return;
        siteShell.classList.remove("is-ready");
        siteShell.setAttribute("aria-hidden", "true");
        restartPhotoStack();
        homeLink.classList.add("stack-restarted");
        document.body.classList.remove("returning-intro");
        setNameLabels();
      },
      reducedMotion.matches ? 0 : INTRO_DURATION,
    );
  });
}

function setupIntro() {
  homeLink.querySelectorAll(".name-text").forEach((line) => {
    line.replaceChildren(
      ...[...line.textContent].map((letter) => {
        const span = document.createElement("span");
        span.className = "name-letter";
        span.textContent = letter;
        span.setAttribute("aria-hidden", "true");
        return span;
      }),
    );
  });
  siteShell.setAttribute("inert", "");
  homeLink.addEventListener("click", (event) => {
    if (!event.target.closest("[data-name-line], .intro-window")) return;
    introOpen ? enterIndex() : returnToIntro(event);
  });
  document.fonts.ready.then(() => {
    updateBrandGeometry();
    homeLink.classList.add("is-revealed");
    homeLink.classList.add("name-ready");
    intro.classList.add("is-revealed");
    introCopy.classList.add("is-revealed");
    fitProjectMedia();
  });
  window.addEventListener("resize", () => {
    updateBrandGeometry();
    fitProjectMedia();
  });
  setupIntroSlideshow();
  activeProjectContainer.addEventListener("load", fitProjectMedia, true);
}

function setupIntroSlideshow() {
  const preview = document.getElementById("intro-preview");
  const windowBox = homeLink.querySelector(".intro-window");
  const frames = PROJECTS.map((project, index) => {
    const image = index === 0 ? preview : new Image();
    image.src = "intro-images/" + project.id + ".webp";
    image.alt = "";
    image.className = "intro-photo";
    image.width = 640;
    image.height = 360;
    return image;
  });
  const shuffle = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  let order = [frames[0], ...shuffle(frames.slice(1))];
  let index = 1;
  let stackTransition = false;
  let stackTimer = null;
  let stackGeneration = 0;
  restartPhotoStack = () => {
    clearTimeout(stackTimer);
    stackGeneration++;
    stackTransition = false;
    order = [frames[0], ...shuffle(frames.slice(1))];
    index = 1;
    frames[0].style.opacity = "1";
    frames[0].style.transform = "rotate(0deg)";
    windowBox.replaceChildren(frames[0]);
  };
  transitionPhotoStack = (reveal) => {
    clearTimeout(stackTimer);
    const generation = ++stackGeneration;
    stackTransition = true;
    // Animate a small retained pile, rather than flashing every accumulated photo.
    const photos = [...windowBox.children].slice(-4);
    windowBox.replaceChildren(...photos);
    const sequence = reveal ? photos : [...photos].reverse();
    const cadence = 130 / Math.max(1, sequence.length - 1);
    let cursor = 0;
    const finish = () => {
      if (generation !== stackGeneration) return;
      stackTransition = false;
      stackTimer = null;
    };
    const step = () => {
      if (generation !== stackGeneration) return;
      if (cursor >= sequence.length) {
        finish();
        return;
      }
      sequence[cursor++].style.opacity = reveal ? "1" : "0";
      stackTimer = window.setTimeout(
        cursor < sequence.length ? step : finish,
        cursor < sequence.length ? cadence : 90,
      );
    };
    if (reducedMotion.matches) {
      photos.forEach((photo) => {
        photo.style.opacity = reveal ? "1" : "0";
      });
      finish();
      return;
    }
    step();
  };
  window.setInterval(() => {
    if (
      !introOpen ||
      stackTransition ||
      document.body.classList.contains("returning-intro") ||
      document.hidden ||
      reducedMotion.matches
    )
      return;
    if (index === order.length) {
      order = shuffle(frames);
      index = 0;
    }
    const image = order[index];
    if (!image.complete || !image.naturalWidth) {
      index++;
      return;
    }
    image.style.opacity = "1";
    if (index === 0) windowBox.replaceChildren();
    image.style.transform =
      "translate(" +
      (Math.random() * 10 - 5).toFixed(1) +
      "px," +
      (Math.random() * 8 - 4).toFixed(1) +
      "px) rotate(" +
      (Math.random() * 12 - 6).toFixed(1) +
      "deg)";
    windowBox.append(image);
    index++;
  }, 500);
}

let networkClock = null;
async function syncViewerTime() {
  const started = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch("/?clock=" + Date.now(), {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });
    const timestamp = Date.parse(response.headers.get("Date"));
    if (response.ok && Number.isFinite(timestamp)) {
      networkClock = {
        timestamp: timestamp + (performance.now() - started) / 2,
        at: performance.now(),
      };
      viewerTime.dataset.clockSource = "server";
    }
  } catch {
    /* The live device clock remains available when offline. */
  } finally {
    clearTimeout(timeout);
    updateViewerTime();
  }
}

function updateViewerTime() {
  const now = new Date(
    networkClock
      ? networkClock.timestamp + performance.now() - networkClock.at
      : Date.now(),
  );
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const city = language === "ja" && zone === "Asia/Tokyo" ? "東京" : zone.split("/").pop().replaceAll("_", " ").toUpperCase();
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const clockLabel = city + " " + time;
  if (viewerTime.getAttribute("aria-label") !== clockLabel) {
    const [hour, minute] = time.split(":");
    viewerTime.innerHTML =
      "<span>" +
      escapeHTML(city) +
      "</span><span>" +
      hour +
      '<span class="clock-colon">:</span>' +
      minute +
      "</span>";
    viewerTime.setAttribute("aria-label", clockLabel);
  }
  viewerTime.title =
    zone + (language === "ja" ? (networkClock ? " · サーバー時刻と同期" : " · 端末の時刻") : (networkClock ? " · synchronized to server time" : " · device time"));
}

let clearSampleHighlight = () => {};
function setupSamplePreview() {
  const hover = matchMedia("(hover: hover) and (pointer: fine)");
  const selector =
    ".project-gallery figure, .media-grid .project-sample:not(.square-lead):not(.instagram-portrait)";
  let current = null;
  let hero = null;
  clearSampleHighlight = () => {
    hero?.classList.remove("sample-highlighted");
    hero?.querySelector(".sample-hero-override")?.remove();
    current = null;
    hero = null;
  };
  projectColumn.addEventListener("pointerover", (event) => {
    if (
      !hover.matches ||
      event.pointerType !== "mouse" ||
      introOpen ||
      changing
    )
      return;
    const figure = event.target.closest(selector);
    if (!figure || figure === current) return;
    const media = figure.closest(".project-media");
    const target = media?.querySelector(
      ":scope > figure, .square-lead, .instagram-wide",
    );
    const source = figure.querySelector("img");
    clearSampleHighlight();
    if (!target || target === figure || !source) return;
    current = figure;
    hero = target;
    const image = new Image();
    image.className = "sample-hero-override";
    image.alt = source.alt;
    image.src = source.currentSrc || source.src;
    hero.append(image);
    hero.classList.add("sample-highlighted");
  });
  projectColumn.addEventListener("pointerout", (event) => {
    if (!current || !current.contains(event.target)) return;
    if (event.relatedTarget && current.contains(event.relatedTarget)) return;
    clearSampleHighlight();
  });
  projectColumn.addEventListener("pointerleave", clearSampleHighlight);
  window.addEventListener("wheel", clearSampleHighlight, { passive: true });
  window.addEventListener("keydown", clearSampleHighlight);
  window.addEventListener("resize", clearSampleHighlight);
  document.addEventListener("visibilitychange", clearSampleHighlight);
}

function initialize() {
  setupLanguageSwitch();
  buildIndex();
  loadInitialProject();
  setupIntro();
  setupIndexClicks();
  setupSamplePreview();
  setupWheelNavigation();
  setupTouchNavigation();
  setupKeyboardNavigation();
  updateViewerTime();
  window.setInterval(updateViewerTime, 1000);
  syncViewerTime();
  window.setInterval(syncViewerTime, 300000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncViewerTime();
  });
  window.addEventListener("resize", () =>
    moveIndexIndicator(requestedIndex, false),
  );
}

document.addEventListener("DOMContentLoaded", initialize);
