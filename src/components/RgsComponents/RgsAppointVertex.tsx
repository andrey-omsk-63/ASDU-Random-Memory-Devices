import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindingsCreate } from '../../redux/actions';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import GsErrorMessage from './RgsErrorMessage';

//import { SendSocketСreateBindings } from "../RgsSocketFunctions";
import { SendSocketUpdateBindings } from '../RgsSocketFunctions';

import { TakeAreaId, CheckKey, MakeTflink } from '../RgsServiceFunctions';
import { MakingKey, OutputKey, MakingKluch } from '../RgsServiceFunctions';
import { AppointDirect, AppointHeader } from '../RgsServiceFunctions';
import { OutputNumFaza, ReplaceInSvg } from '../RgsServiceFunctions';

import { styleModalEnd, styleModalMenu } from '../MainMapStyle';
import { styleSetAppoint, styleAppSt02 } from '../MainMapStyle';
import { styleSetAV, styleBoxFormAV } from '../MainMapStyle';
import { styleSetFaza, styleBoxFormFaza } from '../MainMapStyle';
import { styleSetFazaNull } from '../MainMapStyle';

import { TfLink } from '../../interfaceBindings.d';

let oldIdx = -1;
let kluchGl = '';
let massFaz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let klushTo1 = '';
let klushTo2 = '';
let klushTo3 = '';
let soobErr = '';

