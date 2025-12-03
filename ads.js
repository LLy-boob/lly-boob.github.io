


const safeId = "ad_" + Math.random().toString(36).substr(2, 9);
const adHost = document.createElement("div");
adHost.id = safeId;
adHost.style.all = "unset";
document.body.appendChild(adHost);


const shadow = adHost.attachShadow({ mode: "closed" });


const adScript = document.createElement("script");
adScript.dataset.zone = "10203415";
adScript.src = "https://groleegni.net/vignette.min.js";
shadow.appendChild(adScript);

)
const protectAds = () => {
    if (!document.body.contains(adHost)) {
        console.warn("⚠️ Ads tampered — restoring...");
        document.body.appendChild(adHost);
    }
};


const observer = new MutationObserver(() => protectAds());
observer.observe(document.body, { childList: true, subtree: true });


setTimeout(() => {
    if (!shadow.innerHTML.trim()) {
        console.warn("🚫 AdBlock detected — reloading script stealthily");
        const stealthScript = document.createElement("script");
        stealthScript.dataset.zone = "10203415";
        stealthScript.src = "https://groleegni.net/vignette.min.js";
        shadow.appendChild(stealthScript);
    }
}, 1200);


Object.freeze(adHost);
Object.freeze(shadow);

console.log("✔ Monetag ads protected and active.");
