import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { MapssdkNewPoint, MassrouteNewPoint } from "./../MapServiceFunctions";
import MapPointDataError from "./MapPointDataError";

import { styleInpKnop, styleSetAdrAreaID } from "./../MainMapStyle";
import { styleSetAdrArea, styleSetAdrID } from "./../MainMapStyle";
import { styleSetArea, styleSetID } from "./../MainMapStyle";
import { styleBoxFormArea, styleBoxFormID } from "./../MainMapStyle";

let soobErr = "";
let adrV = "";

const MapCreateVertex = (props: {
  setOpen: any;
  region: number;
  coord: any;
  createPoint: any;
}) => {
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  const dispatch = useDispatch();
  //========================================================
  let homeRegion = map.dateMap.regionInfo[props.region];
  let dat = map.dateMap.areaInfo[homeRegion];
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
  const [currency, setCurrency] = React.useState(massKey[0]);
  const [valuen, setValuen] = React.useState(1);
  const [openSetErr, setOpenSetErr] = React.useState(false);

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
    console.log("setCurrency:", currency);
    setOpenSetAdress(true);
  };

  const handleChangeID = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    valueInp = Math.trunc(Number(valueInp)).toString();
    setValuen(valueInp);
  };

  const handleCloseSetAdress = () => {
    props.setOpen(false);
    setOpenSetAdress(false);
  };

  const CheckDoublAreaID = () => {
    let doublAreaID = true;

    for (let i = 0; i < massroute.vertexes.length; i++) {
      if (
        massroute.vertexes[i].region === props.region &&
        massroute.vertexes[i].area === Number(currency) &&
        massroute.vertexes[i].id === Number(valuen)
      ) {
        doublAreaID = false;
        soobErr = "Дубликатная запись ключ: Регион_Pайон_ID";
        setOpenSetErr(true);
      }
    }
    return doublAreaID;
  };

  const CheckAvailVertex = () => {
    let availVertex = false;
    for (let i = 0; i < map.dateMap.tflight.length; i++) {
      if (
        map.dateMap.tflight[i].region.num === props.region.toString() &&
        map.dateMap.tflight[i].area.num === currency &&
        map.dateMap.tflight[i].ID === Number(valuen)
      ) {
        availVertex = true;
        adrV = map.dateMap.tflight[i].description;
        break;
      }
    }
    if (!availVertex) {
      soobErr = "Нет информации по данному перекрёстку";
      setOpenSetErr(true);
    }
    return availVertex;
  };

  const handleClose = () => {
    if (CheckAvailVertex()) {
      if (CheckDoublAreaID()) {
        massdk.push(
          MapssdkNewPoint(
            props.region,
            props.coord,
            adrV,
            Number(currency),
            Number(valuen)
          )
        );
        massroute.vertexes.push(
          MassrouteNewPoint(
            props.region,
            props.coord,
            adrV,
            Number(currency),
            Number(valuen)
          )
        );
        dispatch(massdkCreate(massdk));
        dispatch(massrouteCreate(massroute));
        setOpenSetAdress(false);
        props.createPoint(props.coord);
      }
    }
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
            onChange={handleChange}
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

  const styleSetAdrAreaID = {
    //border: 1,
    marginTop: "10vh",
    marginLeft: "48px",
    width: "316px",
    height: "14vh",
    // bgcolor: "#FAFAFA",
    // bgcolor: "#DAF0C5",
    bgcolor: "#FFFEF7",
    opacity: 0.8,
  };

  return (
    <Box>
      <Modal open={openSetAdress} onClose={handleCloseSetAdress} hideBackdrop>
        <Grid item container sx={styleSetAdrAreaID}>
          <Grid item>
            <Grid item container sx={styleSetAdrArea}>
              <Grid item xs={9.5}>
                <InputArea />
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
                      value={valuen}
                      onChange={handleChangeID}
                      variant="standard"
                      helperText="Введите ID"
                      color="secondary"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs>
                <Button sx={styleInpKnop} onClick={handleClose}>
                  Ввод
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {openSetErr && (
            <MapPointDataError
              sErr={soobErr}
              setOpen={setOpenSetErr}
              debug={false}
              ws={{}}
              fromCross={0}
              toCross={0}
              //activeRoute={0}
              update={0}
            />
          )}
        </Grid>
      </Modal>
    </Box>
  );
};

export default MapCreateVertex;
