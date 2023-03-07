import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SelectionInRow = {
  row: number;
  idList: number[];
};

type RowNId = {
  row: number;
  id: number;
};

const getSelectedRow = (rows: SelectionInRow[], rowNumber: number) => {
  let selectedRow = rows.find(
    (selectionInRow) => selectionInRow.row === rowNumber
  );
  if (!selectedRow) {
    selectedRow = { row: rowNumber, idList: [] };
    rows.push(selectedRow);
  }
  //   console.log('rows', rows);
  //   console.log('rowNumber', rowNumber);

  return selectedRow;
};

export const selectSlice = createSlice({
  name: 'selections',
  initialState: {
    rows: [] as SelectionInRow[],
  },
  reducers: {
    select(state, action: PayloadAction<RowNId>) {
      const selectedRow = getSelectedRow(state.rows, action.payload.row); // ImageItem에서 선택한 행
      if (selectedRow.idList.indexOf(action.payload.id) !== -1) {
        // 클릭한 id가 있으면 그 id를 제외한 id들로만 filter
        selectedRow.idList = selectedRow.idList.filter(
          (id) => id !== action.payload.id
        );
      } else {
        selectedRow.idList.push(action.payload.id);
      }
      console.log(action.payload.id);
    },
    clear(state, action: PayloadAction<number>) {
      const selectedRow = getSelectedRow(state.rows, action.payload);
      selectedRow.idList = [];
      // filter((v) => v !== action.payload);
    },
    edit(state, action: PayloadAction<number>) {
      const selectedRow = getSelectedRow(state.rows, action.payload);
    },
  },
});

export const { select, clear } = selectSlice.actions;
export default selectSlice.reducer;
