import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapCreate, statsaveCreate } from "./redux/actions";
import { massdkCreate, coordinatesCreate } from "./redux/actions";
import { massmodeCreate, massfazCreate } from "./redux/actions";

import Grid from "@mui/material/Grid";

import MainMapGS from "./components/MainMapGs";
import AppSocketError from "./AppSocketError";

import { MasskPoint } from "./components/MapServiceFunctions";

import { SendSocketGetPhases } from "./components/MapSocketFunctions";

import { dataMap } from "./otladkaMaps";
import { imgFaza } from "./otladkaRoutes";

export let dateMapGl: any;
export let dateRouteGl: any;
export let dateRouteProGl: any;

export interface Stater {
  ws: any;
  debug: boolean;
  region: string;
  phSvg: string | null;
}

export let dateStat: Stater = {
  ws: null,
  debug: false,
  region: "0",
  phSvg: null,
};

export interface Pointer {
  ID: number;
  coordinates: Array<number>;
  nameCoordinates: string;
  region: number;
  area: number;
  phases: Array<number>;
  phSvg: Array<string | null>;
}
export let massDk: Pointer[] = [];

export interface Fazer {
  idx: number;
  faza: number;
  fazaSist: number;
  phases: Array<number>;
  idevice: number;
  name: string;
  starRec: boolean;
  runRec: boolean;
  img: Array<string | null>;
}
export let massFaz: Fazer[] = [];

let maskFaz: Fazer = {
  idx: 0,
  faza: 1,
  fazaSist: -1,
  phases: [],
  idevice: 0,
  name: "",
  starRec: false,
  runRec: false,
  img: [],
};

export interface NameMode {
  name: string;
  delRec: boolean;
}
export let massMode: NameMode[] = [];

export let Coordinates: Array<Array<number>> = []; // массив координат

let flagOpen = true;
let flagOpenWS = true;
let WS: any = null;
let homeRegion: string = "0";
let soob = "";
let flagInit = false;

