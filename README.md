# Minesweeper logic

## Running the tests/demo

```
npm install # or yarn
npm run test # uses ava for testing
npm run demo # simple ai that attempts to play. it's not very good :O
```

## Usage

### create(args);

```javascript
import { create, difficulties } from './src/minesweeper';

// Using presets
const easyGame = create(difficulties.easy)

// Custom
const customGame = create({ width: 10, height: 10, mines: 25 });
```

#### args

- `width`: integer, minimum of `8`, defaults to `8`
- `height`: integer, minimum of `8`, defaults to `8`
- `mines`: integer, max of `width * height - 1`, defaults to `0`
- `now`: integer of start milliseconds, defaults to `Date.now()`

#### returns

A new game, with the following structure:

```javascript
const game = {
  cells: [{ isMine: false, state: cellState.hidden, touchCount: 0 }, ...],
  alive: true,
  width: 8,
  height: 8,
  startedAt: 8573847384,
  endedAt: null,
}
```

### reveal(game, args)

```javascript
import { create, difficulties, reveal } from './src/minesweeper';

const initialGame = create(difficulties.easy)
const progressedGame = reveal(initialGame, { x: 1, y: 6 });
```

#### args

- `x`: integer of x coordinate, no default
- `y`: integer of y coordinate, no default
- `now`: integer of current milliseconds, defaults to `Date.now()`

Reveal a new cell at x,y.
If x,y does not exist, game is returned.
If `now` is not supplied, will default to `Date.now()`.
`now` should be relatively bigger than `game.startedAt`, and both should use the same source of truth.

#### returns

Returns a new copy of the game, with updates to `cells`, `alive` and `endedAt`.
If `endedAt` is not null, it means the game has ended, and no more reveals are available.

### toRows(game)

```javascript
import { create, difficulties, toRows } from './src/minesweeper';

const initialGame = create(difficulties.easy)

return toRows(initialGame).map((row, y) => {
  return row.map((cell, x) => {
    // if cell.status === cellState.hidden
    //   interactable blank cell, clicking should call reveal
    // else
    //   show cell.touchCount in cell
  });
});
```

This is meant to make the flat array easier to iterate over and render.

### returns

An array of `game.height` arrays, each with a length of `game.width`

### cellState

An object of different cell states.
In the future, may contain `cellState.flagged`.

```javascript
import { cellState } from './src/minesweeper';

// ...
if (someCell.state === cellState.revealed) {}
if (someCell.state === cellState.hidden) {}
```
