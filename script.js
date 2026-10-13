// futodama — minimal UI behavior (mobile nav toggle) and anonymous site events

(function () {
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("primary-menu");

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  menu.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", function (event) {
    if (!menu.classList.contains("is-open")) {
      return;
    }
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || !menu.classList.contains("is-open")) {
      return;
    }
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  });
})();

// Anonymous, aggregate site events (see docs/analytics/marketing-measurement.md).
// No cookies, storage, user/device IDs or full query strings; production host only.
(function () {
  var ENDPOINT = "/api/analytics/event";
  var PRODUCTION_HOST = "futodama.app";

  // Automated browsers and crawlers that run JavaScript are not counted. The
  // User-Agent is only tested here in the browser; it is never sent.
  var isAutomated =
    navigator.webdriver === true ||
    /bot|crawl|spider|slurp|headless|lighthouse/i.test(navigator.userAgent || "");

  if (
    location.hostname !== PRODUCTION_HOST ||
    location.pathname.indexOf("/arrvd/invite") === 0 ||
    typeof window.fetch !== "function" ||
    isAutomated
  ) {
    return;
  }

  // Product section of a site path ("/ja/arrvd/terms/" → "arrvd").
  function productOfPath(path) {
    var match = /^\/(?:ja\/)?(arrvd|mojitsunagi|celestial-oracle)\//.exec(path);
    if (!match) {
      return "site";
    }
    return match[1] === "celestial-oracle" ? "celestial_oracle" : match[1];
  }

  // Campaign of the landing URL: utm_* first, then the src/med/cmp/cnt form.
  // Read from the current address only — never stored in the browser.
  var params = new URLSearchParams(location.search);
  function param(primary, fallback) {
    return params.get(primary) || params.get(fallback) || "";
  }
  var campaign = {
    source: param("utm_source", "src"),
    medium: param("utm_medium", "med"),
    campaign: param("utm_campaign", "cmp"),
    content: param("utm_content", "cnt"),
  };

  var pagePath = location.pathname;
  var pageProduct = productOfPath(pagePath);
  var lang = document.documentElement.lang === "ja" ? "ja" : "en";

  function track(eventName, product, target) {
    try {
      window
        .fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: eventName,
            page_path: pagePath,
            lang: lang,
            product: product,
            target: target || "",
            source: campaign.source,
            medium: campaign.medium,
            campaign: campaign.campaign,
            content: campaign.content,
          }),
          keepalive: true,
          credentials: "omit",
        })
        .catch(function () {});
    } catch (error) {
      // Analytics must never affect the page.
    }
  }

  // A prerendered page counts only once the visitor actually opens it.
  if (document.prerendering) {
    document.addEventListener(
      "prerenderingchange",
      function () {
        track("site_page_view", pageProduct);
      },
      { once: true }
    );
  } else {
    track("site_page_view", pageProduct);
  }

  // Clicks: internal links into another product's page, and outbound CTAs.
  var APP_STORE_PRODUCTS = { id6801533488: "mojitsunagi" };

  document.addEventListener("click", function (event) {
    var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!link) {
      return;
    }
    var url;
    try {
      url = new URL(link.href, location.href);
    } catch (error) {
      return;
    }

    if (url.hostname === PRODUCTION_HOST) {
      var linkProduct = productOfPath(url.pathname);
      var isProductPage = /^\/(?:ja\/)?(?:arrvd|mojitsunagi|celestial-oracle)\/$/.test(url.pathname);
      if (isProductPage && !url.hash && linkProduct !== pageProduct) {
        track("product_interest", linkProduct, "product_page");
      }
      return;
    }

    if (url.hostname === "apps.apple.com") {
      var appId = /\/(id\d+)/.exec(url.pathname);
      var storeProduct = (appId && APP_STORE_PRODUCTS[appId[1]]) || pageProduct;
      track("outbound_cta", storeProduct, "app_store");
    } else if (url.hostname === "celestial.futodama.app") {
      track("outbound_cta", "celestial_oracle", "web_app");
    }
  });

  // Engagement: time the page has actually been visible, reported once per threshold.
  var THRESHOLDS = [
    [15000, "engagement_15s"],
    [60000, "engagement_60s"],
    [180000, "engagement_180s"],
  ];
  var next = 0;
  var visibleMs = 0;
  var visibleSince = document.visibilityState === "visible" ? Date.now() : null;
  var timer = null;

  function elapsed() {
    return visibleMs + (visibleSince !== null ? Date.now() - visibleSince : 0);
  }

  function check() {
    while (next < THRESHOLDS.length && elapsed() >= THRESHOLDS[next][0]) {
      track(THRESHOLDS[next][1], pageProduct);
      next += 1;
    }
    clearTimeout(timer);
    if (next < THRESHOLDS.length && visibleSince !== null) {
      timer = setTimeout(check, THRESHOLDS[next][0] - elapsed());
    }
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      if (visibleSince === null) {
        visibleSince = Date.now();
      }
    } else if (visibleSince !== null) {
      visibleMs += Date.now() - visibleSince;
      visibleSince = null;
    }
    check();
  });

  check();
})();
