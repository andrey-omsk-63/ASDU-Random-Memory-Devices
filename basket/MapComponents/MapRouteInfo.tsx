import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";
import { styleBoxFormArea, styleSetArea } from "./MapPointDataErrorStyle";
import { styleSave } from "./MapPointDataErrorStyle";

let dlRoute1 = 0;
let dlRouteBegin = 0;
let tmRoute1 = "";
let flagSave = false;
let sec = 0;
let tmRouteBegin = 0;
let sRoute1 = 0;
let sRouteBegin = 0;
let maskRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};

const MapRouteInfo = (props: {
  activeRoute: any;
  idxA: number;
  idxB: number;
  setOpen: any;
  reqRoute: any;
  setReqRoute: any;
  needLinkBind: boolean;
}) => {
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //========================================================
  
  const [openSetInf, setOpenSetInf] = React.useState(true);

  if (dlRoute1 === 0) {
    maskRoute = props.reqRoute; // инициализация
    sec = maskRoute.tmRoute;
    tmRouteBegin = maskRoute.tmRoute;
    dlRoute1 = maskRoute.dlRoute;
    dlRouteBegin = maskRoute.dlRoute;
    sRoute1 = (dlRoute1 / 1000 / sec) * 3600;
    let sec2 = dlRoute1 / (sRoute1 / 3.6);
    tmRoute1 = Math.round(sec2 / 60) + " мин";
    sRoute1 = Math.round(sRoute1 * 10) / 10;
    sRouteBegin = sRoute1;
  }

  const [valueDl, setValueDl] = React.useState(dlRoute1);
  const [valueTm, setValueTm] = React.useState(sec);

  const handleCloseSetEndInf = () => {
    props.setOpen(false);
    setOpenSetInf(false);
    dlRoute1 = 0;
    flagSave = false;
  };

  const handleClose = () => {
    maskRoute.dlRoute = Number(dlRoute1);
    maskRoute.tmRoute = Number(sec);
    props.setReqRoute(maskRoute, props.needLinkBind);
    handleCloseSetEndInf();
  };

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
      let sec2 = dlRoute1 / (sRoute1 / 3.6);
      tmRoute1 = Math.round(sec2 / 60) + " мин";
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
      sRoute1 = (dlRoute1 / 1000 / sec) * 3600;
      let sec2 = dlRoute1 / (sRoute1 / 3.6);
      tmRoute1 = Math.round(sec2 / 60) + " мин";
      flagSave = true;
      sRoute1 = Math.round(sRoute1 * 10) / 10;
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

  const [tmRoute2, setTmRoute2] = React.useState(tmRoute1);

  return (
    <Modal open={openSetInf} onClose={handleCloseSetEndInf} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEndInf}>
          <b>&#10006;</b>
        </Button>
        <Box>
          <b>Исходящая точка связи:</b> <br />
          Район: <b>{massdk[props.idxA].area}</b>
          &nbsp;ID:&nbsp;<b>{massdk[props.idxA].ID}</b> <br />
          {massdk[props.idxA].nameCoordinates} <br /> <br />
          <b>Входящая точка связи:</b> <br />
          Pайон: <b>{massdk[props.idxB].area}</b>
          &nbsp;ID:&nbsp;<b>{massdk[props.idxB].ID}</b> <br />
          {massdk[props.idxB].nameCoordinates} <br /> <br />
        </Box>

        <Grid container>
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

        <Grid container sx={{ marginTop: 1.5 }}>
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

        <Box sx={{ marginTop: 1.5 }}>
          <b>Средняя скорость прохождения:</b> {sRoute1} км/ч <br />
        </Box>
        {props.activeRoute && props.activeRoute.properties.get("blocked") && (
          <Box>Имеются участки с перекрытыми дорогами</Box>
        )}
        {flagSave && (
          <Box sx={{ fontSize: 12.5, marginTop: 1.5 }}>
            Исходная длина связи: {dlRouteBegin} м<br />
            Исходное время прохождения: {tmRouteBegin} сек
            <br />
            Исходная скорость прохождения: {sRouteBegin} км/ч
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default MapRouteInfo;
