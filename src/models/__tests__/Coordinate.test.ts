import Coordinate from 'models/Coordinate';

test('cords with same file & rank are equal and have same hash', () => {
  const cord1: Coordinate = new Coordinate({ file: 'd', rank: 4 });
  const cord2: Coordinate = new Coordinate({ file: 'd', rank: 4 });
  expect(cord1.equals(cord2)).toBe(true);
  expect(cord2.equals(cord1)).toBe(true);
});

test('cords with same file & rank have same hash', () => {
  const cord1: Coordinate = new Coordinate({ file: 'c', rank: 2 });
  const cord2: Coordinate = new Coordinate({ file: 'c', rank: 2 });
  expect(cord1.hash()).toBe(cord2.hash());
});

test('cords with different ranks are not equal', () => {
  const cord1: Coordinate = new Coordinate({ file: 'c', rank: 2 });
  const cord2: Coordinate = new Coordinate({ file: 'c', rank: 5 });
  expect(cord1.equals(cord2)).toBe(false);
  expect(cord2.equals(cord1)).toBe(false);
});

test('cords with different files are not equal', () => {
  const cord1: Coordinate = new Coordinate({ file: 'e', rank: 4 });
  const cord2: Coordinate = new Coordinate({ file: 'b', rank: 4 });
  expect(cord1.equals(cord2)).toBe(false);
  expect(cord2.equals(cord1)).toBe(false);
});

// If this was part of a normal hash table implementation this would not be
// necessary (i.e. there could be collisions). However these "hashes" are
// intended to be used as keys in JavaScript objects where collisions
// will not be handled
test('cords with different ranks have different hash', () => {
  const cord1: Coordinate = new Coordinate({ file: 'c', rank: 2 });
  const cord2: Coordinate = new Coordinate({ file: 'c', rank: 5 });
  expect(cord1.hash()).not.toBe(cord2.hash());
});
test('cords with different files have different hash', () => {
  const cord1: Coordinate = new Coordinate({ file: 'e', rank: 4 });
  const cord2: Coordinate = new Coordinate({ file: 'b', rank: 4 });
  expect(cord1.hash()).not.toBe(cord2.hash());
});
