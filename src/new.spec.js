import { create, difficulties } from './minesweeper';
import test from 'ava';

test('can create a new game', ava => {
  const startedAt = Date.now();
  const game = create({ width: 8, height: 8, mines: 1, startedAt });
  ava.truthy(Array.isArray(game.cells), 'has cells');
  ava.is(game.cells.length, 64, 'has correct number of cells');
  ava.is(game.width, 8, 'has correct number of cells');
  ava.is(game.height, 8, 'has correct number of cells');
  ava.is(game.alive, true, 'has alive state');
  ava.is(game.startedAt, startedAt, 'has startedAt time');
});

test('must have correct size', ava => {
  const startedAt = Date.now();
  ava.throws(() => create({ width: 7, height: 8, mines: 1, startedAt }));
  ava.throws(() => create({ width: 'test', height: 8, mines: 1, startedAt }));

  ava.throws(() => create({ width: 8, height: 7, mines: 1, startedAt }));
  ava.throws(() => create({ width: 8, height: 'test', mines: 1, startedAt }));

  ava.throws(() => create({ width: 8, height: 8, mines: 64, startedAt }));
});

test('always has the correct number of mines', ava => {
  const countMines = game =>
    game.cells.reduce((c, m) => c + (m.isMine ? 1 : 0), 0);

  ava.plan(3);
  for(let difficulty of Object.values(difficulties)) {
    const game = create(difficulty);
    const mines = countMines(game);
    ava.is(mines, difficulty.mines);
  }
});
