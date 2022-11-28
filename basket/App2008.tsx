import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  mapCreate,
  massrouteCreate,
  coordinatesCreate,
  massdkCreate,
} from "./redux/actions";

import Grid from "@mui/material/Grid";

import MainMap from "./components/MainMapGl";
import AppSocketError from "./AppSocketError";
import {
  SoobErrorCreateWay,
  SoobErrorDeleteWay,
  SoobErrorCreateWayToPoint,
  SoobErrorDeleteWayToPoint,
  SoobErrorCreateWayFromPoint,
  SoobErrorDeleteWayFromPoint,
} from "./components/MapServiceFunctions";

//import { DateMAP } from './interfaceMAP.d';
//import { DateRoute } from "./interfaceRoute.d";
//import { Tflight } from "./interfaceMAP.d";
import { dataMap } from "./otladkaMaps";
import { dataRoute } from "./otladkaRoutes";

export let dateMapGl: any;
export let dateRouteGl: any;

export interface Pointer {
  ID: number;
  coordinates: Array<number>;
  nameCoordinates: string;
  region: number;
  area: number;
  newCoordinates: number;
}
export let massDk: Pointer[] = [];

export interface Router {
  region: number;
  sourceArea: number;
  sourceID: number;
  targetArea: number;
  targetID: number;
  lsource: number;
  ltarget: number;
  starts: string;
  stops: string;
  lenght: number;
  time: number;
}
export let massRoute: Router[] = [];
export let Coordinates: Array<Array<number>> = []; // массив координат

let flagOpen = true;
let flagOpenWS = true;
//let flagWS = true;
let WS: any = null;
let homeRegion: any = "";
let soob = "";

