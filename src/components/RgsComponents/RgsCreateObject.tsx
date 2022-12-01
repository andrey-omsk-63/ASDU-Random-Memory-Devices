import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addobjectsCreate, coordinatesCreate } from '../../redux/actions';

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import GsErrorMessage from "./GsErrorMessage";

import { NameMode } from "../MapServiceFunctions";

import { SendSocketСreateAddObj } from "../MapSocketFunctions";

import { styleSetAdress, styleBoxForm, styleInpKnop } from "../MainMapStyle";
import { styleSet } from "../MainMapStyle";
import { styleSetAdrArea, styleSetAdrID } from "./../MainMapStyle";
import { styleSetArea, styleSetID } from "./../MainMapStyle";
import { styleBoxFormArea, styleBoxFormID } from "./../MainMapStyle";

//let chNewCoord = 1;
let soobErr = "";

const RgsCreateObject = (props: {
  setOpen: Function;
  coord: any;
  funcMode: Function;
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
  let addobjects = useSelector((state: any) => {
    const { addobjectsReducer } = state;
    return addobjectsReducer.addobjects.data.addObjects;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
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
      value: "",
      label: "",
    };
    maskCurrencies.value = massKey[i];
    maskCurrencies.label = massDat[i];
    currencies.push(maskCurrencies);
  }

  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const [valuen1, setValuen1] = React.useState("Объект" + NameMode()); //"Объект 1000" + String(chNewCoord)
  const [currency, setCurrency] = React.useState(massKey[0]);
  const [valuen3, setValuen3] = React.useState(10001);
  const [openSetErr, setOpenSetErr] = React.useState(false);

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setValuen1(event.target.value.trimStart()); // удаление пробелов в начале строки
      setOpenSetAdress(true);
    }
  };

  const handleChangeArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
    setOpenSetAdress(true);
  };

  const handleChangeID = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 10001) valueInp = 10001;
    if (valueInp === "") valueInp = 0;
    valueInp = Math.trunc(Number(valueInp)).toString();
    setValuen3(valueInp);
  };

  const handleCloseSet = () => {
    props.setOpen(false);
    props.funcMode(0);
    setOpenSetAdress(false);
  };

  const InputName = () => {
    return (
      <Box sx={styleSet}>
        <Box component="form" sx={styleBoxForm}>
          <TextField
            size="small"
            onKeyPress={handleKey} //отключение Enter
            inputProps={{ style: { fontSize: 13.3 } }}
            value={valuen1}
            onChange={handleChangeName}
            variant="standard"
            helperText="Введите наименование объекта"
            color="secondary"
          />
        </Box>
      </Box>
    );
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
            onChange={handleChangeArea}
            InputProps={{ style: { fontSize: 13.4 } }}
            variant="standard"
            helperText="Введите район"
            color="secondary"
          >
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

  const InputID = () => {
    return (
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
    );
  };

  const handleClose = () => {
    let have = false;
    for (let i = 0; i < addobjects.length; i++) {
      if (
        addobjects[i].region === Number(datestat.region) &&
        addobjects[i].area === Number(currency) &&
        addobjects[i].id === Number(valuen3)
      )
        have = true;
    }
    if (have) {
      soobErr = "Oбъект с ключом [" + datestat.region + ", " + currency + ", ";
      soobErr += valuen3 + "] уже существует";
      setOpenSetErr(true);
    } else {
      let dater = {
        region: Number(datestat.region),
        area: Number(currency),
        id: Number(valuen3),
        description: valuen1,
        dgis: props.coord,
      };

      console.log('1coordinates:',coordinates)
      console.log('1addobjects:',addobjects)
      
      addobjects.push(dater)
      coordinates.push(props.coord)
      dispatch(coordinatesCreate(coordinates));
      dispatch(addobjectsCreate(addobjects));

      console.log('2coordinates:',coordinates)
      console.log('2addobjects:',addobjects)

      SendSocketСreateAddObj(debug, ws, dater);
      handleCloseSet();
    }
  };

  return (
    <Modal open={openSetAdress} onClose={handleCloseSet} hideBackdrop>
      <Grid item container sx={styleSetAdress}>
        <Grid item xs={9.5} sx={{ border: 0 }}>
          <InputName />
        </Grid>
        <Grid item sx={styleSetAdrArea} xs={9.5}>
          <InputArea />
        </Grid>
        <Grid item xs={9.7} sx={styleSetAdrID}>
          <InputID />
        </Grid>
        <Grid item xs={2.3}>
          <Box sx={{ border: 1, borderColor: "#FFDB4D" }}>
            <Button sx={styleInpKnop} onClick={handleClose}>
              Ввод
            </Button>
          </Box>
        </Grid>
        {openSetErr && (
          <GsErrorMessage setOpen={setOpenSetErr} sErr={soobErr} />
        )}
      </Grid>
    </Modal>
  );
};

export default RgsCreateObject;
