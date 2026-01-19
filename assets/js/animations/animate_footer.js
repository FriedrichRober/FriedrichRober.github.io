const footerAnimation = {
  // Configuration object - customize timing and easing
  config: {
    duration: 1.3,
    enterEase: "power3.out",
    exitEase: "power3.in",
    selector: ".page__footer",
  },

  /**
   * Initialize footer - set initial hidden state
   * @param {HTMLElement|string} selector - DOM element or selector
   */
  init(selector = this.config.selector) {
    const footer =
      typeof selector === "string" ? document.querySelector(selector) : selector;

    if (!footer) {
      console.error(
        `footerAnimation.enter: No element found for selector "${selector}"`,
      );
      return tl;
    }

    gsap.set(footer, {
      x: "100%",
      opacity: 0,
    });
  },

  /**
   * Animate footer entering from right
   * @param {HTMLElement|string} selector - DOM element or selector
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  enter(selector = this.config.selector, customConfig = {}) {
    const footer =
      typeof selector === "string" ? document.querySelector(selector) : selector;
    const tl = gsap.timeline();

    if (!footer) {
      console.error(
        `footerAnimation.enter: No element found for selector "${selector}"`,
      );
      return tl;
    }

    const config = { ...this.config, ...customConfig };

    tl.fromTo(
      footer,
      { x: "100%", autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.enterEase,
      },
    );

    return tl;
  },

  /**
   * Animate footer exiting to left
   * @param {HTMLElement|string} selector - DOM element or selector
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  exit(selector = this.config.selector, customConfig = {}) {
    const footer =
      typeof selector === "string" ? document.querySelector(selector) : selector;
    const tl = gsap.timeline();

    if (!footer) {
      console.error(
        `footerAnimation.enter: No element found for selector "${selector}"`,
      );
      return tl;
    }

    const config = { ...this.config, ...customConfig };

    tl.fromTo(
      footer,
      { x: 0, autoAlpha: 1 },
      {
        x: "-100%",
        autoAlpha: 0,
        duration: config.duration,
        ease: config.exitEase,
      },
    );

    return tl;
  },
};
