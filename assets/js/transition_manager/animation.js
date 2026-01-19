const TransitionAnimationManager = {
  // Animation registry
  Animations: {
    internal: {
      exit: {
        "main-to-main": mainToMainExit,
        default: defaultExit,
      },
      enter: {
        "main-to-main": mainToMainEnter,
        "main-to-slides": externalToSlidesEnter,
        "slides-to-main": externalToMainEnter,
        default: defaultInternalEnter,
      },
    },
    external: {
      enter: {
        main: externalToMainEnter,
        slides: externalToSlidesEnter,
        default: defaultExternalEnter,
      },
      exit: {
        default: defaultExit,
      },
    },
  },

  // Play transition animations
  async playAnimation(type) {
    const data = TransitionDataManager.data;
    const key =
      data.context === "internal"
        ? `${data.from}-to-${data.to}`
        : `${data.current}`;
    const animation =
      this.Animations[data.context][type][key] ||
      this.Animations[data.context][type]["default"];

    document.body.style.pointerEvents = "none";
    if (animation) {
      return new Promise((resolve) => animation(resolve)).then(() => {
        document.body.style.pointerEvents = "auto";
        if (type === "enter") {
          const event = new CustomEvent("TransitionEnterFinished");
          document.dispatchEvent(event);
          TransitionDataManager.clearTransition();
        }
      });
    }
    return Promise.resolve();
  },

  // Initialize - this should run AFTER all animation files are loaded
  async init() {
    // Handle exits
    const links = document.querySelectorAll("a");

    links.forEach((link) => {
      link.addEventListener("click", async (e) => {
        if (
          link.getAttribute("href").startsWith("#") ||
          link.href.startsWith("mailto:")
        ) {
          return;
        }
        TransitionDataManager.processLink(link);

        e.preventDefault();

        await this.playAnimation("exit");

        window.location.href = link.href;
      });
    });

    // Handle enters
    await this.playAnimation("enter");
  },
};

document.addEventListener("DOMContentLoaded", () =>
  TransitionAnimationManager.init(),
);
