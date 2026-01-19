const popAnimation = {
  // Configuration object - customize timing and easing
  config: {
    duration: 0.6,
    overshootScale: 1.1,
    enterEase: "back.out(1.7)",
    exitEase: "back.in(1.7)",
    fadeInDuration: 0.3,
    fadeOutDuration: 0.3,
    selector: null, // Must be set by user
  },

  /**
   * Initialize selector - set initial hidden state
   * @param {HTMLElement|string} selector - DOM selector or selector
   */
  init(selector = this.config.selector) {
    const tl = gsap.timeline();

    if (!selector) {
      console.error('popAnimation.init: selector is required');
      return tl;
    }

    const element =
      typeof selector === "string" ? document.querySelector(selector) : selector;

    if (!element) {
      console.error(`popAnimation.init: No selector found for selector "${selector}"`);
      return tl;
    }

    tl.set(element, {
      scale: 0,
      autoAlpha: 0,
    });

    return tl;
  },

  /**
   * Animate selector popping in with bounce effect
   * @param {HTMLElement|string} selector - DOM selector or selector
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  enter(selector = this.config.selector, customConfig = {}) {
    if (!selector) {
      console.error('popAnimation.enter: selector is required');
      return gsap.timeline();
    }

    const element =
      typeof selector === "string" ? document.querySelector(selector) : selector;
    const tl = gsap.timeline();

    if (!element) {
      console.error(`popAnimation.enter: No selector found for selector "${selector}"`);
      return tl;
    }

    const config = { ...this.config, ...customConfig };

    // Fade in opacity quickly
    tl.addLabel("popIn");
    tl.to(element, {
      autoAlpha: 1,
      duration: config.fadeInDuration,
      ease: "power2.out",
    }, "popIn");

    // Pop in: 0 -> overshoot -> 1 with bounce
    tl.to(
      element,
      {
        scale: 1,
        duration: config.duration,
        ease: config.enterEase,
      },
      "popIn"
    );

    return tl;
  },

  /**
   * Animate selector popping out with bounce effect
   * @param {HTMLElement|string} selector - DOM selector or selector
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  exit(selector = this.config.selector, customConfig = {}) {
    if (!selector) {
      console.error('popAnimation.exit: selector is required');
      return gsap.timeline();
    }

    const element =
      typeof selector === "string" ? document.querySelector(selector) : selector;
    const tl = gsap.timeline();

    if (!element) {
      console.error(`popAnimation.exit: No selector found for selector "${selector}"`);
      return tl;
    }

    const config = { ...this.config, ...customConfig };

    // Pop out: 1 -> overshoot -> 0 with bounce
    tl.to(element, {
      scale: 0,
      duration: config.duration,
      ease: config.exitEase,
    });

    // Fade out opacity
    tl.to(
      element,
      {
        autoAlpha: 0,
        duration: config.fadeOutDuration,
        ease: "power2.in",
      },
      `-=${config.fadeOutDuration}` // Overlap with scale animation
    );

    return tl;
  },
};