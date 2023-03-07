import React from 'react';
import styled from 'styled-components';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { select } from '../app/slices/selections';

const ImgPreview = styled.img`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  background: #a70f11;
`;

const ImagesItem = (props : Props) => {
    const dispatch = useAppDispatch();
    const selections = useAppSelector(state => state.selections).rows.find((selectionInRow) => selectionInRow.row == props.rowNumber);

    const handleImgClick = (e: React.MouseEvent) => {
        dispatch(select({row: props.rowNumber, id:props.id}));
    };
    return (
        <div>
            <ImgPreview src={props.url} onClick={handleImgClick} />
        </div>
    );
};

export interface Props {
    rowNumber: number;
    id: number;
    url: string,
}

export default ImagesItem;

