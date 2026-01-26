$(document).ready(function() {
  $(".social-button").on("mousedown", function(e) {
    const href = $(this).attr("data-href");
    if (e.button === 1) {
      window.open(href, "_blank");
    } else if (e.button === 0) {
      window.open(href, "_blank");
    }
  });

  $(".social-button").on("auxclick", function(e) {
    if (e.button === 1) e.preventDefault();
  });

  $("#click-to-enter").on("click", function(e) {
    $(this).fadeOut(500, "swing");
  })

  $("img").on("drag", function(e) {
    e.preventDefault();
  })
});

const originalTitle = document.title || "bhoppings //";
let currentIndex = 0;

function rotateTitle() {
  const rotated = originalTitle.slice(currentIndex) + " " + originalTitle.slice(0, currentIndex);
  document.title = rotated;
  currentIndex = (currentIndex + 1) % originalTitle.length;
}

setInterval(rotateTitle, 200);

// Create an audio element and set its source
var audio = new Audio("/assets/audio/lit_since_birth_2.mp3");
audio.volume = 0.5;

// Add an event listener to the document body to play the audio on click
document.body.onclick = function () {
  console.log("Body clicked"); // Debug log
  audio.play().catch(function (error) {
    console.error("Error playing audio:", error); // Log any playback errors
  });
};
