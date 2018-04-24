import { create, reveal, getCell, setCell, cellState } from './minesweeper';
import test from 'ava';

test.beforeEach(ava => {
  const game = create({ width: 8, height: 8, mines: 0 });
  ava.context = { game };
});

test('reveals single cell when empty', ava => {
  const coord = { x: 0, y: 0 };
  const game = reveal(ava.context.game, coord);
  const cell = getCell(game, coord);
  ava.is(cell.state, cellState.revealed, 'not revealed');
  ava.truthy(game.cells.slice(1).every(({ state }) => state === cellState.hidden), 'others revealed');
  ava.truthy(game.alive, 'dead');
});

test('ends game when cell is a mine', ava => {
  const coord = { x: 0, y: 0 };
  const game = reveal(setCell(ava.context.game, coord, { isMine: true }), coord);
  ava.falsy(game.alive, 'dead');
});
