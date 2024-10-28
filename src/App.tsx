import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapCreate, statsaveCreate } from "./redux/actions";
import { coordinatesCreate, bindingsCreate } from "./redux/actions";
import { addobjCreate, massfazCreate } from "./redux/actions";
import { massdkCreate } from "./redux/actions";

import Grid from "@mui/material/Grid";

import axios from "axios";

import MainMapRgs from "./components/MainMapRgs";
import AppSocketError from "./AppSocketError";

import { MasskPoint } from "./components/RgsServiceFunctions";

import { SendSocketGetBindings } from "./components/RgsSocketFunctions";
import { SendSocketGetAddObjects } from "./components/RgsSocketFunctions";
import { SendSocketGetPhases } from "./components/RgsSocketFunctions";

import { dataMap } from "./otladkaMaps";
import { imgFaza } from "./otladkaPicFaza";
import { dataBindings } from "./otladkaBindings";
import { dataAddObjects } from "./otladkaAddObjects";

export let dateMapGl: any;
export let dateBindingsGl: any;
export let dateAddObjectsGl: any;

export interface Stater {
  ws: any;
  debug: boolean;
  finish: boolean;
  demo: boolean;
  readyPict: boolean;
  readyFaza: boolean;
  region: string;
  area: string;
  id: string;
  phSvg: Array<any>;
  pictSvg: string | null;
}

export let dateStat: Stater = {
  ws: null,
  debug: false,
  finish: false,
  demo: false,
  readyPict: true,
  readyFaza: true,
  region: "0",
  area: "0",
  id: "0",
  phSvg: [null, null, null, null, null, null, null, null],
  pictSvg: null,
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
  area: number;
  id: number;
  coordinates: Array<number>;
  faza: number;
  fazaBegin: number;
  fazaSist: number;
  fazaSistOld: number;
  phases: Array<number>;
  idevice: number;
  name: string;
  starRec: boolean;
  runRec: number;
  img: Array<string | null>;
}
export let massFaz: Fazer[] = [];

export interface NameMode {
  name: string;
  delRec: boolean;
}
export let massMode: NameMode[] = [];

export let Coordinates: Array<Array<number>> = []; // массив координат

