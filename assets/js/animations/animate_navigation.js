const navigationAnimation = {
  // Configuration object - customize timing and easing
  config: {
    duration: 1.3,
    stagger: 0.15,
    enterEase: "power3.out",
    selector: ".visible-links .masthead__menu-item a",
  },

  /**
   * Initialize navigation links - set initial hidden state
   * @param {string} selector - CSS selector for links
   */
  init(selector = this.config.selector) {
    const links = document.querySelectorAll(selector);
    if (!links.length) return;

    gsap.set(links, {
      x: 100,
      opacity: 0,
    });
  },

  /**
   * Animate navigation links entering from right
   * @param {string} selector - CSS selector for links
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  enter(selector = this.config.selector, customConfig = {}) {
    const links = document.querySelectorAll(selector);
    const tl = gsap.timeline();

    if (!links.length) return tl;

    const config = { ...this.config, ...customConfig };

    tl.fromTo(
      links,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.enterEase,
      },
    );

    return tl;
  },
};