const App = () => {
  // //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  //console.log("APPmassfaz", massfaz);
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  let massmode = useSelector((state: any) => {
    const { massmodeReducer } = state;
    return massmodeReducer.massmode;
  });
  const dispatch = useDispatch();
  //========================================================
  const Initialisation = () => {
    let deb = dateStat.debug;
    console.log("dateMapGl:", dateMapGl);
    for (let i = 0; i < dateMapGl.tflight.length; i++) {
      let masskPoint = MasskPoint(deb, dateMapGl.tflight[i], imgFaza);
      massdk.push(masskPoint);
      coordinates.push(masskPoint.coordinates);
    }
    let ch = 1;
    for (let i = 0; i < dateMapGl.routes.length; i++) {
      let nameZU = dateMapGl.routes[i].description;
      if (!nameZU) nameZU = "без имени(" + ch++ + ")";
      let maskName = {
        name: nameZU,
        delRec: false,
      };
      massmode.push(maskName);
    }
    massfaz.push(maskFaz);
    dispatch(massdkCreate(massdk));
    dispatch(massfazCreate(massfaz));
    dispatch(coordinatesCreate(coordinates));
    dispatch(massmodeCreate(massmode));
    // запросы на получение изображения фаз
    for (let i = 0; i < massdk.length; i++) {
      let reg = massdk[i].region.toString();
      let area = massdk[i].area.toString();
      SendSocketGetPhases(dateStat.debug, WS, reg, area, massdk[i].ID);
    }
  };

  const host =
    "wss://" +
    window.location.host +
    window.location.pathname +
    "W" +
    window.location.search;

  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [openMapInfo, setOpenMapInfo] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  //=== инициализация ======================================
  if (flagOpenWS) {
    WS = new WebSocket(host);
    dateStat.ws = WS;
    if (WS.url === "wss://localhost:3000/W") dateStat.debug = true;
    dispatch(statsaveCreate(dateStat));
    flagOpenWS = false;
    //flagInit = true;
  }

  React.useEffect(() => {
    WS.onopen = function (event: any) {
      console.log("WS.current.onopen:", event);
    };

    WS.onclose = function (event: any) {
      console.log("WS.current.onclose:", event);
    };

    WS.onerror = function (event: any) {
      console.log("WS.current.onerror:", event);
    };

    WS.onmessage = function (event: any) {
      let allData = JSON.parse(event.data);
      let data = allData.data;
      //console.log("пришло:", data.error, allData.type, data);
      switch (allData.type) {
        case "tflight":
          console.log("Tflight:", data, data.tflight);
          for (let j = 0; j < data.tflight.length; j++) {
            for (let i = 0; i < dateMapGl.tflight.length; i++) {
              if (data.tflight[j].idevice === dateMapGl.tflight[i].idevice) {
                dateMapGl.tflight[i].tlsost = data.tflight[j].tlsost;
              }
            }
          }
          dispatch(mapCreate(dateMapGl));
          setTrigger(!trigger);
          break;
        case "phases":
          let flagChange = false;
          for (let i = 0; i < data.phases.length; i++) {
            for (let j = 0; j < massfaz.length; j++) {
              if (massfaz[j].idevice === data.phases[i].device) {
                if (massfaz[j].fazaSist !== data.phases[i].phase) {
                  massfaz[j].fazaSist = data.phases[i].phase;
                  flagChange = true;
                }
              }
            }
          }
          if (flagChange) {
            dispatch(massfazCreate(massfaz));
            setTrigger(!trigger);
          }
          break;
        case "mapInfo":
          dateMapGl = JSON.parse(JSON.stringify(data));
          dispatch(mapCreate(dateMapGl));
          let massRegion = [];
          for (let key in dateMapGl.regionInfo) {
            if (!isNaN(Number(key))) massRegion.push(Number(key));
          }
          homeRegion = massRegion[0].toString();
          dateStat.region = homeRegion;
          dispatch(statsaveCreate(dateStat));
          flagInit = true;
          setOpenMapInfo(true);
          break;
        case "getPhases":
          for (let i = 0; i < massdk.length; i++) {
            if (
              massdk[i].region.toString() === data.pos.region &&
              massdk[i].area.toString() === data.pos.area &&
              massdk[i].ID === data.pos.id
            ) {
              if (data.images) {
                if (data.images.length) {
                  for (let j = 0; j < data.images.length; j++) {
                    let k = Number(data.images[j].num);
                    if (k <= massdk[i].phSvg.length)
                      massdk[i].phSvg[k - 1] = data.images[j].phase;
                  }
                  dispatch(massdkCreate(massdk));
                }
                break;
              }
            }
          }
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [dispatch, massdk, massfaz, trigger]);

  if (WS.url === "wss://localhost:3000/W" && flagOpen) {
    console.log("РЕЖИМ ОТЛАДКИ!!!");
    dateMapGl = JSON.parse(JSON.stringify(dataMap));
    dispatch(mapCreate(dateMapGl));
    let massRegion = [];
    for (let key in dateMapGl.regionInfo) {
      if (!isNaN(Number(key))) massRegion.push(Number(key));
    }
    homeRegion = massRegion[0].toString();
    dateStat.region = homeRegion;
    dateStat.phSvg = imgFaza;
    dispatch(statsaveCreate(dateStat));
    flagInit = true;
    flagOpen = false;
    setOpenMapInfo(true);
  }

  if (flagInit && !flagOpenWS) {
    Initialisation();
    flagInit = false;
  }

  return (
    <Grid container sx={{ height: "100vh", width: "100%", bgcolor: "#E9F5D8" }}>
      <Grid item xs>
        {openSetErr && <AppSocketError sErr={soob} setOpen={setOpenSetErr} />}
        {openMapInfo && <MainMapGS trigger={trigger} />}
      </Grid>
    </Grid>
  );
};

export default App;
