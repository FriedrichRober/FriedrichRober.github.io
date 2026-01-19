// Description content for each step
const STEP_CONTENT = {
  step0: {
    header: "What is a group?",
    body:
      "A group is a fundamental object that appears often throughout algebra, " +
      "and I think one of the main reasons for this is that <b>groups encode symmetry</b>.",
  },
  step1: {
    header: "Symmetries of a Square",
    body:
      "Let's start with a simple example: the symmetries of a <b>square</b>. " +
      "A square has 8 symmetries in total - 4 rotations and 4 reflections - some of which you see in action below.",
  },
  step2: {
    header: null,
    body:
      "By labeling the vertices of the square, we can track how each symmetry acts on it. " +
      "These symmetries then form the elements of the associated group. " +
      "For example, a 90-degree clockwise rotation is one such element of the group.",
  },
  step3: {
    header: "Other Symmetries",
    body:
      "We can also study symmetries of more complex shapes, such as the <b>tetrahedron</b>, and even restrict the symmetries considered, for example to just the rotations. " +
      "We can even consider abstract operations, like <b>shuffling a deck of cards</b>.",
  },
  step4: {
    header: null,
    body: "In algebra, we love to classify objects up to <b>isomorphism</b>, that is, determining whether objects are essentially the same or fundamentally different, and we love to give these objects names. ",
  },
  step5: {
    header: null,
    body:
      "The groups shown acting below are the <b>alternating group</b>, the <b>dihedral group</b>, and the <b>symmetric group</b>. " +
      "Although they all act on 4 points, these groups are non-isomorphic.",
  },
  step6: {
    header: "Applications",
    body:
      "Symmetries appear everywhere, and group theory has profound applications across various fields beyond mathematics, " +
      " such as in <b>solid-state physics</b> through crystallographic groups that describe the symmetries of crystal structures, in <b>chemistry</b> via symmetry groups that help predict molecular behaviour and reactivity, and in <b>cryptography</b> where group-theoretic concepts underpin secure communication protocols.",
  },
  step7: {
    header: "Further Information",
    body: "If you are curious about what my research was about, and how the computer can help us to study groups, you can download the slides by clicking on Download below.",
  },
};

