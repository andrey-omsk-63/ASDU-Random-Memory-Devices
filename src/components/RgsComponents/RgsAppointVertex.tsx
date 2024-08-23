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
import { BadExit, OutBottomRow, OutTopRow } from "../RgsServiceFunctions";
import { AppIconAsdu, OutputPict, SaveСhange } from "../RgsServiceFunctions";
import { OutPutZZ, OutPutVV, AdditionalButton } from "../RgsServiceFunctions";
import { ViewSvg, GetFaza } from "../RgsServiceFunctions";

import { styleModalEnd, StyleAppSt06, styleAppSt07 } from "../MainMapStyle";
import { styleSetAppoint, styleAppSt02 } from "../MainMapStyle";
import { styleSetAV, styleBoxFormAV, styleAppSt04 } from "../MainMapStyle";
import { styleSetFaza, styleBoxFormFaza } from "../MainMapStyle";
import { styleSetFazaNull, styleAppSt05 } from "../MainMapStyle";

import { TfLink } from "../../interfaceBindings.d";

let oldIdx = -1;
let kluchGl = "";
let massFaz = new Array(56).fill(0);
let massFlDir = [0, 0, 0, 0];
let massAreaId = new Array(16).fill(0);

let klushTo1 = "";
let klushTo2 = "";
let klushTo3 = "";
let klushTo4 = "";
let klushTo5 = "";
let klushTo6 = "";
let klushTo7 = "";

