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

type ImageProps = {
  rowNumber: number;
  id: number;
  url: string;
};

const ImagesItem = (props: ImageProps) => {
  const dispatch = useAppDispatch();
  const selections = useAppSelector((state) => state.selections).rows.find(
    (selectionInRow) => selectionInRow.row === props.rowNumber
  );

  const handleImgClick = (e: React.MouseEvent) => {
    dispatch(select({ row: props.rowNumber, id: props.id }));
    // console.log(props.rowNumber);
  };
  return (
    <div>
      <ImgPreview src={props.url} onClick={handleImgClick} />
    </div>
  );
};

export default ImagesItem;
