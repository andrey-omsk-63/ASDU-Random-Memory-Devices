import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import { MapssdkNewPoint, MassrouteNewPoint } from "./../MapServiceFunctions";

import { styleSetAdress, styleInpKnop } from "./../MainMapStyle";

const MapCreateVertexInpID = (props: {
  region: number;
  coord: any;
  area: string;
  createPoint: any;
}) => {
  const styleSet = {
    width: "230px",
    maxHeight: "3px",
    minHeight: "3px",
    bgcolor: "#FAFAFA",
    boxShadow: 14,
    textAlign: "center",
    p: 1.5,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-9px",
      marginLeft: "-12px",
      width: "253px",
    },
  };

  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  const dispatch = useDispatch();
  //========================================================
  // let homeRegion = map.dateMap.regionInfo[props.region];
  // let dat = map.dateMap.areaInfo[homeRegion];
  // let massKey = [];
  // let massDat = [];
  // const currencies: any = [];
  // for (let key in dat) {
  //   massKey.push(key);
  //   massDat.push(dat[key]);
  // }
  // for (let i = 0; i < massKey.length; i++) {
  //   let maskCurrencies = {
  //     value: "",
  //     label: "",
  //   };
  //   maskCurrencies.value = massKey[i];
  //   maskCurrencies.label = massDat[i];
  //   currencies.push(maskCurrencies);
  // }

  // console.log("currencies:", currencies);

  // const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const [openSetID, setOpenSetID] = React.useState(true);
  //const [currency, setCurrency] = React.useState(massKey[0]);
  const [valuen, setValuen] = React.useState(0);

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setCurrency(event.target.value);
  //   console.log("setCurrency:", event.target.value, currency);
  //   setOpenSetAdress(true);
  // };

  // const handleCloseSetAdr = () => {
  //   // let adr = 'Новый перекрёсток'
  //   // massdk.push(
  //   //   MapssdkNewPoint(props.region, props.coord, adr, Number(currency))
  //   // );
  //   // massroute.vertexes.push(
  //   //   MassrouteNewPoint(props.region, props.coord, adr, Number(currency))
  //   // );
  //   // dispatch(massdkCreate(massdk));
  //   // dispatch(massrouteCreate(massroute));
  //   // setOpenSetAdress(false);
  //   // props.createPoint(props.coord);
  //   setOpenSetID(true);
  // };

  const handleCloseSetID = () => {
    console.log("valuen:", typeof valuen, valuen);
    let adr = "Новый перекрёсток";
    massdk.push(
      MapssdkNewPoint(
        props.region,
        props.coord,
        adr,
        Number(props.area),
        Number(valuen)
      )
    );
    massroute.vertexes.push(
      MassrouteNewPoint(
        props.region,
        props.coord,
        adr,
        Number(props.area),
        Number(valuen)
      )
    );
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
    props.createPoint(props.coord);
    setOpenSetID(false);
  };

  // const handleCloseSetAdress = () => {
  //   setOpenSetAdress(false);
  // };

  const handleChangeID = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    // if (valueInp > maxi) valueInp = maxi;
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === '') valueInp = 0;
    console.log("valueInp:", typeof valueInp, valueInp);
    setValuen(valueInp);
  };

  return (
    <Modal open={openSetID} onClose={handleCloseSetID} hideBackdrop>
      <Grid item container sx={styleSetAdress}>
        <Grid item xs={9.5} sx={{ border: 0 }}>
          <Box sx={styleSet}>
            <Box
              component="form"
              sx={styleBoxForm}
              noValidate
              autoComplete="off"
            >
              <TextField
                size="small"
                onKeyPress={handleKey} //отключение Enter
                // inputProps={{ style: { fontSize: 13.3 } }}
                // InputLabelProps={{ style: { fontSize: 13.3 } }}
                type="number"
                inputProps={{
                  min: 0,
                  style: { fontSize: 13.3 },
                }}
                value={valuen}
                onChange={handleChangeID}
                variant="standard"
                helperText="Введите ID"
                color="secondary"
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs sx={{ border: 0 }}>
          <Box>
            <Button
              sx={styleInpKnop}
              variant="contained"
              onClick={handleCloseSetID}
            >
              Ввод
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default MapCreateVertexInpID;
