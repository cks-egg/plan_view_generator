import React, {
    ChangeEvent,
    useCallback, useRef,
    useState
} from "react";

import styled from "styled-components";
import ImageItem from "./ImageItem";
import ImageAppender from "./ImageAppender";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clear, select } from "../app/slices/selections";

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

const ImageRow = (props : RowProps) => {
    const fileId = useRef<number>(0);
    const [files, setFiles] = useState<ImageFile[]>([]);
    const selections = useAppSelector(state => state.selections).rows.find((selectionInRow) => selectionInRow.row == props.rowNumber);
    const dispatch = useAppDispatch();

    const onChangeFiles = useCallback(
        (e: ChangeEvent<HTMLInputElement> | any): void => {
            let selectFiles: File[] = [];
            let tempFiles: ImageFile[] = files;
            let fileUploadId = e.target.id;

            if (e.type === "drop") {
                selectFiles = e.dataTransfer.files;
            } else {
                selectFiles = e.target.files;
            }

            if(fileUploadId === 'fileUpload'){
                for (const file of selectFiles) {
                    tempFiles = [
                        ...tempFiles,
                        {id: fileId.current++, file: file, url: URL.createObjectURL(file) }
                    ];
                }
                setFiles(tempFiles);

            } else if(fileUploadId === 'editFileUpload'){
                let tempFileId = selections!.idList[0];
                let filesIdx = files.findIndex((x) => x.id === tempFileId);

                setFiles(files.filter((curFile: ImageFile) => selections!.idList.indexOf(curFile.id) < 0));
                dispatch(clear(props.rowNumber));

                tempFiles[filesIdx] = {id: fileId.current++, file: selectFiles[0], url: URL.createObjectURL(selectFiles[0]) };
                setFiles(tempFiles);
                dispatch(select({row: props.rowNumber, id:tempFiles[filesIdx].id}));
            }
            
        },
        [selections, files]
    );

    const handleRemoveFiles = useCallback(
        (): void => {
            if(!selections) return;

            setFiles(files.filter((curFile: ImageFile) => selections.idList.indexOf(curFile.id) < 0));
            dispatch(clear(props.rowNumber));
        },
        [selections, files]
    );

    const handleEditFile = useCallback(
        (): void => {
            
        },
        [files]
    );

    const handleSelectFile = useCallback(
        (file: File): void => {
        },
        [files]
    );

    const getFile = (id: number) => {
        files.map((imageFile) => {
            if (imageFile.id == id){
                return imageFile.file;
            }
        })
        return null;
    }

    return (
        <DivFlex>
            {files.length > 0 && files.map((file: ImageFile) => {
                return (
                    <ImageItem rowNumber={props.rowNumber} key={file.id} id={file.id} url={file.url} onRemove={handleRemoveFiles} onEdit={handleEditFile} onChangeFiles={onChangeFiles}/>
                );
            })}
            <ImageAppender rowNumber={props.rowNumber} onChangeFiles={onChangeFiles} onRemove={handleRemoveFiles} onEdit={handleEditFile} />
            <div>
                {selections && selections.idList.map((id: number) => {
                    return (
                        <p key={id}>{id}</p>
                    );
                })}
            </div>
        </DivFlex>
    );
};

export default ImageRow;