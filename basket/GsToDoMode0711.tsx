import * as React from "react";
import { useSelector } from "react-redux";

//import axios from 'axios';

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CardMedia from "@mui/material/CardMedia";
//import TextField from "@mui/material/TextField";
//import Typography from "@mui/material/Typography";
//import MenuItem from "@mui/material/MenuItem";

import { styleModalEnd } from "../MainMapStyle";
import { styleModalMenu } from "./GsSetPhaseStyle";

let newInput = true;
let massFaz: any = [];

let toDoMode = false;

const GsToDoMode = (props: {
  //region: string;
  setOpen: any;
  newMode: number;
  massMem: Array<number>;
  func: any;
}) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  //const dispatch = useDispatch();
  //========================================================
  const [openSetMode, setOpenSetMode] = React.useState(true);
  const [trigger, setTrigger] = React.useState(true);

  //const [chDel, setChDel] = React.useState(0);

  //=== инициализация ======================================
  const styleToDoMode = {
    position: "relative",
    marginTop: 0.1,
    marginLeft: "auto",
    width: "33%",
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const styleStrokaTabl = {
    border: "2px solid #000",
    bgcolor: "#E6F5D6",
    maxWidth: "3px",
    minWidth: "3px",
    maxHeight: "20px",
    minHeight: "20px",
    borderColor: "#E6F5D6",
    borderRadius: 2,
    color: "black",
    textTransform: "unset !important",
  };

  const MakeMaskFaz = (i: number) => {
    let maskFaz = {
      idx: 0,
      faza: 1,
      phases: [],
      name: "",
      starRec: false,
      runRec: false,
    };
    maskFaz.idx = props.massMem[i];
    maskFaz.name = map.tflight[maskFaz.idx].description;
    maskFaz.phases = map.tflight[maskFaz.idx].phases;
    return maskFaz;
  };

  if (newInput) {
    massFaz = [];

    for (let i = 0; i < props.massMem.length; i++) {
      massFaz.push(MakeMaskFaz(i));
    }
    newInput = false;
  } else {
    let massRab: any = [];
    for (let i = 0; i < props.massMem.length; i++) {
      let flagHave = false;
      for (let j = 0; j < massFaz.length; j++) {
        if (massFaz[j].idx === props.massMem[i]) {
          massRab.push(massFaz[j]);
          flagHave = true;
          break;
        }
      }
      if (!flagHave) massRab.push(MakeMaskFaz(i));
    }
    massFaz = massRab;
  }
  //========================================================
  const handleCloseSetEnd = () => {
    props.func(12);
    props.setOpen(false);
    setOpenSetMode(false);
  };

  const ToDoMode = (mode: number) => {
    toDoMode = !toDoMode;
    setTrigger(!trigger);
  };

  const StrokaHeader = (xss: number, soob: string) => {
    return (
      <Grid item xs={xss} sx={{ fontSize: 14, textAlign: "center" }}>
        <b>{soob}</b>
      </Grid>
    );
  };

  const StrokaTabl = () => {
    const ClickKnop = (mode: number) => {
      massFaz[mode].starRec = !massFaz[mode].starRec;
      setTrigger(!trigger);
    };

    const ClickImg = (mode: number) => {
      massFaz[mode].runRec = !massFaz[mode].runRec;
      setTrigger(!trigger);
    };

    let resStr = [];
    const styleStrokaTablImg = {
      border: "2px solid #000",
      bgcolor: "#EFF9E6",
      maxWidth: "10px",
      minWidth: "10px",
      maxHeight: "45px",
      minHeight: "45px",
      borderColor: "#EFF9E6",
      borderRadius: 2,
      color: "black",
      textTransform: "unset !important",
    };

    for (let i = 0; i < massFaz.length; i++) {
      let star = "";
      if (massFaz[i].starRec) star = "*";
      
      resStr.push(
        <Grid key={i} container sx={{ marginTop: 1 }}>
          <Grid item xs={1} sx={{ paddingTop: 0.7, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleStrokaTabl}
              onClick={() => ClickKnop(i)}
            >
              {i + 1}
            </Button>
          </Grid>

          <Grid item xs={1.2} sx={{ fontSize: 27, textAlign: "right" }}>
            {star}
          </Grid>
          <Grid item xs={1.1} sx={{ border: 0 }}>
            <Button
              variant="contained"
              sx={styleStrokaTablImg}
              onClick={() => ClickImg(i)}
            >
              <CardMedia
                component="img"
                sx={{ textAlign: "center", height: 40, width: 30 }}
                image="https://localhost:3000/18.svg"
              />
            </Button>
          </Grid>
          {massFaz[i].runRec && (
            <Grid item xs={1.1} sx={{ fontSize: 30, textAlign: "left" }}>
              &bull;
            </Grid>
          )}
          {!massFaz[i].runRec && (
            <Grid item xs={1.1} sx={{ fontSize: 30, textAlign: "left" }}>
              {" "}
            </Grid>
          )}

          <Grid item xs={1.5} sx={{ textAlign: "center" }}>
            --
          </Grid>

          <Grid item xs sx={{ fontSize: 14 }}>
            {massFaz[i].name}
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleToDoMode}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        <Grid container sx={{ marginTop: 0 }}>
          <Grid item xs sx={{ fontSize: 18, textAlign: "center" }}>
            Режим: <b>{map.routes[props.newMode].description}</b>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 1 }}>
          <Grid container sx={{ bgcolor: "#C0E2C3" }}>
            {StrokaHeader(1, "Номер")}
            {StrokaHeader(3.5, "Состояние")}
            {StrokaHeader(1.5, "Фаза")}
            {StrokaHeader(6, "ДК")}
          </Grid>

          <Box sx={{ overflowX: "auto", height: "81vh" }}>{StrokaTabl()}</Box>

          {!toDoMode && (
            <Box sx={{ marginTop: 1.5, textAlign: "center" }}>
              <Button sx={styleModalMenu} onClick={() => ToDoMode(0)}>
                Начать исполнение
              </Button>
            </Box>
          )}

          {toDoMode && (
            <Box sx={{ marginTop: 1.5, textAlign: "center" }}>
              <Button sx={styleModalMenu} onClick={() => ToDoMode(1)}>
                Закончить исполнение
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default GsToDoMode;
