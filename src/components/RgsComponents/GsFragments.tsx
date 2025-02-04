import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { ExitCross } from "../RgsServiceFunctions";

import { styleSetPK05, styleSetPK06 } from "./../MainMapStyle";
import { styleSetPK01, styleSetPK02 } from "./../MainMapStyle";

const GsFragments = (props: { close: Function }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  //========================================================
  const [open, setOpen] = React.useState(true);

  const handleClose = (mode: number) => {
    setOpen(false);
    props.close(mode);
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose(-1);
  };

  const FragmentContent = () => {
    let resStr = [];
    for (let i = 0; i < map.fragments.length; i++) {
      resStr.push(
        <Button key={i} sx={styleSetPK06} onClick={() => handleClose(i)}>
          {map.fragments[i].name.slice(0, 33)}
        </Button>
      );
    }
    return resStr;
  };

  return (
    <>
      <Modal open={open} onClose={CloseEnd} hideBackdrop={false}>
        <Box sx={styleSetPK01(333, 0)}>
          {ExitCross(() => handleClose(-1))}
          <Box sx={styleSetPK02}>
            <b>Фрагменты на Яндекс-карте:</b>
          </Box>
          <Box sx={styleSetPK05}>{FragmentContent()}</Box>
        </Box>
      </Modal>
    </>
  );
};

export default GsFragments;
