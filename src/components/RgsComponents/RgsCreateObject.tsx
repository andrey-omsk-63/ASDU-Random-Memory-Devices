import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addobjCreate, coordinatesCreate } from "../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import GsErrorMessage from "./RgsErrorMessage";

import { NameMode } from "../RgsServiceFunctions";

import { SendSocketСreateAddObj } from "../RgsSocketFunctions";

import { styleSetAdress, styleBoxForm, styleInpKnop } from "../MainMapStyle";
import { styleSetAdrArea, styleSetAdrID } from "./../MainMapStyle";
import { styleSetArea, styleSetID, styleSet } from "./../MainMapStyle";
import { styleBoxFormArea } from "./../MainMapStyle";

let soobErr = "";
let valueName = "";
let valueID = 0;

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
  let addobj = useSelector((state: any) => {
    const { addobjReducer } = state;
    return addobjReducer.addobj.dateAdd;
  });
  //console.log("RgsCreateObject", addobj);
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  //=== инициализация ======================================
  let homeRegion = map.regionInfo[datestat.region]; // подготовка ввода района
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
  let datID: Array<number> = []; // подготовка ввода ID
  let massKeyID = [];
  let massDatID = [];
  for (let i = 0; i < 1000; i++) {
    let freeID = 10001 + i;
    let have = false;
    for (let j = 0; j < addobj.addObjects.length; j++) {
      if (addobj.addObjects[j].id === freeID) have = true;
    }
    if (!have) datID.push(freeID);
    if (datID.length > 76) break;
  }
  const currenciesID: any = [];
  for (let key in datID) {
    massKeyID.push(datID[key].toString());
    massDatID.push(datID[key]);
  }
  for (let i = 0; i < massKeyID.length; i++) {
    let maskCurrencies = {
      value: "",
      label: 0,
    };
    maskCurrencies.value = massKeyID[i];
    maskCurrencies.label = massDatID[i];
    currenciesID.push(maskCurrencies);
  }
  //========================================================
  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const [currency, setCurrency] = React.useState(massKey[0]);
  const [currencyID, setCurrencyID] = React.useState(massKeyID[0]);
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [valueId, setValueId] = React.useState(datID[0]);

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChangeArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
    setOpenSetAdress(true);
  };

  const handleCloseSet = () => {
    props.setOpen(false);
    props.funcMode(0);
    setOpenSetAdress(false);
  };

  const InputName = () => {
    const [value, setValue] = React.useState("Объект" + NameMode());
    valueName = value;

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value) {
        let val = event.target.value.trimStart(); // удаление пробелов в начале строки
        setValue(val);
        valueName = val;
      } else {
        valueName = value;
      }
    };

    return (
      <Box sx={styleSet}>
        <Box component="form" sx={styleBoxForm}>
          <TextField
            size="small"
            onKeyPress={handleKey} //отключение Enter
            InputProps={{ disableUnderline: true, style: { fontSize: 13.3 } }}
            value={value}
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
            InputProps={{ disableUnderline: true, style: { fontSize: 13.4 } }}
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
    valueID = valueId;

    const handleChangeID = (event: any) => {
      setCurrencyID(event.target.value);
      let valueInp = event.target.value;
      //let valueInp = event.target.value.replace(/^0+/, "");
      //if (Number(valueInp) < freeId) valueInp = freeId;
      //if (valueInp === "") valueInp = 0;
      valueInp = Math.trunc(Number(valueInp)).toString();
      valueID = valueInp;
      setValueId(valueInp);
    };

    return (
      <Box sx={styleSetID}>
        <Box component="form" sx={styleBoxFormArea}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currencyID}
            onChange={handleChangeID}
            InputProps={{ disableUnderline: true, style: { fontSize: 13.4 } }}
            variant="standard"
            helperText="Введите ID"
            color="secondary"
          >
            {currenciesID.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    );
  };

  const handleClose = () => {
    let have = false;
    console.log("@@@:", valueID, typeof valueID);
    for (let i = 0; i < addobj.addObjects.length; i++) {
      if (
        addobj.addObjects[i].region === Number(datestat.region) &&
        addobj.addObjects[i].area === Number(currency) &&
        addobj.addObjects[i].id === Number(valueID)
      )
        have = true;
    }
    if (have) {
      soobErr = "Oбъект с ключом [" + datestat.region + ", " + currency + ", ";
      soobErr += valueID + "] уже существует";
      setOpenSetErr(true);
    } else {
      let dater = {
        region: Number(datestat.region),
        area: Number(currency),
        id: Number(valueID),
        description: valueName,
        dgis: props.coord,
      };

      addobj.addObjects.push(dater);
      coordinates.push(props.coord);
      dispatch(coordinatesCreate(coordinates));
      dispatch(addobjCreate(addobj));
      SendSocketСreateAddObj(debug, ws, dater);
      handleCloseSet();
    }
  };

  return (
    <Modal open={openSetAdress} onClose={handleCloseSet}>
      <Grid item container sx={styleSetAdress}>
        <Grid item xs={9.5}>
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
