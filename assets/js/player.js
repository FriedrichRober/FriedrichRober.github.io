/* ============================================================
   SVG Sprite Animation Player v2.1 - Microstutter Fix
   ------------------------------------------------------------
   Improvements:
   - Fixed master loop to only run when players are active
   - Better timestamp handling to prevent drift
   - Optimized DOM operations with RAF batching
   - Added frame skipping for consistency
   - Improved time calculation accuracy
   ============================================================ */
const masterPlayers = new Set();
let masterLoopRunning = false;
let lastMasterTimestamp = 0;
let accumulator = 0;

// Configuration: Animation updates at this rate (independent of display refresh)
const FIXED_FPS = 24; // Animation logic updates (30fps is common for game logic)
const FIXED_TIMESTEP = 1000 / FIXED_FPS; // milliseconds per update

function masterLoop(timestamp) {
  if (!masterLoopRunning) return;

  const deltaTime = timestamp - lastMasterTimestamp;
  lastMasterTimestamp = timestamp;
  accumulator += deltaTime;

  while (accumulator >= FIXED_TIMESTEP) {
    // Update all active players
    masterPlayers.forEach((player) => player.update(timestamp));
    while (accumulator >= FIXED_TIMESTEP) {
      accumulator -= FIXED_TIMESTEP;
    }
  }

  // Render (RAF ensures this is smooth even if logic updates are slower)
  masterPlayers.forEach((player) => player.render?.());

  // Only continue loop if we have active players
  if (masterPlayers.size > 0) {
    requestAnimationFrame(masterLoop);
  } else {
    masterLoopRunning = false;
  }
}

function ensureMasterLoop() {
  if (!masterLoopRunning && masterPlayers.size > 0) {
    masterLoopRunning = true;
    lastMasterTimestamp = performance.now();
    requestAnimationFrame(masterLoop);
  }
}