let soobErr = "";
let bindIdx = -1;
let maxFaza = 0;
let HAVE = 0;
let haveDop = 0;
let position = 0;
let heightImg = 0;

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
  const [openSvg, setOpenSvg] = React.useState(false);
  const [comment, setComment] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const ref: any = React.useRef(null);
  const scRef: any = React.useRef(null);

  let hBlock = window.innerWidth / 4.6 + 0;
  let hB = hBlock / 6.0;
  //=== инициализация ======================================
  if (oldIdx !== props.idx) {
    HAVE = haveDop = position = heightImg = 0;
    massFlDir = [0, 0, 0, 0];
    massAreaId = new Array(16).fill(0);
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
      let kluchZ = bindings.tfLinks[bindIdx].tflink.west.id;
      let kluchS = bindings.tfLinks[bindIdx].tflink.north.id;
      let kluchV = bindings.tfLinks[bindIdx].tflink.east.id;
      let kluchU = bindings.tfLinks[bindIdx].tflink.south.id;
      //====== new ======
      let kluchSZ = bindings.tfLinks[bindIdx].tflink.add4.id;
      let kluchSV = bindings.tfLinks[bindIdx].tflink.add1.id;
      let kluchUV = bindings.tfLinks[bindIdx].tflink.add2.id;
      let kluchUZ = bindings.tfLinks[bindIdx].tflink.add3.id;

      if (kluchZ) {
        let mas = mass.west.wayPointsArray;
        massFaz[0] = GetFaza(mass, mas, maxFaza, kluchUZ);
        massFaz[1] = GetFaza(mass, mas, maxFaza, kluchU);
        massFaz[2] = GetFaza(mass, mas, maxFaza, kluchUV);
        massFaz[3] = GetFaza(mass, mas, maxFaza, kluchV);
        massFaz[4] = GetFaza(mass, mas, maxFaza, kluchSV);
        massFaz[5] = GetFaza(mass, mas, maxFaza, kluchS);
        massFaz[6] = GetFaza(mass, mas, maxFaza, kluchSZ);
        massAreaId[0] = TakeAreaId(kluchZ)[0];
        massAreaId[1] = TakeAreaId(kluchZ)[1];
      }
      if (kluchSZ) {
        let mas = mass.add4.wayPointsArray;
        massFaz[7] = GetFaza(mass, mas, maxFaza, kluchZ);
        massFaz[8] = GetFaza(mass, mas, maxFaza, kluchUZ);
        massFaz[9] = GetFaza(mass, mas, maxFaza, kluchU);
        massFaz[10] = GetFaza(mass, mas, maxFaza, kluchUV);
        massFaz[11] = GetFaza(mass, mas, maxFaza, kluchV);
        massFaz[12] = GetFaza(mass, mas, maxFaza, kluchSV);
        massFaz[13] = GetFaza(mass, mas, maxFaza, kluchS);
        massAreaId[2] = TakeAreaId(kluchSZ)[0];
        massAreaId[3] = TakeAreaId(kluchSZ)[1];
        massFlDir[0] = TakeAreaId(kluchSZ)[1];
      }
      if (kluchS) {
        let mas = mass.north.wayPointsArray;
        massFaz[14] = GetFaza(mass, mas, maxFaza, kluchSZ);
        massFaz[15] = GetFaza(mass, mas, maxFaza, kluchZ);
        massFaz[16] = GetFaza(mass, mas, maxFaza, kluchUZ);
        massFaz[17] = GetFaza(mass, mas, maxFaza, kluchU);
        massFaz[18] = GetFaza(mass, mas, maxFaza, kluchUV);
        massFaz[19] = GetFaza(mass, mas, maxFaza, kluchV);
        massFaz[20] = GetFaza(mass, mas, maxFaza, kluchSV);
        massAreaId[4] = TakeAreaId(kluchS)[0];
        massAreaId[5] = TakeAreaId(kluchS)[1];
      }
      if (kluchSV) {
        let mas = mass.add1.wayPointsArray;
        massFaz[21] = GetFaza(mass, mas, maxFaza, kluchS);
        massFaz[22] = GetFaza(mass, mas, maxFaza, kluchSZ);
        massFaz[23] = GetFaza(mass, mas, maxFaza, kluchZ);
        massFaz[24] = GetFaza(mass, mas, maxFaza, kluchUZ);
        massFaz[25] = GetFaza(mass, mas, maxFaza, kluchU);
        massFaz[26] = GetFaza(mass, mas, maxFaza, kluchUV);
        massFaz[27] = GetFaza(mass, mas, maxFaza, kluchV);
        massAreaId[6] = TakeAreaId(kluchSV)[0];
        massAreaId[7] = TakeAreaId(kluchSV)[1];
        massFlDir[1] = TakeAreaId(kluchSV)[1];
      }
      if (kluchV) {
        let mas = mass.east.wayPointsArray;
        massFaz[28] = GetFaza(mass, mas, maxFaza, kluchSV);
        massFaz[29] = GetFaza(mass, mas, maxFaza, kluchS);
        massFaz[30] = GetFaza(mass, mas, maxFaza, kluchSZ);
        massFaz[31] = GetFaza(mass, mas, maxFaza, kluchZ);
        massFaz[32] = GetFaza(mass, mas, maxFaza, kluchUZ);
        massFaz[33] = GetFaza(mass, mas, maxFaza, kluchU);
        massFaz[34] = GetFaza(mass, mas, maxFaza, kluchUV);
        massAreaId[8] = TakeAreaId(kluchV)[0];
        massAreaId[9] = TakeAreaId(kluchV)[1];
      }
      if (kluchUV) {
        let mas = mass.add2.wayPointsArray;
        massFaz[35] = GetFaza(mass, mas, maxFaza, kluchV);
        massFaz[36] = GetFaza(mass, mas, maxFaza, kluchSV);
        massFaz[37] = GetFaza(mass, mas, maxFaza, kluchS);
        massFaz[38] = GetFaza(mass, mas, maxFaza, kluchSZ);
        massFaz[39] = GetFaza(mass, mas, maxFaza, kluchZ);
        massFaz[40] = GetFaza(mass, mas, maxFaza, kluchUZ);
        massFaz[41] = GetFaza(mass, mas, maxFaza, kluchU);
        massAreaId[10] = TakeAreaId(kluchUV)[0];
        massAreaId[11] = TakeAreaId(kluchUV)[1];
        massFlDir[2] = TakeAreaId(kluchUV)[1];
      }
      if (kluchU) {
        let mas = mass.south.wayPointsArray;
        massFaz[42] = GetFaza(mass, mas, maxFaza, kluchUV);
        massFaz[43] = GetFaza(mass, mas, maxFaza, kluchV);
        massFaz[44] = GetFaza(mass, mas, maxFaza, kluchSV);
        massFaz[45] = GetFaza(mass, mas, maxFaza, kluchS);
        massFaz[46] = GetFaza(mass, mas, maxFaza, kluchSZ);
        massFaz[47] = GetFaza(mass, mas, maxFaza, kluchZ);
        massFaz[48] = GetFaza(mass, mas, maxFaza, kluchUZ);
        massAreaId[12] = TakeAreaId(kluchU)[0];
        massAreaId[13] = TakeAreaId(kluchU)[1];
      }
      if (kluchUZ) {
        let mas = mass.add3.wayPointsArray;
        massFaz[49] = GetFaza(mass, mas, maxFaza, kluchU);
        massFaz[50] = GetFaza(mass, mas, maxFaza, kluchUV);
        massFaz[51] = GetFaza(mass, mas, maxFaza, kluchV);
        massFaz[52] = GetFaza(mass, mas, maxFaza, kluchSV);
        massFaz[53] = GetFaza(mass, mas, maxFaza, kluchS);
        massFaz[54] = GetFaza(mass, mas, maxFaza, kluchSZ);
        massFaz[55] = GetFaza(mass, mas, maxFaza, kluchZ);
        massAreaId[14] = TakeAreaId(kluchUZ)[0];
        massAreaId[15] = TakeAreaId(kluchUZ)[1];
        massFlDir[3] = TakeAreaId(kluchUZ)[1];
      }
    }
    oldIdx = props.idx;
  }
  let ss = massAreaId[5] ? "С." + massAreaId[5] : "С";
  let sv = massAreaId[7] ? "СВ." + massAreaId[7] : "СВ";
  let vv = massAreaId[9] ? "В." + massAreaId[9] : "В";
  let uv = massAreaId[11] ? "ЮВ." + massAreaId[11] : "ЮВ";
  let uu = massAreaId[13] ? "Ю." + massAreaId[13] : "Ю";
  let uz = massAreaId[15] ? "ЮЗ." + massAreaId[15] : "ЮЗ";
  let zz = massAreaId[1] ? "З." + massAreaId[1] : "З";
  let sz = massAreaId[3] ? "СЗ." + massAreaId[3] : "СЗ";
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
    if (!HAVE) {
      handleCloseAll(); // выход без сохранения
    } else {
      let ch = 0;
      if (massAreaId[0] && massAreaId[1]) ch++;
      if (massAreaId[2] && massAreaId[3]) ch++;
      if (massAreaId[4] && massAreaId[5]) ch++;
      if (massAreaId[6] && massAreaId[7]) ch++;
      if (massAreaId[8] && massAreaId[9]) ch++;
      if (massAreaId[10] && massAreaId[11]) ch++;
      if (massAreaId[12] && massAreaId[13]) ch++;
      if (massAreaId[14] && massAreaId[15]) ch++;
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
          } else bindings.tfLinks.push(maskTfLinks); // добавление новой записи
          SendSocketUpdateBindings(debug, ws, maskTfLinks);
        }
        dispatch(bindingsCreate(bindings));
        handleCloseAll();
      }
    }
  };

  //=== Компоненты =========================================
  const Scroller = () => {
    if (scRef.current) position = scRef.current.scrollTop;
    HAVE++;
    setTrigger(!trigger);
  };

  const InputerFaza = (rec: string, shift: number, kluch: string) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrency(Number(event.target.value));
      massFaz[mode + shift] = massDat[Number(event.target.value)];
      HAVE++;
      HAVE === 1 && Scroller(); // первый ввод
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
      for (let i = 0; i < massKey.length; i++)
        currencies.push({ value: massKey[i], label: massDat[i] });
    }

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

  const funcAddKnop = (rec1: string) => {
    if (rec1 === "СЗ") massFlDir[0] = 1;
    if (rec1 === "СВ") massFlDir[1] = 1;
    if (rec1 === "ЮВ") massFlDir[2] = 1;
    if (rec1 === "ЮЗ") massFlDir[3] = 1;
    if (scRef.current) position = scRef.current.scrollTop;
    haveDop++;
    setTrigger(!trigger);
  };

  const AppointStr = (rec1: string, valueAr: number, valueId: number) => {
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

    const InputerId = (rec1: string) => {
      let nomInMass = 0;
      if (rec1 === "СЗ") nomInMass = 1;
      if (rec1 === "С") nomInMass = 2;
      if (rec1 === "СВ") nomInMass = 3;
      if (rec1 === "В") nomInMass = 4;
      if (rec1 === "ЮВ") nomInMass = 5;
      if (rec1 === "Ю") nomInMass = 6;
      if (rec1 === "ЮЗ") nomInMass = 7;
      const [valueId, setValId] = React.useState(massAreaId[nomInMass * 2 + 1]);
      let valueAr = massAreaId[nomInMass * 2];

      const BlurId = (event: any, area: number, id: number) => {
        if (!area && !id) {
          Scroller();
          return;
        }
        let kluch = homeRegion + "-" + area + "-" + id;
        let kluchOutput = area + "-" + id;
        if (kluch === kluchGl) {
          soobErr = "Вы пытаетесь связать перекрёсток с самим собой";
          setOpenSetErr(true);
          massAreaId[nomInMass * 2] = 0;
          massAreaId[nomInMass * 2 + 1] = 0;
          setValId(0);
        } else {
          if (!CheckKey(kluch, map, addobj)) {
            soobErr = "Перекрёсток [";
            if (id > 10000) soobErr = "Объект [";
            soobErr += kluchOutput + "] не существует";
            setOpenSetErr(true);
            massAreaId[nomInMass * 2] = 0;
            massAreaId[nomInMass * 2 + 1] = 0;
            setValId(0);
          } else {
            let have = 0;
            for (let i = 0; i < 8; i++)
              if (massAreaId[i * 2 + 1] === id) have++;
            if (have > 1) {
              soobErr = "Перекрёсток [";
              if (id > 10000) soobErr = "Объект [";
              soobErr += kluchOutput + "] был введён с другого направления";
              setOpenSetErr(true);
              massAreaId[nomInMass * 2] = 0;
              massAreaId[nomInMass * 2 + 1] = 0;
              setValId(0);
            } else Scroller();
          }
        }
      };

      const ChangeId = (event: any, map: any, addobj: any, AREA: number) => {
        let valueInp = event.target.value;
        if (valueInp === "") valueInp = 1;
        if (Number(valueInp) < 0) valueInp = 1;
        if (Number(valueInp) < 100000) {
          massAreaId[nomInMass * 2 + 1] = Number(valueInp);
          setValId(Number(valueInp));
        }
        let have = false;
        HAVE++;
        if (!Number(valueInp)) {
          // обнуление
          if (rec1 === "СЗ") massFlDir[0] = 0;
          if (rec1 === "СВ") massFlDir[1] = 0;
          if (rec1 === "ЮВ") massFlDir[2] = 0;
          if (rec1 === "ЮЗ") massFlDir[3] = 0;
          Scroller();
        }
        if (HAVE === 1) {
          if (scRef.current) position = scRef.current.scrollTop; // первый ввод
          setTrigger(!trigger);
        }
        if (Number(valueInp) < 9999) {
          // перекрёсток
          for (let i = 0; i < map.tflight.length; i++) {
            if (
              map.tflight[i].ID === Number(valueInp) &&
              Number(map.tflight[i].area.num) === AREA
            ) {
              massAreaId[nomInMass * 2] = Number(map.tflight[i].area.num);
              have = true;
            }
          }
        } else {
          // объект
          for (let i = 0; i < addobj.addObjects.length; i++) {
            if (addobj.addObjects[i].id === Number(valueInp)) {
              massAreaId[nomInMass * 2] = addobj.addObjects[i].area;
              have = true;
            }
          }
        }
        if (!have) massAreaId[nomInMass * 2] = 0;
      };

      return (
        <Box sx={styleSetAV}>
          <Box component="form" sx={styleBoxFormAV}>
            <TextField
              size="small"
              type="number"
              onKeyPress={handleKey} //отключение Enter
              value={valueId}
              InputProps={{ disableUnderline: true }}
              inputProps={{ style: { cursor: "pointer", fontSize: 12.1 } }}
              onChange={(e) => ChangeId(e, map, addobj, AREA)}
              onBlur={(e) => BlurId(e, valueAr, valueId)}
              variant="standard"
              color="secondary"
            />
          </Box>
        </Box>
      );
    };

    let openBlok = false;
    if (rec1 === "З" || rec1 === "С" || rec1 === "В" || rec1 === "Ю")
      openBlok = true;
    if (rec1 === "СЗ" && (massAreaId[3] || massFlDir[0])) openBlok = true;
    if (rec1 === "СВ" && (massAreaId[7] || massFlDir[1])) openBlok = true;
    if (rec1 === "ЮВ" && (massAreaId[11] || massFlDir[2])) openBlok = true;
    if (rec1 === "ЮЗ" && (massAreaId[15] || massFlDir[3])) openBlok = true;

    return (
      <>
        {openBlok && (
          <Grid container sx={{ borderBottom: 1, borderColor: "#d4d4d4" }}>
            {/* === Направление === */}
            {AppointDirect(rec1, hBlock)}
            {/* === Откуда === */}
            <Grid item xs={5.5} sx={{ fontSize: 14, height: hBlock / 2.1 }}>
              <Grid container>
                <Grid item xs={7.7} sx={{ paddingLeft: 0.5, height: hB }}>
                  {" "}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4.7} sx={{ paddingLeft: 0.5, height: hB }}>
                  <Box sx={styleAppSt02}>Ведите ID</Box>
                </Grid>
                <Grid item xs={3.6} sx={{ paddingLeft: 0.5, height: hB }}>
                  <Box sx={styleAppSt02}>
                    {OutputKey(klushFrom.slice(SL), hBlock, "")}
                  </Box>
                </Grid>
                <Grid item xs sx={{ fontSize: 12.1 }}>
                  <Box sx={styleAppSt02}>{InputerId(rec1)}</Box>
                </Grid>
              </Grid>
              {AdditionalButton(rec1, hBlock, massFlDir, funcAddKnop)}
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
        )}
      </>
    );
  };

  const AppointVertex = (props: {}) => {
    React.useEffect(() => {
      position && scRef.current.scrollTo(0, position);
    }, []);

    return (
      <Box ref={scRef} sx={{ overflowX: "auto", height: "83.0vh" }}>
        {AppointStr("З", massAreaId[0], massAreaId[1])}
        {AppointStr("СЗ", massAreaId[2], massAreaId[3])}
        {AppointStr("С", massAreaId[4], massAreaId[5])}
        {AppointStr("СВ", massAreaId[6], massAreaId[7])}
        {AppointStr("В", massAreaId[8], massAreaId[9])}
        {AppointStr("ЮВ", massAreaId[10], massAreaId[11])}
        {AppointStr("Ю", massAreaId[12], massAreaId[13])}
        {AppointStr("ЮЗ", massAreaId[14], massAreaId[15])}
      </Box>
    );
  };

  if (ref.current) heightImg = ref.current.clientWidth;
  let soobComment =
    "Для более детального просмотра изображения перекрёстка нажмите левую кнопку мыши";

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
            {/* вывод картиноки перекрёстка c направлениями */}
            {OutPutZZ(zz)}
            <Grid item xs={4}>
              {OutTopRow(sz, ss, sv)}
              <Box
                onMouseEnter={() => setComment(true)}
                onClick={() => setOpenSvg(true)}
                onMouseLeave={() => setComment(false)}
              >
                {comment ? (
                  <Box sx={StyleAppSt06(121, heightImg)}>{soobComment}</Box>
                ) : (
                  <Box ref={ref} sx={styleAppSt07}>
                    {otlOrKosyk && <>{AppIconAsdu()}</>}
                    {!otlOrKosyk && <>{OutputPict(datestat.pictSvg)}</>}
                  </Box>
                )}
              </Box>
              {OutBottomRow(uz, uu, uv)}
            </Grid>
            {OutPutVV(vv)}
            {/* редактор связей */}
            <Grid item xs={4} sx={styleAppSt05}>
              {AppointHeader(hBlock)}
              <AppointVertex />
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
          {SaveСhange(HAVE, haveDop, handleCloseBad, handleClose)}
          {openSetErr && (
            <GsErrorMessage setOpen={setOpenSetErr} sErr={soobErr} />
          )}
        </Box>
      </Modal>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
      {openSvg && <>{ViewSvg(setOpenSvg, datestat.pictSvg)}</>}
    </>
  );
};

export default RgsAppointVertex;
