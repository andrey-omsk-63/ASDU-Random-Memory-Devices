import * as React from 'react';
import {
  //useDispatch,
  useSelector,
} from 'react-redux';
//import { addobjCreate, coordinatesCreate } from '../../redux/actions';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

//import RgsEditName from './RgsEditName';

//import { SendSocketDeleteAddObj } from '../MapSocketFunctions';

import { styleModalEnd, styleModalMenu } from '../MainMapStyle';
import { styleSetAppoint, styleAppSt02 } from '../MainMapStyle';
import { styleAppSt021, styleAppSt03 } from '../MainMapStyle';
import { styleSetAV, styleBoxFormAV } from '../MainMapStyle';

let oldIdx = 0;
let kluchGl = '';
let massFaz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const RgsAppointVertex = (props: { setOpen: Function; idx: number }) => {
  console.log('IDX:', props.idx);
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
  console.log('bindings', bindings);
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
  const [valAreaZ, setValAreaZ] = React.useState(0);
  const [valAreaS, setValAreaS] = React.useState(0);
  const [valAreaV, setValAreaV] = React.useState(0);
  const [valAreaU, setValAreaU] = React.useState(0);
  const [valIdZ, setValIdZ] = React.useState(0);
  const [valIdS, setValIdS] = React.useState(0);
  const [valIdV, setValIdV] = React.useState(0);
  const [valIdU, setValIdU] = React.useState(0);
  //const [openProcess, setOpenProcess] = React.useState(false);
  //let idxObj = props.idx - map.tflight.length;
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
    handleCloseSet();
  };

  const ChangeArea = (event: any, func: Function) => {
    let valueInp = event.target.value.replace(/^0+/, '');
    if (valueInp === '') valueInp = 1;
    if (Number(valueInp) < 0) valueInp = 1;
    if (Number(valueInp) < 100) func(valueInp);
  };

  const ChangeId = (event: any, func: Function) => {
    let valueInp = event.target.value.replace(/^0+/, '');
    if (valueInp === '') valueInp = 1;
    if (Number(valueInp) < 0) valueInp = 1;
    if (Number(valueInp) < 1000) func(valueInp);
  };

  const AppointHeader = () => {
    return (
      <Grid container sx={{ bgcolor: '#C0E2C3' }}>
        <Grid item xs={1}></Grid>
        <Grid item xs={4.75} sx={{ height: hBlock / 10, paddingTop: 3 }}>
          <Box sx={styleAppSt03}>
            <b>Откуда</b>
          </Box>
        </Grid>
        <Grid item xs={4.75} sx={{ height: hBlock / 10, paddingTop: 3 }}>
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
            inputProps={{ style: { fontSize: 13.2 } }}
            onChange={(e) => ChangeArea(e, func)}
            variant="standard"
            color="secondary"
          />
        </Box>
      </Box>
    );
  };

  const InputerId = (value: any, func: any) => {
    return (
      <Box sx={styleSetAV}>
        <Box component="form" sx={styleBoxFormAV}>
          <TextField
            size="small"
            type="number"
            onKeyPress={handleKey} //отключение Enter
            value={value}
            inputProps={{ style: { fontSize: 12.9 } }}
            onChange={(e) => ChangeId(e, func)}
            variant="standard"
            color="secondary"
          />
        </Box>
      </Box>
    );
  };

  const styleSetFaza = {
    //border: 1,
    position: 'relative',
    marginTop: '1px',
    left: '27%',
    width: '30px',
    maxHeight: '20px',
    minHeight: '20px',
    bgcolor: '#FFFBE5',
    boxShadow: 3,
  };

  const styleBoxFormFaza = {
    '& > :not(style)': {
      marginTop: '-2px',
      marginLeft: '-1px',
      width: '32px',
    },
  };

  const InputerFaza = (rec: string, shift: number, kluch: string) => {
    let mode = 0;
    if (rec === 'С') mode = 3;
    if (rec === 'В') mode = 6;
    if (rec === 'Ю') mode = 9;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrency(Number(event.target.value));
      massFaz[mode + shift] = massDat[Number(event.target.value)];
      console.log('MASSFAZ:', massFaz);
    };

    let dat = map.tflight[props.idx].phases;
    if (!dat.length) dat = [1, 2, 3];
    let massKey = [];
    let massDat: any[] = [];
    const currencies: any = [];
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

    const [currency, setCurrency] = React.useState(dat.indexOf(massFaz[mode + shift]));

    return (
      <Box sx={styleSetFaza}>
        {kluch && (
          <Box component="form" sx={styleBoxFormFaza}>
            <TextField
              select
              size="small"
              onKeyPress={handleKey} //отключение Enter
              value={currency}
              onChange={handleChange}
              InputProps={{ style: { fontSize: 12.9 } }}
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
    let klushFrom = '';
    if (valueAr && valueId) klushFrom = homeRegion + '-' + valueAr + '-' + valueId;
    let klushTo1 = '';
    let klushTo2 = '';
    let klushTo3 = '';

    switch (rec1) {
      case 'З':
        if (valAreaU && valIdU) klushTo1 = homeRegion + '-' + valAreaU + '-' + valIdU;
        if (valAreaV && valIdV) klushTo2 = homeRegion + '-' + valAreaV + '-' + valIdV;
        if (valAreaS && valIdS) klushTo3 = homeRegion + '-' + valAreaS + '-' + valIdS;
        break;
      case 'С':
        if (valAreaZ && valIdZ) klushTo1 = homeRegion + '-' + valAreaZ + '-' + valIdZ;
        if (valAreaU && valIdU) klushTo2 = homeRegion + '-' + valAreaU + '-' + valIdU;
        if (valAreaV && valIdV) klushTo3 = homeRegion + '-' + valAreaV + '-' + valIdV;
        break;
      case 'В':
        if (valAreaS && valIdS) klushTo1 = homeRegion + '-' + valAreaS + '-' + valIdS;
        if (valAreaZ && valIdZ) klushTo2 = homeRegion + '-' + valAreaZ + '-' + valIdZ;
        if (valAreaU && valIdU) klushTo3 = homeRegion + '-' + valAreaU + '-' + valIdU;
        break;
      case 'Ю':
        if (valAreaV && valIdV) klushTo1 = homeRegion + '-' + valAreaV + '-' + valIdV;
        if (valAreaS && valIdS) klushTo2 = homeRegion + '-' + valAreaS + '-' + valIdS;
        if (valAreaZ && valIdZ) klushTo3 = homeRegion + '-' + valAreaZ + '-' + valIdZ;
    }
    return (
      <Grid container sx={{ borderBottom: 1 }}>
        {/* === Направление === */}
        <Grid item xs={1} sx={{ height: hBlock / 5 }}>
          {AppointDirect(rec1)}
        </Grid>
        {/* === Откуда === */}
        <Grid item xs={4.75} sx={{ fontSize: 14, height: hBlock / 5 }}>
          <Grid container>
            <Grid item xs={8.6} sx={{ paddingLeft: 0.5, height: hB }}>
              <Box sx={styleAppSt02}>Ведите район</Box>
            </Grid>
            <Grid item xs sx={{ border: 0 }}>
              <Box sx={styleAppSt02}>{InputerArea(valueAr, funcAr)}</Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={8.6} sx={{ paddingLeft: 0.5, height: hB }}>
              <Box sx={styleAppSt02}>Ведите ID</Box>
            </Grid>
            <Grid item xs sx={{ border: 0 }}>
              <Box sx={styleAppSt02}>{InputerId(valueId, funcId)}</Box>
            </Grid>
          </Grid>
          <b>{OutputKey(klushFrom)}</b>
        </Grid>
        {/* === Куда === */}
        <Grid item xs={4.75} sx={{ fontSize: 14, height: hB }}>
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
    for (let i = 0; i < 12; i++) {
      massFaz[i] = map.tflight[props.idx].phases[0];
    }
    oldIdx = props.idx;
  }

  return (
    <Modal open={openSet} onClose={handleCloseSet} hideBackdrop>
      <Box sx={styleSetAppoint}>
        <Button sx={styleModalEnd} onClick={handleCloseSet}>
          &#10006;
        </Button>
        <Box sx={{ fontSize: 17, marginTop: 0.5, textAlign: 'center' }}>
          <b>Массив связности перекрёстка {kluchGl} </b>
        </Box>
        <Grid container sx={{ marginTop: 1, paddingBottom: 1 }}>
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
        {/* {openProcess && <RgsEditName setOpen={setOpenProcess} idx={props.idx} />} */}
      </Box>
    </Modal>
  );
};

export default RgsAppointVertex;
