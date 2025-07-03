document.addEventListener("mousemove", (e) => {
    const layers = document.querySelectorAll(".parallax-layer");
  
    const { innerWidth: width, innerHeight: height } = window;
    const x = (e.clientX / width - 0.5) * 2; // range: [-1, 1]
    const y = (e.clientY / height - 0.5) * 2;
  
    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth);
      const movementFactor = (1 - depth) * 0.5 * 100; // 0 → 50vw/vh, 1 → 0
  
      const moveX = -x * movementFactor;
      const moveY = -y * movementFactor;
  
      layer.style.transform = `translate(${moveX}%, ${moveY}%)`;
    });
  });
  