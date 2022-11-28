import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import { MapssdkNewPoint, MassrouteNewPoint } from "./../MapServiceFunctions";

import { styleSetAdress, styleBoxForm, styleInpKnop } from "./../MainMapStyle";
import { styleSet } from "./../MainMapStyle";

let chNewCoord = 1;

const MapCreatePoint = (props: {
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
  const dispatch = useDispatch();
  //========================================================

  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const [valuen, setValuen] = React.useState(
    "Новая точка " + String(chNewCoord)
  );

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValuen(event.target.value.trimStart()); // удаление пробелов в начале строки
    setOpenSetAdress(true);
  };

  const handleCloseSetAdr = () => {
    massdk.push(MapssdkNewPoint(props.region, props.coord, valuen, 0, 0));
    massroute.vertexes.push(
      MassrouteNewPoint(props.region, props.coord, valuen, 0, 0)
    );
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
    setOpenSetAdress(false);
    props.createPoint(props.coord);
  };

  const handleCloseSetAdress = () => {
    props.setOpen(false);
    setOpenSetAdress(false);
  };

  return (
    <Box>
      <Modal open={openSetAdress} onClose={handleCloseSetAdress} hideBackdrop>
        <Grid item container sx={styleSetAdress}>
          <Grid item xs={9.5} sx={{ border: 0 }}>
            <Box sx={styleSet}>
              <Box component="form" sx={styleBoxForm}>
                <TextField
                  size="small"
                  onKeyPress={handleKey} //отключение Enter
                  inputProps={{ style: { fontSize: 13.3 } }}
                  value={valuen}
                  onChange={handleChange}
                  variant="standard"
                  helperText="Введите адрес новой точки"
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
                onClick={handleCloseSetAdr}
              >
                Ввод
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Modal>
    </Box>
  );
};

export default MapCreatePoint;
