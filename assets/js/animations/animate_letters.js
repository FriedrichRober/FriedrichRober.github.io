const lettersAnimation = {
  // Configuration object - customize timing and easing
  config: {
    totalDelay: 1.5,
    minDelay: 0.1,
    maxDelay: 0.4,
    maxBias: 1,
    maxSequence: 3,
    charDurationMin: 0.4,
    charDurationMax: 0.6,
    charScaleMin: 1.0,
    charScaleMax: 1.2,
    charInitialScale: 0.8,
    ease: "expo.in",
    selector: ".page__title",
  },

  // Store split text reference
  split: null,
  chars: [],
  charsSplitByWords: [],

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
   * Initialize element animation - split text and hide elements
   * @param {HTMLElement|string} selector - DOM element or selector for element
   */
  init(selector = this.config.selector, hide = true) {
    gsap.registerPlugin(SplitText);
    const tl = gsap.timeline();

    const element =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;

    if (!element) return tl;

    // Split text and hide chars
    this.split = SplitText.create(element, {
      type: "words,chars",
    });

    const { words, chars } = this.split;
    this.chars = chars;

    // Hide all chars immediately
    if (hide) {
      tl.set(chars, { autoAlpha: 0.0 });
    }

    // Group chars by words
    this.charsSplitByWords = words.map((word) =>
      chars.filter((char) => word.contains(char)),
    );

    return tl;
  },

  /**
   * Animate element characters entering with staggered effect
   * @param {HTMLElement|string} selector - DOM element or selector for element
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  enter(selector = this.config.titleSelector, customConfig = {}) {
    const config = { ...this.config, ...customConfig };
    const tl = gsap.timeline();

    // Initialize if not already done
    if (!this.split) {
      this.init(selector, true);
    }

    if (!this.chars.length) {
      console.error("titleAnimation.enter: Failed to initialize element");
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

    return tl;
  },

  /**
   * Animate element characters entering with staggered effect
   * @param {HTMLElement|string} selector - DOM element or selector for element
   * @param {Object} customConfig - Override default config
   * @returns {gsap.core.Timeline} GSAP Timeline
   */
  exit(selector = this.config.titleSelector, customConfig = {}) {
    const config = { ...this.config, ...customConfig };
    const tl = gsap.timeline();

    // Initialize if not already done
    if (!this.split) {
      this.init(selector, false);
    }

    if (!this.chars.length) {
      console.error("titleAnimation.enter: Failed to initialize element");
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
            y: 0,
            autoAlpha: 1.0,
            scale: 1.0,
          },
          {
            y:
              el.offsetHeight *
              gsap.utils.random(config.charScaleMin, config.charScaleMax) *
              yDirections[i],
            autoAlpha: 0.0,
            scale: config.charInitialScale,
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

    return tl;
  },
};