const PageState = {
  steps: [],
  currentStep: 0,
  nextBtn: null,
  description: null,
  descriptionHeader: null,
  descriptionBody: null,
  pageContent: null,

  init() {
    // Get DOM elements
    this.pageContent = document.querySelector(".page__content");
    this.description = document.getElementById("description");
    this.descriptionHeader = document.getElementById("description_header");
    this.descriptionBody = document.getElementById("description_body");
    this.nextBtn = document.getElementById("next_state_btn");

    this.disableNext();

    // Define steps
    this.steps = [
      {
        name: "step0",
        run: () => this.runStep0(),
      },
      {
        name: "step1",
        run: () => this.runStep1(),
      },
      {
        name: "step2",
        run: () => this.runStep2(),
      },
      {
        name: "step3",
        run: () => this.runStep3(),
      },
      {
        name: "step4",
        run: () => this.runStep4(),
      },
      {
        name: "step5",
        run: () => this.runStep5(),
      },
      {
        name: "step6",
        run: () => this.runStep6(),
      },
      {
        name: "step7",
        run: () => this.runStep7(),
      },
    ];

    this.steps[0].run();
  },

  runStep0() {
    const tl = gsap.timeline();

    const content = STEP_CONTENT.step0;
    tl.add(this.initDescription(content.header, content.body));

    tl.call(() => this.activateNext());

    return tl;
  },

  runStep1() {
    const tl = gsap.timeline();

    const content = STEP_CONTENT.step1;
    tl.add(this.updateDescription(content.header, content.body));
    tl.add(this.showGrid("grid_one"));
    tl.add(this.playAnimations("grid_one", ["SO_square"]));

    tl.call(() => this.activateNext());

    return tl;
  },

  runStep2() {
    const tl = gsap.timeline();

    const content = STEP_CONTENT.step2;
    tl.add(this.updateDescription(content.header, content.body));

    tl.call(() => this.activateNext());

    return tl;
  },

  runStep3() {
    const tl = gsap.timeline();

    const content = STEP_CONTENT.step3;
    tl.add(this.updateDescription(content.header, content.body));
    tl.add(
      this.updateCaptions(
        "grid_one",
        ["SO_tetrahedron", "SO_square", "card_shuffle"],
        [
          "Rotations of Tetrahedron",
          "Symmetries of Square",
          "Shuffle of Cards",
        ],
        false,
      ),
    );
    tl.addLabel("start");
    tl.add(this.playAnimations("grid_one", ["SO_tetrahedron"]), "start");
    tl.add(this.playAnimations("grid_one", ["card_shuffle"]), "start+0.5");

    // Activate next button when done
    tl.call(() => this.activateNext());

    return tl;
  },

  runStep4() {
    const tl = gsap.timeline();

    const content = STEP_CONTENT.step4;
    tl.add(this.updateDescription(content.header, content.body));

    // Activate next button when done
    tl.call(() => this.activateNext());

    return tl;
  },

  runStep5() {
    const tl = gsap.timeline();

    const content = STEP_CONTENT.step5;
    tl.add(this.updateDescription(content.header, content.body));
    tl.add(
      this.updateCaptions(
        "grid_one",
        ["SO_tetrahedron", "SO_square", "card_shuffle"],
        [
          "$\\strut\\operatorname{Alt}(4)$",
          "$\\strut\\operatorname{Dih}(2 \\cdot 4)$",
          "$\\strut\\operatorname{Sym}(4)$",
        ],
        true,
      ),
    );

    // Activate next button when done
    tl.call(() => this.activateNext());

    return tl;
  },

  runStep6() {
    const tl = gsap.timeline();

    const content = STEP_CONTENT.step6;
    tl.add(this.hideGrid("grid_one"));
    tl.add(() => this.updateDescription(content.header, content.body));

    // Activate next button when done
    tl.call(() => this.activateNext());

    return tl;
  },

  runStep7() {
    const tl = gsap.timeline();

    const content = STEP_CONTENT.step7;
    tl.add(this.updateDescription(content.header, content.body));

    // Activate next button when done
    tl.add(this.hideNext());
    tl.add(() => this.showDownload());

    return tl;
  },

  // Helper method to smoothly resize description box to fit new content
  resizeDescriptionBox(headerText, bodyText) {
    const tl = gsap.timeline();

    // Create a hidden clone to measure the new height
    const clone = this.description.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.height = "auto";
    clone.style.width = this.description.offsetWidth + "px"; // Match original width
    clone.style.top = "0"; // Position at top
    clone.style.left = this.description.offsetLeft + "px"; // Match horizontal position
    this.pageContent.appendChild(clone);

    // Update clone content to match what we're about to show
    const cloneHeader = clone.querySelector("#description_header");
    const cloneBody = clone.querySelector("#description_body");
    if (headerText !== null && cloneHeader) cloneHeader.innerHTML = headerText;
    if (bodyText !== null && cloneBody) cloneBody.innerHTML = bodyText;

    // Measure the new height
    const newHeight = clone.offsetHeight;
    this.pageContent.removeChild(clone);

    const currentHeight = this.description.offsetHeight;
    const heightDiff = Math.abs(newHeight - currentHeight);
    const minDuration = 0.2;
    const maxDuration = 1.7;
    const maxDiff = 100; // Assume 300px difference = max duration
    const duration =
      minDuration +
      (Math.min(heightDiff, maxDiff) / maxDiff) * (maxDuration - minDuration);

    // Animate to new height
    tl.to(this.description, {
      height: newHeight,
      duration: duration,
      ease: "back.out(1.7)",
    });

    return tl;
  },

  initDescription(headerText, bodyText) {
    const tl = gsap.timeline();

    tl.set([this.descriptionHeader, this.descriptionBody], { autoAlpha: 0 });
    tl.add(() => {
      if (headerText !== null) this.descriptionHeader.innerHTML = headerText;
      if (bodyText !== null) this.descriptionBody.innerHTML = bodyText;
    });

    tl.addLabel("content");
    tl.add(popAnimation.init(this.description));
    tl.add(
      popAnimation.enter(this.description, {
        duration: 1.1,
        overshootScale: 1.3,
        enterEase: "back.out(1.7)",
        exitEase: "back.in(1.7)",
        fadeInDuration: 0.9,
      }),
      "content",
    );

    tl.add(this.fadeInText(headerText, bodyText));

    tl.add(popAnimation.init(this.nextBtn), "+=0.5");
    tl.add(popAnimation.enter(this.nextBtn));

    return tl;
  },

  fadeInText(headerText, bodyText) {
    const tl = gsap.timeline();

    tl.addLabel("enter");
    if (headerText !== null) {
      tl.add(
        fadeInAnimation.enter(this.descriptionHeader, {
          fadeDuration: 0.4,
          yDuration: 0.3,
          yOffset: 20,
          yEase: "power1.out",
          fadeEase: "power1.out",
        }),
        "enter",
      );
    }
    if (bodyText !== null) {
      tl.add(
        fadeInAnimation.enter(this.descriptionBody, {
          fadeDuration: 0.7,
          yDuration: 0.4,
          yOffset: 20,
          yEase: "power1.out",
          fadeEase: "power1.out",
        }),
        "enter+=0.2",
      );
    }

    return tl;
  },

  fadeOutText(headerText, bodyText) {
    const tl = gsap.timeline();

    tl.addLabel("exit");
    if (headerText !== null) {
      tl.add(
        fadeOutAnimation.exit(this.descriptionHeader, {
          fadeDuration: 0.4,
          yDuration: 0.4,
          yOffset: -30,
        }),
        "exit",
      );
    }
    if (bodyText !== null) {
      tl.add(
        fadeOutAnimation.exit(this.descriptionBody, {
          fadeDuration: 0.4,
          yDuration: 0.4,
          yOffset: -30,
        }),
        "exit",
      );
    }

    return tl;
  },

  // Helper method to update description content with animation
  // Pass null for headerText or bodyText to skip updating that element
  updateDescription(headerText, bodyText) {
    const tl = gsap.timeline();

    tl.add(this.fadeOutText(headerText, bodyText));
    tl.addLabel("fadeOutComplete");

    tl.add(
      this.resizeDescriptionBox(headerText, bodyText),
      "fadeOutComplete+=0.3",
    );
    tl.addLabel("box");

    tl.add(() => {
      if (headerText !== null) this.descriptionHeader.innerHTML = headerText;
      if (bodyText !== null) this.descriptionBody.innerHTML = bodyText;
    }, "box+=0.3");

    tl.add(this.fadeInText(headerText, bodyText));

    return tl;
  },

  showGrid(grid_id) {
    const tl = gsap.timeline();

    const grid = document.getElementById(grid_id);
    const button = document.getElementById("next_state_btn");
    const footer = document.getElementById("footer");

    const buttonStartPos = button.getBoundingClientRect();
    const footerStartPos = footer.getBoundingClientRect();
    grid.style.display = "grid";
    grid.style.visibility = "hidden";
    const buttonEndPos = button.getBoundingClientRect();
    const footerEndPos = footer.getBoundingClientRect();

    const buttonDeltaX = buttonStartPos.left - buttonEndPos.left;
    const buttonDeltaY = buttonStartPos.top - buttonEndPos.top;

    const footerDeltaX = footerStartPos.left - footerEndPos.left;
    const footerDeltaY = footerStartPos.top - footerEndPos.top;

    tl.addLabel("grid_enter");
    tl.fromTo(
      footer,
      { x: footerDeltaX, y: footerDeltaY },
      { x: 0, y: 0, duration: 1.0, ease: "power2.out" },
      "grid_enter",
    );
    tl.fromTo(
      button,
      { x: buttonDeltaX, y: buttonDeltaY },
      { x: 0, y: 0, duration: 1.0, ease: "power2.out" },
      "grid_enter",
    );

    grid.querySelectorAll(".cell").forEach((cell) => {
      tl.add(popAnimation.init(cell));
    });

    tl.set(grid, { autoAlpha: 1.0 });

    return tl;
  },

  hideGrid(grid_id) {
    const tl = gsap.timeline();

    const grid = document.getElementById(grid_id);
    const button = document.getElementById("next_state_btn");
    const footer = document.getElementById("footer");

    const buttonStartPos = button.getBoundingClientRect();
    const footerStartPos = footer.getBoundingClientRect();
    grid.style.display = "none";
    grid.style.visibility = "hidden";
    const buttonEndPos = button.getBoundingClientRect();
    const footerEndPos = footer.getBoundingClientRect();
    grid.style.display = "grid";
    grid.style.visibility = "visible";

    const buttonDeltaX = buttonStartPos.left - buttonEndPos.left;
    const buttonDeltaY = buttonStartPos.top - buttonEndPos.top;

    const footerDeltaX = footerStartPos.left - footerEndPos.left;
    const footerDeltaY = footerStartPos.top - footerEndPos.top;

    grid.querySelectorAll(".cell").forEach((cell) => {
      tl.add(() => {
        const cellId = cell.id;
        const animationId = cellId.replace('cell_', '');
        const player = window.SVGPlayers?.[animationId];
        if (player) {
          player.pause();
        }
      });
      tl.add(popAnimation.exit(cell));
    });

    tl.set(grid, { autoAlpha: 0.0});
    tl.addLabel("grid_exit");
    tl.fromTo(
      footer,
      { x: 0, y: 0 },
      { x: -footerDeltaX, y: -footerDeltaY, duration: 1.0, ease: "power2.out" },
      "grid_exit",
    );
    tl.fromTo(
      button,
      { x: 0, y: 0 },
      { x: -buttonDeltaX, y: -buttonDeltaY, duration: 1.0, ease: "power2.out" },
      "grid_exit",
    );

    return tl;
  },

  removeGrid(grid_id) {
    const tl = gsap.timeline();

    const grid = document.getElementById(grid_id);
    const footer = document.getElementById("footer");

    const footerStartPos = footer.getBoundingClientRect();
    grid.style.display = "none";
    const footerEndPos = footer.getBoundingClientRect();
    grid.style.display = "grid";

    const footerDeltaX = footerStartPos.left - footerEndPos.left;
    const footerDeltaY = footerStartPos.top - footerEndPos.top;

    grid.querySelectorAll(".cell").forEach((cell) => {
      tl.add(() => {
        const cellId = cell.id;
        const animationId = cellId.replace('cell_', '');
        const player = window.SVGPlayers?.[animationId];
        if (player) {
          player.pause();
        }
      });
      tl.add(popAnimation.exit(cell));
    });

    tl.set(grid, {display: "none"});
    tl.addLabel("grid_exit");
    tl.fromTo(
      footer,
      { x: 0, y: 0 },
      { x: -footerDeltaX, y: -footerDeltaY, duration: 1.0, ease: "power2.out" },
      "grid_exit",
    );

    return tl;
  },

  playAnimations(grid_id, animationIds) {
    const tl = gsap.timeline();
    const grid = document.getElementById(grid_id);
    const cellIds = animationIds.map((id) => `cell_${id}`);

    tl.addLabel("content");

    grid.querySelectorAll(".cell").forEach((cell) => {
      if (cellIds.includes(cell.id)) {
        tl.add(popAnimation.enter(cell), "content");
      }
    });

    tl.add(async () => {
      // Filter players by animationIds
      const playerPromises = animationIds.map((id) =>
        window.SVGPlayers?.[id]?.init({ useCanvas: false }),
      );

      // Wait for all players to be ready
      await Promise.all(playerPromises);

      // Start all players at the same time
      animationIds.forEach((id) => {
        const player = window.SVGPlayers?.[id];
        if (player) {
          player.play();
        }
      });

      return;
    });

    return tl;
  },

  updateCaptions(grid_id, animationIds, captions, hasExit) {
    const tl = gsap.timeline();
    const grid = document.getElementById(grid_id);
    const cellIds = animationIds.map((id) => `cell_${id}`);

    tl.addLabel("caption");

    grid.querySelectorAll(".cell").forEach((cell) => {
      const index = cellIds.indexOf(cell.id);
      if (index >= 0) {
        const caption = cell.querySelector(".caption");
        if (hasExit) {
          tl.add(popAnimation.exit(caption), "caption");
        }
        tl.add(() => {
          caption.innerHTML = captions[index];
          if (window.MathJax) {
            return MathJax.typesetPromise([caption]);
          }
        });
        tl.add(popAnimation.enter(caption));
      }
    });

    return tl;
  },

  next() {
    this.disableNext();
    this.currentStep++;

    const step = this.steps[this.currentStep];
    if (!step) {
      console.log("No more steps");
      return;
    }

    step.run();
  },

  activateNext() {
    if (!this.nextBtn) return;
    gsap.to(this.nextBtn, { opacity: 1, duration: 0.5 });
    this.nextBtn.disabled = false;
  },

  disableNext() {
    if (!this.nextBtn) return;
    gsap.to(this.nextBtn, { opacity: 0.5, duration: 0.2 });
    this.nextBtn.disabled = true;
  },

  hideNext() {
    if (!this.nextBtn) return;
    gsap.to(this.nextBtn, { opacity: 0, duration: 1.0 });
    this.nextBtn.disabled = true;
  },

  showDownload() {
    const tl = gsap.timeline();

    const downloadDiv = document.createElement("div");
    downloadDiv.className = "download-container";
    downloadDiv.style.visibility = "hidden";

    // Create the link
    const downloadLink = document.createElement("a");
    downloadLink.href = `${window.SITE_BASEURL}/assets/pdfs/friedrich-rober-research-presentation.pdf`;
    downloadLink.download = ""; // enables download behavior

    // Create the button
    const downloadButton = document.createElement("button");
    downloadButton.className = "download_button";
    downloadButton.textContent = "Download here!";

    // Assemble elements
    downloadLink.appendChild(downloadButton);
    downloadDiv.appendChild(downloadLink);
    const container = this.pageContent.querySelector(".grid-container");
    container.prepend(downloadDiv);

    tl.add(popAnimation.init(downloadDiv));
    tl.add(popAnimation.enter(downloadDiv));
    return tl;
  }
};

// Initialize when DOM is ready
document.addEventListener("TransitionEnterFinished", () => {
  PageState.init();

  const btn = document.getElementById("next_state_btn");
  if (btn) {
    btn.addEventListener("click", () => PageState.next());
  }
});
