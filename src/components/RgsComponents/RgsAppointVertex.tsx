import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindingsCreate } from "../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import GsErrorMessage from "./RgsErrorMessage";

import { SendSocketUpdateBindings } from "../RgsSocketFunctions";
import { SendSocketDeleteBindings } from "../RgsSocketFunctions";

import { TakeAreaId, CheckKey, MakeTflink } from "../RgsServiceFunctions";
import { MakingKey, OutputKey, MakingKluch } from "../RgsServiceFunctions";
import { AppointDirect, AppointHeader } from "../RgsServiceFunctions";
import { OutputNumFaza, MakeMasDirect } from "../RgsServiceFunctions";
import { BadExit } from "../RgsServiceFunctions";
import { AppIconAsdu, OutputPict } from "../RgsServiceFunctions";
import { OutPutZZ, OutPutSS, OutPutUU, OutPutVV } from "../RgsServiceFunctions";

//import { BAN } from "../MainMapRgs";

import { styleModalEnd, styleModalMenu } from "../MainMapStyle";
import { styleSetAppoint, styleAppSt02 } from "../MainMapStyle";
import { styleSetAV, styleBoxFormAV, styleAppSt04 } from "../MainMapStyle";
import { styleSetFaza, styleBoxFormFaza } from "../MainMapStyle";
import { styleSetFazaNull, styleAppSt05 } from "../MainMapStyle";

import { TfLink } from "../../interfaceBindings.d";

let oldIdx = -1;
let kluchGl = "";
// let massFaz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// let massFazAdd = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //====== new
let massFaz = new Array(56).fill(0);
//let massFazAdd = new Array(28).fill(0); //====== new
let klushTo1 = "";
let klushTo2 = "";
let klushTo3 = "";
//====== new ======
let klushTo4 = "";
let klushTo5 = "";
let klushTo6 = "";
let klushTo7 = "";

let soobErr = "";
let bindIdx = -1;
let maxFaza = 0;
let HAVE = 0;

