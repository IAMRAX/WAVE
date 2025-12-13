// ===== DOM ELEMENTS =====
const tabs = document.querySelectorAll(".tab");
const contentArea = document.querySelector(".content-area");
const frame = document.querySelector(".app-frame");
const dragRegion = document.getElementById("drag-region");

// ===== GAME REGISTRY =====
const GAME_REGISTRY = [
  { name: "Slope", icon: "https://play-lh.googleusercontent.com/uJn2i9h7KxYQarC_c3K4qH6o7gLtflFnhD_dN14MNkzHJ1NeNFzCL69jpB5mT0vCoQs", url: "/active/uv/service/hvtrs8%2F-svopaee%2Cy%3A.aoo%2F%7B8%2Fsvufim%2Fwnkt%7B_ue%60gn%2FEali-snore%2Fgcmg_0005%5Dv1%2F%3Dkgy%3F9555569%24vclwe%3F82507" },
  { name: "Retro Bowl", icon: "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=40,height=40,fit=cover,f=auto/ee9ca3764ef4289a48a1ebf457ef605441ed1f35a0f2eb12707a70d609e53686/retro-bowl.png", url: "/active/uv/service/hvtrs8%2F-gcmg33620%3B.iolgeaoeq.aoo%2Feaoex%2F2011-620%3B%2Fnite-ildgx%2Chvmn" },
  { name: "Cookie Clicker", icon: "https://super142.wordpress.com/wp-content/uploads/2022/07/cookie-clicker.jpg", url: "/active/uv/service/hvtrs8%2F-optgin.faqhlev.mre%2Faomkkealkciep%2F" },
  { name: "Run 3", icon: "https://azgames.io/upload/cache/upload/imgs/run3thumb-m180x180.png", url: "/active/uv/service/hvtrs8%2F-pna%7Bep01.aoo%2Fpul%2F1%2F%60eva-" },
  { name: "Shell Shockers", icon: "https://imgs.crazygames.com/shellshockersio_16x9/20251202223018/shellshockersio_16x9-cover?metadata=none&quality=85&width=196&dpr=1", url: "/active/uv/service/hvtrs8%2F-sjenlqhmci.ko-" },
  { name: "Volley Random", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1TIgOyKaC36N7TckZt-gCVupPgy-ltSNyqzKzDeP-dkwZaFXPcehKqO9HWlyLi7l4R4zPlt7G1YQcI_2aaMWloyrjX64_b6PZq9DJG3FA&s=10", url: "/active/uv/service/hvtrs8%2F-kfava3.aoo%2F0001-00%2FTonlgy%5Drcnfoo%2F" },
];

// ===== CONTENT MAP =====
const contentMap = {
  GAMES: `
    <div class="content-inner">
      <h2>GAMES</h2>
      <input type="text" id="gameSearch" class="game-search" placeholder="Search games...">
      <div class="game-grid"></div>
      <p class="hint">Don't see the game you're looking for?</p>
      <p class="hint">F for fullscreen!</p>
    </div>
  `,
  PROXY: `
    <div class="content-inner">
      <h2>PROXY</h2>
      <div class="uv-searchbar">
        <form id="url-form">
          <input type="text" id="url-input" placeholder="Search or enter URL" autocomplete="off" spellcheck="false" />
        </form>
      </div>
      <p>Magic Johnson so tuff</p>
      <p class="hint">NOTING WE GOT NOTING</p>
    </div>
  `,
  THEMES: `
    <div class="content-inner">
      <h2>THEMES</h2>

      <div class="theme-wrapper">
        <label for="theme-select" class="theme-label">Choose a theme</label>

        <select id="theme-select" class="theme-select">
          <option value="midnight">Midnight (Default)</option>
          <option value="safari">Safari</option>
          <option value="neon">Neon</option>
          <option value="pastel">Pastel</option>
        </select>

        <button id="apply-theme-btn" class="theme-apply-btn">Apply Theme</button>
      </div>

      <p class="hint">Themes load from <code>css/themes/{name}/theme.css</code></p>
    </div>
  `
};


// ===== HELPERS =====
function qs(selector) {
  return document.querySelector(selector);
}

function renderIframe(url) {
  const contentInner = qs(".content-inner");
  if (!contentInner) return;

  contentInner.innerHTML = "";

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.width = "100%";
  iframe.style.border = "none";
  iframe.style.borderRadius = "8px";

  iframe.onload = () => {
    iframe.style.height = iframe.offsetHeight * 2.8 + "px";
  };

  contentInner.appendChild(iframe);
}

function renderGameGrid(games) {
  const grid = qs(".game-grid");
  if (!grid) return;

  grid.innerHTML = "";

  games.forEach(game => {
    const slot = document.createElement("div");
    slot.className = "game-slot";

    slot.innerHTML = `<img class="slot-icon" src="${game.icon}" alt="${game.name}">`;

    slot.addEventListener("click", () => renderIframe(game.url));

    grid.appendChild(slot);
  });
}

function attachListeners() {
  const gameSearch = qs("#gameSearch");
  if (gameSearch) {
    gameSearch.addEventListener("input", () => {
      const filtered = GAME_REGISTRY.filter(g =>
        g.name.toLowerCase().includes(gameSearch.value.toLowerCase())
      );
      renderGameGrid(filtered);
    });
  }

  const urlInput = qs("#url-input");
  if (urlInput) {
    urlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        let url = urlInput.value.trim();
        if (!url.startsWith("http")) url = "https://" + url;
        window.open(url, "_blank");
      }
    });
  }
}

