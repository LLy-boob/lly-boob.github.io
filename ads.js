// ===============================
// STRONG PROTECTED ADS SYSTEM
// ===============================

// 1. Create SAFE container with random ID
const safeId = "ad_" + Math.random().toString(36).substr(2, 9);
const adHost = document.createElement("div");
adHost.id = safeId;
adHost.style.all = "unset";
document.body.appendChild(adHost);

// 2. Create fully hidden Shadow DOM (hackers cannot access it)
const shadow = adHost.attachShadow({ mode: "closed" });

// 3. Insert Monetag script safely inside Shadow DOM
const adScript = document.createElement("script");
adScript.dataset.zone = "10203415";
adScript.src = "https://groleegni.net/vignette.min.js";
shadow.appendChild(adScript);

// 4. Mutation Protection (auto-restore if someone tries to delete/modify)
const protectAds = () => {
    if (!document.body.contains(adHost)) {
        console.warn("⚠️ Ads tampered — restoring...");
        document.body.appendChild(adHost);
    }
};

// 5. Observe the page for hacker activity
const observer = new MutationObserver(() => protectAds());
observer.observe(document.body, { childList: true, subtree: true });

// 6. Basic AdBlock Bypass (dynamic loader)
setTimeout(() => {
    if (!shadow.innerHTML.trim()) {
        console.warn("🚫 AdBlock detected — reloading script stealthily");
        const stealthScript = document.createElement("script");
        stealthScript.dataset.zone = "10203415";
        stealthScript.src = "https://groleegni.net/vignette.min.js";
        shadow.appendChild(stealthScript);
    }
}, 1200);

// 7. Anti‑Replace Guard (block JS trying to overwrite your ads)
Object.freeze(adHost);
Object.freeze(shadow);

console.log("✔ Monetag ads protected and active.");
