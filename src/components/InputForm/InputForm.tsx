import { FC, FormEvent, useState } from "react";
import { ICutInput } from "../../store/types";
import styles from "./InputForm.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setBoardSize } from "../../store/slices/boardSlice";

interface InputFormProps {
  onAddCut: (cut: ICutInput) => void;
}

const InputForm: FC<InputFormProps> = ({ onAddCut }) => {
  const [height, setHeight] = useState<number | "">("");
  const [width, setWidth] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");

  const { boardSize } = useSelector((state: RootState) => state.boards);

  const [boardHeight, setBoardHeight] = useState<number | "">(boardSize.height);
  const [boardWidth, setBoardWidth] = useState<number | "">(boardSize.width);

  const dispatch = useDispatch();

  


  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (height !== "" && width !== "" && quantity !== "") {
      const newCut = {
        height: height / 2,
        width: width / 2,
        quantity: quantity,
      };
      onAddCut(newCut);
    }
    if (boardHeight !== "" && boardWidth !== "") {
        dispatch(setBoardSize({width: boardWidth, height: boardHeight}))
      }
    setHeight("");
    setWidth("");
    setQuantity("");
  };
  return (
    <form className={styles.InputForm} onSubmit={handleAdd}>
      <div className={styles.labelAndInput}>
        <label htmlFor="BoardWidth">Board Width</label>
        <input
          name="BoardWidth"
          type="number"
          value={boardWidth}
          onChange={(e) => setBoardWidth(parseInt(e.target.value))}
          min={1}
          max={boardWidth}
        />
      </div>
      <div className={styles.labelAndInput}>
        <label htmlFor="BoardwHeight">Board Height</label>
        <input
          name="BoardwHeight"
          type="number"
          value={boardHeight}
          onChange={(e) => setBoardHeight(parseInt(e.target.value))}
          min={1}
          max={boardHeight}
        />
      </div>
      <div className={styles.labelAndInput}>
        <label htmlFor="width">Width</label>
        <input
          name="width"
          type="number"
          value={width}
          onChange={(e) => setWidth(parseInt(e.target.value))}
          min={1}
          max={boardWidth}
        />
      </div>
      <div className={styles.labelAndInput}>
        <label htmlFor="height">Height</label>
        <input
          name="height"
          type="number"
          value={height}
          onChange={(e) => setHeight(parseInt(e.target.value))}
          min={1}
          max={boardHeight}
        />
      </div>
      <div className={styles.labelAndInput}>
        <label htmlFor="quantity">Quantity</label>
        <input
          name="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min={1}
        />
      </div>

      <input className={styles.addBtn} type="submit" value="Add" />
    </form>
  );
};

export default InputForm;
