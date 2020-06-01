import orderBy from 'lodash/orderBy';

import Board, { BoardSide } from '../Board';
import Coordinate from 'models/Coordinate';

const sortCords = (cords: Coordinate[]): Coordinate[] =>
  orderBy(cords, ['file', 'rank'], ['asc', 'asc']);

test('interior cords are not a corners or sides', () => {
  const testCases: { board: Board; interiorCords: Coordinate[] }[] = [
    {
      board: new Board(9),
      interiorCords: [
        new Coordinate({ file: 'm', rank: 11 }),
        new Coordinate({ file: 'j', rank: 14 }),
        new Coordinate({ file: 'i', rank: 2 }),
        new Coordinate({ file: 'b', rank: 4 })
      ]
    },
    {
      board: new Board(5),
      interiorCords: [
        new Coordinate({ file: 'h', rank: 6 }),
        new Coordinate({ file: 'g', rank: 8 }),
        new Coordinate({ file: 'c', rank: 2 }),
        new Coordinate({ file: 'b', rank: 5 })
      ]
    }
  ];

  for (const testCase of testCases) {
    for (const cord of testCase.interiorCords) {
      expect(testCase.board.isCorner(cord)).toBe(false);
      expect(testCase.board.isSide(cord)).toBe(false);
    }
  }
});

test('side cords are not a corners, but are identified as sides', () => {
  const testCases: { board: Board; interiorCords: Coordinate[] }[] = [
    {
      board: new Board(9),
      interiorCords: [
        new Coordinate({ file: 'q', rank: 16 }),
        new Coordinate({ file: 'k', rank: 17 }),
        new Coordinate({ file: 'f', rank: 14 }),
        new Coordinate({ file: 'a', rank: 8 }),
        new Coordinate({ file: 'd', rank: 1 }),
        new Coordinate({ file: 'o', rank: 7 })
      ]
    },
    {
      board: new Board(5),
      interiorCords: [
        new Coordinate({ file: 'i', rank: 8 }),
        new Coordinate({ file: 'f', rank: 9 }),
        new Coordinate({ file: 'a', rank: 3 }),
        new Coordinate({ file: 'b', rank: 1 }),
        new Coordinate({ file: 'd', rank: 1 }),
        new Coordinate({ file: 'h', rank: 4 })
      ]
    }
  ];

  for (const testCase of testCases) {
    for (const cord of testCase.interiorCords) {
      expect(testCase.board.isCorner(cord)).toBe(false);
      expect(testCase.board.isSide(cord)).toBe(true);
    }
  }
});

test('corners are not sides, but are correctly identified as corners', () => {
  const testCases: { board: Board; interiorCords: Coordinate[] }[] = [
    {
      board: new Board(9),
      interiorCords: [
        new Coordinate({ file: 'q', rank: 17 }),
        new Coordinate({ file: 'i', rank: 17 }),
        new Coordinate({ file: 'a', rank: 9 }),
        new Coordinate({ file: 'a', rank: 1 }),
        new Coordinate({ file: 'i', rank: 1 }),
        new Coordinate({ file: 'q', rank: 9 })
      ]
    },
    {
      board: new Board(5),
      interiorCords: [
        new Coordinate({ file: 'i', rank: 9 }),
        new Coordinate({ file: 'e', rank: 9 }),
        new Coordinate({ file: 'a', rank: 5 }),
        new Coordinate({ file: 'a', rank: 1 }),
        new Coordinate({ file: 'e', rank: 1 }),
        new Coordinate({ file: 'i', rank: 5 })
      ]
    }
  ];

  for (const testCase of testCases) {
    for (const cord of testCase.interiorCords) {
      expect(testCase.board.isCorner(cord)).toBe(true);
      expect(testCase.board.isSide(cord)).toBe(false);
    }
  }
});

