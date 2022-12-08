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

import { SendSocketСreateBindings } from '../RgsSocketFunctions';
import { TakeAreaId, CheckKey, MakeTflink } from '../RgsServiceFunctions';

import { styleModalEnd, styleModalMenu } from '../MainMapStyle';
import { styleSetAppoint, styleAppSt02 } from '../MainMapStyle';
import { styleAppSt021, styleAppSt03 } from '../MainMapStyle';
import { styleSetAV, styleBoxFormAV } from '../MainMapStyle';
import { styleSetFaza, styleBoxFormFaza } from '../MainMapStyle';

//import { Tflink, WayPointsArray } from "../../interfaceBindings.d";
import { TfLink } from '../../interfaceBindings.d';

let oldIdx = -1;
let kluchGl = '';
let massFaz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let klushTo1 = '';
let klushTo2 = '';
let klushTo3 = '';
let soobErr = '';

let bindIdx = -1;

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
  // console.log("bindings", bindings);
  let addobj = useSelector((state: any) => {
    const { addobjReducer } = state;
    return addobjReducer.addobj.dateAdd;
  });
  // let coordinates = useSelector((state: any) => {
  //   const { coordinatesReducer } = state;
  //   return coordinatesReducer.coordinates;
  // });
  //console.log("RgsAppointVertex", addobj);
  const debug = datestat.debug;
  const ws = datestat.ws;
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
  //const [trigger, setTrigger] = React.useState(false);

  let hBlock = window.innerWidth / 3 + 15;
  let hB = hBlock / 15;
  let homeRegion = datestat.region;

  const handleKey = (event: any) => {
    if (event.key === 'Enter') event.preventDefault();
  };

  const handleCloseSet = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  const handleClose = () => {
    let ch = 0;
    if (valIdZ) ch++;
    if (valIdS) ch++;
    if (valIdV) ch++;
    if (valIdU) ch++;
    if (ch < 2) {
      soobErr = 'Должно быть введено хотя бы два направления';
      setOpenSetErr(true);
    } else {
      let massAreaId = [valAreaZ, valIdZ, valAreaS, valIdS, valAreaV, valIdV, valAreaU, valIdU];
      let maskTfLinks: TfLink = {
        id: kluchGl,
        tflink: MakeTflink(homeRegion, massAreaId, massFaz),
      };
      bindings.tfLinks.push(maskTfLinks);
      console.log('bindings2', bindings);
      dispatch(bindingsCreate(bindings));
      SendSocketСreateBindings(debug, ws, maskTfLinks);
      oldIdx = -1;
      handleCloseSet();
    }
  };

  const ChangeArea = (event: any, func: Function) => {
    let valueInp = event.target.value.replace(/^0+/, '');
    if (valueInp === '') valueInp = 1;
    if (Number(valueInp) < 0) valueInp = 1;
    if (Number(valueInp) < 100) func(valueInp);
  };

  const ChangeId = (event: any, func: any) => {
    let valueInp = event.target.value.replace(/^0+/, '');
    if (valueInp === '') valueInp = 1;
    if (Number(valueInp) < 0) valueInp = 1;
    if (Number(valueInp) < 100000) func(valueInp);
  };

  const BlurId = (event: any, area: any, id: any) => {
    let kluch = homeRegion + '-' + area + '-' + id;
    if (kluch === kluchGl) {
      soobErr = 'Вы пытаетесь связать перекрёсток с самим собой';
      setOpenSetErr(true);
    } else {
      if (!CheckKey(kluch, map, addobj)) {
        soobErr = 'Перекрёсток ';
        if (id > 10000) soobErr = 'Объект ';
        soobErr += kluch + ' не существует';
        setOpenSetErr(true);
      }
    }
  };

  const AppointHeader = () => {
    return (
      <Grid container sx={{ bgcolor: '#C0E2C3' }}>
        <Grid item xs={1}></Grid>
        <Grid item xs={5.5} sx={{ height: hBlock / 10, paddingTop: 3 }}>
          <Box sx={styleAppSt03}>
            <b>Откуда</b>
          </Box>
        </Grid>
        <Grid item xs={4} sx={{ height: hBlock / 10, paddingTop: 3 }}>
          <Box sx={styleAppSt03}>
            <b>Куда</b>
          </Box>
        </Grid>
        <Grid item xs sx={{ height: hBlock / 10, paddingTop: 3 }}>
          <Box sx={styleAppSt03}>
            <b>Фаза</b>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const AppointDirect = (rec1: string) => {
    return (
      <Grid container>
        <Grid item xs={12} sx={{ height: hBlock / 15 }}></Grid>
        <Grid item xs={12} sx={{ textAlign: 'center', height: hB }}>
          <Box sx={styleAppSt021}>
            <b>{rec1}</b>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const InputerArea = (value: any, func: any) => {
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

  const InputerId = (value: any, func: any, valueAr: any) => {
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
              onBlur={(e) => BlurId(e, valueAr, value)}
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
      <Box sx={styleSetFaza}>
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

  const OutputKey = (klush: string) => {
    return (
      <Grid container>
        <Grid item xs={12} sx={{ textAlign: 'center', height: hBlock / 15 }}>
          <Box sx={styleAppSt02}>{klush}</Box>
        </Grid>
      </Grid>
    );
  };

  const AppointStroka = (
    rec1: string,
    valueAr: any,
    funcAr: Function,
    valueId: any,
    funcId: Function,
  ) => {
    const MakingKey = (valueAr: any, valueId: any) => {
      let klushFrom = '';
      if (valueAr && valueId) klushFrom = homeRegion + '-' + valueAr + '-' + valueId;
      return klushFrom;
    };

    klushTo1 = '';
    klushTo2 = '';
    klushTo3 = '';
    let klushFrom = MakingKey(valueAr, valueId);
    switch (rec1) {
      case 'З':
        if (valAreaZ && valIdZ) {
          klushTo1 = MakingKey(valAreaU, valIdU);
          klushTo2 = MakingKey(valAreaV, valIdV);
          klushTo3 = MakingKey(valAreaS, valIdS);
        }
        break;
      case 'С':
        if (valAreaS && valIdS) {
          klushTo1 = MakingKey(valAreaZ, valIdZ);
          klushTo2 = MakingKey(valAreaU, valIdU);
          klushTo3 = MakingKey(valAreaV, valIdV);
        }
        break;
      case 'В':
        if (valAreaV && valIdV) {
          klushTo1 = MakingKey(valAreaS, valIdS);
          klushTo2 = MakingKey(valAreaZ, valIdZ);
          klushTo3 = MakingKey(valAreaU, valIdU);
        }
        break;
      case 'Ю':
        if (valAreaU && valIdV) {
          klushTo1 = MakingKey(valAreaV, valIdV);
          klushTo2 = MakingKey(valAreaS, valIdS);
          klushTo3 = MakingKey(valAreaZ, valIdZ);
        }
    }

    return (
      <Grid container sx={{ borderBottom: 1 }}>
        {/* === Направление === */}
        <Grid item xs={1} sx={{ height: hBlock / 5 }}>
          {AppointDirect(rec1)}
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
          <b>{OutputKey(klushFrom)}</b>
        </Grid>
        {/* === Куда === */}
        <Grid item xs={4} sx={{ fontSize: 14, height: hB }}>
          <b>{OutputKey(klushTo1)}</b>
          <b>{OutputKey(klushTo2)}</b>
          <b>{OutputKey(klushTo3)}</b>
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
  //=== инициализация ======================================
  if (oldIdx !== props.idx) {
    kluchGl = homeRegion + '-' + map.tflight[props.idx].area.num + '-';
    kluchGl += map.tflight[props.idx].ID;
    let maxFaza = map.tflight[props.idx].phases.length;
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
      console.log('bindings0', bindIdx, bindings.tfLinks[bindIdx]);
      let kluchZ = bindings.tfLinks[bindIdx].tflink.west.id;
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
          <Grid item xs={4} sx={{ border: 1 }}></Grid>

          <Grid item xs={4} sx={{ border: 0 }}>
            {AppointHeader()}
            {AppointStroka('З', valAreaZ, setValAreaZ, valIdZ, setValIdZ)}
            {AppointStroka('С', valAreaS, setValAreaS, valIdS, setValIdS)}
            {AppointStroka('В', valAreaV, setValAreaV, valIdV, setValIdV)}
            {AppointStroka('Ю', valAreaU, setValAreaU, valIdU, setValIdU)}
          </Grid>

          <Grid item xs={4} sx={{ border: 1 }}></Grid>
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
