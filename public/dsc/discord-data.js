// ===============================
// Discord Guild Preview Fetcher
// ===============================
// Requirements:
// - Server must have "Community" enabled
// - Replace YOUR_GUILD_ID with your actual server ID
// - Works client-side, no token needed
// ===============================

const GUILD_ID = "1447437195462967360"; // <-- replace this

async function loadDiscordData() {
  try {
    const res = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/preview`, {
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      console.warn("Discord API error:", res.status);
      return;
    }

    const data = await res.json();

    // ===============================
    // Update UI Elements
    // ===============================

    // Online count
    const onlineEl = document.querySelector(".pill--online");
    if (onlineEl && data.approximate_presence_count !== undefined) {
      onlineEl.textContent = `● ${data.approximate_presence_count} online`;
    }

    // Member count
    const memberEl = document.querySelector(".pill--members");
    if (memberEl && data.approximate_member_count !== undefined) {
      memberEl.textContent = `${data.approximate_member_count} members`;
    }

    // Server name
    const nameEl = document.querySelector(".panel__server-name");
    if (nameEl && data.name) {
      nameEl.textContent = data.name;
    }

    // Hero title accent (optional)
    const heroAccent = document.querySelector(".hero__title-accent");
    if (heroAccent && data.name) {
      heroAccent.textContent = `in ${data.name}.`;
    }

    // Server icon
    const iconEl = document.querySelector(".panel__server-icon");
    if (iconEl && data.icon) {
      iconEl.style.backgroundImage = `url(https://cdn.discordapp.com/icons/${GUILD_ID}/${data.icon}.png?size=128)`;
      iconEl.style.backgroundSize = "cover";
      iconEl.textContent = ""; // remove fallback letters
    }

    // Optional: server description
    const subtitleEl = document.querySelector(".hero__subtitle");
    if (subtitleEl && data.description) {
      subtitleEl.textContent = data.description;
    }

  } catch (err) {
    console.error("Failed to load Discord data:", err);
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadDiscordData);