test('neighbors are correctly determined', () => {
  const testCases: {
    board: Board;
    cordsAndNeighbors: { cord: Coordinate; neighbors: Coordinate[] }[];
  }[] = [
    {
      board: new Board(9),
      cordsAndNeighbors: [
        {
          cord: new Coordinate({ file: 'p', rank: 12 }),
          neighbors: [
            new Coordinate({ file: 'q', rank: 13 }),
            new Coordinate({ file: 'p', rank: 13 }),
            new Coordinate({ file: 'o', rank: 12 }),
            new Coordinate({ file: 'o', rank: 11 }),
            new Coordinate({ file: 'p', rank: 11 }),
            new Coordinate({ file: 'q', rank: 12 })
          ]
        },
        {
          cord: new Coordinate({ file: 'd', rank: 7 }),
          neighbors: [
            new Coordinate({ file: 'e', rank: 8 }),
            new Coordinate({ file: 'd', rank: 8 }),
            new Coordinate({ file: 'c', rank: 7 }),
            new Coordinate({ file: 'c', rank: 6 }),
            new Coordinate({ file: 'd', rank: 6 }),
            new Coordinate({ file: 'e', rank: 7 })
          ]
        },
        {
          cord: new Coordinate({ file: 'q', rank: 9 }),
          neighbors: [
            new Coordinate({ file: 'p', rank: 8 }),
            new Coordinate({ file: 'p', rank: 9 }),
            new Coordinate({ file: 'q', rank: 10 })
          ]
        },
        {
          cord: new Coordinate({ file: 'a', rank: 1 }),
          neighbors: [
            new Coordinate({ file: 'b', rank: 1 }),
            new Coordinate({ file: 'b', rank: 2 }),
            new Coordinate({ file: 'a', rank: 2 })
          ]
        },
        {
          cord: new Coordinate({ file: 'm', rank: 17 }),
          neighbors: [
            new Coordinate({ file: 'l', rank: 17 }),
            new Coordinate({ file: 'n', rank: 17 }),
            new Coordinate({ file: 'm', rank: 16 }),
            new Coordinate({ file: 'l', rank: 16 })
          ]
        }
      ]
    },
    {
      board: new Board(5),
      cordsAndNeighbors: [
        {
          cord: new Coordinate({ file: 'i', rank: 9 }),
          neighbors: [
            new Coordinate({ file: 'i', rank: 8 }),
            new Coordinate({ file: 'h', rank: 8 }),
            new Coordinate({ file: 'h', rank: 9 })
          ]
        },
        {
          cord: new Coordinate({ file: 'e', rank: 9 }),
          neighbors: [
            new Coordinate({ file: 'd', rank: 8 }),
            new Coordinate({ file: 'e', rank: 8 }),
            new Coordinate({ file: 'f', rank: 9 })
          ]
        },
        {
          cord: new Coordinate({ file: 'e', rank: 5 }),
          neighbors: [
            new Coordinate({ file: 'f', rank: 6 }),
            new Coordinate({ file: 'e', rank: 6 }),
            new Coordinate({ file: 'd', rank: 5 }),
            new Coordinate({ file: 'd', rank: 4 }),
            new Coordinate({ file: 'e', rank: 4 }),
            new Coordinate({ file: 'f', rank: 5 })
          ]
        }
      ]
    }
  ];

  for (const testCase of testCases) {
    for (const { cord, neighbors } of testCase.cordsAndNeighbors) {
      const generatedNeighbors = sortCords(testCase.board.getNeighbors(cord));
      const expectedNeighbors = sortCords(neighbors);
      expect(generatedNeighbors.length).toBe(expectedNeighbors.length);
      expect(
        generatedNeighbors.every((cord, index) =>
          cord.equals(expectedNeighbors[index])
        )
      ).toBe(true);
    }
  }
});

test('board sides correctly computed', () => {
  const testCases: {
    board: Board;
    sideCords: Record<BoardSide, Coordinate>;
    nonSideCords: Coordinate[];
  }[] = [
    {
      board: new Board(5),
      sideCords: {
        [BoardSide.TOP_LEFT]: new Coordinate({ file: 'i', rank: 7 }),
        [BoardSide.TOP_RIGHT]: new Coordinate({ file: 'h', rank: 9 }),
        [BoardSide.MIDDLE_LEFT]: new Coordinate({ file: 'g', rank: 3 }),
        [BoardSide.MIDDLE_RIGHT]: new Coordinate({ file: 'b', rank: 6 }),
        [BoardSide.BOTTOM_LEFT]: new Coordinate({ file: 'd', rank: 1 }),
        [BoardSide.BOTTOM_RIGHT]: new Coordinate({ file: 'a', rank: 3 })
      },
      nonSideCords: [
        new Coordinate({ file: 'i', rank: 5 }),
        new Coordinate({ file: 'c', rank: 6 })
      ]
    },
    {
      board: new Board(6),
      sideCords: {
        [BoardSide.TOP_LEFT]: new Coordinate({ file: 'k', rank: 10 }),
        [BoardSide.TOP_RIGHT]: new Coordinate({ file: 'g', rank: 11 }),
        [BoardSide.MIDDLE_LEFT]: new Coordinate({ file: 'j', rank: 5 }),
        [BoardSide.MIDDLE_RIGHT]: new Coordinate({ file: 'e', rank: 10 }),
        [BoardSide.BOTTOM_LEFT]: new Coordinate({ file: 'c', rank: 1 }),
        [BoardSide.BOTTOM_RIGHT]: new Coordinate({ file: 'a', rank: 2 })
      },
      nonSideCords: [
        new Coordinate({ file: 'a', rank: 1 }),
        new Coordinate({ file: 'a', rank: 6 }),
        new Coordinate({ file: 'i', rank: 8 })
      ]
    }
  ];

  for (const testCase of testCases) {
    for (const sideCase of Object.entries(testCase.sideCords)) {
      const [side, cord] = sideCase;
      expect(testCase.board.getBoardSide(cord)).toBe(+side);
    }
    for (const cord of testCase.nonSideCords) {
      expect(testCase.board.getBoardSide(cord)).toBe(null);
    }
  }
});
