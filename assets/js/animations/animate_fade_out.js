const fadeOutAnimation = {
  // Configuration object - customize timing and easing
  config: {
    fadeDuration: 0.4,
    yDuration: 0.4,
    yOffset: -30,
    yEase: "power1.out",
    fadeEase: "power1.out",
    selector: ".page__content",
  },

  /**
   * Animate fade out and slightly going downwards
   * @param {HTMLElement|string} selector - DOM element or selector for title
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  exit(selector = this.config.selector, customConfig = {}) {
    const config = { ...this.config, ...customConfig };
    const tl = gsap.timeline();

    const element =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;

    if (!element) {
      console.error(
        `fadeAnimation.enter: No element found for selector "${element}"`,
      );
      return tl;
    }

    tl.addLabel("fade")
      .fromTo(
        element,
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: config.fadeDuration, ease: config.fadeEase },
        "fade",
      )
      .fromTo(
        element,
        { y: 0 },
        { y: config.yOffset, duration: config.yDuration, ease: config.yEase },
        "fade",
      );

    return tl;
  }
};
