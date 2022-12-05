import * as React from "react";
//import { useDispatch, useSelector } from 'react-redux';
//import { addobjCreate, coordinatesCreate } from '../../redux/actions';

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

//import RgsEditName from './RgsEditName';

//import { SendSocketDeleteAddObj } from '../MapSocketFunctions';

import { styleModalEnd, styleModalMenu } from "../MainMapStyle";
//import { styleModalMenu } from '../MainMapStyle';

const RgsAppointVertex = (props: {
  setOpen: Function;
  //idx: number
}) => {
  //== Piece of Redux ======================================
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map.dateMap;
  // });
  // let datestat = useSelector((state: any) => {
  //   const { statsaveReducer } = state;
  //   return statsaveReducer.datestat;
  // });
  // let addobj = useSelector((state: any) => {
  //   const { addobjReducer } = state;
  //   return addobjReducer.addobj.dateAdd;
  // });
  // let coordinates = useSelector((state: any) => {
  //   const { coordinatesReducer } = state;
  //   return coordinatesReducer.coordinates;
  // });
  //console.log('RgsAppointVertex', addobj);
  //const debug = datestat.debug;
  //const ws = datestat.ws;
  //const dispatch = useDispatch();
  //========================================================
  const [openSet, setOpenSet] = React.useState(true);
  const [valueAreaZ, setValueAreaZ] = React.useState(10);
  const [valueAreaS, setValueAreaS] = React.useState(0);
  const [valueAreaV, setValueAreaV] = React.useState(0);
  const [valueAreaU, setValueAreaU] = React.useState(0);
  //const [openProcess, setOpenProcess] = React.useState(false);
  //let idxObj = props.idx - map.tflight.length;
  let heightBlock = window.innerWidth / 3 + 33;

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleCloseSet = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  const handleClose = () => {
    handleCloseSet();
  };

  const handleChangeAreaZ = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    setValueAreaZ(valueInp);
  };

  const handleChangeAreaS = () => {};

  const handleChangeAreaV = () => {};

  const handleChangeAreaU = () => {};

  const styleSetAppoint = {
    outline: "none",
    position: "relative",
    marginTop: "12vh",
    marginLeft: 1,
    marginRight: "auto",
    width: "98%",
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
  };

  const styleAppHeader = {
    //border: 1,
    height: heightBlock / 5,
    paddingTop: 3,
    textAlign: "center",
  };

  const styleAppSt01 = {
    border: 0,
    textAlign: "center",
    height: heightBlock / 15,
  };

  const styleAppSt02 = {
    //border: 1,
    transform: "translate(-50%, -50%)",
    position: "relative",
    top: "50%",
    left: "50%",
  };

  const styleAppSt03 = {
    //border: 1,
    transform: "translate(-50%, -100%)",
    position: "relative",
    top: "50%",
    left: "50%",
  };

  const styleAppSt04 = {
    paddingLeft: 0.5,
    height: heightBlock / 15,
  };

  const styleSetArea = {
    width: "15px",
    maxHeight: "6px",
    minHeight: "6px",
    bgcolor: "#FFFBE5",
    boxShadow: 3,
    textAlign: "center",
    p: 1,
  };

  const styleBoxFormArea = {
    "& > :not(style)": {
      marginTop: "-9px",
      marginLeft: "-12px",
      width: "33px",
    },
  };

  const AppointHeader = () => {
    return (
      <Grid container sx={{ bgcolor: "#C0E2C3" }}>
        <Grid item xs={1}></Grid>
        <Grid item xs={4.75} sx={styleAppHeader}>
          <Box sx={styleAppSt03}>
            <b>Откуда</b>
          </Box>
        </Grid>
        <Grid item xs={4.75} sx={styleAppHeader}>
          <Box sx={styleAppSt03}>
            <b>Куда</b>
          </Box>
        </Grid>
        <Grid item xs sx={styleAppHeader}>
          <Box sx={styleAppSt03}>
            <b>Фаза</b>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const InputerArea = (value: any, func: any) => {
    return (
      <Box sx={styleSetArea}>
        <Box component="form" sx={styleBoxFormArea}>
          <TextField
            size="small"
            type="number"
            onKeyPress={handleKey} //отключение Enter
            value={valueAreaZ}
            inputProps={{ style: { fontSize: 14.2 } }}
            onChange={handleChangeAreaZ}
            variant="standard"
            color="secondary"
          />
        </Box>
      </Box>
    );
  };

  const AppointStroka = (rec1: string) => {
    return (
      <Grid container sx={{ borderBottom: 1 }}>
        {/* === Направление === */}
        <Grid item xs={1} sx={{ height: heightBlock / 5 }}>
          <Grid container>
            <Grid item xs={12} sx={{ height: heightBlock / 15 }}></Grid>
            <Grid item xs={12} sx={styleAppSt01}>
              <Box sx={styleAppSt02}>
                <b>{rec1}</b>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* === Откуда === */}
        <Grid item xs={4.75} sx={{ fontSize: 14, height: heightBlock / 5 }}>
          <Grid container>
            <Grid item xs={8.8} sx={styleAppSt04}>
              <Box sx={styleAppSt02}>Ведите район</Box>
            </Grid>
            <Grid item xs sx={{ border: 1 }}>
              <Box sx={styleAppSt02}>
                {InputerArea(valueAreaZ, handleChangeAreaZ)}
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={10} sx={styleAppSt04}>
              <Box sx={styleAppSt02}>Ведите ID</Box>
            </Grid>
            <Grid item xs={2} sx={{ border: 0 }}>
              <Box sx={styleAppSt02}>6</Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} sx={styleAppSt01}>
              <Box sx={styleAppSt02}>1-1-6</Box>
            </Grid>
          </Grid>
        </Grid>

        {/* === Куда === */}
        <Grid item xs={4.75} sx={{ fontSize: 14, height: heightBlock / 5 }}>
          <Grid container>
            <Grid item xs={12} sx={styleAppSt01}>
              <Box sx={styleAppSt02}>1-1-8</Box>
            </Grid>
            <Grid item xs={12} sx={styleAppSt01}>
              <Box sx={styleAppSt02}>1-1-10</Box>
            </Grid>
            <Grid item xs={12} sx={styleAppSt01}>
              <Box sx={styleAppSt02}>1-1-12</Box>
            </Grid>
          </Grid>
        </Grid>

        {/* === Фаза === */}
        <Grid item xs sx={{ fontSize: 14, height: heightBlock / 5 }}>
          <Grid container>
            <Grid item xs={12} sx={styleAppSt01}>
              <Box sx={styleAppSt02}>2</Box>
            </Grid>
            <Grid item xs={12} sx={styleAppSt01}>
              <Box sx={styleAppSt02}>1</Box>
            </Grid>
            <Grid item xs={12} sx={styleAppSt01}>
              <Box sx={styleAppSt02}>3</Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Modal open={openSet} onClose={handleCloseSet} hideBackdrop>
      <Box sx={styleSetAppoint}>
        <Button sx={styleModalEnd} onClick={handleCloseSet}>
          &#10006;
        </Button>
        <Box sx={{ fontSize: 17, textAlign: "center" }}>
          <b>Массив связности перекрёстка</b>
        </Box>
        <Grid container sx={{ marginTop: 0.5, paddingBottom: 1 }}>
          <Grid item xs={4} sx={{ border: 0, height: heightBlock }}></Grid>

          <Grid item xs={4} sx={{ border: 0 }}>
            {AppointHeader()}
            {AppointStroka("З")}
            {AppointStroka("С")}
            {AppointStroka("В")}
            {AppointStroka("Ю")}
          </Grid>

          <Grid item xs={4} sx={{ border: 0 }}></Grid>
        </Grid>
        <Box sx={{ marginTop: 1, textAlign: "center" }}>
          <Button sx={styleModalMenu} onClick={() => handleClose()}>
            Сохранить изменения
          </Button>
        </Box>
        {/* {openProcess && <RgsEditName setOpen={setOpenProcess} idx={props.idx} />} */}
      </Box>
    </Modal>
  );
};

export default RgsAppointVertex;
