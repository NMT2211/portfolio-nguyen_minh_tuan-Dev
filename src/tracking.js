// src/tracking.js
// Lightweight visitor tracking -> Google Sheets via Google Apps Script Web App
// How to use:
// 1) Deploy your Apps Script as a Web App and set "scriptURL" below (or pass it in from main.jsx)
// 2) This will run once per session (sessionStorage) on first page load.

export async function initTracking(scriptURL) {
  try {
    // Don't re-send during the same tab session
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("tracked")) return;

    const url = new URL(window.location.href);
    const params = Object.fromEntries(url.searchParams.entries());
    const referrer = document.referrer || "";
    const ua = navigator.userAgent || navigator.userAgentData || "";
    const language = navigator.language || "";
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const screenSize = (typeof screen !== "undefined") ? `${screen.width}x${screen.height}` : "";
    const pageTitle = document.title || "";
    const now = new Date().toISOString();

    // Try to get IP + geoinfo. Safe fallback if blocked.
    let ip = "", country = "", region = "", city = "";
    try {
      const geoRes = await fetch("https://ipapi.co/json/");
      if (geoRes.ok) {
        const g = await geoRes.json();
        ip = g.ip || "";
        country = g.country_name || g.country || "";
        region = g.region || "";
        city = g.city || "";
      } else {
        // fallback to just IP
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (ipRes.ok) {
          const j = await ipRes.json();
          ip = j.ip || "";
        }
      }
    } catch (e) {
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (ipRes.ok) {
          const j = await ipRes.json();
          ip = j.ip || "";
        }
      } catch (_) {}
    }

    const payload = {
      timestamp: now,
      url: url.toString(),
      path: url.pathname,
      referrer,
      utm_source: params.utm_source || "",
      utm_medium: params.utm_medium || "",
      utm_campaign: params.utm_campaign || "",
      utm_term: params.utm_term || "",
      utm_content: params.utm_content || "",
      userAgent: (typeof ua === "string") ? ua : JSON.stringify(ua),
      language,
      timezone: tz,
      screen: screenSize,
      pageTitle,
      ip,
      country,
      region,
      city,
    };

    if (!scriptURL) {
      console.warn("[tracking] No scriptURL provided. Skipping send.");
      return;
    }

    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors", // let Apps Script accept the request without CORS preflight issues
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true, // helps when user closes tab quickly
    });

    if (typeof sessionStorage !== "undefined") sessionStorage.setItem("tracked", "1");
    console.log("[tracking] sent");
  } catch (err) {
    console.warn("[tracking] error", err);
  }
}