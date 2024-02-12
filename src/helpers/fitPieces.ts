import { IBoard, ICut, ICutSizes } from "../store/types";

let isHeightBig = false;

function sortByWidth(pieces: ICutSizes[]) {
  return [...pieces].sort((a, b) => b.width - a.width);
}

function sortByHeight(pieces: ICutSizes[]) {
  return [...pieces].sort((a, b) => b.height - a.height);
}

function biggest(pieces: ICutSizes[]) {
  const areas: number[] = [];
  pieces.forEach((piece) => {
    areas.push(piece.height * piece.width);
  });
  return Math.max(...areas);
}

function initializeBoard(boardWidth: number, boardHeight: number) {
  return {
    width: boardWidth,
    height: boardHeight,
    freeRectangles: [{ x: 0, y: 0, width: boardWidth, height: boardHeight }],
    pieces: [],
  };
}

function canFitPiece(freeRect: ICut, piece: ICutSizes) {
  return freeRect.width >= piece.width && freeRect.height >= piece.height;
}

function findBestFit(board: IBoard, piece: ICutSizes) {
  let bestFit = null;
  let bestWaste = Number.MAX_VALUE;

  board.freeRectangles.forEach((freeRect) => {
    if (canFitPiece(freeRect, piece)) {
      const waste =
        freeRect.width * freeRect.height - piece.width * piece.height;
      if (waste < bestWaste) {
        bestWaste = waste;
        bestFit = freeRect;
      }
    }
  });

  return bestFit;
}

function updateFreeRectangles(board: IBoard, piece: ICut, placement: ICut) {
  let newFreeRects: ICut[] = [];

  board.freeRectangles.forEach((freeRect) => {
    if (!doesOverlap(freeRect, piece, placement)) {
      newFreeRects.push(freeRect);
      return;
    }
    

    // if (board.width >= board.height) {
    if (!isHeightBig) {
      if (placement.x > freeRect.x) {
        newFreeRects.push({
          x: freeRect.x,
          y: freeRect.y,
          width: placement.x - freeRect.x,
          height: freeRect.height,
        });
      }
      if (placement.x + piece.width < freeRect.x + freeRect.width) {
        newFreeRects.push({
          x: placement.x + piece.width,
          y: freeRect.y,
          width: freeRect.x + freeRect.width - (placement.x + piece.width),
          height: freeRect.height,
        });
      }
      if (placement.y > freeRect.y) {
        newFreeRects.push({
          x: freeRect.x,
          y: placement.y,
          width: piece.width,
          height: placement.y - freeRect.y,
        });
      }
      if (placement.y + piece.height < freeRect.y + freeRect.height) {
        newFreeRects.push({
          x: placement.x,
          y: placement.y + piece.height,
          width: piece.width,
          height: freeRect.y + freeRect.height - (placement.y + piece.height),
        });
      }
    } else {
      if (placement.y > freeRect.y) {
        newFreeRects.push({
          x: freeRect.x,
          y: freeRect.y,
          width: freeRect.width,
          height: placement.y - freeRect.y,
        });
      }
      if (placement.y + piece.height < freeRect.y + freeRect.height) {
        newFreeRects.push({
          x: freeRect.x,
          y: placement.y + piece.height,
          width: freeRect.width,
          height: freeRect.y + freeRect.height - (placement.y + piece.height),
        });
      }
      if (placement.x > freeRect.x) {
        newFreeRects.push({
          x: freeRect.x,
          y: placement.y,
          width: placement.x - freeRect.x,
          height: piece.height,
        });
      }
      if (placement.x + piece.width < freeRect.x + freeRect.width) {
        newFreeRects.push({
          x: placement.x + piece.width,
          y: placement.y,
          width: freeRect.x + freeRect.width - (placement.x + piece.width),
          height: piece.height,
        });
      }
    }
  });

  board.freeRectangles = newFreeRects;
}

function doesOverlap(freeRect: ICut, piece: ICutSizes, placement: ICut) {
  return (
    placement.x < freeRect.x + freeRect.width &&
    placement.x + piece.width > freeRect.x &&
    placement.y < freeRect.y + freeRect.height &&
    placement.y + piece.height > freeRect.y
  );
}

function placePiece(board: IBoard, piece: ICutSizes, placement: ICut) {
  let newPiece = {
    width: piece.width,
    height: piece.height,
    x: placement.x,
    y: placement.y,
  };
  board.pieces.push(newPiece);
  updateFreeRectangles(board, newPiece, placement);
}

export function fitPieces(
  boardWidth: number,
  boardHeight: number,
  pieces: ICutSizes[]
) {
  let boards = [initializeBoard(boardWidth, boardHeight)];
  let sortedPieces =
    boardWidth >= boardHeight ? sortByWidth(pieces) : sortByHeight(pieces);
  let biggestPiece = pieces.find(
    (el) => el.height * el.width === biggest(pieces)
  );
  if (biggestPiece) {
    if (biggestPiece?.width >= biggestPiece?.height) {
      isHeightBig = false;
      sortedPieces = sortByWidth(pieces);
    } else {
      isHeightBig = true;
      sortedPieces = sortByHeight(pieces);
    }
  }

  for (let piece of sortedPieces) {
    let j;
    let bestPlacement;
    if (boards.find((board) => findBestFit(board, piece))) {
      j = boards.findIndex((board) => findBestFit(board, piece));
      bestPlacement = findBestFit(boards[j], piece);
      if (bestPlacement) {
        placePiece(boards[j], piece, bestPlacement);
      }
    } else {
      boards.push(initializeBoard(boardWidth, boardHeight));
      j = boards.findIndex((board) => findBestFit(board, piece));
      bestPlacement = findBestFit(boards[j], piece);
      if (bestPlacement) {
        placePiece(boards[j], piece, bestPlacement);
      }
    }
  }

  return boards;
}
