import * as React from 'react';
import { useSelector } from 'react-redux';
//import { massdkCreate, massrouteCreate } from "../../redux/actions";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

//import { MapssdkNewPoint, MassrouteNewPoint } from "../MapServiceFunctions";

import { styleSetAdress, styleBoxForm, styleInpKnop } from '../MainMapStyle';
import { styleSet } from '../MainMapStyle';

import { styleSetAdrAreaID } from './../MainMapStyle';
import { styleSetAdrArea, styleSetAdrID } from './../MainMapStyle';
import { styleSetArea, styleSetID } from './../MainMapStyle';
import { styleBoxFormArea, styleBoxFormID } from './../MainMapStyle';

let chNewCoord = 1;

const RgsCreateObject = (props: {
  setOpen: any;
  coord: any;
  //createPoint: any;
}) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  // let massdk = useSelector((state: any) => {
  //   const { massdkReducer } = state;
  //   return massdkReducer.massdk;
  // });
  // let massroute = useSelector((state: any) => {
  //   const { massrouteReducer } = state;
  //   return massrouteReducer.massroute;
  // });
  // const dispatch = useDispatch();
  //========================================================
  let homeRegion = map.regionInfo[datestat.region];
  let dat = map.areaInfo[homeRegion];
  let massKey = [];
  let massDat = [];
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

  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const [valuen1, setValuen1] = React.useState('Объект 1000' + String(chNewCoord));
  const [currency, setCurrency] = React.useState(massKey[0]);
  const [valuen3, setValuen3] = React.useState(10000);
  const [openSetErr, setOpenSetErr] = React.useState(false);

  const handleKey = (event: any) => {
    if (event.key === 'Enter') event.preventDefault();
  };

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValuen1(event.target.value.trimStart()); // удаление пробелов в начале строки
    setOpenSetAdress(true);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
    console.log('setCurrency:', currency);
    setOpenSetAdress(true);
  };

  const handleChangeID = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, '');
    if (Number(valueInp) < 10000) valueInp = 10000;
    if (valueInp === '') valueInp = 0;
    valueInp = Math.trunc(Number(valueInp)).toString();
    setValuen3(valueInp);
  };

  const handleCloseSetAdr = () => {
    props.setOpen(false);
    // massdk.push(MapssdkNewPoint(props.region, props.coord, valuen, 0, 0));
    // massroute.vertexes.push(
    //   MassrouteNewPoint(props.region, props.coord, valuen, 0, 0)
    // );
    //dispatch(massdkCreate(massdk));
    //dispatch(massrouteCreate(massroute));
    setOpenSetAdress(false);
    //props.createPoint(props.coord);
  };

  const handleCloseSetAdress = () => {
    props.setOpen(false);
    setOpenSetAdress(false);
  };

  const InputArea = () => {
    return (
      <Box sx={styleSetArea}>
        <Box component="form" sx={styleBoxFormArea}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currency}
            onChange={handleChange2}
            InputProps={{ style: { fontSize: 13.5 } }}
            variant="standard"
            helperText="Введите район"
            color="secondary">
            {currencies.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    );
  };

  //const handleClose = () => {
  // if (CheckAvailVertex()) {
  //   if (CheckDoublAreaID()) {
  //     massdk.push(
  //       MapssdkNewPoint(
  //         props.region,
  //         props.coord,
  //         adrV,
  //         Number(currency),
  //         Number(valuen)
  //       )
  //     );
  //     massroute.vertexes.push(
  //       MassrouteNewPoint(
  //         props.region,
  //         props.coord,
  //         adrV,
  //         Number(currency),
  //         Number(valuen)
  //       )
  //     );
  //     dispatch(massdkCreate(massdk));
  //     dispatch(massrouteCreate(massroute));
  //setOpenSetAdress(false);
  //props.createPoint(props.coord);
  // }
  //}
  //};

  return (
    <Modal open={openSetAdress} onClose={handleCloseSetAdress} hideBackdrop>
      <Grid item container sx={styleSetAdress}>
        <Grid item xs={9.5} sx={{ border: 0 }}>
          <Box sx={styleSet}>
            <Box component="form" sx={styleBoxForm}>
              <TextField
                size="small"
                onKeyPress={handleKey} //отключение Enter
                inputProps={{ style: { fontSize: 13.3 } }}
                value={valuen1}
                onChange={handleChange1}
                variant="standard"
                helperText="Введите наименование объекта"
                color="secondary"
              />
            </Box>
          </Box>
          <Grid item container sx={styleSetAdrArea}>
            <Grid item xs={9.5}>
              <InputArea />
            </Grid>
          </Grid>
        </Grid>

        <Grid item container sx={styleSetAdrID}>
          <Grid item xs={9.5}>
            <Box sx={styleSetID}>
              <Box component="form" sx={styleBoxFormID}>
                <TextField
                  size="small"
                  onKeyPress={handleKey} //отключение Enter
                  type="number"
                  inputProps={{ style: { fontSize: 13.3 } }}
                  value={valuen3}
                  onChange={handleChangeID}
                  variant="standard"
                  helperText="Введите ID"
                  color="secondary"
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs>
            <Button sx={styleInpKnop} onClick={handleCloseSetAdr}>
              Ввод
            </Button>
          </Grid>
        </Grid>

        {/* <Grid item xs sx={{ border: 0 }}>
          <Box>
            <Button sx={styleInpKnop} onClick={handleCloseSetAdr}>
              Ввод
            </Button>
          </Box>
        </Grid> */}
      </Grid>
    </Modal>
  );
};

export default RgsCreateObject;
