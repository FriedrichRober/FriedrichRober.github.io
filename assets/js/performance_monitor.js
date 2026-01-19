/* ============================================================
   Performance Monitor for Detecting Stutters
   ------------------------------------------------------------
   Monitors frame times and detects when the main thread is blocked
   ============================================================ */

class PerformanceMonitor {
  constructor(options = {}) {
    this.targetFPS = options.targetFPS || 60;
    this.stutterThreshold = options.stutterThreshold || 1000 / this.targetFPS * 1.5; // 1.5x frame time
    this.badFrameThreshold = options.badFrameThreshold || 1000 / this.targetFPS * 2; // 2x frame time
    this.logToConsole = options.logToConsole !== false;
    this.showOverlay = options.showOverlay !== false;
    
    this.frameTimes = [];
    this.lastFrameTime = performance.now();
    this.monitoring = false;
    this.rafId = null;
    
    this.stats = {
      totalFrames: 0,
      droppedFrames: 0,
      stutters: 0,
      maxFrameTime: 0,
      avgFrameTime: 0,
      startTime: null,
      endTime: null
    };
    
    if (this.showOverlay) {
      this.createOverlay();
    }
  }
  
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #0f0;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 4px;
      z-index: 10000;
      min-width: 200px;
      pointer-events: none;
    `;
    document.body.appendChild(this.overlay);
    this.updateOverlay();
  }
  
  updateOverlay() {
    if (!this.overlay) return;
    
    const fps = this.stats.totalFrames > 0 
      ? (1000 / this.stats.avgFrameTime).toFixed(1)
      : '0.0';
    
    const duration = this.stats.endTime 
      ? ((this.stats.endTime - this.stats.startTime) / 1000).toFixed(2)
      : this.stats.startTime 
        ? ((performance.now() - this.stats.startTime) / 1000).toFixed(2)
        : '0.00';
    
    const dropRate = this.stats.totalFrames > 0
      ? ((this.stats.droppedFrames / this.stats.totalFrames) * 100).toFixed(1)
      : '0.0';
    
    this.overlay.innerHTML = `
      <div style="margin-bottom: 5px; font-weight: bold; color: #fff;">Performance Monitor</div>
      <div>FPS: <span style="color: ${fps < 55 ? '#f00' : '#0f0'}">${fps}</span></div>
      <div>Avg Frame: ${this.stats.avgFrameTime.toFixed(2)}ms</div>
      <div>Max Frame: <span style="color: ${this.stats.maxFrameTime > this.badFrameThreshold ? '#f00' : '#ff0'}">${this.stats.maxFrameTime.toFixed(2)}ms</span></div>
      <div>Dropped: <span style="color: ${this.stats.droppedFrames > 0 ? '#f00' : '#0f0'}">${this.stats.droppedFrames}</span> (${dropRate}%)</div>
      <div>Stutters: <span style="color: ${this.stats.stutters > 0 ? '#f00' : '#0f0'}">${this.stats.stutters}</span></div>
      <div>Duration: ${duration}s</div>
      <div style="margin-top: 5px; font-size: 10px; color: #888;">
        Status: ${this.monitoring ? '<span style="color: #0f0">●</span> Monitoring' : '<span style="color: #f00">●</span> Stopped'}
      </div>
    `;
  }
  
  start() {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.stats.startTime = performance.now();
    this.stats.endTime = null;
    this.lastFrameTime = performance.now();
    
    if (this.logToConsole) {
      console.log('%c[PerformanceMonitor] Started monitoring', 'color: #0f0; font-weight: bold');
    }
    
    this.tick();
  }
  
  tick() {
    if (!this.monitoring) return;
    
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    
    this.frameTimes.push(frameTime);
    this.stats.totalFrames++;
    this.stats.maxFrameTime = Math.max(this.stats.maxFrameTime, frameTime);
    
    // Calculate average (last 60 frames)
    const recentFrames = this.frameTimes.slice(-60);
    this.stats.avgFrameTime = recentFrames.reduce((a, b) => a + b, 0) / recentFrames.length;
    
    // Detect dropped frames
    if (frameTime > this.stutterThreshold) {
      this.stats.droppedFrames++;
      
      if (frameTime > this.badFrameThreshold) {
        this.stats.stutters++;
        
        if (this.logToConsole) {
          console.warn(
            `%c[PerformanceMonitor] Stutter detected: ${frameTime.toFixed(2)}ms (${(frameTime / 16.67).toFixed(1)}x normal frame time)`,
            'color: #f00; font-weight: bold',
            {
              timestamp: now.toFixed(2),
              frameTime: frameTime.toFixed(2),
              previousFrameTime: this.frameTimes[this.frameTimes.length - 2]?.toFixed(2)
            }
          );
        }
      }
    }
    
    this.updateOverlay();
    this.lastFrameTime = now;
    this.rafId = requestAnimationFrame(() => this.tick());
  }
  
  stop() {
    if (!this.monitoring) return;
    
    this.monitoring = false;
    this.stats.endTime = performance.now();
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    this.updateOverlay();
    
    if (this.logToConsole) {
      this.printSummary();
    }
  }
  
  printSummary() {
    const duration = (this.stats.endTime - this.stats.startTime) / 1000;
    const avgFPS = this.stats.totalFrames / duration;
    
    console.log('%c[PerformanceMonitor] Summary', 'color: #0ff; font-weight: bold; font-size: 14px');
    console.table({
      'Duration': `${duration.toFixed(2)}s`,
      'Total Frames': this.stats.totalFrames,
      'Average FPS': avgFPS.toFixed(1),
      'Average Frame Time': `${this.stats.avgFrameTime.toFixed(2)}ms`,
      'Max Frame Time': `${this.stats.maxFrameTime.toFixed(2)}ms`,
      'Dropped Frames': `${this.stats.droppedFrames} (${((this.stats.droppedFrames / this.stats.totalFrames) * 100).toFixed(1)}%)`,
      'Stutters': this.stats.stutters,
      'Stutter Rate': `${(this.stats.stutters / duration).toFixed(2)} per second`
    });
    
    // Show frame time distribution
    const buckets = {
      'Good (0-20ms)': 0,
      'OK (20-30ms)': 0,
      'Poor (30-50ms)': 0,
      'Bad (50-100ms)': 0,
      'Terrible (>100ms)': 0
    };
    
    this.frameTimes.forEach(ft => {
      if (ft <= 20) buckets['Good (0-20ms)']++;
      else if (ft <= 30) buckets['OK (20-30ms)']++;
      else if (ft <= 50) buckets['Poor (30-50ms)']++;
      else if (ft <= 100) buckets['Bad (50-100ms)']++;
      else buckets['Terrible (>100ms)']++;
    });
    
    console.log('%cFrame Time Distribution:', 'font-weight: bold');
    console.table(buckets);
  }
  
  reset() {
    this.frameTimes = [];
    this.stats = {
      totalFrames: 0,
      droppedFrames: 0,
      stutters: 0,
      maxFrameTime: 0,
      avgFrameTime: 0,
      startTime: null,
      endTime: null
    };
    this.updateOverlay();
  }
  
  destroy() {
    this.stop();
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}

// Make it globally available
window.PerformanceMonitor = PerformanceMonitor;

const monitor = new PerformanceMonitor({
    stutterThreshold: 25,
    badFrameThreshold: 40
});

monitor.start();

// Auto-start example (uncomment to use)
// const monitor = new PerformanceMonitor({
//   logToConsole: true,
//   showOverlay: true,
//   stutterThreshold: 25, // ms
//   badFrameThreshold: 40  // ms
// });
// monitor.start();