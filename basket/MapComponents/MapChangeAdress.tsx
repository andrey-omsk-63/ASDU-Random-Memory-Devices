import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../../redux/actions";
import { coordinatesCreate } from "./../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import { SendSocketDeletePoint } from "./../MapSocketFunctions";
import { SocketDeleteWay } from "./../MapSocketFunctions";
import { SendSocketCreateWayFromPoint } from "./../MapSocketFunctions";
import { SendSocketCreateWayToPoint } from "./../MapSocketFunctions";

import { styleSet, styleInpKnop, styleSetAdress } from "./../MainMapStyle";
import { styleBoxForm } from "./../MainMapStyle";

let reqRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};
let fromCross: any = {
  pointAaRegin: "",
  pointAaArea: "",
  pointAaID: 0,
  pointAcod: "",
};
let toCross: any = {
  pointBbRegin: "",
  pointBbArea: "",
  pointBbID: 0,
  pointBcod: "",
};
let massBind = [-1, -1];

const MapChangeAdress = (props: {
  debug: boolean;
  ws: any;
  iPoint: number;
  setOpen: any;
  zeroRoute: any;
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
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  const dispatch = useDispatch();
  //========================================================
  const [openSetAdress, setOpenSetAdress] = React.useState(true);

  const [valuen, setValuen] = React.useState(
    massdk[props.iPoint].nameCoordinates
  );

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValuen(event.target.value.trimStart()); // удаление пробелов в начале строки
  };

  const handleCloseSet = () => {
    props.setOpen(false);
    setOpenSetAdress(false);
  };

  const handleCloseSetAdr = () => {
    const handleSendOpen = () => {
      if (!props.debug) {
        if (props.ws.readyState === WebSocket.OPEN) {
          props.ws.send(
            JSON.stringify({
              type: "createPoint",
              data: {
                position: coor,
                name: valuen,
                id: idPoint,
              },
            })
          );
        } else {
          setTimeout(() => {
            handleSendOpen();
          }, 1000);
        }
      }
    };

    massdk[props.iPoint].nameCoordinates = valuen;
    massroute.vertexes[props.iPoint].name = valuen;
    let recMassdk = massdk[props.iPoint];
    let recMassroute = massroute.vertexes[props.iPoint];
    let recCoordinates = coordinates[props.iPoint];
    let coor = massroute.vertexes[props.iPoint].dgis;
    let idPoint = massroute.vertexes[props.iPoint].id;

    let massWays: any = [];
    for (let i = 0; i < massroute.ways.length; i++) {
      if (
        !massroute.ways[i].sourceArea &&
        massroute.ways[i].sourceID === idPoint
      ) {
        massWays.push(massroute.ways[i]);
        SocketDeleteWay(props.debug, props.ws, massroute.ways[i]);
      }
      if (
        !massroute.ways[i].targetArea &&
        massroute.ways[i].targetID === idPoint
      ) {
        massWays.push(massroute.ways[i]);
        SocketDeleteWay(props.debug, props.ws, massroute.ways[i]);
      }
    }
    //console.log("massWays:", massWays);
    SendSocketDeletePoint(props.debug, props.ws, idPoint);
    //SendSocketCreatePoint(deb, WS, coor, valuen);
    handleSendOpen(); // создание новой точки со старым ID

    massdk.splice(props.iPoint, 1); // удаление самой точки
    massroute.vertexes.splice(props.iPoint, 1);
    coordinates.splice(props.iPoint, 1);

    massdk.push(recMassdk); // пересоздание точки
    massroute.vertexes.push(recMassroute);
    coordinates.push(recCoordinates);

    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
    dispatch(coordinatesCreate(coordinates));

    for (let i = 0; i < massWays.length; i++) {
      fromCross.pointAaRegin = massWays[i].region.toString(); // пересоздание связей
      fromCross.pointAaArea = massWays[i].sourceArea.toString();
      fromCross.pointAaID = massWays[i].sourceID;
      fromCross.pointAcod = massWays[i].starts;
      toCross.pointBbRegin = massWays[i].region.toString();
      toCross.pointBbArea = massWays[i].targetArea.toString();
      toCross.pointBbID = massWays[i].targetID;
      toCross.pointBcod = massWays[i].stops;
      massBind[0] = massWays[i].lsource;
      massBind[1] = massWays[i].ltarget;
      reqRoute.dlRoute = massWays[i].lenght;
      reqRoute.tmRoute = massWays[i].time;
      if (!massWays[i].sourceArea) {
        SendSocketCreateWayFromPoint(
          props.debug,
          props.ws,
          fromCross,
          toCross,
          massBind,
          reqRoute
        );
      } else {
        SendSocketCreateWayToPoint(
          props.debug,
          props.ws,
          fromCross,
          toCross,
          massBind,
          reqRoute
        );
      }
    }
    props.zeroRoute(false)
    handleCloseSet();
  };

  return (
    <Box>
      <Modal open={openSetAdress} onClose={handleCloseSet} hideBackdrop>
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
                  helperText="Отредактируйте адрес точки"
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

export default MapChangeAdress;
