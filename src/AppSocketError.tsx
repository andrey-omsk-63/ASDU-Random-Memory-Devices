import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { styleModalEnd, styleSetInf } from "./components/MainMapStyle";

const AppSocketError = (props: { sErr: string; setOpen: any }) => {
  const [openSet, setOpenSet] = React.useState(true);

  const handleClose = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  return (
    <Modal open={openSet} onClose={handleClose} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleClose}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
          {props.sErr}
        </Typography>
      </Box>
    </Modal>
  );
};

export default AppSocketError;
