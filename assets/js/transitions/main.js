function externalToMainEnter(resolve) {
  const tl = gsap.timeline({
    onComplete: () => resolve(),
  });

  tl.addLabel("init");
  tl.add(sidebarAnimation.init(), "init");
  tl.add(navigationAnimation.init(), "init");
  tl.add(footerAnimation.init(), "init");
  tl.add(lettersAnimation.init(".page__title"), "init");
  tl.add(fadeInAnimation.init(".page__content"), "init");
  document.querySelectorAll(".cell").forEach((cell) => {
    tl.add(popAnimation.init(cell), "init");
  });

  tl.addLabel("start");
  tl.add(curtainAnimation.open(), "start+=0.8");

  tl.addLabel("curtain");
  tl.add(sidebarAnimation.enter(), "curtain");
  tl.add(navigationAnimation.enter(), "curtain");
  tl.add(footerAnimation.enter(), "curtain");
  tl.add(
    lettersAnimation.enter({
      selector: ".page__title",
    }),
    "curtain",
  ).addLabel("title");
  tl.add(
    fadeInAnimation.enter(".page__content", {
      fadeDuration: 0.7,
      yDuration: 0.4,
      yOffset: 30,
      yEase: "power1.out",
      fadeEase: "power1.out",
    }),
    "title+=0.1",
  );
  tl.addLabel("content");
  document.querySelectorAll(".cell").forEach((cell) => {
    tl.add(popAnimation.enter(cell), "content");
  });

  return tl;
}

function mainToMainExit(resolve) {
  const tl = gsap.timeline({
    onComplete: () => resolve(),
  });

  tl.addLabel("cells");
  document.querySelectorAll(".cell").forEach((cell) => {
    tl.add(popAnimation.exit(cell), "cells");
  });
  tl.addLabel("start");
  tl.add(footerAnimation.exit(), "start");
  tl.add(
    fadeOutAnimation.exit(".page__title", {
      fadeDuration: 0.4,
      yDuration: 0.3,
      yOffset: -20,
    }),
    "start+=0.3",
  );
  tl.add(
    fadeOutAnimation.exit(".page__content", {
      fadeDuration: 0.4,
      yDuration: 0.3,
      yOffset: -20,
    }),
    "start+=0.5",
  );

  return tl;
}

function mainToMainEnter(resolve) {
  const tl = gsap.timeline({
    onComplete: () => resolve(),
  });

  tl.addLabel("init");
  tl.add(footerAnimation.init(), "init");
  document.querySelectorAll(".cell").forEach((cell) => {
    tl.add(popAnimation.init(cell), "init");
  });

  tl.addLabel("start");
  tl.add(footerAnimation.enter(), "start");
  tl.add(
    fadeInAnimation.enter(".page__title", {
      fadeDuration: 0.4,
      yDuration: 0.3,
      yOffset: 20,
      yEase: "power1.out",
      fadeEase: "power1.out",
    }),
    "start+=0.3",
  );
  tl.add(
    fadeInAnimation.enter(".page__content", {
      fadeDuration: 0.7,
      yDuration: 0.4,
      yOffset: 30,
      yEase: "power1.out",
      fadeEase: "power1.out",
    }),
    "start+=0.5",
  );
  tl.addLabel("content");
  document.querySelectorAll(".cell").forEach((cell) => {
    tl.add(popAnimation.enter(cell), "content");
  });

  return tl;
}
