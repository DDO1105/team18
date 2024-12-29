let slideIndex = 0;
let slideTimer;


function initSlideshow() {
  showSlides(slideIndex);
  autoplay();
}

function showSlides(index) {
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");

  if (index >= slides.length) {
    slideIndex = 0;
  }
  if (index < 0) {
    slideIndex = slides.length - 1;
  }

  for (let slide of slides) {
    slide.style.display = "none";
  }

  for (let dot of dots) {
    dot.classList.remove("active");
  }

  slides[slideIndex].style.display = "block";
  dots[slideIndex].classList.add("active");
}

function plusSlides(step) {
  slideIndex += step;
  clearTimeout(slideTimer);
  showSlides(slideIndex);
  autoplay();
}

function currentSlide(index) {
  slideIndex = index;
  clearTimeout(slideTimer);
  showSlides(slideIndex);
  autoplay();
}

function autoplay() {
  slideTimer = setTimeout(() => {
    plusSlides(1);
  }, 2000);
}

window.onload = initSlideshow;