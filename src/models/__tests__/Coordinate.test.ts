import Coordinate from 'models/Coordinate';

test('cords with same row and col are equal and have same hash', () => {
  const cord1: Coordinate = new Coordinate({ row: 14, col: 1 });
  const cord2: Coordinate = new Coordinate({ row: 14, col: 1 });
  expect(cord1.equals(cord2)).toBe(true);
  expect(cord2.equals(cord1)).toBe(true);
});

test('cords with same row/col have same hash', () => {
  const cord1: Coordinate = new Coordinate({ row: 9, col: 4 });
  const cord2: Coordinate = new Coordinate({ row: 9, col: 4 });
  expect(cord1.hash()).toBe(cord2.hash());
});

test('cords with different rows are not equal', () => {
  const cord1: Coordinate = new Coordinate({ row: 9, col: 4 });
  const cord2: Coordinate = new Coordinate({ row: 7, col: 4 });
  expect(cord1.equals(cord2)).toBe(false);
  expect(cord2.equals(cord1)).toBe(false);
});

test('cords with different cols are not equal', () => {
  const cord1: Coordinate = new Coordinate({ row: 7, col: 3 });
  const cord2: Coordinate = new Coordinate({ row: 7, col: 5 });
  expect(cord1.equals(cord2)).toBe(false);
  expect(cord2.equals(cord1)).toBe(false);
});

// If this was part of a normal hash table implementation this would not be
// necessary (i.e. there could be collisions). However these "hashes" are
// intended to be used as keys in JavaScript objects where collisions
// will not be handled
test('cords with different cols have different hash', () => {
  const cord1: Coordinate = new Coordinate({ row: 4, col: 2 });
  const cord2: Coordinate = new Coordinate({ row: 4, col: 3 });
  expect(cord1.hash()).not.toBe(cord2.hash());
});
test('cords with different rows have different hash', () => {
  const cord1: Coordinate = new Coordinate({ row: 3, col: 2 });
  const cord2: Coordinate = new Coordinate({ row: 4, col: 2 });
  expect(cord1.hash()).not.toBe(cord2.hash());
});
