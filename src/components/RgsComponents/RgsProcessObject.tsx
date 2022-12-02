import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addobjCreate, coordinatesCreate } from "../../redux/actions";

//import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";

//import GsErrorMessage from "./GsErrorMessage";

//import { SendSocketСreateAddObj } from "../MapSocketFunctions";
import { SendSocketDeleteAddObj } from "../MapSocketFunctions";

import { styleModalEnd, styleTypography } from "../MainMapStyle";
import { styleModalMenu, styleSetProcess } from "../MainMapStyle";

const RgsProcessObject = (props: { setOpen: Function; idx: number }) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  let addobj = useSelector((state: any) => {
    const { addobjReducer } = state;
    return addobjReducer.addobj.dateAdd;
  });
  console.log("RgsProcessObject", addobj);
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  //========================================================
  const [openSet, setOpenSet] = React.useState(true);
  // const [openProcess, setOpenProcess] = React.useState(true);
  // const [openSetErr, setOpenSetErr] = React.useState(false);

  // const handleKey = (event: any) => {
  //   if (event.key === "Enter") event.preventDefault();
  // };

  let idxObj = props.idx - map.tflight.length;

  const handleCloseSet = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  const handleClose = (mode: number) => {
    if (mode) {
      let dater = addobj.addObjects[idxObj];
      addobj.addObjects.splice(idxObj, 1); // удаление самой точки
      coordinates.splice(props.idx, 1);
      dispatch(coordinatesCreate(coordinates));
      dispatch(addobjCreate(addobj));
      SendSocketDeleteAddObj(debug, ws, dater);
    } else {
      console.log("Здесь будет редактирование имени")
    }
    handleCloseSet();
  };

  const StrokaBalloon = (soob: string, mode: number) => {
    return (
      <Button sx={styleModalMenu} onClick={() => handleClose(mode)}>
        <b>{soob}</b>
      </Button>
    );
  };

  return (
    <Modal open={openSet} onClose={handleCloseSet} hideBackdrop>
      <Box sx={styleSetProcess}>
        <Button sx={styleModalEnd} onClick={handleCloseSet}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={styleTypography}>
          {/* 123456789012345678901234567 */}
          {addobj.addObjects[idxObj].description.slice(0, 27)}
        </Typography>
        <Box sx={{ marginTop: 1, textAlign: "center" }}>
          {StrokaBalloon("Редактирование названия", 0)}
          {StrokaBalloon("Удаление", 1)}
        </Box>
      </Box>
    </Modal>
  );
};

export default RgsProcessObject;
