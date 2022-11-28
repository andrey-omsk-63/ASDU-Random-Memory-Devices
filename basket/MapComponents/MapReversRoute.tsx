import * as React from "react";
//import { useDispatch, useSelector } from "react-redux";
//import { massrouteCreate, massrouteproCreate } from "./../../redux/actions";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

const MapReversRoute = (props: {
  setOpen: any;
  makeRevers: any;
  needRevers: any;
}) => {
  //== Piece of Redux =======================================
  // let massroute = useSelector((state: any) => {
  //   const { massrouteReducer } = state;
  //   return massrouteReducer.massroute;
  // });
  // let massroutepro = useSelector((state: any) => {
  //   const { massrouteproReducer } = state;
  //   return massrouteproReducer.massroutepro;
  // });
  // const dispatch = useDispatch();
  //=========================================================
  const styleModalMenu = {
    fontSize: 16,
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };

  const [openSetEr, setOpenSetEr] = React.useState(true);

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetEr(false);
  };

  const handleClose = (mode: number) => {
    props.makeRevers(true);
    props.needRevers(mode);
    handleCloseSetEnd();
  };

  return (
    <Modal open={openSetEr} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={() => handleClose(0)}>
          <b>&#10006;</b>
        </Button>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">Создать реверсную связь?</Typography>
          <Box>
            <Button sx={styleModalMenu} onClick={() => handleClose(1)}>
              Да, создать
            </Button>
          </Box>
          <Box sx={{ marginTop: 0.5 }}>
            <Button sx={styleModalMenu} onClick={() => handleClose(2)}>
              Создать с редактированием
            </Button>
          </Box>
          <Box sx={{ marginTop: 0.5 }}>
            <Button sx={styleModalMenu} onClick={() => handleClose(0)}>
              Нет, не создавать
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default MapReversRoute;
