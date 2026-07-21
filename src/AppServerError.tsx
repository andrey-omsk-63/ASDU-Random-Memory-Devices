import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const ServerError = () => {
  let soob =
    "Произошла ошибка при обмене с сервером, обратитесь к администратору БД";

  const styleSetInf = {
    outline: "none",
    position: "absolute",
    left: "45%",
    top: "46%",
    transform: "translate(-50%, -50%)",
    width: 380,
    bgcolor: "#FFDB4D", // жёлтый
    border: "1px solid #FFEDA6", // бледно-жёлтый
    borderRadius: 1,
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    boxShadow: 24,
    p: 1.5,
  };

  const styleBatMenu = {
    fontSize: 14,
    maxHeight: "24px",
    minHeight: "24px",
    bgcolor: "#CFECB0", // светло-салатовый
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    boxShadow: 6,
    color: "black",
    marginTop: 1,
    marginRight: 1,
    textTransform: "unset !important",
    padding: "3px 8px 0px 8px",
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <Modal open={true} onClose={handleClose} hideBackdrop>
      <Box sx={styleSetInf}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {soob}
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Button sx={styleBatMenu} onClick={() => handleClose()}>
            Выход
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ServerError;