const App = () => {
  //== Piece of Redux ======================================
  // const comm = useSelector((state: any) => {
  //   const { commReducer } = state;
  //   return commReducer.comm;
  // });
  // //console.log('comm_App:', comm);

  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  //console.log("map_App:", map);

  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });

  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  //console.log("coordinates_App:", coordinates);

  const dispatch = useDispatch();
  //========================================================
  //const host = "wss://192.168.115.25/mapW";
  //const host = "wss://192.168.115.25/user/andrey_omsk/graphManageW";
  const host =
    "wss://" +
    window.location.host +
    window.location.pathname +
    "W" +
    window.location.search;

  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [svg, setSvg] = React.useState<any>(null);

  if (flagOpenWS) {
    WS = new WebSocket(host);
    flagOpenWS = false;
    let pageUrl = new URL(window.location.href);
    homeRegion = Number(pageUrl.searchParams.get("Region"));
    console.log("homeRegion+WS:", homeRegion, WS);
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
      console.log("пришло:", allData.type, data);
      switch (allData.type) {
        case "mapInfo":
          dateMapGl = data;
          dispatch(mapCreate(dateMapGl));
          break;
        case "graphInfo":
          dateRouteGl = data;
          dispatch(massrouteCreate(dateRouteGl));
          break;
        case "createPoint":
          if (data.status) {
            dateRouteGl.vertexes[dateRouteGl.vertexes.length - 1].id = data.id;
            massdk[massdk.length - 1].ID = data.id;
          } else {
            dateRouteGl.vertexes.splice(dateRouteGl.vertexes.length - 1, 1);
            massdk.splice(massdk.length - 1, 1);
            coordinates.splice(coordinates.length - 1, 1);
            soob = "Произошла ошибка при создании точки";
            setOpenSetErr(true);
            dispatch(coordinatesCreate(coordinates));
          }
          dispatch(massrouteCreate(dateRouteGl));
          dispatch(massdkCreate(massdk));
          break;
        case "deletePoint":
          if (!data.status) {
            soob = "Произошла ошибка при удалении точки";
            setOpenSetErr(true);
          }
          break;
        case "createVertex":
          if (!data.status) {
            dateRouteGl.vertexes.splice(dateRouteGl.vertexes.length - 1, 1);
            massdk.splice(massdk.length - 1, 1);
            coordinates.splice(coordinates.length - 1, 1);
            soob = "Произошла ошибка при создании перекрёстка";
            setOpenSetErr(true);
            dispatch(coordinatesCreate(coordinates));
            dispatch(massrouteCreate(dateRouteGl));
            dispatch(massdkCreate(massdk));
          }
          break;
        case "deleteVertex":
          if (!data.status) {
            soob = "Произошла ошибка при удалении перекрёстка";
            setOpenSetErr(true);
          }
          break;
        case "createWay":
          if (!data.status) {
            soob = SoobErrorCreateWay(data);
            dateRouteGl.ways.splice(dateRouteGl.ways.length - 1, 1);
            dispatch(massrouteCreate(dateRouteGl));
            setOpenSetErr(true);
          }
          break;
        case "deleteWay":
          if (!data.status) {
            soob = SoobErrorDeleteWay(data);
            setOpenSetErr(true);
          }
          break;
        case "createWayToPoint":
          if (!data.status) {
            soob = SoobErrorCreateWayToPoint(data);
            dateRouteGl.ways.splice(dateRouteGl.ways.length - 1, 1);
            dispatch(massrouteCreate(dateRouteGl));
            setOpenSetErr(true);
          }
          break;
        case "deleteWayToPoint":
          if (!data.status) {
            soob = SoobErrorDeleteWayToPoint(data);
            setOpenSetErr(true);
          }
          break;
        case "createWayFromPoint":
          if (!data.status) {
            soob = SoobErrorCreateWayFromPoint(data);
            console.log("soob:", soob);
            dateRouteGl.ways.splice(dateRouteGl.ways.length - 1, 1);
            dispatch(massrouteCreate(dateRouteGl));
            setOpenSetErr(true);
          }
          break;
        case "deleteWayFromPoint":
          if (!data.status) {
            soob = SoobErrorDeleteWayFromPoint(data);
            setOpenSetErr(true);
          }
          break;
        case "getSvg":
          if (!data.status) {
            soob = "Ошибка при получении изображений перекрёстков";
            setOpenSetErr(true);
            setSvg(0);
          } else {
            setSvg(data.svg);
          }
          console.log("SVG:", svg, data.svg);
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [dispatch, massdk, coordinates, svg]);

  if (WS.url === "wss://localhost:3000/W" && flagOpen) {
    console.log("РЕЖИМ ОТЛАДКИ!!!");
    dateMapGl = dataMap;
    dispatch(mapCreate(dateMapGl));
    dateRouteGl = dataRoute.data;
    flagOpen = false;
    console.log("@@@dateRouteGl", dateRouteGl);
    dispatch(massrouteCreate(dateRouteGl));
  }

  return (
    <Grid container sx={{ height: "100vh", width: "100%", bgcolor: "#E9F5D8" }}>
      <Grid item xs>
        {openSetErr && <AppSocketError sErr={soob} setOpen={setOpenSetErr} />}
        <MainMap
          ws={WS}
          region={homeRegion}
          sErr={soob}
          svg={svg}
          setSvg={setSvg}
        />
      </Grid>
    </Grid>
  );
};

export default App;

// if (flagRoute === 1) {
//   console.log("dateRouteGl:", dateRouteGl);
//   // проверка/удаление дубликатных связей
//   let dateRouteRab: any = [];
//   let flagDubl = false;
//   for (let i = 0; i < dateRouteGl.ways.length; i++) {
//     for (let j = 0; j < dateRouteRab.length; j++) {
//       if (
//         dateRouteRab[j].starts === dateRouteGl.ways[i].starts &&
//         dateRouteRab[j].stops === dateRouteGl.ways[i].stops
//       )
//         flagDubl = true;
//     }
//     if (!flagDubl) dateRouteRab.push(dateRouteGl.ways[i]);
//     flagDubl = false;
//   }
//   dateRouteGl.ways.splice(0, dateRouteGl.ways.length);
//   dateRouteGl.ways = dateRouteRab;
//   dispatch(massrouteCreate(dateRouteGl));
//   flagRoute = 2;
//   //setSize(window.innerWidth + Math.random());
// }
//console.log("dateRouteGl:", dateRouteGl);
