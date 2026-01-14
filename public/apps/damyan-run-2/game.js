/* Tower Runner - a tiny Chrome Dino-like game
   - Player: brown rectangle
   - Obstacles: tower.png
   - Score + restart system
*/

(() => {
  const canvas = document.getElementById("game");
  const context = canvas.getContext("2d");

  // Responsive canvas drawing helpers
  const logicalWidth = canvas.width; // 900
  const logicalHeight = canvas.height; // 300

  // World config
  const groundHeight = 36;
  const gravityPixelsPerSecondSq = 2200;
  const jumpVelocityPixelsPerSecond = 860;
  const initialScrollSpeed = 360; // pixels per second
  const maximumScrollSpeed = 780;
  const speedRampPerSecond = 14;

  // Player config
  const playerWidth = 36;
  const playerHeight = 48;
  const playerStartX = 80;

  // Obstacles
  const minSpawnSeconds = 0.95;
  const maxSpawnSeconds = 1.65;
  const obstacleBaseWidth = 42; // scaled draw width
  const obstacleMinHeight = 60;
  const obstacleMaxHeight = 130;

  // Assets
  const towerImage = new Image();
  towerImage.src = "./tower.png";

  // Game state
  let isGameOver = false;
  let score = 0;
  let scrollSpeed = initialScrollSpeed;
  let obstacles = [];
  let timeUntilNextSpawn = randomRange(minSpawnSeconds, maxSpawnSeconds);

  const player = {
    x: playerStartX,
    y: logicalHeight - groundHeight - playerHeight,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0,
    isOnGround: true,
  };

  function resetGame() {
    isGameOver = false;
    score = 0;
    scrollSpeed = initialScrollSpeed;
    obstacles = [];
    timeUntilNextSpawn = randomRange(minSpawnSeconds, maxSpawnSeconds);

    player.x = playerStartX;
    player.y = logicalHeight - groundHeight - player.height;
    player.velocityY = 0;
    player.isOnGround = true;
  }

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnObstacle() {
    const height = Math.floor(randomRange(obstacleMinHeight, obstacleMaxHeight));
    obstacles.push({
      x: logicalWidth + 10,
      y: logicalHeight - groundHeight - height,
      width: obstacleBaseWidth,
      height,
      passed: false,
    });
  }

  function rectanglesOverlap(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  function handleJump() {
    if (isGameOver) return;
    if (player.isOnGround) {
      player.velocityY = -jumpVelocityPixelsPerSecond;
      player.isOnGround = false;
    }
  }

  // Inputs
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === " " || key === "arrowup" || key === "w") {
      event.preventDefault();
      handleJump();
    } else if (key === "r" || key === "enter") {
      if (isGameOver) {
        event.preventDefault();
        resetGame();
      }
    }
  });

  canvas.addEventListener("pointerdown", () => {
    if (isGameOver) {
      resetGame();
    } else {
      handleJump();
    }
  });

  // Game loop
  let lastTimestampMs = performance.now();
  function frameLoop(nowMs) {
    const deltaSeconds = Math.min(0.032, (nowMs - lastTimestampMs) / 1000);
    lastTimestampMs = nowMs;

    update(deltaSeconds);
    draw();

    requestAnimationFrame(frameLoop);
  }

  function update(deltaSeconds) {
    if (!isGameOver) {
      // Progress score by time; scale slightly with speed so it feels rewarding
      score += deltaSeconds * (10 + scrollSpeed * 0.04);

      // Gradually ramp difficulty
      scrollSpeed = Math.min(maximumScrollSpeed, scrollSpeed + speedRampPerSecond * deltaSeconds);

      // Spawn obstacles
      timeUntilNextSpawn -= deltaSeconds;
      if (timeUntilNextSpawn <= 0) {
        spawnObstacle();
        timeUntilNextSpawn = randomRange(minSpawnSeconds, maxSpawnSeconds);
      }
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i -= 1) {
      const obstacle = obstacles[i];
      obstacle.x -= scrollSpeed * deltaSeconds;
      if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(i, 1);
      }
    }

    // Apply gravity
    player.velocityY += gravityPixelsPerSecondSq * deltaSeconds;
    player.y += player.velocityY * deltaSeconds;

    // Ground collision
    const groundY = logicalHeight - groundHeight - player.height;
    if (player.y >= groundY) {
      player.y = groundY;
      player.velocityY = 0;
      player.isOnGround = true;
    }

    // Collisions
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    for (const obstacle of obstacles) {
      if (rectanglesOverlap(playerRect, obstacle)) {
        isGameOver = true;
        break;
      }
    }
  }

  function drawGround() {
    // Ground strip
    context.fillStyle = "#2a2f45";
    context.fillRect(0, logicalHeight - groundHeight, logicalWidth, groundHeight);

    // Ground accent line
    context.fillStyle = "#3b425e";
    context.fillRect(0, logicalHeight - groundHeight, logicalWidth, 4);
  }

  function drawPlayer() {
    context.fillStyle = "#8B4513"; // brown
    context.fillRect(player.x, player.y, player.width, player.height);
  }

  function drawObstacles() {
    for (const obstacle of obstacles) {
      if (towerImage.complete && towerImage.naturalWidth > 0) {
        // Draw scaled to desired width/height, anchored to its rect
        context.drawImage(
          towerImage,
          0,
          0,
          towerImage.naturalWidth,
          towerImage.naturalHeight,
          Math.round(obstacle.x),
          Math.round(obstacle.y),
          obstacle.width,
          obstacle.height
        );
      } else {
        // Fallback rectangle while image loads
        context.fillStyle = "#9ca3af";
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    }
  }

  function drawHud() {
    context.font = "16px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial";
    context.textAlign = "right";
    context.textBaseline = "top";
    context.fillStyle = "#e5e7eb";
    context.fillText(`Score: ${Math.floor(score)}`, logicalWidth - 14, 12);

    if (isGameOver) {
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#ffffff";
      context.font = "bold 28px ui-sans-serif, system-ui";
      context.fillText("Game Over", logicalWidth / 2, logicalHeight / 2 - 10);

      context.font = "16px ui-sans-serif, system-ui";
      context.fillStyle = "#cbd5e1";
      context.fillText("Press R or Enter to restart • Click to restart", logicalWidth / 2, logicalHeight / 2 + 20);
    }
  }

  function clear() {
    context.clearRect(0, 0, logicalWidth, logicalHeight);
  }

  function drawBackgroundSky() {
    const gradient = context.createLinearGradient(0, 0, 0, logicalHeight);
    gradient.addColorStop(0, "#0b1020");
    gradient.addColorStop(1, "#0d1b2a");
    context.fillStyle = gradient;
    context.fillRect(0, 0, logicalWidth, logicalHeight);
  }

  function draw() {
    clear();
    drawBackgroundSky();
    drawGround();
    drawObstacles();
    drawPlayer();
    drawHud();
  }

  // Start
  resetGame();
  requestAnimationFrame(frameLoop);
})();


