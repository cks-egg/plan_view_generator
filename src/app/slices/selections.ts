import {createSlice, PayloadAction} from '@reduxjs/toolkit'

// type SelectionInRow = {
//     row: number
//     idList: number[]
// };

type RowNId = {
    row: number,
    id: number
}

const getSelectedRow = (rows: SelectionInRow[], rowNumber: number) => {
    let selectedRow = rows.find((selectionInRow) => selectionInRow.row == rowNumber);
    if(!selectedRow){
        selectedRow = {row: rowNumber, idList: []};
        rows.push(selectedRow);
    }
    return selectedRow;
}

export const selectSlice = createSlice({
    name: 'selections',
    initialState: {
        rows: [] as SelectionInRow[]
    },
    reducers: {
        select(state, action: PayloadAction<RowNId>){
            const selectedRow = getSelectedRow(state.rows, action.payload.row);
            if (selectedRow.idList.indexOf(action.payload.id) !== -1){
                selectedRow.idList = selectedRow.idList.filter(id => id !== action.payload.id);
            } else {
                selectedRow.idList.push(action.payload.id);
            }
        },
        clear(state, action: PayloadAction<number>){
            const selectedRow = getSelectedRow(state.rows, action.payload);
            selectedRow.idList = [];
        }
    }
});

export interface SelectionInRow {
    row: number
    idList: number[]
}
export const { select, clear } = selectSlice.actions
export default selectSlice.reducer