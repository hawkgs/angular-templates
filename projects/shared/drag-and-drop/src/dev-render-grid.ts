/**
 *
 * !!! Dev functions for debugging purposes. EXCLUDE FROM BUILD !!!
 *
 */

type GridCell = {
  id: string;
  viewRefIdx: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const GRID_VIS_CLASS = 'dev-grid-vis';

/** Renders the spacial grid in the viewport. */
export function devRenderSpacialGrid(grid: GridCell[]) {
  devRemoveSpacialGrid();

  const cont = document.createElement('div');
  cont.classList.add(GRID_VIS_CLASS);
  cont.style.position = 'fixed';
  cont.style.top = '0';
  cont.style.left = '0';
  cont.style.pointerEvents = 'none';

  for (const c of grid) {
    const cell = document.createElement('div');
    cell.style.position = 'absolute';
    cell.style.border = '2px dashed green';
    cell.style.color = 'green';
    cell.style.top = c.y1 + 'px';
    cell.style.left = c.x1 + 'px';
    cell.style.width = c.x2 - c.x1 + 'px';
    cell.style.height = c.y2 - c.y1 + 'px';
    cell.innerHTML = c.id;

    cont.appendChild(cell);
  }

  document.body.appendChild(cont);
}

/** Removes the currently rendered spacial grid, if any. */
export function devRemoveSpacialGrid() {
  const cont = document.body.querySelector('.' + GRID_VIS_CLASS);
  if (cont) {
    cont.remove();
  }
}
