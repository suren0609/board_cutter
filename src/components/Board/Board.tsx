import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fitPieces } from "../../helpers/fitPieces";
import { RootState } from "../../store";
import { setBoards } from "../../store/slices/boardSlice";
import styles from "./Board.module.scss";

const Board: FC = () => {
  const dispatch = useDispatch();

  const { cuts } = useSelector((state: RootState) => state.cuts);
  const { boards, boardSize } = useSelector((state: RootState) => state.boards);

  const boardSizeShow = {
    width: boardSize.width / 2,
    height: boardSize.height / 2,
  };

  useEffect(() => {
    dispatch(
      setBoards(fitPieces(boardSizeShow.width, boardSizeShow.height, cuts))
    );
  }, [cuts]);

  return (
    <div className={styles.BoardComponent}>
      <h2>BOARD</h2>

      {boards.map((board, i) => (
        <div
          key={i}
          className={styles.board}
          style={{
            width: `${board.width}px`,
            height: `${board.height}px`,
          }}
        >
          {board.pieces.map((cut, index) => (
            <div
              className={styles.cut}
              style={{
                left: `${cut.x}px`,
                top: `${cut.y}px`,
                width: `${cut.width}px`,
                height: `${cut.height}px`,
              }}
              key={index}
            >
              {cut.width * 2}x{cut.height * 2}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