let bindIdx = -1;
let maxFaza = 0;

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
  //console.log("datestat", datestat);
  let bindings = useSelector((state: any) => {
    const { bindingsReducer } = state;
    return bindingsReducer.bindings.dateBindings;
  });
  // console.log("bindings", bindings);
  let addobj = useSelector((state: any) => {
    const { addobjReducer } = state;
    return addobjReducer.addobj.dateAdd;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const homeRegion = datestat.region;
  let imgFaza = datestat.phSvg;
  let otlOrKosyk = false;
  if (!datestat.pictSvg) otlOrKosyk = true;
  const dispatch = useDispatch();
  //========================================================
  const [openSet, setOpenSet] = React.useState(true);
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [valAreaZ, setValAreaZ] = React.useState(0);
  const [valAreaS, setValAreaS] = React.useState(0);
  const [valAreaV, setValAreaV] = React.useState(0);
  const [valAreaU, setValAreaU] = React.useState(0);
  const [valIdZ, setValIdZ] = React.useState(0);
  const [valIdS, setValIdS] = React.useState(0);
  const [valIdV, setValIdV] = React.useState(0);
  const [valIdU, setValIdU] = React.useState(0);
  let massAreaId = [valAreaZ, valIdZ, valAreaS, valIdS, valAreaV, valIdV, valAreaU, valIdU];
  let hBlock = window.innerWidth / 3 + 15;
  let hB = hBlock / 15;

  const handleKey = (event: any) => {
    if (event.key === 'Enter') event.preventDefault();
  };

  const handleCloseSet = () => {
    oldIdx = -1;
    props.setOpen(false);
    setOpenSet(false);
  };

  const handleClose = () => {
    let ch = 0;
    if (valIdZ && valAreaZ) ch++;
    if (valIdS && valAreaS) ch++;
    if (valIdV && valAreaV) ch++;
    if (valIdU && valAreaU) ch++;
    if (ch < 2) {
      soobErr = 'Должно быть введено хотя бы два направления';
      setOpenSetErr(true);
    } else {
      let maskTfLinks: TfLink = {
        id: kluchGl,
        tflink: MakeTflink(homeRegion, massAreaId, massFaz),
      };
      if (bindIdx >= 0) {
        bindings.tfLinks[bindIdx] = maskTfLinks; // редактирование
      } else {
        bindings.tfLinks.push(maskTfLinks); // добавление новой записи
      }
      SendSocketUpdateBindings(debug, ws, maskTfLinks);
      //console.log('bindings2', bindings);
      dispatch(bindingsCreate(bindings));
      handleCloseSet();
    }
  };

  const ChangeArea = (event: any, func: Function) => {
    //let valueInp = event.target.value.replace(/^0+/, "");
    let valueInp = event.target.value;
    if (valueInp === '') valueInp = 1;
    if (Number(valueInp) < 0) valueInp = 1;
    if (Number(valueInp) === 0) valueInp = 0;
    if (Number(valueInp) < 100) func(Number(valueInp));
  };

  const ChangeId = (event: any, func: any) => {
    let valueInp = event.target.value.replace(/^0+/, '');
    if (valueInp === '') valueInp = 1;
    if (Number(valueInp) < 0) valueInp = 1;
    if (Number(valueInp) < 100000) func(Number(valueInp));
  };

  const BlurId = (event: any, area: number, id: number, func: any) => {
    let kluch = homeRegion + '-' + area + '-' + id;
    if (kluch === kluchGl) {
      soobErr = 'Вы пытаетесь связать перекрёсток с самим собой';
      setOpenSetErr(true);
      func(0);
    } else {
      if (!CheckKey(kluch, map, addobj)) {
        soobErr = 'Перекрёсток [';
        if (id > 10000) soobErr = 'Объект [';
        soobErr += kluch + '] не существует';
        setOpenSetErr(true);
        func(0);
      } else {
        let have = 0;
        for (let i = 0; i < 4; i++) {
          if (massAreaId[i * 2] === area && massAreaId[i * 2 + 1] === id) have++;
        }
        if (have > 1) {
          soobErr = 'Перекрёсток [';
          if (id > 10000) soobErr = 'Объект [';
          soobErr += kluch + '] был введён с другого направления';
          setOpenSetErr(true);
          func(0);
        }
      }
    }
  };

  const InputerArea = (value: number, func: any) => {
    return (
      <Box sx={styleSetAV}>
        <Box component="form" sx={styleBoxFormAV}>
          <TextField
            size="small"
            type="number"
            onKeyPress={handleKey} //отключение Enter
            value={value}
            inputProps={{ style: { fontSize: 12.1 } }}
            onChange={(e) => ChangeArea(e, func)}
            variant="standard"
            color="secondary"
          />
        </Box>
      </Box>
    );
  };

  const InputerId = (value: any, func: any, valueAr: number) => {
    return (
      <Box sx={styleSetAV}>
        {valueAr && (
          <Box component="form" sx={styleBoxFormAV}>
            <TextField
              size="small"
              type="number"
              onKeyPress={handleKey} //отключение Enter
              value={value}
              inputProps={{ style: { fontSize: 12.1 } }}
              onChange={(e) => ChangeId(e, func)}
              onBlur={(e) => BlurId(e, valueAr, value, func)}
              variant="standard"
              color="secondary"
            />
          </Box>
        )}
      </Box>
    );
  };

  const InputerFaza = (rec: string, shift: number, kluch: string) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrency(Number(event.target.value));
      massFaz[mode + shift] = massDat[Number(event.target.value)];
    };

    let mode = 0;
    let dat = map.tflight[props.idx].phases;
    if (!dat.length) dat = [1, 2, 3];
    let massKey = [];
    let massDat: any[] = [];
    const currencies: any = [];
    if (rec === 'С') mode = 3;
    if (rec === 'В') mode = 6;
    if (rec === 'Ю') mode = 9;
    if (kluch) {
      for (let key in dat) {
        massKey.push(key);
        massDat.push(dat[key]);
      }
      for (let i = 0; i < massKey.length; i++) {
        let maskCurrencies = {
          value: '',
          label: '',
        };
        maskCurrencies.value = massKey[i];
        maskCurrencies.label = massDat[i];
        currencies.push(maskCurrencies);
      }
    }

    const [currency, setCurrency] = React.useState(dat.indexOf(massFaz[mode + shift]));

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
              InputProps={{ style: { fontSize: 12.1 } }}
              variant="standard"
              color="secondary">
              {currencies.map((option: any) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: 14 }}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}
      </Box>
    );
  };

  const AppointStroka = (
    rec1: string,
    valueAr: number,
    funcAr: Function,
    valueId: number,
    funcId: Function,
  ) => {
    let klushFrom = MakingKey(homeRegion, valueAr, valueId);
    klushTo1 = MakingKluch(rec1, homeRegion, massAreaId)[0];
    klushTo2 = MakingKluch(rec1, homeRegion, massAreaId)[1];
    klushTo3 = MakingKluch(rec1, homeRegion, massAreaId)[2];

    return (
      <Grid container sx={{ borderBottom: 1 }}>
        {/* === Направление === */}
        <Grid item xs={1} sx={{ height: hBlock / 5 }}>
          {AppointDirect(rec1, hBlock)}
        </Grid>
        {/* === Откуда === */}
        <Grid item xs={5.5} sx={{ fontSize: 14, height: hBlock / 5 }}>
          <Grid container>
            <Grid item xs={7.7} sx={{ paddingLeft: 0.5, height: hB }}>
              <Box sx={styleAppSt02}>Ведите район</Box>
            </Grid>
            <Grid item xs sx={{ border: 0 }}>
              <Box sx={styleAppSt02}>{InputerArea(valueAr, funcAr)}</Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={7.7} sx={{ paddingLeft: 0.5, height: hB }}>
              <Box sx={styleAppSt02}>Ведите ID</Box>
            </Grid>
            <Grid item xs sx={{ fontSize: 12.1 }}>
              <Box sx={styleAppSt02}>{InputerId(valueId, funcId, valueAr)}</Box>
            </Grid>
          </Grid>
          <b>{OutputKey(klushFrom, hBlock)}</b>
        </Grid>
        {/* === Куда === */}
        <Grid item xs={4} sx={{ fontSize: 14, height: hB }}>
          <b>{OutputKey(klushTo1, hBlock)}</b>
          <b>{OutputKey(klushTo2, hBlock)}</b>
          <b>{OutputKey(klushTo3, hBlock)}</b>
        </Grid>
        {/* === Фаза === */}
        <Grid item xs sx={{ fontSize: 14, height: hBlock / 5 }}>
          <Grid container>
            <Grid item xs={12} sx={{ textAlign: 'center', height: hB }}>
              <Box sx={styleAppSt02}>{InputerFaza(rec1, 0, klushTo1)}</Box>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', height: hB }}>
              <Box sx={styleAppSt02}>{InputerFaza(rec1, 1, klushTo2)}</Box>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', height: hB }}>
              <Box sx={styleAppSt02}>{InputerFaza(rec1, 2, klushTo3)}</Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const OutputPict = () => {
    return (
      <Box sx={{ border: 0, marginLeft: 1 }}>
        <div dangerouslySetInnerHTML={{ __html: ReplaceInSvg(datestat.pictSvg) }} />
      </Box>
    );
  };

  function AppIconAsdu() {
    let heightImg = window.innerWidth / 3.333;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={heightImg - 10}
        height={heightImg - 10}
        version="1"
        viewBox="0 0 91 54">
        <path
          d="M425 513C81 440-106 190 91 68 266-41 640 15 819 176c154 139 110 292-98 341-73 17-208 15-296-4zm270-14c208-38 257-178 108-308C676 79 413 8 240 40 29 78-30 199 100 329c131 131 396 207 595 170z"
          transform="matrix(.1 0 0 -.1 0 54)"></path>
        <path
          d="M425 451c-11-18-5-20 74-30 108-14 157-56 154-133-2-52-41-120-73-129-44-12-110-10-110 4 1 6 7 62 14 122 7 61 12 113 10 117-4 6-150 1-191-8-45-9-61-40-74-150-10-90-14-104-30-104-12 0-19-7-19-20 0-11 7-20 15-20s15-7 15-15c0-11 11-15 35-15 22 0 38 6 41 15 4 9 19 15 35 15 22 0 29 5 29 20s-7 20-25 20c-29 0-31 10-14 127 12 82 31 113 71 113 18 0 20-5 15-42-4-24-9-74-12-113-3-38-8-87-11-107l-6-38h46c34 0 46 4 46 15s12 15 48 15c97 0 195 47 227 110 59 115-44 225-223 237-56 4-81 2-87-6z"
          transform="matrix(.1 0 0 -.1 0 54)"></path>
      </svg>
    );
  }
  //=== инициализация ======================================
  if (oldIdx !== props.idx) {
    kluchGl = homeRegion + '-' + map.tflight[props.idx].area.num + '-';
    kluchGl += map.tflight[props.idx].ID;
    maxFaza = map.tflight[props.idx].phases.length;
    for (let i = 0; i < 12; i++) {
      massFaz[i] = map.tflight[props.idx].phases[0];
    }
    bindIdx = -1;
    for (let i = 0; i < bindings.tfLinks.length; i++) {
      if (bindings.tfLinks[i].id === kluchGl) {
        bindIdx = i;
        break;
      }
    }
    if (bindIdx >= 0) {
      let kluchZ = bindings.tfLinks[bindIdx].tflink.west.id; // запись существует
      let kluchS = bindings.tfLinks[bindIdx].tflink.north.id;
      let kluchV = bindings.tfLinks[bindIdx].tflink.east.id;
      let kluchU = bindings.tfLinks[bindIdx].tflink.south.id;
      let mass = bindings.tfLinks[bindIdx].tflink;
      const GetFaza = (mas: any, kluch: string) => {
        let faza = 0;
        for (let i = 0; i < mas.length; i++) {
          if (mas[i].id === kluch) faza = Number(mas[i].phase);
        }
        if (faza > maxFaza || !faza) faza = 1;
        return faza;
      };

      if (kluchZ) {
        let mas = mass.west.wayPointsArray;
        massFaz[0] = GetFaza(mas, kluchU);
        massFaz[1] = GetFaza(mas, kluchV);
        massFaz[2] = GetFaza(mas, kluchS);
        setValAreaZ(TakeAreaId(kluchZ)[0]);
        setValIdZ(TakeAreaId(kluchZ)[1]);
      }
      if (kluchS) {
        let mas = mass.north.wayPointsArray;
        massFaz[3] = GetFaza(mas, kluchZ);
        massFaz[4] = GetFaza(mas, kluchU);
        massFaz[5] = GetFaza(mas, kluchV);
        setValAreaS(TakeAreaId(kluchS)[0]);
        setValIdS(TakeAreaId(kluchS)[1]);
      }
      if (kluchV) {
        let mas = mass.east.wayPointsArray;
        massFaz[6] = GetFaza(mas, kluchS);
        massFaz[7] = GetFaza(mas, kluchZ);
        massFaz[8] = GetFaza(mas, kluchU);
        setValAreaV(TakeAreaId(kluchV)[0]);
        setValIdV(TakeAreaId(kluchV)[1]);
      }
      if (kluchU) {
        let mas = mass.south.wayPointsArray;
        massFaz[9] = GetFaza(mas, kluchV);
        massFaz[10] = GetFaza(mas, kluchS);
        massFaz[11] = GetFaza(mas, kluchZ);
        setValAreaU(TakeAreaId(kluchU)[0]);
        setValIdU(TakeAreaId(kluchU)[1]);
      }
    }
    oldIdx = props.idx;
  }

  return (
    <Modal open={openSet} onClose={handleCloseSet} hideBackdrop>
      <Box sx={styleSetAppoint}>
        <Button sx={styleModalEnd} onClick={handleCloseSet}>
          &#10006;
        </Button>
        <Box sx={{ fontSize: 17, marginTop: 1, textAlign: 'center' }}>
          <b>Массив связности перекрёстка {kluchGl} </b>
        </Box>
        <Grid container sx={{ marginTop: 1.5, paddingBottom: 1 }}>
          <Grid item xs={4}>
            {otlOrKosyk && <>{AppIconAsdu()}</>}
            {!otlOrKosyk && <>{OutputPict()}</>}
          </Grid>

          <Grid item xs={4} sx={{ border: 0 }}>
            {AppointHeader(hBlock)}
            {AppointStroka('З', valAreaZ, setValAreaZ, valIdZ, setValIdZ)}
            {AppointStroka('С', valAreaS, setValAreaS, valIdS, setValIdS)}
            {AppointStroka('В', valAreaV, setValAreaV, valIdV, setValIdV)}
            {AppointStroka('Ю', valAreaU, setValAreaU, valIdU, setValIdU)}
          </Grid>

          <Grid item xs={4}>
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
        <Box sx={{ marginTop: 1, textAlign: 'center' }}>
          <Button sx={styleModalMenu} onClick={() => handleClose()}>
            Сохранить изменения
          </Button>
        </Box>
        {openSetErr && <GsErrorMessage setOpen={setOpenSetErr} sErr={soobErr} />}
      </Box>
    </Modal>
  );
};

export default RgsAppointVertex;
