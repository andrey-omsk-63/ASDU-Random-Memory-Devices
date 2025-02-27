import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const GsErrorMessage = (props: { sErr: string; setOpen: any }) => {
  const [openSet, setOpenSet] = React.useState(true);

  const styleSetInf = {
    outline: "none",
    position: "absolute",
    marginTop: "15vh",
    marginLeft: "24vh",
    width: 380,
    //bgcolor: 'background.paper', // белый
    // bgcolor: "#FFDB4D", // жёлтый
    bgcolor: "#ffe16e", // жёлтый
    border: "1px solid #FFEDA6", // блендно-жёлтый
    borderRadius: 1,
    color: "black",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    boxShadow: 24,
    p: 1.5,
  };

  const styleModalEnd = {
    position: "absolute",
    top: "0%",
    left: "auto",
    right: "-0%",
    height: "21px",
    maxWidth: "2%",
    minWidth: "2%",
    color: "black",
  };

  const handleClose = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  return (
    <Modal open={openSet} onClose={handleClose} hideBackdrop={false}>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleClose}>
          &#10006;
        </Button>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {props.sErr}
        </Typography>
      </Box>
    </Modal>
  );
};

export default GsErrorMessage;
