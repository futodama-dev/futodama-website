// ARRVD invitation fallback page (/arrvd/invite/<id>#<token>, legal-2026-11-14/75).
// Runs only on this device: it reads this page's own address to offer "Copy invitation link" — the link
// the ARRVD app's "Paste invitation link" accepts — and sends nothing anywhere (no fetch, beacon, image,
// storage or navigation of its own; _headers also sets connect-src 'none'). It never checks the
// invitation: validity (48 hours, one use) is decided only by the ARRVD app and its server.
(function () {
  "use strict";

  // The app accepts only https://futodama.app/arrvd/invite/<id>#<token>, both base64url
  // (lib/src/services/invitation_link.dart). Anything else is treated as an incomplete link.
  var APP_HOST = "https://futodama.app";
  var PART = /^[A-Za-z0-9_-]{1,256}$/;
  var LANGS = ["en", "ja", "ms"];

  function all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function setHidden(elements, hidden) {
    elements.forEach(function (el) {
      el.hidden = hidden;
    });
  }

  var match = /^\/arrvd\/invite\/([^\/]*)\/?$/.exec(location.pathname);
  var id = match && PART.test(match[1]) ? match[1] : "";
  var token = location.hash.charAt(0) === "#" ? location.hash.slice(1) : "";
  if (!PART.test(token)) token = "";
  var path = id && token ? "/arrvd/invite/" + id : "";
  var link = path ? APP_HOST + path + "#" + token : "";

  setHidden(all('[data-invite-when="ok"]'), !link);
  setHidden(all('[data-invite-when="incomplete"]'), !!link);

  // Language: one section at a time, chosen from the device language; the buttons switch it.
  function pickLanguage() {
    var list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]);
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i] || "").toLowerCase().split("-")[0];
      if (code === "ja") return "ja";
      if (code === "ms") return "ms";
      if (code === "en") return "en";
    }
    return "en";
  }

  function showLanguage(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "en";
    all("[data-invite-lang]").forEach(function (section) {
      section.hidden = section.getAttribute("data-invite-lang") !== lang;
    });
    all("[data-invite-lang-button]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-invite-lang-button") === lang ? "true" : "false");
    });
    document.documentElement.setAttribute("lang", lang);
  }

  all("[data-invite-lang-button]").forEach(function (button) {
    button.addEventListener("click", function () {
      showLanguage(button.getAttribute("data-invite-lang-button"));
    });
  });
  setHidden(all("[data-invite-langs]"), false);
  setHidden(all("[data-invite-langs-static]"), true);
  showLanguage(pickLanguage());

  if (!link) return;

  // LINE's in-app browser opens a link in the default browser when it carries openExternalBrowser=1;
  // the app accepts an invitation link with a query (invitation_link.dart). Same page, same token after "#".
  if (/\sLine\//.test(navigator.userAgent || "")) {
    all("[data-invite-line-safari]").forEach(function (a) {
      a.setAttribute("href", location.origin + path + "?openExternalBrowser=1#" + token);
      a.hidden = false;
    });
  }

  function showCopied(section) {
    var status = section.querySelector('[data-invite-status="copied"]');
    if (status) status.hidden = false;
  }

  function showManual(section) {
    var box = section.querySelector("[data-invite-manual]");
    var text = section.querySelector("[data-invite-manual-text]");
    if (!box || !text) return;
    text.value = link;
    box.hidden = false;
    try {
      text.focus();
      text.select();
      text.setSelectionRange(0, link.length);
    } catch (e) {
      // Selecting is only a convenience; the link is shown either way.
    }
  }

  function copyWithSelection() {
    var area = document.createElement("textarea");
    area.value = link;
    area.setAttribute("readonly", "");
    area.className = "invite-offscreen";
    document.body.appendChild(area);
    var ok = false;
    try {
      area.select();
      area.setSelectionRange(0, link.length);
      ok = document.execCommand("copy") === true;
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  all("[data-invite-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var section = button.closest("[data-invite-lang]") || document;
      var fallback = function () {
        if (copyWithSelection()) showCopied(section);
        else showManual(section);
      };
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(link).then(function () {
          showCopied(section);
        }, fallback);
      } else {
        fallback();
      }
    });
  });
})();
