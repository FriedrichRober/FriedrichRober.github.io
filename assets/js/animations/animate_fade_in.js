const fadeInAnimation = {
  // Configuration object - customize timing and easing
  config: {
    fadeDuration: 0.7,
    yDuration: 0.4,
    yOffset: 30,
    yEase: "power1.out",
    fadeEase: "power1.out",
    selector: ".page__content",
  },

  /**
   * Initialize fading animation
   * @param {HTMLElement|string} selector - DOM element or selector for element
   */
  init(selector = this.config.selector) {
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

    tl.set(element, { autoAlpha: 0 });

    return tl;
  },

  /**
   * Animate fade in and slightly going upwards
   * @param {HTMLElement|string} selector - DOM element or selector for title
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  enter(selector = this.config.selector, customConfig = {}) {
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
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: config.fadeDuration, ease: config.fadeEase },
        "fade",
      )
      .fromTo(
        element,
        { y: config.yOffset },
        { y: 0, duration: config.yDuration, ease: config.yEase },
        "fade",
      );

    return tl;
  }
};
