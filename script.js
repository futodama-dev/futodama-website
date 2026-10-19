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

  // Products come from the futodama product registry (futodama-analytics). The block below is
  // generated — never edit it by hand: npm run registry -- site-config --site <this repo> --write
  // BEGIN GENERATED SITE PRODUCTS — npm run registry -- site-config (futodama-analytics). Do not edit by hand.
  var SITE_SECTIONS = ["","about","legal","privacy","support","terms"]; // brand pages (first path segment; "" = top)
  var SITE_PRODUCTS = {"arrvd":"arrvd","celestial-oracle":"celestial_oracle","mojitsunagi":"mojitsunagi"}; // site slug → product_id
  var STORE_PRODUCTS = {"app_store:6801533488":"mojitsunagi","web:celestial.futodama.app":"celestial_oracle"}; // store:app id → product_id
  // END GENERATED SITE PRODUCTS

  // First path segment after the optional /ja/ ("/ja/arrvd/terms/" → "arrvd"), or null.
  function sectionOf(path) {
    var match = /^\/(?:ja\/)?([a-z0-9][a-z0-9-]{0,39})\//.exec(path);
    return match && match[1] !== "ja" ? match[1] : null;
  }

  // Product of a site path: a registered product's slug → its product_id; the top page and brand
  // sections → "site". A section the registry does not know yet is sent as its own product token
  // (kept and reported as unregistered — never dropped, never guessed onto another product).
  function productOfPath(path) {
    var section = sectionOf(path);
    if (section === null || SITE_SECTIONS.indexOf(section) >= 0) {
      return "site";
    }
    if (Object.prototype.hasOwnProperty.call(SITE_PRODUCTS, section)) {
      return SITE_PRODUCTS[section];
    }
    var token = section.replace(/-/g, "_");
    return /^[a-z][a-z0-9_]{1,31}$/.test(token) && token !== "site" ? token : "site";
  }

  // A product's top page ("/arrvd/", "/ja/arrvd/"): the target of product_interest.
  function isProductPage(path) {
    return /^\/(?:ja\/)?[a-z0-9][a-z0-9-]{0,39}\/$/.test(path) && productOfPath(path) !== "site";
  }

  // Store / web app of an outbound link: App Store (id…), Google Play (details?id=…) or a
  // registered web app host. The product comes from the registry; an unregistered store app counts
  // for the page's product.
  function outboundOf(url) {
    var key = null;
    var target = null;
    if (url.hostname === "apps.apple.com") {
      var appId = /\/id(\d+)/.exec(url.pathname);
      key = appId ? "app_store:" + appId[1] : null;
      target = "app_store";
    } else if (url.hostname === "play.google.com" && url.pathname === "/store/apps/details") {
      key = url.searchParams.get("id") ? "google_play:" + url.searchParams.get("id") : null;
      target = "play_store";
    } else if (Object.prototype.hasOwnProperty.call(STORE_PRODUCTS, "web:" + url.hostname)) {
      key = "web:" + url.hostname;
      target = "web_app";
    }
    if (!target) {
      return null;
    }
    var known = key !== null && Object.prototype.hasOwnProperty.call(STORE_PRODUCTS, key);
    return { target: target, product: known ? STORE_PRODUCTS[key] : null };
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
      if (isProductPage(url.pathname) && !url.hash && linkProduct !== pageProduct) {
        track("product_interest", linkProduct, "product_page");
      }
      return;
    }

    var outbound = outboundOf(url);
    if (outbound) {
      track("outbound_cta", outbound.product || pageProduct, outbound.target);
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
