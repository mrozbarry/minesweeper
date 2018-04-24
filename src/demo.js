import { create, getCell, difficulties, reveal, cellState, toRows, neighboursOf } from './minesweeper';

const renderCell = cell =>
  cell.state === cellState.hidden
  ? 'X'
  : cell.isMine
  ? '*'
  : cell.touchCount > 0
  ? cell.touchCount
  : ' ';

const drawGame = (game, log) => {
  console.log('+', '-'.repeat(game.width * 2 + 1), '+');
  toRows(game).forEach(row => {
    console.log('| ', row.map(renderCell).join(' '), ' |');
  });
  console.log('+', '-'.repeat(game.width * 2 + 1), '+');
  console.log();

  log.slice(-10).forEach(msg => console.log(msg));
}

const getRandomMove = (game, count, log) => {
  // console.log('Random selection');
  const coord = {
    x: Math.floor(Math.random() * game.width),
    y: Math.floor(Math.random() * game.height),
  };

  const cell = getCell(game, coord);
  if (cell.state === cellState.hidden) {
    log.push(`${count}> Random move @ ${JSON.stringify(coord)}`);
    return coord;
  }

  return getNextMove(game, count, log);
}

const getNextBestMove = (game, count, log) => {
  const potentials = game.cells.reduce((memo, cell, index) => {
    if (cell.state === cellState.hidden) return memo;

    const position = {
      x: index % game.width,
      y: Math.floor(index / game.width),
    }

    const totalNeighbours = neighboursOf(game, position);

    const hiddenNeighbours =
      totalNeighbours
      .filter(p => {
        return getCell(game, p).state === cellState.hidden
      });

    const calculateRisk = coord => {
      const neighbours = neighboursOf(game, coord);
      const anyNonTouching = neighbours.some(c => {
        const cell = getCell(game, c);
        return cell.state === cellState.revealed && cell.touchCount === 0;
      });
      if (anyNonTouching) return 0;

      return neighbours.reduce((count, coord) => {
        const cell = getCell(game, coord);
        const touching = cell.state === cellState.hidden ? 6 : cell.touchCount;
        return count + touching;
      }, 0) - neighbours.length;
    }

    return memo
      .concat(
        hiddenNeighbours
        .map(coord => {
          return {
            coord,
            index: index,
            source: [index, position],
            risk: calculateRisk(coord),
          }
        })
      );

  }, []);

  if (potentials.length === 0) return null;

  const sortedByRisk = potentials.sort((a, b) => a.risk - b.risk);
  const best = sortedByRisk[0];
  log.push(`${count}> Weighing risks, best is ${best.risk} @ ${JSON.stringify(best.coord)}(${best.index}), parent: ${JSON.stringify(best.source)}`);
  return best.coord;
}

const doNextMove = (game, count = 0, log = []) => {
  console.clear();
  console.log('Move #', count);

  const currentMove = getNextBestMove(game, count, log) || getRandomMove(game, count, log);

  const updatedGame = reveal(game, currentMove);
  drawGame(updatedGame, log);

  if (updatedGame.endedAt) {
    console.log();
    console.log('Did the AI win? ', updatedGame.alive ? 'yes' : 'no');
    console.log('Game took: ', updatedGame.endedAt - updatedGame.startedAt, 'ms');
    return;
  }

  setTimeout(() => {
    doNextMove(updatedGame, count + 1, log);
  }, 100);
};

doNextMove(create({ width: 15, height: 15, mines: 5 }));
