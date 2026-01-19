async function initAllCells() {
  // Wait for all SVG players to be ready
  if (window.SVGPlayers) {
    const playerPromises = Object.values(window.SVGPlayers)
      .map((p) => p.ready)
      .filter(Boolean);
    
    await Promise.all(playerPromises);
  }
  
  const cells = document.querySelectorAll('.cell.hover');
  
  cells.forEach(cell => {
    popAnimation.init(cell);
    
    const cellId = cell.id;
    const animationId = cellId.replace('cell_', '');
    
    cell.addEventListener('mouseenter', () => {
      const player = window.SVGPlayers?.[animationId];
      if (player) {
        player.play();
      }
    });
    
    cell.addEventListener('mouseleave', () => {
      const player = window.SVGPlayers?.[animationId];
      if (player) {
        player.pause();
      }
    });
  });
}

async function initAllAnimations() {
  if (window.SVGPlayers) {
    await Promise.all(
      Object.values(window.SVGPlayers).map(p => p.init())
    );
  }
}

document.addEventListener('TransitionEnterFinished', initAllAnimations);
document.addEventListener('DOMContentLoaded', initAllCells);