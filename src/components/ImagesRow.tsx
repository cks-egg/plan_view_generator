import React, { ChangeEvent, useCallback, useRef, useState } from 'react';

import styled from 'styled-components';
import ImageItem from './ImageItem';
import ImageAppender from './ImageAppender';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clear } from '../app/slices/selections';

const DivFlex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  margin-bottom: 50px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

type RowProps = {
  rowNumber: number;
};

type ImageFile = {
  id: number;
  file: File;
  url: string;
};

const ImageRow = (props: RowProps) => {
  const fileId = useRef<number>(0);
  const [files, setFiles] = useState<ImageFile[]>([]);
  const selections = useAppSelector((state) => state.selections).rows.find(
    (selectionInRow) => selectionInRow.row === props.rowNumber
  );
  //   const a = useAppSelector((state) => state.selections);
  //   const selections = a.rows.find((selectionInrow) => {
  // console.log('selectionInRow: ', selectionInrow);
  // console.log('props.rowNumber: ', props.rowNumber);
  // return selectionInrow.row === props.rowNumber;
  //   });
  //   console.log(a);
  //   console.log(selections);

  // selections의 rows중에 row가 현재 rowNumber인 경우 (현재 선택한 row)
  const dispatch = useAppDispatch();

  const onChangeFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement> | any): void => {
      let selectFiles: File[] = [];
      let tempFiles: ImageFile[] = files;

      if (e.type === 'drop') {
        selectFiles = e.dataTransfer.files;
      } else {
        selectFiles = e.target.files;
      }

      for (const file of selectFiles) {
        tempFiles = [
          ...tempFiles,
          { id: fileId.current++, file: file, url: URL.createObjectURL(file) },
        ];
      }

      setFiles(tempFiles);

      // edit
      //   if (!selections) {
      //     return; // 선택한 row가 없으면 return
      //   } else {
      //     if (!e.target.files[0]) {
      //       return;
      //     } else {
      const file = e.target.files[0];

      if (selections && file) {
        // 선택한 행이 있고 추가한 파일이 있으면
        // 현재 row의 현재 id의 현재 file을 clear하고, 지금 선택하는 새로운 file을 추가하라.(setFiles)

        // edit 하기 위해 선택한 file 정보
        const editTemp = files.find((curFile: ImageFile) =>
          selections.idList.includes(curFile.id)
        );
        const curId: number | any = editTemp?.id;

        console.log(files);
        console.log('editTemp', editTemp);

        // 내가 선택하지 않은 파일들을 setFiles
        //   setFiles(
        //     files.filter(
        //       (curFile: ImageFile) => !selections.idList.includes(curFile.id)
        //     )
        //   );

        // edit 하기 위해 선택한 파일 제외하고 나머지 다 넣어주기
        const notSelectedFiles = files.filter(
          (curFile: ImageFile) => !selections.idList.includes(curFile.id)
        );
        console.log('notSelectedFiles.length', notSelectedFiles.length);
        console.log('selections.idList', selections.idList);

        // 새로 선택한 파일을 edit 하려던 자리에 추가(id)
        setFiles(
          [
            ...notSelectedFiles,
            {
              id: curId,
              file: file,
              url: URL.createObjectURL(file),
            },
          ].sort((a, b) => a.id - b.id)
        ); // id순으로 정렬해주기 (수정한 이미지가 원래 id자리에 가도록)
        console.log(files);

        /**
         * select하고 +(새로 추가) 누를 시 edit 로직을 타는 버그 해결하기!
         * change로직 안의 edit로직으로 들어올 때 확실히 거를 수 있는 조건 추가하기
         * edit과 그냥 add는 뭘로 분리를 해주지?? 둘이 다른 점이 뭐지, 같은 onChangeFiles 함수 안에서
         */
      }
      //   }
    },
    [files, selections]
  );

  const handleRemoveFiles = useCallback((): void => {
    if (!selections) return;

    setFiles(
      files.filter(
        (curFile: ImageFile) => selections.idList.indexOf(curFile.id) < 0 // idList에는 삭제하려고 선택한 하나의 id밖에 없다
      )
    );

    dispatch(clear(props.rowNumber));
  }, [selections, files]);

  //   const handleEditFile = useAppSelector((state) => state.selections).rows.map(
  //     (a) => console.log(a)
  //   );
  const handleEditFile = useCallback(
    // (e: ChangeEvent<HTMLInputElement> | any): void => {
    (e: React.MouseEvent): void => {
      console.log('edit');
      let selectFiles: File[] = [];
      let tempFiles: ImageFile[] = files;

      if (e.type === 'drop') {
        // selectFiles = e.dataTransfer.files;
      } else {
        console.log('selections', selections);

        if (!selections) return;
      }
    },
    [files, selections] // dependency에 selections 추가
  );

  const handleSelectFile = useCallback((file: File): void => {}, [files]);

  const getFile = (id: number) => {
    files.map((imageFile) => {
      if (imageFile.id === id) {
        return imageFile.file;
      }
    });
    return null;
  };

  return (
    <DivFlex>
      {files.length > 0 &&
        files.map((file: ImageFile) => {
          return (
            <ImageItem
              rowNumber={props.rowNumber}
              key={file.id}
              id={file.id}
              url={file.url}
            />
          );
        })}
      <ImageAppender
        rowNumber={props.rowNumber}
        onChangeFiles={onChangeFiles}
        onRemove={handleRemoveFiles}
        onEdit={handleEditFile}
      />
      <div>
        {selections &&
          selections.idList.map((id: number) => {
            return <p key={id}>{id}</p>;
          })}
      </div>
    </DivFlex>
  );
};

export default ImageRow;
