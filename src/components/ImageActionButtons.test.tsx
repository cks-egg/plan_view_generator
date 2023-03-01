import { act, fireEvent, render , screen} from '@testing-library/react';
import React, { useCallback, useState } from 'react';
import { select } from '../app/slices/selections';
import store from '../app/store';
import ImageActionButtons, {ImageActionButtonsProps} from './ImageActionButtons';
import ImagesItem, {ImageItemProps} from './ImageItem';

const testProps: ImageItemProps = {
    rowNumber: 0,
    id: 0,
    url: "blob:http://localhost:3000/6e1068f1-3d27-4443-b713-e78eba4ecb02",
    onEdit: function(){},
    onRemove: function(){}
};

const testImageActionButtonsProops: ImageActionButtonsProps = {
    onEdit: function(){window.alert('Alert-Edit');},
    onRemove: function(){window.alert('Alert-Delete');},
};


type ImageFile = {
    id: number;
    file: File;
    url: string;
};

async function selectAction(){
    await act(() => {
        store.dispatch(select({row: testProps.rowNumber, id: testProps.id}));
    });

    // 결과 체크
    return store.getState().selections.rows.find((selectionInRow) => selectionInRow.row == testProps.rowNumber);
}

// beforeAll(() => {
//     console.log('top - beforeAll');
// });

// afterAll(() => {
//     console.log('top - afterAll');
// });

// afterEach(() => {
//     console.log('top - afterEach');
// });

// test : All you need in a test file is the test method which runs a test.
// Also under the alias : it
it('ImageActionButtons It Test', async () => {

    // afterAll(()=>{
    //     console.log('It Atfer All');
    // });

    const handleClick = jest.fn();
    // const testImageActionButtonsProops: ImageActionButtonsProps = {
    //     onEdit: handleClick,
    //     onRemove: handleClick
    // };
    render(<ImageActionButtons {...testImageActionButtonsProops} />);
    // const linkElement = screen.getByText(/Edit/i);
    // 렌더링 된 화면에서 라벨 텍스트 가져오기, 엘리먼트
    const linkEditElement = screen.getByLabelText(/Edit/i);
    // 엘리먼트(linkEditElement)가 도큐먼트에 존재하는지 확인 
    expect(linkEditElement).toBeInTheDocument(); 
    // 엘리먼트의 유형이 버튼(BUTTON)인지 확인 
    expect(linkEditElement.nodeName).toBe('BUTTON');

    console.log('hi');    
    
    // fireEvent.click(linkEditElement);
    // expect(handleClick).toBeCalledTimes(1);

    const linkRemoveElement = screen.getByLabelText(/Delete/i);
    expect(linkRemoveElement).toBeInTheDocument(); 
});

// describe : creates a block that groups together several related tests
describe('ImageActionButtons Describe Unit Test', () => {
    // https://jestjs.io/docs/api#afterallfn-timeout
    // Runs a function after all the tests in this file have completed. 
    afterAll(() => {
        console.log('afterAll');
    });

    // Runs a function after each one of the tests in this file completes.
    afterEach(() => {
        console.log('afterEach');
    });

    // Runs a function before any of the tests in this file run.
    beforeAll(() => {
        console.log('beforeAll');
    });

    // Runs a function before each of the tests in this file runs.
    beforeEach(() => {
        console.log('beforeEach');
    });

    it('Test Unit 1', () => {
        console.log('======================================');
        console.log('start - Test Unit 1');

        const handleClick = jest.fn();
        const testImageActionButtonsProops2: ImageActionButtonsProps = {
            onEdit: handleClick,
            onRemove: handleClick,
        };

        render(<ImageActionButtons {...testImageActionButtonsProops2} />);

        const editElement = screen.getByLabelText(/Edit/i);
        
        fireEvent.click(editElement);

        expect(handleClick).toBeCalledTimes(1);

        console.log('Clicked - Edit Button');

        const deleteElement = screen.getByLabelText(/Delete/i);
        
        fireEvent.click(deleteElement);
        // expect(handleClick).toBeCalledTimes(1); // error, expected call 1, recieved call 2
        expect(handleClick).toBeCalledTimes(2);

        console.log('Clicked - Delete Button');

        console.log('end - Test Unit 1');
        console.log('======================================');

    });

    it('Test Unit 2', () => { 
        console.log('======================================');
        console.log('start - Test Unit 2');
        console.log('end - Test Unit 2');
        console.log('======================================');
    });

});

describe('ImageActionButton Describe Unit Test2', () => {
    // Test Target Container 
    let testImageActionButtonsProops3: ImageActionButtonsProps = {
        onEdit: ()=>{},
        onRemove: ()=>{}
    };
    // 테스트 단위별 DOM 엘리먼트를 매번 초기화 
    beforeEach(() => {
        const handleClick = jest.fn();
        testImageActionButtonsProops3 = {
            onEdit: handleClick,
            onRemove: handleClick,
        };
    });

    // ImageActionButton Render Test - 1
    // 렌더링 이후 버튼(Edit, Delete) 그려졌는지 확인 
    it('render excpected Edit and Delete ', ()=> {
        // 
        act(() => {
            render(<ImageActionButtons {...testImageActionButtonsProops3} />);
        });

        // 
        let editButton = screen.getByLabelText('Edit');
        // console.dir(editButton);
        
        // error
        // expect(editButton).toBe(/Edit/i); // error : <button .. 
        // expect(editButton).toBe(/Edit/i);
        // expect(editButton).toHaveTextContent(/Edit/i);
        // expect(editButton).toHaveAttribute('aria-label', /Edit/i);

        expect(editButton).toBeInTheDocument(); 
        expect(editButton.nodeName).toBe('BUTTON');
        expect(editButton).toHaveAttribute('aria-label', 'Edit');

        // 
        let deleteButton = screen.getByLabelText('Delete');
        // 
        expect(deleteButton).toBeInTheDocument(); 
        expect(deleteButton.nodeName).toBe('BUTTON');
        expect(deleteButton).toHaveAttribute('aria-label', 'Delete');

    })

});