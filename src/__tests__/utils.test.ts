import { getCoordinates, getFiles } from 'utils';
import Coordinate from 'models/Coordinate';
import orderBy from 'lodash/orderBy';

test('getFiles works for size 3 board', () => {
  expect(getFiles(3)).toEqual(['a', 'b', 'c', 'd', 'e']);
});

test('getFiles works for size 4 board', () => {
  expect(getFiles(4)).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
});

test('getCoordinates works for size 3 board', () => {
  const coords: Coordinate[] = [
    new Coordinate({ file: 'e', rank: 3 }),
    new Coordinate({ file: 'e', rank: 4 }),
    new Coordinate({ file: 'e', rank: 5 }),
    new Coordinate({ file: 'd', rank: 2 }),
    new Coordinate({ file: 'd', rank: 3 }),
    new Coordinate({ file: 'd', rank: 4 }),
    new Coordinate({ file: 'd', rank: 5 }),
    new Coordinate({ file: 'c', rank: 1 }),
    new Coordinate({ file: 'c', rank: 2 }),
    new Coordinate({ file: 'c', rank: 3 }),
    new Coordinate({ file: 'c', rank: 4 }),
    new Coordinate({ file: 'c', rank: 5 }),
    new Coordinate({ file: 'b', rank: 1 }),
    new Coordinate({ file: 'b', rank: 2 }),
    new Coordinate({ file: 'b', rank: 3 }),
    new Coordinate({ file: 'b', rank: 4 }),
    new Coordinate({ file: 'a', rank: 1 }),
    new Coordinate({ file: 'a', rank: 2 }),
    new Coordinate({ file: 'a', rank: 3 })
  ];
  const sortCoords = (coords: Coordinate[]): Coordinate[] =>
    orderBy(coords, ['rank', 'file']);
  expect(sortCoords(getCoordinates(3))).toEqual(sortCoords(coords));
});
