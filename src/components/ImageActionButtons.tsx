import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { Fab } from "@mui/material";


const DivFlex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  margin-bottom: 50px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

const DivFab = styled.div`
  position: relative;
  float:left;
  display: inline;
`;

const ImageActionButtons = (props: ImageActionButtonsProps) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    if(e.currentTarget.ariaLabel == 'Edit'){
      props.onEdit();
    }else{
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
  ]

  return (
      <DivFab>
        {fabs.map((fab, index) => (
            <Fab key={fab.label} aria-label={fab.label} color={fab.color} onClick={fab.onClick} >
                {fab.icon}
            </Fab>
        ))}
      </DivFab>
  );
};

export interface ImageActionButtonsProps  {
  // rowNumber: number,
  onEdit: () => void;
  onRemove: ()=> void;
}
export default ImageActionButtons;