import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapCreate, statsaveCreate } from "./redux/actions";
import { coordinatesCreate, bindingsCreate } from "./redux/actions";
import { addobjCreate, massfazCreate } from "./redux/actions";

import Grid from "@mui/material/Grid";

import axios from "axios";

import MainMapRgs from "./components/MainMapRgs";
import AppSocketError from "./AppSocketError";

//import { MasskPoint } from "./components/MapServiceFunctions";

import { SendSocketGetBindings } from "./components/RgsSocketFunctions";
import { SendSocketGetAddObjects } from "./components/RgsSocketFunctions";
//import { SendSocketGetPhases } from "./components/MapSocketFunctions";

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
  faza: number;
  fazaSist: number;
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
  // let massdk = useSelector((state: any) => {
  //   const { massdkReducer } = state;
  //   return massdkReducer.massdk;
  // });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  //console.log("APPmassfaz", massfaz);
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  // let massmode = useSelector((state: any) => {
  //   const { massmodeReducer } = state;
  //   return massmodeReducer.massmode;
  // });
  const dispatch = useDispatch();
  //========================================================
  const Initialisation = () => {
    //let deb = dateStat.debug;
    console.log("dateMapGl:", dateMapGl);
    console.log("dateBindingsGl:", dateBindingsGl);
    console.log("dateAddObjectsGl:", dateAddObjectsGl);
    for (let i = 0; i < dateMapGl.tflight.length; i++) {
      let coord = [];
      coord[0] = dateMapGl.tflight[i].points.Y;
      coord[1] = dateMapGl.tflight[i].points.X;
      coordinates.push(coord);
    }
    dispatch(coordinatesCreate(coordinates));
    // SendSocketGetBindings(dateStat.debug, WS);
    // SendSocketGetAddObjects(dateStat.debug, WS);
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
      //console.log("пришло:", data.error, allData.type, data);
      switch (allData.type) {
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
          flagMap = true;
          setTrigger(!trigger)
          // SendSocketGetBindings(dateStat.debug, WS);
          // SendSocketGetAddObjects(dateStat.debug, WS);
          break;
        case "getBindings":
          dateBindingsGl = JSON.parse(JSON.stringify(data));
          dispatch(bindingsCreate(dateBindingsGl));
          console.log("dateBindingsGl:", dateBindingsGl);
          flagBindings = true;
          setTrigger(!trigger)
          break;
        case "getAddObjects":
          dateAddObjectsGl = JSON.parse(JSON.stringify(data));
          dispatch(addobjCreate(dateAddObjectsGl));
          console.log("dateAddObjectsGl:", dateAddObjectsGl);
          flagAddObjects = true;
          setTrigger(!trigger)
          break;
        case "getPhases":
          dateStat.area = data.pos.area;
          dateStat.id = data.pos.id.toString();
          dateStat.phSvg = Array(8).fill(null);
          if (data.images) {
            for (let i = 0; i < data.images.length; i++) {
              //=== Проверить!!! =====================================
              dateStat.phSvg[i] = data.images[i].phase;
            }
          }
          dispatch(statsaveCreate(dateStat));
          //   for (let i = 0; i < massdk.length; i++) {
          //     if (
          //       massdk[i].region.toString() === data.pos.region &&
          //       massdk[i].area.toString() === data.pos.area &&
          //       massdk[i].ID === data.pos.id
          //     ) {
          //       if (data.images) {
          //         if (data.images.length) {
          //           for (let j = 0; j < data.images.length; j++) {
          //             let k = Number(data.images[j].num);
          //             if (k <= massdk[i].phSvg.length)
          //               massdk[i].phSvg[k - 1] = data.images[j].phase;
          //           }
          //           dispatch(massdkCreate(massdk));
          //         }
          //         break;
          //       }
          //     }
          //   }
          break;
        case "getSvg":
          if (!data.status) {
            soob = "Ошибка при получении изображений перекрёстков";
            setOpenSetErr(true);
            //dateStat.pictSvg = null;
          } else {
            dateStat.pictSvg = data.svg;
            dispatch(statsaveCreate(dateStat));
          }
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [dispatch, massfaz, trigger]);

  if (WS.url === "wss://localhost:3000/W" && flagOpenDebug) {
    console.log("РЕЖИМ ОТЛАДКИ!!!");
    dateMapGl = JSON.parse(JSON.stringify(dataMap));
    dispatch(mapCreate(dateMapGl));

    dateAddObjectsGl = JSON.parse(JSON.stringify(dataAddObjects.data));
    dispatch(addobjCreate(dateAddObjectsGl));
    console.log("dateAddObjectsGl:", dateAddObjectsGl);

    dateBindingsGl = JSON.parse(JSON.stringify(dataBindings.data));
    dispatch(bindingsCreate(dateBindingsGl));
    console.log("dateBindingsGl:", dateBindingsGl);

    let massRegion = [];
    for (let key in dateMapGl.regionInfo) {
      if (!isNaN(Number(key))) massRegion.push(Number(key));
    }
    homeRegion = massRegion[0].toString();
    dateStat.region = homeRegion;
    dateStat.phSvg[0] = imgFaza;
    dateStat.phSvg[1] = null;
    dateStat.phSvg[2] = imgFaza;
    dateStat.phSvg[3] = null;
    dateStat.phSvg[4] = imgFaza;
    dispatch(statsaveCreate(dateStat));
    const ipAdress: string = "https://localhost:3000/cross.svg";
    axios.get(ipAdress).then(({ data }) => {
      dateStat.pictSvg = data;
      dispatch(statsaveCreate(dateStat));
    });
    flagMap = true;
    flagBindings = true;
    flagAddObjects = true;
    flagOpenDebug = false;
    //setOpenMapInfo(true);
  }
  console.log("GGGGGG:", flagMap, flagBindings, flagAddObjects,flagOpenWS);
  if (flagMap && flagBindings && flagAddObjects && !flagOpenWS) {
    Initialisation();
    flagMap = false;
    flagBindings = false;
    flagAddObjects = false;
    setOpenMapInfo(true);
  }

  console.log("openMapInfo:", openMapInfo);

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
