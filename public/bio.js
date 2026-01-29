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

var audio = new Audio("/assets/audio/lit_since_birth_2.mp3");
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