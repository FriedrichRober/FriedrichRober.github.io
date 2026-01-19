const sidebarAnimation = {
  // Configuration object - customize timing and easing
  config: {
    xOffset: -200,
    duration: 1.5,
    initialScale: 0.8,
    enterEase: "power1.out",
    selector: ".sidebar.sticky", // Must be set by user
  },

  /**
   * Initialize sidebar - set initial hidden state
   * @param {HTMLElement|string} selector - DOM element or selector
   */
  init(selector = this.config.selector) {
    const element =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;

    if (!element) {
      console.error(`sidebar.init: No element found for selector "${element}"`);
      return;
    }

    gsap.set(element, {
      autoAlpha: 0.0,
    });
  },

  /**
   * Animate sidebar entering with slide-in effect
   * @param {HTMLElement|string} selector - DOM element or selector
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  enter(selector = this.config.selector, customConfig = {}) {
    const tl = gsap.timeline();

    const element =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;

    if (!element) {
      console.error(
        `sidebar.enter: No element found for selector "${element}"`,
      );
      return tl;
    }

    const config = { ...this.config, ...customConfig };

    tl.fromTo(
      element,
      {
        x: config.xOffset,
        autoAlpha: 0.0,
        scale: config.initialScale,
      },
      {
        x: 0,
        autoAlpha: 1.0,
        scale: 1.0,
        duration: config.duration,
        ease: config.enterEase,
      },
    );

    return tl;
  },
};
