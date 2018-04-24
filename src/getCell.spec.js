import { create, getCell, cellState } from './minesweeper';
import test from 'ava';

test.beforeEach(ava => {
  const game = create({ width: 8, height: 8, mines: 0 });
  ava.context = { game };
});

test('returns undefined when out of bounds', ava => {
  ava.is(getCell(ava.context.game, { x: -1, y: 0 }), undefined);
  ava.is(getCell(ava.context.game, { x: 8, y: 0 }), undefined);
  ava.is(getCell(ava.context.game, { x: 0, y: -1 }), undefined);
  ava.is(getCell(ava.context.game, { x: 0, y: 8 }), undefined);
});

test('returns a cell when in bounds', ava => {
  ava.deepEqual(
    getCell(ava.context.game, { x: 0, y: 0 }),
    { isMine: false, state: cellState.hidden, touchCount: 0 },
  );
});

test('is immutable', ava => {
  const first = getCell(ava.context.game, { x: 0, y: 0 });
  first.isMine = true;
  const second = getCell(ava.context.game, { x: 0, y: 0 });

  ava.not(first, second);
  ava.notDeepEqual(first, second);
});
