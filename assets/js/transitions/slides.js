// Slides start animation
function externalToSlidesEnter(resolve) {
  const tl = gsap.timeline({
    onComplete: () => resolve(),
  });
  const pageContent = document.querySelector(".page__content");
  tl.set([pageContent], { autoAlpha: 0 });
  tl.add(initSlideTitle());
  tl.add(curtainAnimation.init());
  tl.add(curtainAnimation.open(), "+=0.8");
  tl.add(animateSlideTitle());

  return tl;
}

// Slides enter animation
function slidesEnter(resolve) {
  const tl = gsap.timeline({
    onComplete: () => resolve(),
  });

  const pageContent = document.querySelector(".page__content");
  tl.set([pageContent], { autoAlpha: 0 });
  tl.add(initSlideTitle());
  tl.add(curtainAnimation.init());
  tl.add(curtainAnimation.open(), "+=0.4");
  tl.add(animateSlideTitle());

  return tl;
}

function initSlideTitle() {
  const pageInner = document.querySelector(".page__inner-wrap");

  const centeredTitle = document.createElement("h1");
  centeredTitle.className = "centered-page-title";
  centeredTitle.textContent = document
    .querySelector('meta[property="og:title"]')
    ?.getAttribute("content");
  pageInner.appendChild(centeredTitle);
}

function animateSlideTitle() {
  const tl = gsap.timeline();

  const centeredTitle = document.querySelector(".centered-page-title");

  tl.add(lettersAnimation.init(centeredTitle, false));
  tl.add(
    lettersAnimation.exit({
      selector: centeredTitle,
    }),
  );
  tl.add(fadeInAnimation.enter(".page__content"));

  return tl;
}