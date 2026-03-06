$(document).ready(function() {
  // Subtle 3D tilt effect on #center
  const $center = $("#center-container");
  let tiltRAF = null;
  let targetRX = 0, targetRY = 0;
  let currentRX = 0, currentRY = 0;
  const MAX_TILT = 8; // degrees

  function animateTilt() {
    currentRX += (targetRX - currentRX) * 0.08;
    currentRY += (targetRY - currentRY) * 0.08;

    $center.css("transform", `perspective(800px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`);

    if (Math.abs(targetRX - currentRX) + Math.abs(targetRY - currentRY) > 0.01) {
      tiltRAF = requestAnimationFrame(animateTilt);
    } else {
      currentRX = targetRX;
      currentRY = targetRY;
      $center.css("transform", `perspective(800px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`);
      tiltRAF = null;
    }
  }

  $center.on("mousemove", function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetRY = ((x - rect.width / 2) / (rect.width / 2)) * MAX_TILT;
    targetRX = -((y - rect.height / 2) / (rect.height / 2)) * MAX_TILT;
    if (!tiltRAF) tiltRAF = requestAnimationFrame(animateTilt);
  });

  $center.on("mouseleave", function() {
    targetRX = 0;
    targetRY = 0;
    if (!tiltRAF) tiltRAF = requestAnimationFrame(animateTilt);
  });

  $("#home-hover-hitbox").on("click", function(e) {
    window.open("/home", "_self");
  });
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
    console.log("fade out")
  })

  $("img").on("drag", function(e) {
    e.preventDefault();
  })

  $(document).on("keydown", function(e) {
    if (e.key === " ") window.open("/home", "_self")
  })
refreshActivity();
});

const originalTitle = document.title || "bhoppings //";
let currentIndex = 0;

function rotateTitle() {
  const rotated = originalTitle.slice(currentIndex) + " " + originalTitle.slice(0, currentIndex);
  document.title = rotated;
  currentIndex = (currentIndex + 1) % originalTitle.length;
}

setInterval(rotateTitle, 200);

var audio = new Audio("/assets/audio/swish.mp3");
audio.volume = 0.5;

document.body.onclick = function () {
  console.log("Body clicked");
  audio.play().catch(function (error) {
    console.error("Error playing audio:", error);
  });
};

function timeAgo(timestamp) {
  if (timestamp < 1e12) {
    timestamp *= 1000;
  }

  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

function updateTimeLastSeen() {
$("#activity-offline-counter").text(
      timeAgo(timeLastSeen)
    );
}

setInterval(updateTimeLastSeen, 1000)

const discordUrl = `https://lantern.rest/api/v1/users/1237591310278463502`;
var timeLastSeen = 0;

async function refreshActivity() {
  const res = await fetch(discordUrl);
  const json = await res.json();

  $("#activity").removeClass("active idling");

  const activity = json.activities && json.activities[0];

  if (activity) {
    const logo = activity.assets?.large_image?.image_url || "";

    if (logo) {
      $("#activity-icon").attr("src", logo);
    }

    $("#activity-title").text(activity.name);
    $("#activity-description").text(
      activity.details || activity.state || "Idling"
    );

    $("#activity").addClass("active");
    return;
  }

  const platforms = json.active_platforms || {};
  const isOnline = Object.values(platforms).some(
    status => status === "online" || status === "idle"
  );

  if (isOnline) {
    $("#activity").addClass("idling");
  } else {
    timeLastSeen = json.last_seen_at.unix;
    updateTimeLastSeen()
  }
  setTimeout(refreshActivity, 10000);
}

$(document).ready(function(e) {
  fetch("/api/views").then(r => r.json()).then(d => $("#view-count").text(d.value));
  if (JSON.parse(localStorage.getItem("visitedBio"))) return;
  localStorage.setItem("visitedBio", "true");
  fetch("/api/views/up");

})
