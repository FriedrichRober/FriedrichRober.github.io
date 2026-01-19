const titleAnimation = {
  // Configuration object - customize timing and easing
  config: {
    totalDelay: 1.5,
    minDelay: 0.1,
    maxDelay: 0.4,
    maxBias: 1,
    maxSequence: 3,
    contentFadeDuration: 1.5,
    contentYDuration: 0.5,
    contentYOffset: 20,
    charDurationMin: 0.4,
    charDurationMax: 0.6,
    charScaleMin: 1.0,
    charScaleMax: 1.2,
    charInitialScale: 0.8,
    ease: "expo.in",
    titleSelector: ".page__title",
    contentSelector: ".page__content",
  },

  // Store split text reference
  split: null,
  chars: [],
  charsSplitByWords: [],
  contentElement: null,

  /**
   * Roll random Y directions with constraints
   * @param {number} count - Number of directions to generate
   * @param {number} maxBias - Maximum total directional bias
   * @param {number} maxSequence - Maximum consecutive same direction
   * @returns {number[]} Array of -1 or 1 values
   */
  _rollYDirections(count, maxBias = 1, maxSequence = 3) {
    let directions;
    let attempts = 0;

    do {
      attempts++;
      directions = Array.from({ length: count }, () =>
        gsap.utils.random([-1, 1]),
      );

      // check total bias
      const sum = directions.reduce((a, b) => a + b, 0);
      if (Math.abs(sum) > maxBias) continue;

      // check max sequence
      let seq = 1;
      let valid = true;
      for (let i = 1; i < directions.length; i++) {
        if (directions[i] === directions[i - 1]) {
          seq++;
          if (seq > maxSequence) {
            valid = false;
            break;
          }
        } else {
          seq = 1;
        }
      }
      if (valid) break;

      if (attempts > 100) break;
    } while (true);

    return directions;
  },

  /**
   * Roll randomized delays that sum to a total
   * @param {number} count - Number of delays to generate
   * @param {number} minDelay - Minimum delay value
   * @param {number} maxDelay - Maximum delay value
   * @param {number} totalDelay - Total sum of all delays
   * @returns {number[]} Array of cumulative delay values
   */
  _rollDelays(count, minDelay = 0.1, maxDelay = 0.4, totalDelay = 1.5) {
    const delays = [];
    let sum = 0;

    for (let i = 0; i < count; i++) {
      const rnd = gsap.utils.random(minDelay, maxDelay);
      delays.push(rnd);
      sum += rnd;
    }

    const scale = totalDelay / sum;
    for (let i = 0; i < count; i++) {
      delays[i] *= scale;
    }

    for (let i = 1; i < count; i++) {
      delays[i] += delays[i - 1];
    }

    if (count > 1) {
      const rest = delays.slice(1);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      return [delays[0], ...rest];
    }
    return delays;
  },

  /**
   * Initialize title animation - split text and hide elements
   * @param {HTMLElement|string} titleElement - DOM element or selector for title
   * @param {HTMLElement|string} contentElement - DOM element or selector for content (optional)
   */
  init(
    titleElement = this.config.titleSelector,
    contentElement = this.config.contentSelector,
  ) {
    gsap.registerPlugin(SplitText);
    const tl = gsap.timeline();

    const titleEl =
      typeof titleElement === "string"
        ? document.querySelector(titleElement)
        : titleElement;

    const contentEl =
      typeof contentElement === "string"
        ? document.querySelector(contentElement)
        : contentElement;

    if (!titleEl || !contentEl) {
      console.error(
        "titleAnimation.init: titleElement or contentElement not found",
      );
      return;
    }

    if (!titleEl) {
      console.error(
        `titleAnimation.init: No element found for selector "${titleElement}"`,
      );
      return;
    }

    // Hide content immediately
    if (contentEl) {
      tl.set(contentEl, { autoAlpha: 0 });
      this.contentElement = contentEl;
    }

    // Split text and hide chars
    this.split = SplitText.create(titleEl, {
      type: "words,chars",
    });

    const { words, chars } = this.split;
    this.chars = chars;

    // Hide all chars immediately
    tl.set(chars, { autoAlpha: 0.0 });

    // Group chars by words
    this.charsSplitByWords = words.map((word) =>
      chars.filter((char) => word.contains(char)),
    );

    return tl;
  },

  /**
   * Animate title characters entering with staggered effect
   * @param {HTMLElement|string} titleElement - DOM element or selector for title
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  enter(titleElement = this.config.titleSelector, customConfig = {}) {
    const config = { ...this.config, ...customConfig };
    const tl = gsap.timeline();

    // Initialize if not already done
    if (!this.split) {
      this.init(titleElement, config.contentSelector);
    }

    if (!this.chars.length) {
      console.error("titleAnimation.enter: Failed to initialize title");
      return tl;
    }

    // Animate each word's characters
    tl.addLabel("words");
    this.charsSplitByWords.forEach((chars) => {
      const l = chars.length;

      const yDirections = this._rollYDirections(
        l,
        config.maxBias,
        config.maxSequence,
      );
      const delays = this._rollDelays(
        l,
        config.minDelay,
        config.maxDelay,
        config.totalDelay,
      );

      chars.forEach((el, i) => {
        tl.fromTo(
          el,
          {
            y:
              el.offsetHeight *
              gsap.utils.random(config.charScaleMin, config.charScaleMax) *
              yDirections[i],
            autoAlpha: 0.0,
            scale: config.charInitialScale,
          },
          {
            y: 0,
            autoAlpha: 1.0,
            scale: 1.0,
            duration: gsap.utils.random(
              config.charDurationMin,
              config.charDurationMax,
            ),
            ease: config.ease,
            delay: delays[i],
          },
          "words",
        );
      });
    });

    // Animate content if present
    if (this.contentElement) {
      tl.addLabel("contentStart", "+=0.1")
        .fromTo(
          this.contentElement,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: config.contentFadeDuration },
          "contentStart",
        )
        .fromTo(
          this.contentElement,
          { y: config.contentYOffset },
          { y: 0, duration: config.contentYDuration },
          "contentStart",
        );
    }

    return tl;
  },
};
