import { create, setCell } from './minesweeper';
import test from 'ava';

test.beforeEach(ava => {
  const game = create({ width: 8, height: 8, mines: 0 });
  ava.context = { game };
});

test('returns same object when out of bounds', ava => {
  ava.is(setCell(ava.context.game, { x: -1, y: 0 }, {}), ava.context.game);
});

test('returns new object when in bounds', ava => {
  ava.not(setCell(ava.context.game, { x: 0, y: 0 }, {}), ava.context.game);
});
