const tabs = document.querySelectorAll(".tab");
const contentArea = document.querySelector(".content-area");
const frame = document.querySelector(".app-frame");
const dragRegion = document.getElementById("drag-region");

const GAME_REGISTRY = [
  { name: "Slope", icon: "/img/slope.png", url: "/scramjet/https%3A%2F%2Fstorage.y8.com%2Fy8-studio%2Funity_webgl%2FGani%2Fslope-game_2025_v3%2F%3Fkey%3D9757549%26value%3D80527" },
  { name: "Retro Bowl", icon: "/img/retrobowl.png", url: "/scramjet/https%3A%2F%2Fgame316009.konggames.com%2Fgamez%2F0031%2F6009%2Flive%2Findex.html" },
  { name: "Cookie Clicker", icon: "/img/cookieclicker.png", url: "/scramjet/https%3A%2F%2Forteil.dashnet.org%2Fcookieclicker%2F" },
  { name: "Run 3", icon: "/img/run3.png", url: "/scramjet/https%3A%2F%2Fplayer03.com%2Frun%2F3%2Fbeta%2F" },
  { name: "MotoX3M", icon: "/img/motox3m.png", url: "/scramjet/https%3A%2F%2F5dd264d4-015f-11ea-ad56-9cb6d0d995f7.poki-gdn.com%2F55d9475f-c88a-4900-b4e6-886cdd3c425e%2Findex.html%3Fcountry%3DUS%26ccpaApplies%3D0%26url_referrer%3Dhttps%253A%252F%252Fpoki.com%252F%26tag%3Dpg-adff6f6643d643041207ec3d438f4c56c268d346%26site_id%3D3%26iso_lang%3Den%26poki_url%3Dhttps%253A%252F%252Fpoki.com%252Fen%252Fg%252Fmoto-x3m%26hoist%3Dyes%26nonPersonalized%3Dn%26cloudsavegames%3Dn%26familyFriendly%3Dn%26categories%3D1%252C9%252C260%252C738%252C929%252C1123%252C1140%252C1190%252C1193%26special_condition%3Dlanding%26game_id%3D5dd264d4-015f-11ea-ad56-9cb6d0d995f7%26game_version_id%3D55d9475f-c88a-4900-b4e6-886cdd3c425e%26inspector%3D0%26csp%3D1" },
  { name: "Volley Random", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1TIgOyKaC36N7TckZt-gCVupPgy-ltSNyqzKzDeP-dkwZaFXPcehKqO9HWlyLi7l4R4zPlt7G1YQcI_2aaMWloyrjX64_b6PZq9DJG3FA&s=10", url: "/active/uv/service/hvtrs8%2F-kfava3.aoo%2F0001-00%2FTonlgy%5Drcnfoo%2F" },
  { name: "Krunker", icon: "/img/krunker.png", url: "/scramjet/https%3A%2F%2Fkrunker.io%2F" },
  { name: "Basketball Stars", icon: "/img/basketballstars.png", url: "/scramjet/https%3A%2F%2Fbasketballstarsonline.github.io%2Ffile%2F" },
];

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
		<form id="sj-form" class="flex-center">
			<input
				id="sj-search-engine"
				value="https://www.google.com/search?q=%s"
				type="hidden"
			/>
			<input id="sj-address" type="text" placeholder="Search the web freely" />
		</form>
    </div>

    <p>Magic Johnson so tuff</p>
    <p class="hint">NOTING WE GOT NOTING</p>
  </div>
  `
};

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
  iframe.style.borderRadius = "16px";

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

let tLeft = 0;
let tTop = 0;
let cLeft = 0;
let cTop = 0;
let animating = false;

if (frame && dragRegion) {
  let dragging = false, offsetX = 0, offsetY = 0;

  dragRegion.addEventListener("mousedown", (e) => {
    dragging = true;

    const rect = frame.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    tLeft = rect.left;
    tTop = rect.top;

    frame.style.position = "absolute";
    frame.style.transition = "none";
    frame.style.transform = "none"; 
  });

dragRegion.addEventListener("mousedown", () => console.log("DOWN"));


  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = frame.getBoundingClientRect();

    tLeft = Math.max(0, Math.min(e.clientX - offsetX, vw - rect.width));
    tTop = Math.max(0, Math.min(e.clientY - offsetY, vh - rect.height));

    if (!animating) animateFrame();
  });

  function animateFrame() {
    animating = true;

    const ease = 0.18;

    cLeft += (tLeft - cLeft) * ease;
    cTop += (tTop - cTop) * ease;

    frame.style.left = `${cLeft}px`;
    frame.style.top = `${cTop}px`;

    if (Math.abs(cLeft - tLeft) < 0.5 &&
        Math.abs(cTop - tTop) < 0.5) {
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

document.addEventListener("keydown", (event) => {
  if (event.key === "f") {
    const sjFrame = qs("#sj-frame");
    if (sjFrame && sjFrame.getBoundingClientRect().top >= 0 && sjFrame.getBoundingClientRect().bottom <= window.innerHeight) {
      document.documentElement.requestFullscreen();
    }
  }
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => {
      if (t === tab) {
        t.classList.add("tab-active");
        t.classList.remove("tab-loud");
      } else {
        t.classList.remove("tab-active");
        t.classList.add("tab-loud");
      }
    });
  });
});