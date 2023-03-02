import React, {
    useRef, useState
} from "react";
import {useDragAndDrop} from "../hooks/useDragAndDrop";
import styled from "styled-components";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useAppSelector} from "../app/hooks";

const LabelAppendImage = styled.label`
  border-radius: 8px;
  font-size: 5rem;
  border: 1px solid lightgray;
  color: gray;
  background: white;
  line-height: 100%;
`;

const DivFab = styled.div`
  position: relative;
  float:left;
  display: inline;
`;

type ImageAppenderProps = {
    rowNumber: number,
    onChangeFiles: (e: any) => void;
    onRemove: () => void;
    onEdit: () => void;
};

const ImageAppender = (props: ImageAppenderProps) => {
    const dragRef = useRef<HTMLLabelElement | null>(null);
    const isDragging = useDragAndDrop({onChange: props.onChangeFiles, dragRef: dragRef});

    const selections = useAppSelector(state => state.selections).rows.find((selectionInRow) => selectionInRow.row == props.rowNumber);

    const handleButtonClick = (e: React.MouseEvent) => {
        if(e.currentTarget.ariaLabel == 'Edit'){
            props.onEdit();
        } else {
            props.onRemove();
        }
    };

    const fabs = [
        {
            color: 'primary' as 'primary',
            icon: <EditIcon />,
            label: 'Edit',
            onClick: handleButtonClick
        },
        {
            color: 'secondary' as 'secondary',
            icon: <DeleteIcon />,
            label: 'Delete',
            onClick: handleButtonClick
        }
    ];


    return (
        <div>
            <input
                type="file"
                id="fileUpload"
                style={{ display: "none" }}
                multiple={true}
                onChange={props.onChangeFiles}
            />

            <LabelAppendImage
                className={isDragging ? "ImagesRow-File-Dragging" : "ImagesRow-File"}
                htmlFor="fileUpload"
                ref={dragRef}
            > +
            </LabelAppendImage>

            {/* <DivFab>
                {selections && selections.idList.length > 0 ? fabs.map((fab, index) => (
                    <Fab key={fab.label} aria-label={fab.label} color={fab.color} onClick={fab.onClick} >
                        {fab.icon}
                    </Fab>
                )) : ''}
            </DivFab> */}
        </div>
    );
};

export default ImageAppender;
