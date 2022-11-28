import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massrouteCreate, massrouteproCreate } from "./../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

import { SendSocketDeleteWay } from "./../MapSocketFunctions";
import { SendSocketDeleteWayFromPoint } from "./../MapSocketFunctions";
import { SendSocketDeleteWayToPoint } from "./../MapSocketFunctions";
import { SendSocketCreateWay } from "./../MapSocketFunctions";
import { SendSocketCreateWayFromPoint } from "./../MapSocketFunctions";
import { SendSocketCreateWayToPoint } from "./../MapSocketFunctions";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";
import { styleModalMenu, styleSetArea } from "./MapPointDataErrorStyle";
import { styleBoxFormArea, styleBoxFormNapr } from "./MapPointDataErrorStyle";
import { styleSetNapr, styleSave } from "./MapPointDataErrorStyle";

let lengthRoute = 0;
let index = -1;
let fromIdx = -1;
let onIdx = -1;
let massBind = [-1, -1];
let massBindNew = [-1, -1];

let dlRoute1 = 0;
let dlRouteBegin = 0;
let flagSave = false;
let sec = 0;
let tmRouteBegin = 0;
let sRoute0 = 0;
let sRouteBegin = 0;
let fromDirectBegin = 0;
let inDirectBegin = 0;
let tmRoute1 = "";