(function () {
  if (!window.SVGPlayers) window.SVGPlayers = {};

  // Auto-discovery still works, but doesn't auto-load
  document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".svg-animation-container");
    containers.forEach(registerAnimation);
  });

  function registerAnimation(container) {
    const id = container.dataset.id;
    const basePath = container.dataset.basePath;
    const previewPath = `${basePath}/preview.svg`;
    const spritePath = `${basePath}/sprite.svg`;
    const timelinePath = `${basePath}/timeline.js`;

    if (!id || !basePath) {
      console.error("Missing animation data attributes", container);
      return;
    }

    let loadingAnimation = null;
    let isInitialized = false;
    let isLoading = false;

    // Show preview immediately on page load
    showPreview(container, previewPath).catch(() => {
      console.warn(`Preview not found for ${id}`);
    });

    const player = {
      container,
      id,
      initialized: false,

      // Initialize and load the animation
      init: async function () {
        if (isInitialized || isLoading) {
          console.warn(`Animation ${id} is already initialized or loading`);
          return this.ready;
        }

        isLoading = true;

        // Start loading animation
        loadingAnimation = createLoadingAnimation(container);

        // Load timeline and sprite
        this.ready = loadAnimation(
          container,
          spritePath,
          timelinePath,
          id,
          this,
          loadingAnimation,
        )
          .then(() => {
            isInitialized = true;
            this.initialized = true;
            isLoading = false;
            return this;
          })
          .catch((err) => {
            console.error(`Failed to load animation ${id}`, err);
            isLoading = false;
            loadingAnimation?.cleanup();
            throw err;
          });

        return this.ready;
      },

      play: () => console.warn(`Player ${id} not ready. Call init() first.`),
      pause: () => {},
      showFirstFrame: () => {},
      gotoFrame: () => {},
      ready: Promise.resolve(),
    };

    window.SVGPlayers[id] = player;
  }

  // ============================================================
  // GSAP Loading Animation
  // ============================================================
  function createLoadingAnimation(container) {
    // Create loading overlay
    const overlay = document.createElement("div");
    overlay.className = "svg-player-loading";
    overlay.innerHTML = `
      <div class="loading-container">
        <svg class="loading-spinner" viewBox="0 0 100 100">
          <circle class="loading-track" cx="50" cy="50" r="40" />
          <circle class="loading-progress" cx="50" cy="50" r="40" />
        </svg>
        <div class="loading-text">Loading<span class="loading-dots"></span></div>
        <div class="loading-percentage">0%</div>
      </div>
    `;

    // Inject styles if not already present
    if (!document.getElementById("svg-player-loading-styles")) {
      const style = document.createElement("style");
      style.id = "svg-player-loading-styles";
      style.textContent = `
        .svg-player-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(81, 81, 81, 0.8);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
        }
        
        .loading-container {
          text-align: center;
          transform: scale(0.8);
          opacity: 0;
          padding: 10%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .loading-spinner {
          display: block;
          width: 120px;
          height: 120px;
          max-width: 40%;
          max-height: 40%;
          margin: 0 auto 20px;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
          flex-shrink: 0;
        }
        
        .loading-track,
        .loading-progress {
          fill: none;
          stroke-width: 6;
        }
        
        .loading-track {
          stroke: rgba(255, 255, 255, 0.2);
        }
        
        .loading-progress {
          stroke: #ffffff;
          stroke-linecap: round;
          stroke-dasharray: 251.2;
          stroke-dashoffset: 251.2;
          transform-origin: center;
          transform: rotate(-90deg);
        }
        
        .loading-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        
        .loading-percentage {
          font-family: "SF Mono", "Monaco", "Inconsolata", monospace;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .loading-dots::after {
          content: '';
          animation: loadingDots 1.5s infinite;
        }
        
        @keyframes loadingDots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
      `;
      document.head.appendChild(style);
    }

    // Position container relatively if not already
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    container.appendChild(overlay);

    // GSAP animations
    const progressCircle = overlay.querySelector(".loading-progress");
    const loadingContainer = overlay.querySelector(".loading-container");
    const percentageEl = overlay.querySelector(".loading-percentage");

    // Animate in
    if (window.gsap) {
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(loadingContainer, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.1,
      });

      // Gentle rotation animation
      gsap.to(overlay.querySelector(".loading-spinner"), {
        rotation: 360,
        duration: 3,
        ease: "none",
        repeat: -1
      });
    } else {
      overlay.style.opacity = 1;
      loadingContainer.style.transform = "scale(1)";
      loadingContainer.style.opacity = 1;
    }

    return {
      element: overlay,

      updateProgress: (percent) => {
        const offset = 251.2 - (251.2 * percent) / 100;

        if (window.gsap) {
          gsap.to(progressCircle, {
            strokeDashoffset: offset,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(percentageEl, {
            innerText: Math.round(percent) + "%",
            duration: 0.3,
            snap: { innerText: 1 },
          });
        } else {
          progressCircle.style.strokeDashoffset = offset;
          percentageEl.textContent = Math.round(percent) + "%";
        }
      },

      cleanup: () => {
        if (window.gsap) {
          gsap.to(loadingContainer, {
            scale: 1.1,
            opacity: 0,
            duration: 0.3,
            ease: "back.in(1.7)",
          });
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            delay: 0.1,
            onComplete: () => overlay.remove(),
          });
        } else {
          overlay.remove();
        }
      },
    };
  }

  // ============================================================
  // Preview Loading
  // ============================================================
  async function showPreview(container, previewPath) {
    const res = await fetch(previewPath);
    const svgText = await res.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const previewSvg = svgDoc.documentElement;

    previewSvg.setAttribute("width", "100%");
    previewSvg.setAttribute("height", "100%");
    previewSvg.style.display = "block";
    previewSvg.classList.add("svg-preview");

    container.appendChild(previewSvg);
  }

  // ============================================================
  // Timeline Loading
  // ============================================================
  function loadTimeline(path, id) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = path;
      script.async = true;
      script.onload = () => {
        const timeline = window[`${id}_timeline`];
        if (!timeline) reject(`Timeline ${id}_timeline not found`);
        else resolve(timeline);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // ============================================================
  // Sprite Parsing (Incremental)
  // ============================================================
  async function parseSpriteIncremental(svgText, progressCallback) {
    const parser = new DOMParser();

    // Extract SVG head
    const svgStart = svgText.indexOf("<svg");
    const svgTagEnd = svgText.indexOf(">", svgStart) + 1;
    const svgHead = svgText.substring(svgStart, svgTagEnd);
    const svgEnd = svgText.lastIndexOf("</svg>");
    const innerContent = svgText.substring(svgStart, svgEnd);

    progressCallback?.(20);

    // Extract background layer (if it exists)
    let backgroundLayer = null;
    const backgroundRegex = /<g\s+id="background"\s+[^>]*>[\s\S]*?<\/g>/;
    const backgroundMatch = innerContent.match(backgroundRegex);

    if (backgroundMatch) {
      backgroundLayer = backgroundMatch[0];
    }

    // Match all frames incrementally
    const frames = [];
    const frameRegex = /<g\s+id="frame_\d+"\s+[^>]*>[\s\S]*?<\/g>/g;

    let match;
    let matchCount = 0;
    const batchSize = 5;

    while ((match = frameRegex.exec(innerContent)) !== null) {
      frames.push(match[0]);
      matchCount++;

      // Yield to main thread and update progress
      if (matchCount % batchSize === 0) {
        const progress = 20 + (matchCount / innerContent.length) * 50000;
        progressCallback?.(Math.min(40, progress));
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    progressCallback?.(50);

    // Create the final SVG container
    const tempWrapper = parser.parseFromString(
      svgHead + "</svg>",
      "image/svg+xml",
    );
    const finalSvg = tempWrapper.documentElement;

    return { svg: finalSvg, frameStrings: frames, svgHead, backgroundLayer };
  }

  // ============================================================
  // Main Animation Loading
  // ============================================================
  async function loadAnimation(
    container,
    spritePath,
    timelinePath,
    id,
    player,
    loadingAnimation,
  ) {
    loadingAnimation?.updateProgress(5);

    // Load timeline
    const timelineData = await loadTimeline(timelinePath, id);
    loadingAnimation?.updateProgress(15);

    // Fetch sprite
    const response = await fetch(spritePath);
    const svgText = await response.text();
    loadingAnimation?.updateProgress(25);

    // Parse sprite incrementally
    const { svg, frameStrings, svgHead, backgroundLayer } = await parseSpriteIncremental(
      svgText,
      (progress) => loadingAnimation?.updateProgress(progress),
    );

    // Prepare SVG (but don't insert yet)
    svg.style.visibility = "hidden";
    svg.style.position = "relative";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";

    loadingAnimation?.updateProgress(60);

    // Insert background layer first (if it exists)
    if (backgroundLayer) {
      const parser = new DOMParser();
      const tempDoc = parser.parseFromString(
        svgHead + backgroundLayer + "</svg>",
        "image/svg+xml",
      );
      const bgElement = tempDoc.querySelector("#background");
      if (bgElement) {
        // Make sure background is fully visible
        bgElement.setAttribute("opacity", 1);
        svg.appendChild(bgElement);
      }
    }

    // Incrementally add frames to SVG (while it's not in DOM yet)
    const parser = new DOMParser();
    const chunkSize = 10;

    for (let i = 0; i < frameStrings.length; i += chunkSize) {
      await new Promise((resolveChunk) => {
        setTimeout(() => {
          const chunkFrames = frameStrings.slice(i, i + chunkSize);
          const chunkString = chunkFrames.join("\n");
          const tempDoc = parser.parseFromString(
            svgHead + chunkString + "</svg>",
            "image/svg+xml",
          );

          chunkFrames.forEach((frameStr) => {
            const idMatch = frameStr.match(/id="(frame_\d+)"/);
            if (idMatch) {
              const frameId = idMatch[1];
              const gEl = tempDoc.querySelector(`#${frameId}`);
              if (gEl) {
                gEl.setAttribute("opacity", 0);
                svg.appendChild(gEl);
              }
            }
          });

          const progress = 60 + (i / frameStrings.length) * 30;
          loadingAnimation?.updateProgress(progress);

          resolveChunk();
        }, 0);
      });
    }

    loadingAnimation?.updateProgress(90);

    // Build animation controls
    await buildAnimationIncremental(svg, timelineData, player);

    loadingAnimation?.updateProgress(100);

    // Now insert the full sprite and remove preview
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        const preview = container.querySelector(".svg-preview");
        container.appendChild(svg);
        svg.style.visibility = "";
        if (preview) container.removeChild(preview);
        resolve();
      });
    });

    // Cleanup loading animation
    setTimeout(() => loadingAnimation?.cleanup(), 300);
  }

  // ============================================================
  // Animation Builder (Incremental)
  // ============================================================
  async function buildAnimationIncremental(
    svg,
    timelineData,
    player,
    chunkSize = 20,
  ) {
    const frames = {};
    const order = [];

    // Cache all frame elements
    const allFrameElements = {};
    const frameNodes = svg.querySelectorAll('[id^="frame_"]');
    frameNodes.forEach((el) => {
      const frameNum = parseInt(el.id.replace("frame_", ""), 10);
      if (!isNaN(frameNum)) {
        allFrameElements[frameNum] = el;
      }
    });

    // Process timeline entries in chunks
    for (let i = 0; i < timelineData.length; i += chunkSize) {
      await new Promise((resolve) => {
        setTimeout(() => {
          const chunk = timelineData.slice(i, i + chunkSize);
          chunk.forEach((entry) => {
            const el = allFrameElements[entry.frame];
            if (el) {
              frames[entry.frame] = el;
              order.push(entry);
              el.setAttribute("opacity", 0);
            }
          });
          resolve();
        }, 0);
      });
    }

    if (!order.length) {
      console.warn("No frames found in sprite");
      return;
    }

    let totalDuration = 0;
    const startTimes = order.map((e) => {
      const start = totalDuration;
      totalDuration += e.duration;
      return start;
    });

    let currentFrame = order[0].frame;
    let playing = false;
    let startTime = null;
    let pausedTime = 0;

    let lastIndex = 0;

    function frameAt(t) {
      // normalize time
      if (t < startTimes[lastIndex]) {
        lastIndex = 0; // we wrapped
      }

      // forward search
      for (let i = lastIndex; i < startTimes.length; i++) {
        const start = startTimes[i];
        const end = startTimes[i + 1] ?? totalDuration;

        if (t >= start && t < end) {
          lastIndex = i;
          return order[i].frame;
        }
      }

      // Fallback to first frame
      lastIndex = 0;
      return order[0].frame;
    }

    player.update = (timestamp) => {
      if (!playing) return;
      if (startTime === null) startTime = timestamp - pausedTime * 1000;
      const elapsed = (timestamp - startTime) / 1000;
      const looped = elapsed % totalDuration;

      const next = frameAt(looped);
      if (next !== currentFrame) {
        frames[currentFrame]?.setAttribute("opacity", 0);
        frames[next]?.setAttribute("opacity", 1);
        currentFrame = next;
      }
    };

    // Public API
    player.play = () => {
      if (!playing) {
        playing = true;
        startTime = null;
        masterPlayers.add(player);
        ensureMasterLoop();
      }
    };

    player.pause = () => {
      if (playing) {
        // Calculate where we are in the animation
        if (startTime !== null) {
          pausedTime = ((performance.now() - startTime) / 1000) % totalDuration;
        }
        playing = false;
        masterPlayers.delete(player);
      }
    };

    player.showFirstFrame = () => {
      player.pause();
      Object.values(frames).forEach((el) => el?.setAttribute("opacity", "0"));
      frames[order[0].frame]?.setAttribute("opacity", "1");
      currentFrame = order[0].frame;
      pausedTime = 0;
    };

    player.gotoFrame = (frameNum) => {
      if (!frames[frameNum]) return;
      player.pause();
      frames[currentFrame]?.setAttribute("opacity", "0");
      frames[frameNum]?.setAttribute("opacity", "1");
      currentFrame = frameNum;

      // Find the time for this frame
      const frameIndex = order.findIndex((e) => e.frame === frameNum);
      if (frameIndex !== -1) {
        pausedTime = startTimes[frameIndex];
      }
    };

    // Initialize
    player.showFirstFrame();
  }
})();