let flagOpenDebug = true;
let flagOpenWS = true;
let WS: any = null;
let homeRegion: string = "0";
let soob = "";
let flagMap = false;
let flagBindings = false;
let flagAddObjects = false;

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
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  const dispatch = useDispatch();
  //========================================================
  const Initialisation = () => {
    let deb = dateStat.debug;
    console.log("dateMapGl:", dateMapGl);
    console.log("dateBindingsGl:", dateBindingsGl);
    console.log("dateAddObjectsGl:", dateAddObjectsGl);
    for (let i = 0; i < dateMapGl.tflight.length; i++) {
      let coord = [];
      coord[0] = dateMapGl.tflight[i].points.Y;
      coord[1] = dateMapGl.tflight[i].points.X;
      coordinates.push(coord);
      let masskPoint = MasskPoint(deb, dateMapGl.tflight[i], imgFaza);
      massdk.push(masskPoint);
    }
    dispatch(coordinatesCreate(coordinates));
    dispatch(massdkCreate(massdk));
    // запросы на получение изображения фаз
    for (let i = 0; i < massdk.length; i++) {
      let reg = massdk[i].region.toString();
      let area = massdk[i].area.toString();
      SendSocketGetPhases(dateStat.debug, WS, reg, area, massdk[i].ID);
    }
    flagMap = false;
    flagBindings = false;
    flagAddObjects = false;
    setOpenMapInfo(true);
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
    if (
      WS.url.slice(0, 20) === "wss://localhost:3000" ||
      WS.url.slice(0, 27) === "wss://andrey-omsk-63.github"
    )
      dateStat.debug = true;
    dispatch(statsaveCreate(dateStat));
    flagOpenWS = false;
    SendSocketGetBindings(dateStat.debug, WS);
    SendSocketGetAddObjects(dateStat.debug, WS);
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
      //console.log("Пришло:", allData.type);
      switch (allData.type) {
        case "phases":
          let flagChange = false;
          for (let i = 0; i < data.phases.length; i++) {
            for (let j = 0; j < massfaz.length; j++) {
              if (data.phases[i].phase) {
                if (massfaz[j].idevice === data.phases[i].device) {
                  if (massfaz[j].fazaSist !== data.phases[i].phase) {
                    massfaz[j].fazaSist = data.phases[i].phase;
                    flagChange = true;
                  }
                }
              }
            }
          }
          if (flagChange) dispatch(massfazCreate(massfaz));
          //setTrigger(!trigger);
          break;
        case "mapInfo":
          dateMapGl = JSON.parse(JSON.stringify(data));
          dispatch(mapCreate(dateMapGl));
          let massRegion = [];
          for (let key in dateMapGl.regionInfo)
            if (!isNaN(Number(key))) massRegion.push(Number(key));
          homeRegion = massRegion[0].toString();
          if (dateMapGl.tflight.length)
            homeRegion = dateMapGl.tflight[0].region.num;
          dateStat.region = homeRegion;
          dispatch(statsaveCreate(dateStat));
          flagMap = true;
          setTrigger(!trigger);
          break;
        case "getBindings":
          dateBindingsGl = JSON.parse(JSON.stringify(data));
          dispatch(bindingsCreate(dateBindingsGl));
          flagBindings = true;
          setTrigger(!trigger);
          break;
        case "getAddObjects":
          dateAddObjectsGl = JSON.parse(JSON.stringify(data));
          dispatch(addobjCreate(dateAddObjectsGl));
          flagAddObjects = true;
          setTrigger(!trigger);
          break;
        case "getPhases":
          for (let i = 0; i < massdk.length; i++) {
            if (
              massdk[i].region.toString() === data.pos.region &&
              massdk[i].area.toString() === data.pos.area &&
              massdk[i].ID === data.pos.id
            ) {
              if (data.phases) {
                if (data.phases.length) {
                  for (let j = 0; j < data.phases.length; j++)
                    massdk[i].phSvg[j] = data.phases[j].phase;
                  dispatch(massdkCreate(massdk));
                }
                break;
              }
            }
          }
          break;
        case "getSvg":
          dateStat.pictSvg = data.svg;
          dateStat.readyPict = true;
          dispatch(statsaveCreate(dateStat));
          setTrigger(!trigger);
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [dispatch, massfaz, trigger, massdk]);

  if (dateStat.debug && flagOpenDebug) {
    console.log("РЕЖИМ ОТЛАДКИ!!!");
    dateMapGl = JSON.parse(JSON.stringify(dataMap));
    dispatch(mapCreate(dateMapGl));
    dateAddObjectsGl = JSON.parse(JSON.stringify(dataAddObjects.data));
    dispatch(addobjCreate(dateAddObjectsGl));
    dateBindingsGl = JSON.parse(JSON.stringify(dataBindings.data));
    dispatch(bindingsCreate(dateBindingsGl));
    let massRegion = [];
    for (let key in dateMapGl.regionInfo)
      if (!isNaN(Number(key))) massRegion.push(Number(key));
    homeRegion = massRegion[0].toString();
    dateStat.region = homeRegion;
    dateStat.phSvg[0] = imgFaza;
    dateStat.phSvg[1] = null;
    dateStat.phSvg[2] = imgFaza;
    dateStat.phSvg[3] = null;
    dateStat.phSvg[4] = imgFaza;
    let road =
      window.location.origin.slice(0, 22) === "https://localhost:3000"
        ? "https://localhost:3000/"
        : "./";
    axios.get(road + "cross.svg").then(({ data }) => {
      dateStat.pictSvg = data;
    });
    dispatch(statsaveCreate(dateStat));
    flagMap = true;
    flagAddObjects = true;
    flagOpenDebug = false;
    flagBindings = true;

    console.log("!!!!!!", flagMap, flagBindings, flagAddObjects, !flagOpenWS);
  }

  if (flagMap && flagBindings && flagAddObjects && !flagOpenWS)
    Initialisation();

  return (
    <Grid container sx={{ height: "100vh", width: "100%", bgcolor: "#E9F5D8" }}>
      <Grid item xs>
        {openSetErr && <AppSocketError sErr={soob} setOpen={setOpenSetErr} />}
        {openMapInfo && <MainMapRgs trigger={trigger} />}
      </Grid>
    </Grid>
  );
};

export default App;
