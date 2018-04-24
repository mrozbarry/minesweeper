import { create, reveal, difficulties } from './minesweeper';
import test from 'ava';

test.beforeEach(ava => {
  const game = create({ width: 8, height: 8, mines: 0 });
  ava.context = game;
});

