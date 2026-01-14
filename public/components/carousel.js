"use strict";
const carouselImages = document.getElementById("carousel-images");
const carousel = document.getElementById("carousel");
const autoScrollDelay = 8000; // ms for the poopy carousel to auto scroll
var autoScrollWaitTime = autoScrollDelay / 2; // dont change this
const autoScrollPollInterval = 100;
var carouselIsHovered = false;
var carouselScrollAttempts = 0;
var isScrolling = false;
var scrollTimeoutId = null;




function scrollCarousel() {
  const items = carouselImages.getElementsByClassName("carousel-img");
  const first = items[0];
  carouselImages.append(first);
  updateCarouselPositions();
  const index = items[0].getAttribute("data-index");
  const carouselNavigator = document.getElementById("carousel-nav");
  const dots = carouselNavigator.children;
  for (const dot of dots) {
    dot.classList.remove("active-carousel-dot");
  }
  carouselNavigator.children[index].classList.add("active-carousel-dot");
}

function scrollCarouselBackward() {
  const items = carouselImages.getElementsByClassName("carousel-img");
  const last = items[items.length - 1];
  carouselImages.prepend(last);
  updateCarouselPositions();

  const index = items[0].getAttribute("data-index");
  const dots = document.getElementById("carousel-nav").children;

  for (const dot of dots) dot.classList.remove("active-carousel-dot");
  dots[index].classList.add("active-carousel-dot");
}

function updateCarouselPositions() {
  const items = carouselImages.getElementsByClassName("carousel-img");
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.style.transform = `translateX(calc(${i * 100}% - 100%))`;
  }
}


document.addEventListener("DOMContentLoaded", (e) => {
  const items = carouselImages.getElementsByClassName("carousel-img");

  carouselImages.prepend(items[items.length - 1]);
  updateCarouselPositions();

  for (let i = 0; i < items.length; i++) {
    items[i].setAttribute("data-index", i);
  }

  const carouselNavigator = document.createElement("div");
  carouselNavigator.id = "carousel-nav";

  for (let i = 0; i < items.length; i++) {
    const dot = document.createElement("div");
    dot.classList.add("carousel-dot");
    dot.setAttribute("data-index", i);
    carouselNavigator.appendChild(dot);
  }

  carousel.appendChild(carouselNavigator);

  const firstIndex = items[0].getAttribute("data-index");
  carouselNavigator.children[firstIndex].classList.add("active-carousel-dot");

  const getCurrentIndex = () =>
    carouselNavigator.querySelector(".active-carousel-dot").dataset.index;

  carouselNavigator.addEventListener("click", (ev) => {
    if (!ev.target.classList.contains("carousel-dot")) return;

    const targetIndex = Number(ev.target.dataset.index);
    const currentIndex = getCurrentIndex();
    const total = items.length;

    const forward = (targetIndex - currentIndex + total - carouselScrollAttempts) % total;
    const backward = (currentIndex - targetIndex + total) % total;

    if (forward === 0) return;
    
      const oldCarouselScrollAttempts = carouselScrollAttempts;
        carouselScrollAttempts = forward;
      if (oldCarouselScrollAttempts <= 0) attemptCarouselScroll();
    /*if (forward <= backward) {
    } else {
      for (let i = 0; i < backward; i++) scrollCarouselBackward();
    }*/
  });
  setInterval(() => {
    if (!carouselIsHovered && carouselScrollAttempts <= 0) {
      autoScrollWaitTime += autoScrollPollInterval;
    } else {
      autoScrollWaitTime = 0;
    }
    if (autoScrollWaitTime >= autoScrollDelay) {
      scrollCarousel();
      autoScrollWaitTime = 0;
    }
  }, autoScrollPollInterval)

  carousel.addEventListener("mouseenter", (e) => {
    carouselIsHovered = true;
  })
  carousel.addEventListener("mouseleave", (e) => {
    carouselIsHovered = false;
  })
  setTimeout(() => {
    for (const img of items) {
      img.style.transition = "transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)";
    }
  }, autoScrollPollInterval)
});

function carouselOpen() {
  const href = carouselImages.children[1].getAttribute("data-href");
  window.open(href, "_blank");
}

async function attemptCarouselScroll() {
  if (carouselScrollAttempts <= 0 || isScrolling) return;
  
  isScrolling = true;
  
  while (carouselScrollAttempts > 0) {
    carouselScrollAttempts--;
    scrollCarousel();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  isScrolling = false;
}