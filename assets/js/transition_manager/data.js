/**
 * Critical Transition Data Injector
 *
 * This runs SYNCHRONOUSLY in <head> to determine which elements need
 * to be hidden based on transition context.
 *
 */

const TransitionDataManager = {
  // The current transition data
  data: null,

  CriticalInits: {
    internal: {
      "main-to-main": () => {},
      default: defaultInit,
    },
    external: {
      default: defaultInit,
    },
  },

  init() {
    const data = TransitionDataManager.data;
    const key =
      data.context === "internal"
        ? `${data.from}-to-${data.to}`
        : `${data.current}`;
    const initFunc =
      this.CriticalInits[data.context][key] ||
      this.CriticalInits[data.context]["default"];

    if (initFunc) {
      initFunc();
    }
    return;
  },

  // Get current page's layout
  getSourceLayout() {
    const html = document.documentElement;

    if (html.classList.contains("layout--main")) return "main";
    if (html.classList.contains("layout--slides")) return "slides";

    return "default";
  },

  detectRoot(href) {
    const url = new URL(href, window.location.origin);
    const path = url.pathname;
    const normalized = path.replace(/\/+$/, "");
    if (normalized === "" || normalized === "/index.html") {
      return true;
    }
    return false;
  },

  // Get target layout from internal link
  getTargetLayout(link) {
    const href = link.href;

    // Check data attribute first
    if (link.dataset.layout) {
      return link.dataset.layout;
    }

    // Home page
    if (this.detectRoot(href)) {
      return "main";
    }

    // Main pages
    const mainPages = ["math-research", "math-teaching"];
    if (
      mainPages.some(
        (page) => href.endsWith(`/${page}`) || href.endsWith(`/${page}/`),
      )
    ) {
      return "main";
    }

    if (href.includes("/main")) {
      return "main";
    }

    // Slide pages
    if (href.includes("/slides")) {
      return "slides";
    }

    return "default";
  },

  processLink(link) {
    const isInternal =
      link.hostname === window.location.hostname ||
      link.href.startsWith("file://") ||
      !link.href.includes("://") ||
      link.href.startsWith(window.location.origin);

    const data = isInternal
      ? {
          context: "internal",
          from: this.getSourceLayout(),
          to: this.getTargetLayout(link),
        }
      : {
          context: "external",
          current: this.getSourceLayout(),
        };

    this.saveTransition(data);
  },

  // Store where we're going
  saveTransition(data) {
    sessionStorage.setItem("transition", JSON.stringify(data));
    const root = document.documentElement;
    root.setAttribute("data-transition-context", `${data.context}`);
    if (data.context == "internal") {
      root.setAttribute("data-transition-from", `${data.from}`);
      root.setAttribute("data-transition-to", `${data.to}`);
    } else {
      root.setAttribute("data-transition-current", `${data.current}`);
    }
    this.data = data;
  },

  // Get transition data
  getTransition() {
    // internal transitions
    try {
      const storage = sessionStorage.getItem("transition");
      if (storage) {
        const data = storage ? JSON.parse(storage) : null;
        const root = document.documentElement;
        root.setAttribute("data-transition-context", `${data.context}`);
        root.setAttribute("data-transition-from", `${data.from}`);
        root.setAttribute("data-transition-to", `${data.to}`);
        this.data = data;
        return;
      }
    } catch (e) {
      console.warn("Failed to parse transition data:", e);
    }

    // external transitions
    const data = {
      context: "external",
      current: this.getSourceLayout(),
    };
    const root = document.documentElement;
    root.setAttribute("data-transition-context", "external");
    root.setAttribute("data-transition-current", `${data.current}`);
    this.data = data;
  },

  clearTransition() {
    sessionStorage.removeItem("transition");
    this.data = null;
    const root = document.documentElement;

    root.removeAttribute("data-transition-context");
    root.removeAttribute("data-transition-from");
    root.removeAttribute("data-transition-to");
    root.removeAttribute("data-transition-current");
    root.removeAttribute("data-transition-start");
  },
};

// Get transition and do critical inits
// BEFORE anything renders
(function () {
  "use strict";
  TransitionDataManager.getTransition();
  TransitionDataManager.init();
})();