// ===== TAB SWITCHING =====
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const selected = tab.textContent.trim();
    const html = contentMap[selected];
    if (!html) return;

    contentArea.innerHTML = html;

    if (selected === "GAMES") renderGameGrid(GAME_REGISTRY);

    attachListeners();
  });
});

// ===== DRAGGING =====
let targetLeft = 0;
let targetTop = 0;
let currentLeft = 0;
let currentTop = 0;
let animating = false;

if (frame && dragRegion) {
  let dragging = false, offsetX = 0, offsetY = 0;

  dragRegion.addEventListener("mousedown", (e) => {
    dragging = true;
    const rect = frame.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    currentLeft = rect.left;
    currentTop = rect.top;

    frame.style.position = "absolute";
    frame.style.transition = "none";
  });


  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = frame.getBoundingClientRect();

    targetLeft = Math.max(0, Math.min(e.clientX - offsetX, vw - rect.width));
    targetTop = Math.max(0, Math.min(e.clientY - offsetY, vh - rect.height));

    if (!animating) animateFrame();
  });

  function animateFrame() {
    animating = true;

    const ease = 0.18;

    currentLeft += (targetLeft - currentLeft) * ease;
    currentTop += (targetTop - currentTop) * ease;

    frame.style.left = `${currentLeft}px`;
    frame.style.top = `${currentTop}px`;

    if (Math.abs(currentLeft - targetLeft) < 0.5 &&
        Math.abs(currentTop - targetTop) < 0.5) {
      animating = false;
      return;
    }

    requestAnimationFrame(animateFrame);
  }


  document.addEventListener("mouseup", () => {
    dragging = false;
    frame.style.transition = "";
  });
}

// ===== FLOATING QUESTION MARKS =====
setInterval(() => {
  const q = document.createElement("div");
  q.className = "floating-qmark";
  q.textContent = "?";
  q.style.left = Math.random() * 90 + "%";
  q.style.top = Math.random() * 90 + "%";
  q.style.position = "fixed";

  document.body.appendChild(q);
  setTimeout(() => q.remove(), 4000);
}, 2500);

// ===== FULLSCREEN HANDLING =====
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() !== "f") return;

  const iframe = qs(".content-inner iframe");
  if (!iframe) return;

  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    iframe.requestFullscreen().catch(console.warn);
  }
});

document.addEventListener("fullscreenchange", () => {
  const iframe = qs(".content-inner iframe");
  if (!iframe || document.fullscreenElement) return;

  const original = iframe.style.height;
  iframe.style.height = iframe.offsetHeight + 1 + "px";

  requestAnimationFrame(() => {
    iframe.style.height = original;
  });
});

// Create or reuse the theme <link> element
let themeLink = document.getElementById("theme-link");
if (!themeLink) {
  themeLink = document.createElement("link");
  themeLink.rel = "stylesheet";
  themeLink.id = "theme-link";
  document.head.appendChild(themeLink);
}

function applyTheme(themeName) {
  themeLink.href = `css/themes/${themeName}/theme.css`;
  console.log(`Theme applied: ${themeName}`);
}

// Handle button click inside THEMES page
document.addEventListener("click", (e) => {
  if (e.target.id === "apply-theme-btn") {
    const theme = document.getElementById("theme-select").value;
    applyTheme(theme);
  }
});