const RgsAppointVertex = (props: { setOpen: Function; idx: number }) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  let bindings = useSelector((state: any) => {
    const { bindingsReducer } = state;
    return bindingsReducer.bindings.dateBindings;
  });
  let addobj = useSelector((state: any) => {
    const { addobjReducer } = state;
    return addobjReducer.addobj.dateAdd;
  });
  const dispatch = useDispatch();
  //========================================================
  const debug = datestat.debug;
  const ws = datestat.ws;
  const homeRegion = datestat.region;
  const SL = homeRegion < 10 ? 4 : 5;
  let imgFaza = datestat.phSvg;
  let otlOrKosyk = datestat.pictSvg ? false : true;
  const AREA = Number(map.tflight[props.idx].area.num);

  const [openSet, setOpenSet] = React.useState(true);
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [badExit, setBadExit] = React.useState(false);

  const [valAreaZ, setValAreaZ] = React.useState(AREA);
  const [valAreaS, setValAreaS] = React.useState(AREA);
  const [valAreaV, setValAreaV] = React.useState(AREA);
  const [valAreaU, setValAreaU] = React.useState(AREA);
  //====== new
  const [valAreaSZ, setValAreaSZ] = React.useState(AREA);
  const [valAreaUZ, setValAreaUZ] = React.useState(AREA);
  const [valAreaUV, setValAreaUV] = React.useState(AREA);
  const [valAreaSV, setValAreaSV] = React.useState(AREA);
  //======
  const [valIdZ, setValIdZ] = React.useState(0);
  const [valIdS, setValIdS] = React.useState(0);
  const [valIdV, setValIdV] = React.useState(0);
  const [valIdU, setValIdU] = React.useState(0);
  //====== new
  const [valIdSZ, setValIdSZ] = React.useState(0);
  const [valIdUZ, setValIdUZ] = React.useState(0);
  const [valIdUV, setValIdUV] = React.useState(0);
  const [valIdSV, setValIdSV] = React.useState(0);

  let massAreaId = [
    valAreaZ,
    valIdZ,
    valAreaSZ, //====== new ======
    valIdSZ,
    valAreaS,
    valIdS,
    valAreaSV, //====== new ======
    valIdSV,
    valAreaV,
    valIdV,
    valAreaUV, //====== new ======
    valIdUV,
    valAreaU,
    valIdU,
    valAreaUZ, //====== new ======
    valIdUZ,
  ];

  let hBlock = window.innerWidth / 3.8 + 0;
  let hB = hBlock / 6;
  //=== инициализация ======================================
  if (oldIdx !== props.idx) {
    HAVE = 0;
    kluchGl = homeRegion + "-" + map.tflight[props.idx].area.num + "-";
    kluchGl += map.tflight[props.idx].ID;
    maxFaza = map.tflight[props.idx].phases.length;
    for (let i = 0; i < 12; i++) massFaz[i] = map.tflight[props.idx].phases[0];
    bindIdx = -1;
    massFaz = new Array(56).fill(1);
    for (let i = 0; i < bindings.tfLinks.length; i++)
      if (bindings.tfLinks[i].id === kluchGl) bindIdx = i;
    if (bindIdx >= 0) {
      // запись существует
      let mass = bindings.tfLinks[bindIdx].tflink;

      console.log("###:", mass);
      
      let kluchZ = bindings.tfLinks[bindIdx].tflink.west.id;
      let kluchS = bindings.tfLinks[bindIdx].tflink.north.id;
      let kluchV = bindings.tfLinks[bindIdx].tflink.east.id;
      let kluchU = bindings.tfLinks[bindIdx].tflink.south.id;
      //====== new ======
      let kluchSZ = bindings.tfLinks[bindIdx].tflink.add4.id;
      let kluchSV = bindings.tfLinks[bindIdx].tflink.add1.id;
      let kluchUV = bindings.tfLinks[bindIdx].tflink.add2.id;
      let kluchUZ = bindings.tfLinks[bindIdx].tflink.add3.id;
      //======
      

      const GetFaza = (mas: any, kluch: string) => {
        let faza = 0;
        if (mass) {
          for (let i = 0; i < mas.length; i++)
            if (mas[i].id === kluch) faza = Number(mas[i].phase);
        }
        if (faza > maxFaza || !faza) faza = 1;
        return faza;
      };

      if (kluchZ) {
        let mas = mass.west.wayPointsArray;
        massFaz[0] = GetFaza(mas, kluchUZ);
        massFaz[1] = GetFaza(mas, kluchU);
        massFaz[2] = GetFaza(mas, kluchUV);
        massFaz[3] = GetFaza(mas, kluchV);
        massFaz[4] = GetFaza(mas, kluchSV);
        massFaz[5] = GetFaza(mas, kluchS);
        massFaz[6] = GetFaza(mas, kluchSZ);
        setValAreaZ(TakeAreaId(kluchZ)[0]);
        setValIdZ(TakeAreaId(kluchZ)[1]);
      }
      if (kluchSZ) {
        let mas = mass.add4.wayPointsArray;
        massFaz[7] = GetFaza(mas, kluchZ);
        massFaz[8] = GetFaza(mas, kluchUZ);
        massFaz[9] = GetFaza(mas, kluchU);
        massFaz[10] = GetFaza(mas, kluchUV);
        massFaz[11] = GetFaza(mas, kluchV);
        massFaz[12] = GetFaza(mas, kluchSV);
        massFaz[13] = GetFaza(mas, kluchS);
        setValAreaSZ(TakeAreaId(kluchSZ)[0]);
        setValIdSZ(TakeAreaId(kluchSZ)[1]);
      }
      if (kluchS) {
        let mas = mass.north.wayPointsArray;
        massFaz[14] = GetFaza(mas, kluchSZ);
        massFaz[15] = GetFaza(mas, kluchZ);
        massFaz[16] = GetFaza(mas, kluchUZ);
        massFaz[17] = GetFaza(mas, kluchU);
        massFaz[18] = GetFaza(mas, kluchUV);
        massFaz[19] = GetFaza(mas, kluchV);
        massFaz[20] = GetFaza(mas, kluchSV);
        setValAreaS(TakeAreaId(kluchS)[0]);
        setValIdS(TakeAreaId(kluchS)[1]);
      }
      if (kluchSV) {
        let mas = mass.add1.wayPointsArray;
        massFaz[21] = GetFaza(mas, kluchS);
        massFaz[22] = GetFaza(mas, kluchSZ);
        massFaz[23] = GetFaza(mas, kluchZ);
        massFaz[24] = GetFaza(mas, kluchUZ);
        massFaz[25] = GetFaza(mas, kluchU);
        massFaz[26] = GetFaza(mas, kluchUV);
        massFaz[27] = GetFaza(mas, kluchV);
        setValAreaSV(TakeAreaId(kluchSV)[0]);
        setValIdSV(TakeAreaId(kluchSV)[1]);
      }
      if (kluchV) {
        let mas = mass.east.wayPointsArray;
        massFaz[28] = GetFaza(mas, kluchSV);
        massFaz[29] = GetFaza(mas, kluchS);
        massFaz[30] = GetFaza(mas, kluchSZ);
        massFaz[31] = GetFaza(mas, kluchZ);
        massFaz[32] = GetFaza(mas, kluchUZ);
        massFaz[33] = GetFaza(mas, kluchU);
        massFaz[34] = GetFaza(mas, kluchUV);
        setValAreaV(TakeAreaId(kluchV)[0]);
        setValIdV(TakeAreaId(kluchV)[1]);
      }
      if (kluchUV) {
        let mas = mass.add2.wayPointsArray;
        massFaz[35] = GetFaza(mas, kluchV);
        massFaz[36] = GetFaza(mas, kluchSV);
        massFaz[37] = GetFaza(mas, kluchS);
        massFaz[38] = GetFaza(mas, kluchSZ);
        massFaz[39] = GetFaza(mas, kluchZ);
        massFaz[40] = GetFaza(mas, kluchUZ);
        massFaz[41] = GetFaza(mas, kluchU);
        setValAreaUV(TakeAreaId(kluchUV)[0]);
        setValIdUV(TakeAreaId(kluchUV)[1]);
      }
      if (kluchU) {
        let mas = mass.south.wayPointsArray;
        massFaz[42] = GetFaza(mas, kluchUV);
        massFaz[43] = GetFaza(mas, kluchV);
        massFaz[44] = GetFaza(mas, kluchSV);
        massFaz[45] = GetFaza(mas, kluchS);
        massFaz[46] = GetFaza(mas, kluchSZ);
        massFaz[47] = GetFaza(mas, kluchZ);
        massFaz[48] = GetFaza(mas, kluchUZ);
        setValAreaU(TakeAreaId(kluchU)[0]);
        setValIdU(TakeAreaId(kluchU)[1]);
      }
      if (kluchUZ) {
        let mas = mass.add3.wayPointsArray;
        massFaz[33] = GetFaza(mas, kluchU);
        massFaz[42] = GetFaza(mas, kluchUV);
        massFaz[43] = GetFaza(mas, kluchV);
        massFaz[44] = GetFaza(mas, kluchSV);
        massFaz[45] = GetFaza(mas, kluchS);
        massFaz[46] = GetFaza(mas, kluchSZ);
        massFaz[47] = GetFaza(mas, kluchZ);
        setValAreaUZ(TakeAreaId(kluchUZ)[0]);
        setValIdUZ(TakeAreaId(kluchUZ)[1]);
      }
    }
    oldIdx = props.idx;
  }
  let ss = valIdS ? "С." + valIdS : "С";
  let vv = valIdV ? "В." + valIdV : "В";
  let uu = valIdU ? "Ю." + valIdU : "Ю";
  let zz = valIdZ ? "З." + valIdZ : "З";
  //=== Функции - обработчики ==============================
  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleCloseAll = () => {
    oldIdx = -1; // выход из формы
    HAVE = 0;
    props.setOpen(false);
    setOpenSet(false);
  };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && handleCloseAll(); // выход
  };

  const handleCloseBad = () => {
    HAVE && setBadExit(true);
    !HAVE && handleCloseAll(); // выход без сохранения
  };

  const handleCloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleCloseBad();
  };

  const handleClose = () => {
    let ch = 0;
    if (valIdZ && valAreaZ) ch++;
    if (valIdSZ && valAreaSZ) ch++;
    if (valIdS && valAreaS) ch++;
    if (valIdSV && valAreaSV) ch++;
    if (valIdV && valAreaV) ch++;
    if (valIdUV && valAreaUV) ch++;
    if (valIdU && valAreaU) ch++;
    if (valIdUZ && valAreaUZ) ch++;

    if (ch === 1) {
      soobErr = "Должно быть введено введено хотя бы два направления";
      setOpenSetErr(true);
    } else {
      let maskTfLinks: TfLink = {
        id: kluchGl,
        tflink: MakeTflink(homeRegion, massAreaId, massFaz),
      };
      if (!ch) {
        if (bindIdx >= 0) {
          let massRab = [];
          for (let i = 0; i < bindings.tfLinks.length; i++)
            if (i !== bindIdx) massRab.push(bindings.tfLinks[i]);
          bindings.tfLinks = massRab;
          SendSocketDeleteBindings(debug, ws, maskTfLinks);
        }
      } else {
        if (bindIdx >= 0) {
          bindings.tfLinks[bindIdx] = maskTfLinks; // редактирование
        } else {
          bindings.tfLinks.push(maskTfLinks); // добавление новой записи
        }
        SendSocketUpdateBindings(debug, ws, maskTfLinks);
      }
      dispatch(bindingsCreate(bindings));
      handleCloseAll();
    }
  };

  const BlurContent = (
    mode: number,
    area: number,
    id: number,
    funcAr: Function
  ) => {
    let kluch = homeRegion + "-" + area + "-" + id;
    let kluchOutput = area + "-" + id;
    if (kluch === kluchGl) {
      soobErr = "Вы пытаетесь связать перекрёсток с самим собой";
      setOpenSetErr(true);
      mode && funcAr(0);
    } else {
      if (!CheckKey(kluch, map, addobj)) {
        soobErr = "Перекрёсток [";
        if (id > 10000) soobErr = "Объект [";
        soobErr += kluchOutput + "] не существует";
        setOpenSetErr(true);
        mode && funcAr(0);
      } else {
        let have = 0;
        for (let i = 0; i < 4; i++)
          if (massAreaId[i * 2] === area && massAreaId[i * 2 + 1] === id)
            have++;
        if (have > 1) {
          soobErr = "Перекрёсток [";
          if (id > 10000) soobErr = "Объект [";
          soobErr += kluchOutput + "] был введён с другого направления";
          setOpenSetErr(true);
          mode && funcAr(0);
        }
      }
    }
  };

  const BlurId = (event: any, area: number, id: number, funcAr: Function) => {
    if (!area && !id) return;
    BlurContent(0, area, id, funcAr);
  };

  const ChangeId = (
    event: any,
    funcId: Function,
    funcAr: Function,
    map: any,
    addobj: any,
    AREA: number
  ) => {
    //let valueInp = event.target.value.replace(/^0+/, "");
    let valueInp = event.target.value;
    if (valueInp === "") valueInp = 1;
    if (Number(valueInp) < 0) valueInp = 1;
    if (Number(valueInp) < 100000) funcId(Number(valueInp));
    let have = false;
    HAVE++;
    if (Number(valueInp) < 9999) {
      // перекрёсток
      for (let i = 0; i < map.tflight.length; i++) {
        if (
          map.tflight[i].ID === Number(valueInp) &&
          Number(map.tflight[i].area.num) === AREA
        ) {
          funcAr(Number(map.tflight[i].area.num));
          have = true;
        }
      }
    } else {
      // объект
      for (let i = 0; i < addobj.addObjects.length; i++) {
        if (addobj.addObjects[i].id === Number(valueInp)) {
          funcAr(addobj.addObjects[i].area);
          have = true;
        }
      }
    }
    !have && funcAr(0);
  };
  //=== Компоненты =========================================
  const SaveСhange = () => {
    return (
      <>
        {HAVE > 0 ? (
          <Box sx={{ marginTop: "12px", textAlign: "center" }}>
            <Button sx={styleModalMenu} onClick={() => handleClose()}>
              Сохранить изменения
            </Button>
          </Box>
        ) : (
          <Box sx={{ marginTop: "10px", height: "36px" }}> </Box>
        )}
      </>
    );
  };

  const InputerId = (
    valueId: any,
    funcId: Function,
    valueAr: number,
    funcAr: Function
  ) => {
    return (
      <Box sx={styleSetAV}>
        <Box component="form" sx={styleBoxFormAV}>
          <TextField
            size="small"
            type="number"
            onKeyPress={handleKey} //отключение Enter
            value={valueId}
            InputProps={{ disableUnderline: true, style: { fontSize: 12.1 } }}
            onChange={(e) => ChangeId(e, funcId, funcAr, map, addobj, AREA)}
            onBlur={(e) => BlurId(e, valueAr, valueId, funcAr)}
            variant="standard"
            color="secondary"
          />
        </Box>
      </Box>
    );
  };

  const InputerFaza = (rec: string, shift: number, kluch: string) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrency(Number(event.target.value));
      massFaz[mode + shift] = massDat[Number(event.target.value)];
      HAVE++;
    };

    let mode = 0;
    let dat = map.tflight[props.idx].phases;
    if (!dat.length) dat = [1, 2, 3];
    let massKey = [];
    let massDat: any[] = [];
    const currencies: any = [];
    if (rec === "СЗ") mode = 7;
    if (rec === "С") mode = 14;
    if (rec === "СВ") mode = 21;
    if (rec === "В") mode = 28;
    if (rec === "ЮВ") mode = 35;
    if (rec === "Ю") mode = 42;
    if (rec === "ЮЗ") mode = 48;
    if (kluch) {
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
    }

    //if (rec === "СЗ") console.log("massFaz:", rec, shift, massFaz);

    const [currency, setCurrency] = React.useState(
      dat.indexOf(massFaz[mode + shift])
    );

    return (
      <Box sx={kluch ? styleSetFaza : styleSetFazaNull}>
        {kluch && CheckKey(kluch, map, addobj) && kluch !== kluchGl && (
          <Box component="form" sx={styleBoxFormFaza}>
            <TextField
              select
              size="small"
              onKeyPress={handleKey} //отключение Enter
              value={currency}
              onChange={handleChange}
              InputProps={{ disableUnderline: true, style: { fontSize: 12.1 } }}
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
        )}
      </Box>
    );
  };

  const AppointStr = (
    rec1: string,
    valueAr: number,
    funcAr: Function,
    valueId: number,
    funcId: Function
  ) => {
    let klushFrom = MakingKey(homeRegion, valueAr, valueId);
    klushTo1 = MakingKluch(rec1, homeRegion, massAreaId)[0];
    klushTo2 = MakingKluch(rec1, homeRegion, massAreaId)[1];
    klushTo3 = MakingKluch(rec1, homeRegion, massAreaId)[2];
    klushTo4 = MakingKluch(rec1, homeRegion, massAreaId)[3];
    klushTo5 = MakingKluch(rec1, homeRegion, massAreaId)[4];
    klushTo6 = MakingKluch(rec1, homeRegion, massAreaId)[5];
    klushTo7 = MakingKluch(rec1, homeRegion, massAreaId)[6];
    let masDirect = MakeMasDirect(rec1);

    const InputFaza = (num: number, klushTo: string) => {
      return (
        <Grid item xs={12} sx={{ textAlign: "center", height: hB / 2.5 }}>
          <Box sx={styleAppSt02}>{InputerFaza(rec1, num, klushTo)}</Box>
        </Grid>
      );
    };

    return (
      <Grid container sx={{ borderBottom: 1, borderColor: "#d4d4d4" }}>
        {/* === Направление === */}
        {AppointDirect(rec1, hBlock)}
        {/* === Откуда === */}
        <Grid item xs={5.5} sx={{ fontSize: 14, height: hBlock / 2.1 }}>
          <Grid container>
            <Grid item xs={7.7} sx={{ paddingLeft: 0.5, height: hB }}></Grid>
          </Grid>
          <Grid container>
            <Grid item xs={7.7} sx={{ paddingLeft: 0.5, height: hB }}>
              <Box sx={styleAppSt02}>Ведите ID</Box>
            </Grid>
            <Grid item xs sx={{ fontSize: 12.1 }}>
              <Box sx={styleAppSt02}>
                {InputerId(valueId, funcId, valueAr, funcAr)}
              </Box>
            </Grid>
          </Grid>
          {OutputKey(klushFrom.slice(SL), hBlock, "")}
        </Grid>
        {/* === Куда === */}
        <Grid item xs={4} sx={{ fontSize: 14, height: hB }}>
          {OutputKey(klushTo1.slice(SL), hBlock, masDirect[0])}
          {OutputKey(klushTo2.slice(SL), hBlock, masDirect[1])}
          {OutputKey(klushTo3.slice(SL), hBlock, masDirect[2])}
          {OutputKey(klushTo4.slice(SL), hBlock, masDirect[3])}
          {OutputKey(klushTo5.slice(SL), hBlock, masDirect[4])}
          {OutputKey(klushTo6.slice(SL), hBlock, masDirect[5])}
          {OutputKey(klushTo7.slice(SL), hBlock, masDirect[6])}
        </Grid>
        {/* === Фаза === */}
        <Grid item xs={1.5} sx={{ fontSize: 14, height: hBlock / 5 }}>
          <Grid container>
            {InputFaza(0, klushTo1)}
            {InputFaza(1, klushTo2)}
            {InputFaza(2, klushTo3)}
            {InputFaza(3, klushTo4)}
            {InputFaza(4, klushTo5)}
            {InputFaza(5, klushTo6)}
            {InputFaza(6, klushTo7)}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Modal open={openSet} onClose={handleCloseEnd}>
        <Box sx={styleSetAppoint}>
          <Button sx={styleModalEnd} onClick={handleCloseBad}>
            &#10006;
          </Button>
          <Box sx={styleAppSt04}>
            <b>Массив связности перекрёстка {kluchGl.slice(2)}</b> (
            <b>{map.tflight[props.idx].description}</b>)
          </Box>
          <Grid container sx={{ marginTop: 2 }}>
            {/* вывод картиноки перекрёстка */}
            {OutPutZZ(zz)}
            <Grid item xs={4} sx={{ border: 0 }}>
              {OutPutSS(ss)}
              {otlOrKosyk && <>{AppIconAsdu()}</>}
              {!otlOrKosyk && <>{OutputPict(datestat.pictSvg)}</>}
              {OutPutUU(uu)}
            </Grid>
            {OutPutVV(vv)}
            {/* редактор связей */}
            <Grid item xs={4} sx={styleAppSt05}>
              {AppointHeader(hBlock)}
              <Box sx={{ overflowX: "auto", height: "80.0vh" }}>
                {AppointStr("З", valAreaZ, setValAreaZ, valIdZ, setValIdZ)}
                {AppointStr("СЗ", valAreaSZ, setValAreaSZ, valIdSZ, setValIdSZ)}
                {AppointStr("С", valAreaS, setValAreaS, valIdS, setValIdS)}
                {AppointStr("СВ", valAreaSV, setValAreaSV, valIdSV, setValIdSV)}
                {AppointStr("В", valAreaV, setValAreaV, valIdV, setValIdV)}
                {AppointStr("ЮВ", valAreaUV, setValAreaUV, valIdUV, setValIdUV)}
                {AppointStr("Ю", valAreaU, setValAreaU, valIdU, setValIdU)}
                {AppointStr("ЮЗ", valAreaUZ, setValAreaUZ, valIdUZ, setValIdUZ)}
              </Box>
            </Grid>
            {/* вывод картинок фаз */}
            <Grid item xs sx={{ border: 0 }}>
              <Grid container>
                {OutputNumFaza(1, imgFaza[0], maxFaza, hBlock)}
                {OutputNumFaza(2, imgFaza[1], maxFaza, hBlock)}
                {OutputNumFaza(3, imgFaza[2], maxFaza, hBlock)}
              </Grid>
              <Grid container>
                {OutputNumFaza(4, imgFaza[3], maxFaza, hBlock)}
                {OutputNumFaza(5, imgFaza[4], maxFaza, hBlock)}
                {OutputNumFaza(6, imgFaza[5], maxFaza, hBlock)}
              </Grid>
              <Grid container>
                {OutputNumFaza(7, imgFaza[6], maxFaza, hBlock)}
                {OutputNumFaza(8, imgFaza[7], maxFaza, hBlock)}
              </Grid>
            </Grid>
          </Grid>
          {SaveСhange()}
          {openSetErr && (
            <GsErrorMessage setOpen={setOpenSetErr} sErr={soobErr} />
          )}
        </Box>
      </Modal>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
    </>
  );
};

export default RgsAppointVertex;
