const carousel = document.getElementById("carousel");


function scrollCarousel() {
    const items = carousel.getElementsByClassName("carousel-img");
    const last = items[items.length - 1];
    console.log(last)
    carousel.prepend(last);
    last.remove();
}