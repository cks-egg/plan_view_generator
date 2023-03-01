import { act, fireEvent, render , screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { clear, select, SelectionInRow } from '../app/slices/selections';
import store from '../app/store';
import ImageItem, { ImageItemProps } from './ImageItem';





describe('ImageItem Test Describe 1', () => {

    // ImageItme Props 선언 및 초기값 설정
    let testImageItemProps:ImageItemProps = {
        rowNumber: 0, 
        id: 0,
        url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fdemo.ycart.kr%2Fshopboth_farm_max5_001%2Fbbs%2Fview_image.php%3Ffn%3Dhttp%253A%252F%252Fdemo.ycart.kr%252Fshopboth_cosmetics_001%252Fdata%252Feditor%252F1612%252Fcd2f39a0598c81712450b871c218164f_1482469221_493.jpg&psig=AOvVaw11qRQsmuLzrO0-Gk9mwTz0&ust=1677771592132000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCKj766-Iu_0CFQAAAAAdAAAAABAE',
        onEdit: ()=>{},
        onRemove: ()=>{}
    };

    // Test Unit 별로 사용하기 위하여 선언
    let selections: SelectionInRow | null | undefined = null;
    
    // Test Unit 별로 액션 사용하기 위해서 선언 
    async function selectAction() {
        await act(() => {
            store.dispatch(select({row: testImageItemProps.rowNumber, id: testImageItemProps.id}));
        });
        return store.getState().selections.rows.find((x) => x.row == testImageItemProps.rowNumber);
    }

    async function deleteAction() {
        console.log('deleteAction');
        if(!selections) return;

        // setFiles(files.filter((curFile: ImageFile) => selections.idList.indexOf(curFile.id) < 0));
        await act(() => {
            store.dispatch(clear(testImageItemProps.rowNumber));
            console.log('act - deleteAction');
            console.log(selections);
        });
        return store.getState().selections.rows.find((x) => x.row == testImageItemProps.rowNumber);
    }

    // edit 이벤트핸들러 jest 목업 함수 
    const handleOnEdit = jest.fn();
    // delete 이벤트핸들러 jest 목업 함수 
    const handleOnRemove = jest.fn();

    // Test Unit 별로 실행전 초기값 설정 
    beforeEach(async () => {
        testImageItemProps =  {
                                rowNumber: 0, 
                                id: 0,
                                url: '',
                                onEdit: handleOnEdit,
                                onRemove: handleOnRemove
                            };
        selections = await selectAction();

        act(() => {
            render(<Provider store={store}><ImageItem {...testImageItemProps} /></Provider>);
        });
    });

    // Test Unit 별로 실행후 초기화 
    afterEach(async () => {
        selections = null;
        handleOnEdit.mockClear();
        handleOnRemove.mockClear();
    });


    // 실행전 작업 
    //  1 - render <ImageItem />
    //  2 - store selections 선택
    // T-1. selections idList 에 id 값 ItemaImage 컴포넌트 props id 와 같음
    // T-2. 선택해제 후 selections idList 가 비워있음 
    it('Test Unit 1 - Render ImageItem', async () => {
        
        console.log('Start - Test Unit 1');
        console.log(selections);

        // T-1. selections idList 에 id 값 ItemaImage 컴포넌트 props id 와 같음
        expect(selections).not.toBeNull();
        // @ts-ignore
        expect(selections.idList.includes(testImageItemProps.id)).toBeTruthy()

        // T-2. 선택해제 후 selections idList 가 비워있음
        // 선택 해제 
        selections = await selectAction();
        console.log(selections);
        try{
            // selections idList 에 선택된 id 값이 없으나 null 이 아니므로 exception 발생 
            expect(selections).toBeNull();
        }catch(e){
            // selections idList 에 선택된 id 값이 없으나 null 이 아니므로 truhty
            expect(selections).toBeTruthy();
            // selections idList 에 ImageItem props.id 값이 존재하지 않으므로 falsy
            // @ts-ignore
            expect(selections.idList.includes(testImageItemProps.id)).toBeFalsy(); 
            // @ts-ignore
            expect(selections.idList.length).toBeFalsy();
            // @ts-ignore
            // expect(selections.idList.length).toBeTruthy();
            // @ts-ignore
            expect(selections.idList.length).toBe(0);
        }

        console.log('End - Test Unit 1');
    });

    // 실행전 작업 
    //  1 - render <ImageItem />
    //  2 - store selections 선택
    // T-1. 선택 후에 화면에서 버튼 보여지는지 확인 
    // T-2. 선택해제 후 후에 화면에서 버튼 사라지는지 확인
    it('Test Unit 2 - Render SelectAction and Button', async () => {
        console.log('Start - Test Unit2');

        // let imageItemNode = document.querySelector('img');
        // T-1. 이미지 선택한 후에 화면에서 버튼 보여지는 확인 
        let editButtonNode = document.querySelector("[aria-label='Edit']");
        expect(editButtonNode).toBeInTheDocument();

        console.log(editButtonNode); // HTMLButtonElement
        
        // T-2. 이미지 선택취소 후에 화면에서 버튼 사라지는지 확인
        // 선택 취소 
        selections = await selectAction();

        // 선택 취소하였다면 화면에서 버튼(Edit, Delete) 사라짐
        // DOM 에서 쿼리셀렉터로 다시 노드 검색 
        editButtonNode = document.querySelector("[aria-label='Edit']");
        console.log(editButtonNode); // null
        // error
        // expect(editButtonNode).toBeInTheDocument();
        // expect(editButtonNode).toBe({});
        expect(editButtonNode).toBeFalsy();
        
        console.log('End - Test Unit2');
    });

    // 실행전 작업 
    //  1 - render <ImageItem />
    //  2 - store selections 선택
    // T-1. Appender click 이벤트 발생 후 
    //      - selections idList length 증가  
    // T-2. Delete 핸들메서드 동작 후 
    //      - seletions idList length 감소 
    //      - 선택한 id 가 selections idList 포함되지 않음, falsy
    // T-3. Edit 핸들메서드 동작 후 
    //      - fileupload 
    //      - 선택한 id 가 삭제되고 새로운 id 추가 
    //      - DOM 새로운 img 확인 
    it('Test Unit 3 - Button Actions Delete', async () => {
        console.log('Start - Test Unit3');

        // let imageItemNode = document.querySelector('img');
        // T-2. Delete 핸들메서드 동작 후 
        //      - seletions idList length 감소 
        //      - 선택한 id 가 selections idList 포함되지 않음, falsy

        // 현재 selections idList 의 lenght 확인 
        // @ts-ignore
        let idListLength = selections.idList.length;
        // @ts-ignore
        // console.log(selections.idList);
        expect(idListLength).toBe(1);

        // 화면에서 Delete 버튼 엘리먼트 가져옴 
        // let deleteButtonNode = document.querySelector("[aria-label='Delete']");
        let deleteButtonNode = screen.getByLabelText(/Delete/i);
        // jest 에서 제공하는 유저 이벤트 API, 유저가 발생시키는 엑션(이벤트)에 대한 테스트 가능하도록 도와줌 
        fireEvent.click(deleteButtonNode);

        // @ts-ignore
        // idListLength = selections.idList.length;
        // @ts-ignore
        // console.log(selections.idList);
        // error
        // expect(idListLength).toBe(0);
        // Delete 버튼의 onclick 이벤트 발생으로 handleOnRemove 핸들러가 1번 콜 발생 
        expect(handleOnRemove).toBeCalledTimes(1);
        // 실제 selections idList 에서 삭제 
        selections =  await deleteAction();
        // 삭제 확인 
        // @ts-ignore
        idListLength = selections.idList.length;
        expect(idListLength).toBe(0);
        expect(idListLength).toBeFalsy();
        
        console.log('End - Test Unit3');
    });


});