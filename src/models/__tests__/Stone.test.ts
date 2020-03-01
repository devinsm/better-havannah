import Player from 'models/Player';
import Stone from 'models/Stone';
import Coordinate from 'models/Coordinate';

test('stones with same player and same cords are equal', () => {
  const playerOne = new Player({ stoneColor: 'blue' });
  const stoneA = new Stone({
    location: new Coordinate({ file: 'c', rank: 5 }),
    owner: playerOne
  });
  const stoneB = new Stone({
    location: new Coordinate({ file: 'c', rank: 5 }),
    owner: playerOne
  });
  expect(stoneA.equals(stoneB)).toBe(true);
  expect(stoneB.equals(stoneA)).toBe(true);
});

test('stones with different players are not equal', () => {
  const location = new Coordinate({ file: 'c', rank: 5 });
  const stoneA = new Stone({
    location,
    owner: new Player({ stoneColor: 'blue' })
  });
  const stoneB = new Stone({
    location,
    owner: new Player({ stoneColor: 'blue' })
  });
  expect(stoneA.equals(stoneB)).toBe(false);
  expect(stoneB.equals(stoneA)).toBe(false);
});

test('stones with different locations are not equal', () => {
  const owner = new Player({ stoneColor: 'red' });
  const stoneA = new Stone({
    location: new Coordinate({ file: 'c', rank: 5 }),
    owner
  });
  const stoneB = new Stone({
    location: new Coordinate({ file: 'c', rank: 2 }),
    owner
  });
  expect(stoneA.equals(stoneB)).toBe(false);
  expect(stoneB.equals(stoneA)).toBe(false);
});

test('stones with same player and same cords have same hash', () => {
  const playerOne = new Player({ stoneColor: 'blue' });
  const stoneA = new Stone({
    location: new Coordinate({ file: 'c', rank: 5 }),
    owner: playerOne
  });
  const stoneB = new Stone({
    location: new Coordinate({ file: 'c', rank: 5 }),
    owner: playerOne
  });
  expect(stoneA.hash()).toBe(stoneB.hash());
});

// stricter hash than is normal. This hash will be used in JS objects and
// collisions will not be handled (and therefore must be prevented by the hash
// function).
test('stones with different players have different hashes', () => {
  const location = new Coordinate({ file: 'c', rank: 5 });
  const stoneA = new Stone({
    location,
    owner: new Player({ stoneColor: 'blue' })
  });
  const stoneB = new Stone({
    location,
    owner: new Player({ stoneColor: 'blue' })
  });
  expect(stoneA.hash()).not.toBe(stoneB.hash());
});

test('stones with different locations have different hashes', () => {
  const owner = new Player({ stoneColor: 'red' });
  const stoneA = new Stone({
    location: new Coordinate({ file: 'c', rank: 5 }),
    owner
  });
  const stoneB = new Stone({
    location: new Coordinate({ file: 'e', rank: 5 }),
    owner
  });
  expect(stoneA.hash()).not.toBe(stoneB.hash());
});
