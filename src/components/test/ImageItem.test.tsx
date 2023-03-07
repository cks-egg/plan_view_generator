import {act, render, screen} from "@testing-library/react";

import ImageItem, { Props } from "../ImageItem";
import store from "../../app/store";
import {Provider} from "react-redux";
import {useAppDispatch} from "../../app/hooks";
import {select} from "../../app/slices/selections";

const testProps: Props = {
    rowNumber: 0,
    id: 0,
    url: "blob:http://localhost:3000/6e1068f1-3d27-4443-b713-e78eba4ecb02"
};

async function selectAction(){
    await act(() => {
        store.dispatch(select({row: testProps.rowNumber, id: testProps.id}));
    });

    // 결과 체크
    return store.getState().selections.rows.find((selectionInRow) => selectionInRow.row == testProps.rowNumber);
}

describe("Render", () => {
    it("Check image src", () => {
        render(<Provider store={store}><ImageItem {...testProps} /></Provider>);
        const initImage = document.querySelector("img") as HTMLImageElement;
        expect(initImage.src).toBe(testProps.url);
    });
});

describe("Reducers", () => {
    it("Test to select/unselect", async () => {
        render(<Provider store={store}><ImageItem {...testProps} /></Provider>);
        let selections = await selectAction();
        expect(selections).not.toBeNull();
        // @ts-ignore
        expect(selections.idList.includes(testProps.id)).toBeTruthy();

        selections = await selectAction();
        try {
            expect(selections).toBeNull();
        } catch (e) {
            expect(selections).toBeTruthy();
            // @ts-ignore
            expect(selections.idList.includes(testProps.id)).toBeFalsy();
        }
    })
});