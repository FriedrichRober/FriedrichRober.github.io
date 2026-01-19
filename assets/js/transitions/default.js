function defaultExternalEnter(resolve) {
  const tl = gsap.timeline({
    onComplete: () => resolve(),
  });

  tl.add(curtainAnimation.open(), "+=0.8");

  return tl;
}

// Default exit animation
function defaultExit(resolve) {
  const tl = gsap.timeline({
    onComplete: () => resolve(),
  });

  tl.add(curtainAnimation.close());

  return tl;
}

// Default enter animation
function defaultInternalEnter(resolve) {
  const tl = gsap.timeline({
    onComplete: () => resolve(),
  });

  tl.add(curtainAnimation.open(), "+=0.4");

  return tl;
}
