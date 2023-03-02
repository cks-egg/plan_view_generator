import { act, fireEvent, getByLabelText, render , screen} from '@testing-library/react';
import { ChangeEvent } from 'react';
import { Provider } from 'react-redux';
import { clear, select, SelectionInRow } from '../app/slices/selections';
import store from '../app/store';
import ImageItem, { ImageItemProps } from './ImageItem';





describe('ImageItem Test Describe 1', () => {

    // ImageItme Props 선언 및 초기값 설정
    let testImageItemProps:ImageItemProps = {
        rowNumber: 0, 
        id: 0,
        url: 'hello1.png',
        onEdit: ()=>{},
        onRemove: ()=>{},
        onChangeFiles: (e) => {}
    };

    let files: ImageFile[] = [
        {id:0, file: new File(["img0"], "hello1.png", { type: "image/png" }), url: 'hello0.png'},
        {id:1, file: new File(["img1"], "hello1.png", { type: "image/png" }), url: 'hello1.png'},
        {id:2, file: new File(["img2"], "hello1.png", { type: "image/png" }), url: 'hello2.png'}
    ];

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

    type ImageFile = {
        id: number;
        file: File;
        url: string;
    };

    async function editAction(e: HTMLInputElement ) {
        console.log('editAction');
        console.dir(files);
        // console.log(e.type);
        // console.log(e.files);
        // console.dir(e);
        // 현재 file 배열에서 id 맥스값 찾기
        let maxIdItem = Math.max(...files.map(o => o.id)); 
        console.log(`maxIdItem : ${maxIdItem}`);
        let fileId =  maxIdItem + 1;
        let selectFiles: File[] = [];
        let tempFiles: ImageFile[] = files;
        let fileUploadId = e.id;
        // console.log(`file id : ${fileUploadId}`);

        if (e.type === "drop") {
            // @ts-ignore
            selectFiles = e.files;
        } else {
            // @ts-ignore
            selectFiles = e.files;
        }

        if(fileUploadId === 'fileUpload'){
            for (const file of selectFiles) {
                tempFiles = [
                    ...tempFiles,
                    {id: fileId++, file: file, url: URL.createObjectURL(file) }
                ];
            }
        } else if(fileUploadId === 'editFileUpload'){
            let tempFileId = selections!.idList[0];
            let filesIdx = files.findIndex((x) => x.id === tempFileId);

            // setFiles(files.filter((curFile: ImageFile) => selections!.idList.indexOf(curFile.id) < 0));
            // files = files.filter((curFile: ImageFile) => selections!.idList.indexOf(curFile.id) < 0);
            await act(() => {
                store.dispatch(clear(testImageItemProps.rowNumber));
                // tempFiles[filesIdx] = {id: fileId++, file: selectFiles[0], url: URL.createObjectURL(selectFiles[0]) };
                tempFiles[filesIdx] = {id: fileId++, file: selectFiles[0], url: selectFiles[0].name };
                files = tempFiles;
                store.dispatch(select({row: testImageItemProps.rowNumber, id:tempFiles[filesIdx].id}));
            });
            console.dir(files);
        }

        return store.getState().selections.rows.find((x) => x.row == testImageItemProps.rowNumber);
    }

    // edit 이벤트핸들러 jest 목업 함수 
    const handleOnEditMock = jest.fn();
    // delete 이벤트핸들러 jest 목업 함수 
    const handleOnRemoveMock = jest.fn();
    // file chang 발생 시 콜백 함수 
    const onChangeFilesMock = jest.fn();

    // Test Unit 별로 실행전 초기값 설정 
    beforeEach(async () => {
        testImageItemProps =  {
                                rowNumber: 0, 
                                id: 0,
                                url: '123',
                                onEdit: handleOnEditMock,
                                onRemove: handleOnRemoveMock,
                                onChangeFiles: onChangeFilesMock
                            };
        selections = await selectAction();

        act(() => {
            render(<Provider store={store}><ImageItem {...testImageItemProps} /></Provider>);
        });
    });

    // Test Unit 별로 실행후 초기화 
    afterEach(async () => {
        selections = null;
        handleOnEditMock.mockClear();
        handleOnRemoveMock.mockClear();
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
        expect(handleOnRemoveMock).toBeCalledTimes(1);
        // 실제 selections idList 에서 삭제 
        selections =  await deleteAction();
        // 삭제 확인 
        // @ts-ignore
        idListLength = selections.idList.length;
        expect(idListLength).toBe(0);
        expect(idListLength).toBeFalsy();
        
        console.log('End - Test Unit3');
    });

    // 실행전 작업 
    //  1 - render <ImageItem />
    //  2 - store selections 선택
    // T-3. Edit 핸들메서드 동작 후 
    //      - fileupload 
    //      - 선택한 id 가 삭제되고 새로운 id 추가 
    //      - DOM 새로운 img 확인 
    it('Test Unit 4 - Button Actions Edit', async () => {
        console.log('Start - Test Unit4');
        const testImageFile = new File(["hello"], "hello.png", { type: "image/png" });

        console.log(selections);
        // let imageItemNode = document.querySelector('img');
        // T-3. Edit 핸들메서드 동작 후 
        //  - 화면으로부터 Edit 버튼 가져오기 
        let editButtonNode = document.querySelector("button[aria-label='Edit']");
        // console.dir(editButtonNode);
        // screen.getByLabelText(/Edit/i);
        //  - Edit 버튼의 클릭 이벤트 발생
        fireEvent.click(editButtonNode!);
        //  - 클릭 이벤트 발생으로 onEdit 콜백 실행
        expect(handleOnEditMock).toBeCalledTimes(0);
        // expect(handleOnRemove).toBeCalledTimes(0);

        // input file 화면에서 가져오기 
        // let fileUploadNode = screen.getByLabelText(/editFileUpload/) as HTMLInputElement;
        let fileUploadNode = document.querySelector("input[id='editFileUpload']") as HTMLInputElement;
        expect(fileUploadNode).toBeInTheDocument();
        // file change 이벤트 발생 
        console.log(fileUploadNode.files);
        fireEvent.change(fileUploadNode!, { target: { files: [testImageFile] } });
        console.log(fileUploadNode.files![0].name);
        expect(fileUploadNode.files?.length).toBe(1);
        // onchange 호출 확인 
        expect(onChangeFilesMock).toBeCalledTimes(1);
        // 현재 선택된 idList = [0] 이므로 id 값이 변경되었는지 확인 
        selections =  await editAction(fileUploadNode);
        // 현재 files 에 최대 id 값은 2 이므로 변경된 id 값은 3 
        expect(selections?.idList[0]).toBe(3);
        console.log(selections);
                
        console.log('End - Test Unit4');
    });


});

