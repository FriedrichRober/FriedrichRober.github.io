const curtainAnimation = {
  // Configuration object - customize timing and easing
  config: {
    containerSelector: "html",
    columns: 5,
    colors: ["#00539F", "#356FA8", "#5E8FB3", "#88AFC0", "#B1C9CC"],
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.inOut",
  },

  // Store overlay reference
  overlay: null,
  blocks: [],

  /**
   * Initialize grid transition - create overlay and blocks
   * @param {string} containerSelector - CSS selector for container
   * @param {Object} customConfig - Override default config
   */
  init(containerSelector = this.config.containerSelector, customConfig = {}) {
    const config = { ...this.config, ...customConfig };
    const container = document.querySelector(containerSelector);

    if (!container) {
      console.error(
        `gridTransition.init: No element found for selector "${containerSelector}"`
      );
      return;
    }

    // Remove existing overlay if present
    if (this.overlay) {
      this.overlay.remove();
    }

    // Create overlay container
    this.overlay = document.createElement("div");
    this.overlay.id = "grid-transition-overlay";
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      pointer-events: none;
      display: grid;
      grid-template-columns: repeat(${config.columns}, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 0;
      view-transition-name: grid-transition-overlay;
    `;

    // Create grid blocks
    this.blocks = [];
    for (let i = 0; i < config.columns * 2; i++) {
      const block = document.createElement("div");
      block.style.cssText = `
        background-color: ${config.colors[i % config.colors.length]};
        width: 100%;
        height: 100%;
      `;
      this.overlay.appendChild(block);
      this.blocks.push(block);
    }

    container.appendChild(this.overlay);
  },

  /**
   * Animate grid blocks opening (revealing page)
   * @param {string} containerSelector - CSS selector for container
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  open(containerSelector = this.config.containerSelector, customConfig = {}) {
    const config = { ...this.config, ...customConfig };
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          this.cleanup();
        }, 100);
      },
    });

    // Initialize if not already done
    if (!this.overlay) {
      this.init(containerSelector, customConfig);
    }

    if (!this.overlay || !this.blocks.length) {
      console.error("gridTransition.open: Failed to initialize overlay");
      return tl;
    }

    const topBlocks = this.blocks.slice(0, config.columns);
    const bottomBlocks = this.blocks.slice(config.columns);

    // Set initial positions (closed)
    gsap.set(topBlocks, { y: "0%" });
    gsap.set(bottomBlocks, { y: "0%" });

    // Build animation order from center outward
    const centerIndex = Math.floor(config.columns / 2);
    const animationOrder = [];
    for (let offset = 0; offset <= centerIndex; offset++) {
      if (centerIndex - offset >= 0) animationOrder.push(centerIndex - offset);
      if (centerIndex + offset < config.columns && offset !== 0)
        animationOrder.push(centerIndex + offset);
    }

    // Animate blocks sliding away
    animationOrder.forEach((colIndex, orderIndex) => {
      const delay = orderIndex * config.stagger;

      tl.to(
        topBlocks[colIndex],
        { y: "-100%", duration: config.duration, ease: config.ease },
        delay
      );
      tl.to(
        bottomBlocks[colIndex],
        { y: "100%", duration: config.duration, ease: config.ease },
        delay
      );
    });

    return tl;
  },

  /**
   * Animate grid blocks closing (covering page)
   * @param {string} containerSelector - CSS selector for container
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  close(containerSelector = this.config.containerSelector, customConfig = {}) {
    const config = { ...this.config, ...customConfig };
    const tl = gsap.timeline();

    // Initialize if not already done
    if (!this.overlay) {
      this.init(containerSelector, customConfig);
    }

    if (!this.overlay || !this.blocks.length) {
      console.error("gridTransition.close: Failed to initialize overlay");
      return tl;
    }

    const topBlocks = this.blocks.slice(0, config.columns);
    const bottomBlocks = this.blocks.slice(config.columns);

    // Set initial positions (open)
    gsap.set(topBlocks, { y: "-100%" });
    gsap.set(bottomBlocks, { y: "100%" });

    // Build animation order from center outward
    const centerIndex = Math.floor(config.columns / 2);
    const animationOrder = [];
    for (let offset = 0; offset <= centerIndex; offset++) {
      if (centerIndex - offset >= 0) animationOrder.push(centerIndex - offset);
      if (centerIndex + offset < config.columns && offset !== 0)
        animationOrder.push(centerIndex + offset);
    }

    // Animate blocks sliding in
    animationOrder.forEach((colIndex, orderIndex) => {
      const delay = orderIndex * config.stagger;

      tl.to(
        topBlocks[colIndex],
        { y: "0%", duration: config.duration, ease: config.ease },
        delay
      );
      tl.to(
        bottomBlocks[colIndex],
        { y: "0%", duration: config.duration, ease: config.ease },
        delay
      );
    });

    return tl;
  },

  /**
   * Remove overlay and clean up
   */
  cleanup() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
      this.blocks = [];
    }
  },
};