const MapPointDataError = (props: {
  sErr: string;
  setOpen: any;
  debug: boolean;
  ws: any;
  fromCross: any;
  toCross: any;
  update: any;
}) => {
  const WS = props.ws;
  //== Piece of Redux =======================================
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let massroutepro = useSelector((state: any) => {
    const { massrouteproReducer } = state;
    return massrouteproReducer.massroutepro;
  });
  const dispatch = useDispatch();
  const [openSetEr, setOpenSetEr] = React.useState(true);

  //=== инициализация ======================================
  if (index < 0) flagSave = false;
  if (index < 0 && props.sErr === "Дубликатная связь") {
    for (let i = 0; i < massroute.ways.length; i++) {
      if (
        props.fromCross.pointAaRegin === massroute.ways[i].region.toString() &&
        props.fromCross.pointAaArea ===
          massroute.ways[i].sourceArea.toString() &&
        props.fromCross.pointAaID === massroute.ways[i].sourceID &&
        props.toCross.pointBbID === massroute.ways[i].targetID &&
        props.toCross.pointBbArea === massroute.ways[i].targetArea.toString()
      ) {
        index = i;
        lengthRoute = massroute.ways[i].lenght;
        dlRoute1 = lengthRoute;
        break;
      }
    }
    sec = massroute.ways[index].time;
    tmRouteBegin = sec;
    dlRouteBegin = dlRoute1;
    sRoute0 = 0;
    if (sec) sRoute0 = (dlRoute1 / 1000 / sec) * 3600;
    let sec2 = 0;
    if (sRoute0) sec2 = dlRoute1 / (sRoute0 / 3.6);
    tmRoute1 = Math.round(sec2 / 60) + " мин";
    sRoute0 = Math.round(sRoute0 * 10) / 10;
    sRouteBegin = sRoute0;
    fromDirectBegin = massroute.ways[index].lsource; // выход
    inDirectBegin = massroute.ways[index].ltarget; // вход
    fromIdx = -1;
    onIdx = -1;
    for (let i = 0; i < massroute.vertexes.length; i++) {
      if (
        massroute.vertexes[i].region === massroute.ways[index].region &&
        massroute.vertexes[i].area === massroute.ways[index].sourceArea &&
        massroute.vertexes[i].id === massroute.ways[index].sourceID
      )
        fromIdx = i; // выход
      if (
        massroute.vertexes[i].region === massroute.ways[index].region &&
        massroute.vertexes[i].area === massroute.ways[index].targetArea &&
        massroute.vertexes[i].id === massroute.ways[index].targetID
      )
        onIdx = i; // вход
    }
    massBind = [-1, -1];
    if (massroute.vertexes[fromIdx].area)
      massBind[0] = massroute.vertexes[fromIdx].lin.indexOf(fromDirectBegin); // выход
    if (massroute.vertexes[onIdx].area)
      massBind[1] = massroute.vertexes[onIdx].lout.indexOf(inDirectBegin); // вход
    massBindNew[0] = fromDirectBegin;
    massBindNew[1] = inDirectBegin;
  }

  const handleCloseSetEnd = () => {
    index = -1;
    props.setOpen(false);
    setOpenSetEr(false);
  };

  const DeleteWay = () => {
    massroute.ways.splice(index, 1); // удаление из базы
    dispatch(massrouteCreate(massroute));

    let idx = -1; // удаление из протокола
    for (let i = 0; i < massroutepro.ways.length; i++) {
      if (
        props.fromCross.pointAaRegin ===
          massroutepro.ways[i].region.toString() &&
        props.fromCross.pointAaArea ===
          massroutepro.ways[i].sourceArea.toString() &&
        props.fromCross.pointAaID === massroutepro.ways[i].sourceID &&
        props.toCross.pointBbID === massroutepro.ways[i].targetID &&
        props.toCross.pointBbArea === massroutepro.ways[i].targetArea.toString()
      ) {
        idx = i;
      }
    }
    if (idx >= 0) {
      massroutepro.ways.splice(idx, 1);
      dispatch(massrouteproCreate(massroutepro));
    }
    props.update();
  };

  const handleCloseDel = (mode: number) => {
    let deb = props.debug;
    if (mode === 1) {
      DeleteWay();
      if (props.fromCross.pointAaArea === "0") {
        SendSocketDeleteWayFromPoint(deb, WS, props.fromCross, props.toCross);
      } else {
        if (props.toCross.pointBbArea === "0") {
          SendSocketDeleteWayToPoint(deb, WS, props.fromCross, props.toCross);
        } else {
          SendSocketDeleteWay(deb, WS, props.fromCross, props.toCross);
        }
      }
    }
    handleCloseSetEnd();
  };

  const handleClose = () => {
    let reqRoute: any = {
      dlRoute: 0,
      tmRoute: 0,
    };

    massroute.ways[index].lsource = massBindNew[0];
    massroute.ways[index].ltarget = massBindNew[1];
    massroute.ways[index].lenght = Number(dlRoute1);
    reqRoute.dlRoute = Number(dlRoute1);
    massroute.ways[index].time = Number(sec);
    reqRoute.tmRoute = Number(sec);
    dispatch(massrouteCreate(massroute));
    let deb = props.debug;
    let frCr = props.fromCross;
    let toCr = props.toCross;
    if (props.fromCross.pointAaArea === "0") {
      SendSocketDeleteWayFromPoint(deb, WS, frCr, toCr);
      SendSocketCreateWayFromPoint(deb, WS, frCr, toCr, massBindNew, reqRoute);
    } else {
      if (props.toCross.pointBbArea === "0") {
        SendSocketDeleteWayToPoint(deb, WS, frCr, props.toCross);
        SendSocketCreateWayToPoint(deb, WS, frCr, toCr, massBindNew, reqRoute);
      } else {
        SendSocketDeleteWay(deb, WS, frCr, props.toCross);
        SendSocketCreateWay(deb, WS, frCr, toCr, massBindNew, reqRoute);
      }
    }
    handleCloseSetEnd();
  };

  const [valueDl, setValueDl] = React.useState(dlRoute1);
  const [valueTm, setValueTm] = React.useState(sec);

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChangeDl = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    if (Number(valueInp) < 1000000) {
      valueInp = Math.trunc(Number(valueInp)).toString();
      dlRoute1 = valueInp;
      let sec2 = 0;
      if (dlRoute1 && sRoute0) sec2 = dlRoute1 / (sRoute0 / 3.6);
      if (sec2) tmRoute1 = Math.round(sec2 / 60) + " мин";
      flagSave = true;
      setValueDl(valueInp);
      setValueTm(Math.round(sec2));
      setTmRoute2(tmRoute1);
    }
  };

  const handleChangeTm = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    if (Number(valueInp) < 66300) {
      valueInp = Math.trunc(Number(valueInp)).toString();
      sec = valueInp;
      if (dlRoute1) sRoute0 = (dlRoute1 / 1000 / sec) * 3600;
      let sec2 = 0;
      if (dlRoute1 && sRoute0) sec2 = dlRoute1 / (sRoute0 / 3.6);
      if (sec2) tmRoute1 = Math.round(sec2 / 60) + " мин";
      flagSave = true;
      sRoute0 = Math.round(sRoute0 * 10) / 10;
      setValueTm(valueInp);
      setTmRoute2(tmRoute1);
    }
  };

  const InputerDlTm = (value: any, func: any) => {
    return (
      <Box sx={styleSetArea}>
        <Box component="form" sx={styleBoxFormArea}>
          <TextField
            size="small"
            type="number"
            onKeyPress={handleKey} //отключение Enter
            value={value}
            inputProps={{ style: { fontSize: 14.2 } }}
            onChange={func}
            variant="standard"
            color="secondary"
          />
        </Box>
      </Box>
    );
  };

  const StrokaMenu = () => {
    return (
      <Button variant="contained" sx={styleSave} onClick={() => handleClose()}>
        <b>Сохранить</b>
      </Button>
    );
  };

  const InputDirect = (mode: number) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrency(Number(event.target.value));
      if (mode) {
        massBindNew[1] = massDat[Number(event.target.value)];
      } else {
        massBindNew[0] = massDat[Number(event.target.value)];
      }
      flagSave = true;
      setTrigger(!trigger);
    };

    let dat = massroute.vertexes[fromIdx].lin;
    if (mode) dat = massroute.vertexes[onIdx].lout;
    let massKey = [];
    let massDat: any[] = [];
    const currencies: any = [];
    for (let key in dat) {
      massKey.push(key);
      massDat.push(dat[key]);
    }
    for (let i = 0; i < massKey.length; i++) {
      let maskCurrencies = {
        value: "",
        label: "",
      };
      maskCurrencies.value = massKey[i];
      maskCurrencies.label = massDat[i];
      currencies.push(maskCurrencies);
    }
    const [currency, setCurrency] = React.useState(massBind[mode]);
    const [trigger, setTrigger] = React.useState(true);

    return (
      <Box sx={styleSetNapr}>
        <Box component="form" sx={styleBoxFormNapr}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currency}
            onChange={handleChange}
            InputProps={{ style: { fontSize: 14 } }}
            variant="standard"
            color="secondary"
          >
            {currencies.map((option: any) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ fontSize: 14 }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    );
  };

  const [tmRoute2, setTmRoute2] = React.useState(tmRoute1);

  return (
    <Modal open={openSetEr} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>
        {!flagSave && (
          <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
            {props.sErr}
          </Typography>
        )}
        {flagSave && (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Редактирование параметров связи:
          </Typography>
        )}
        {props.sErr === "Дубликатная связь" && (
          <>
            {props.fromCross.pointAaArea !== "0" && (
              <Grid container sx={{ marginLeft: 1.5, marginTop: 1.2 }}>
                <Grid item xs={1.9} sx={{ border: 0 }}>
                  <b>Выход</b>
                </Grid>
                <Grid item xs={2.8} sx={{ border: 0 }}>
                  Район: <b>{massroute.ways[index].sourceArea}</b>
                </Grid>
                <Grid item xs={1.9} sx={{ border: 0 }}>
                  ID: <b>{massroute.ways[index].sourceID}</b>
                </Grid>
                <Grid item xs={3.4} sx={{ border: 0 }}>
                  Направление:
                </Grid>
                <Grid item xs sx={{ border: 0 }}>
                  {InputDirect(0)}
                </Grid>
              </Grid>
            )}

            {props.toCross.pointBbArea !== "0" && (
              <Grid container sx={{ marginLeft: 1.5, marginTop: 1.2 }}>
                <Grid item xs={1.9} sx={{ border: 0 }}>
                  <b>Вход</b>
                </Grid>
                <Grid item xs={2.8} sx={{ border: 0 }}>
                  Район: <b>{massroute.ways[index].targetArea}</b>
                </Grid>
                <Grid item xs={1.9} sx={{ border: 0 }}>
                  ID: <b>{massroute.ways[index].targetID}</b>
                </Grid>
                <Grid item xs={3.4} sx={{ border: 0 }}>
                  Направление:
                </Grid>
                <Grid item xs sx={{ border: 0 }}>
                  {InputDirect(1)}
                </Grid>
              </Grid>
            )}

            <Grid container sx={{ marginLeft: 1.5, marginTop: 1.2 }}>
              <Grid item xs={3.5} sx={{ border: 0 }}>
                <b>Длина связи:</b>
              </Grid>
              <Grid item xs={2.3} sx={{ border: 0 }}>
                {InputerDlTm(valueDl, handleChangeDl)}
              </Grid>
              <Grid item xs={0.5} sx={{ border: 0 }}>
                м
              </Grid>
              {flagSave && (
                <Grid item xs sx={{ textAlign: "center", border: 0 }}>
                  {StrokaMenu()}
                </Grid>
              )}
            </Grid>

            <Grid container sx={{ marginLeft: 1.5, marginTop: 1.5 }}>
              <Grid item xs={5.4} sx={{ border: 0 }}>
                <b>Время прохождения:</b>
              </Grid>
              <Grid item xs={2.3} sx={{ border: 0 }}>
                {tmRoute2}
              </Grid>
              <Grid item xs={0.25} sx={{ border: 0 }}>
                (
              </Grid>
              <Grid item xs={2.3} sx={{ border: 0 }}>
                {InputerDlTm(valueTm, handleChangeTm)}
              </Grid>
              <Grid item xs sx={{ border: 0 }}>
                сек)
              </Grid>
            </Grid>

            <Box sx={{ marginLeft: 1.5, marginTop: 1.5 }}>
              <b> Средняя скорость прохождения:</b>&nbsp;{sRoute0} км/ч
            </Box>

            {flagSave && (
              <Box sx={{ fontSize: 12.5, marginLeft: 1.5, marginTop: 1.5 }}>
                Исходное выходное направление: {fromDirectBegin}
                <br />
                Исходное входное направление: {inDirectBegin}
                <br />
                Исходная длина связи: {dlRouteBegin} м<br />
                Исходное время прохождения: {tmRouteBegin} сек
                <br />
                Исходная скорость прохождения: {sRouteBegin} км/ч
              </Box>
            )}

            {!flagSave && (
              <Box sx={{ textAlign: "center", marginTop: 1.2 }}>
                <Typography variant="h6" sx={{ color: "red" }}>
                  Удалить исходную связь?
                </Typography>
                <Button sx={styleModalMenu} onClick={() => handleCloseDel(1)}>
                  Да
                </Button>
                &nbsp;
                <Button sx={styleModalMenu} onClick={() => handleCloseDel(2)}>
                  Нет
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default MapPointDataError;
