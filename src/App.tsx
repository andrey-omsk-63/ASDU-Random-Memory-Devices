import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapCreate, statsaveCreate } from "./redux/actions";
import { coordinatesCreate, bindingsCreate } from "./redux/actions";
import { addobjCreate, massfazCreate } from "./redux/actions";
import { massdkCreate } from "./redux/actions";

import Grid from "@mui/material/Grid";

import axios from "axios";

import MainMapRgs from "./components/MainMapRgs";
//import GsErrorMessage from "./components/RgsComponents/RgsErrorMessage";

import { MasskPoint } from "./components/RgsServiceFunctions";

import { SendSocketGetBindings } from "./components/RgsSocketFunctions";
import { SendSocketGetAddObjects } from "./components/RgsSocketFunctions";

import { dataMap } from "./otladkaMaps";
import { imgFaza } from "./otladkaPicFaza";
import { dataBindings } from "./otladkaBindings";
import { dataAddObjects } from "./otladkaAddObjects";

import { zoomStart, CLINCH, BadCODE } from "./components/MapConst";

export let dateMapGl: any;
export let dateBindingsGl: any;
export let dateAddObjectsGl: any;

export interface Stater {
  ws: any;
  debug: boolean;
  start: boolean; // первая точка маршрута
  finish: boolean;
  demo: boolean;
  readyPict: boolean;
  readyFaza: boolean;
  region: string;
  area: string;
  id: string;
  phSvg: Array<any>;
  pictSvg: string | null;
  typeRoute: boolean; // тип отображаемых связей
  typeVert: number; // тип отображаемых CO на карте: 0 - значки СО 1 - картинка фаз 2 - номер фаз(счётчик)
  counterFaza: boolean; // наличие счётчика длительность фазы ДУ
  intervalFaza: number; // Задаваемая длительность фазы ДУ (сек)
  intervalFazaDop: number; // Увеличениение длительности фазы ДУ (сек)
  massPath: any; // точки рабочего маршрута
  counterId: Array<any>; // счётчик длительности фаз
  timerId: Array<any>; // массив времени отправки команд на счётчики
  massInt: any[][]; // массив интервалов отправки команд на счётчики
}

export let dateStat: Stater = {
  ws: null,
  debug: false,
  start: false, // первая точка маршрута
  finish: false,
  demo: false,
  readyPict: true,
  readyFaza: true,
  region: "0",
  area: "0",
  id: "0",
  phSvg: [null, null, null, null, null, null, null, null],
  pictSvg: null,
  typeRoute: true, // тип отображаемых связей true - mаршрутизированные  false - неформальные
  typeVert: 0, // тип отображаемых CO на карте: 0 - значки СО 1 - картинка фаз 2 - номер фаз(счётчик)
  counterFaza: true, // наличие счётчика длительность фазы ДУ
  intervalFaza: 0, // Задаваемая длительность фазы ДУ (сек)
  intervalFazaDop: 0, // Увеличениение длительности фазы ДУ (сек)
  massPath: null, // точки рабочего маршрута
  counterId: [], // счётчик длительности фаз
  timerId: [], // массив времени отправки команд на счётчики
  massInt: [], // массив интервалов отправки команд на счётчики
};

export interface Pointer {
  ID: number;
  coordinates: Array<number>;
  nameCoordinates: string;
  region: number;
  area: number;
  phases: Array<number>; // фазы светофора
  phSvg: Array<string | null>; // картинки фаз
  readIt: boolean; // флаг прочтения картинок фаз
  imgVert: string | null; // картинка перекрёстка
  readVert: boolean; // флаг прочтения картинки перекрёстка
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
  runRec: number; // 0-начало 1-финиш 2-актив 3-хз 4-активДемо 5-финишДемо
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
let homeRegion: string = "0";
let flagMap = false;
let flagBindings = false;
let flagAddObjects = false;

export let debug = false;
export let WS: any = null;

const App = () => {
  //== Piece of Redux ======================================
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
    let img: any = debug ? imgFaza : null;
    for (let i = 0; i < dateMapGl.tflight.length; i++) {
      let coord = [];
      coord[0] = dateMapGl.tflight[i].points.Y;
      coord[1] = dateMapGl.tflight[i].points.X;
      coordinates.push(coord);
      let masskPoint = MasskPoint(dateMapGl.tflight[i], img);
      massdk.push(masskPoint);
    }
    dispatch(coordinatesCreate(coordinates));
    dispatch(massdkCreate(massdk));

    console.log("massdk:", massdk);

    flagMap = false;
    flagBindings = false;
    flagAddObjects = false;
    setOpenMapInfo(true);

    // достать тип отображаемых связей из LocalStorage
    if (window.localStorage.typeRoute === undefined)
      window.localStorage.typeRoute = 0;
    dateStat.typeRoute = Number(window.localStorage.typeRoute) ? true : false;

    // достать тип отображаемых фаз на карте из LocalStorage
    if (window.localStorage.typeVert === undefined)
      window.localStorage.typeVert = 0;
    dateStat.typeVert = Number(window.localStorage.typeVert);

    // достать наличие счётчика длительность фазы ДУ из LocalStorage
    if (window.localStorage.counterFazaD === undefined)
      window.localStorage.counterFazaD = "0";
    dateStat.counterFaza = Number(window.localStorage.counterFazaD)
      ? true
      : false;

    // достать длительность фазы ДУ из LocalStorage
    if (window.localStorage.intervalFazaD === undefined)
      window.localStorage.intervalFazaD = "0";
    dateStat.intervalFaza = Number(window.localStorage.intervalFazaD);

    // достать увеличениение длительности фазы ДУ из LocalStorage
    if (window.localStorage.intervalFazaDopD === undefined)
      window.localStorage.intervalFazaDopD = "0";
    dateStat.intervalFazaDop = !dateStat.intervalFaza
      ? 0
      : Number(window.localStorage.intervalFazaDopD);

    // достать начальный zoom Yandex-карты ДУ из LocalStorage
    if (window.localStorage.ZoomDU === undefined)
      window.localStorage.ZoomDU = zoomStart;

    // достать центр координат [0] Yandex-карты ДУ из LocalStorage
    if (window.localStorage.PointCenterDU0 === undefined)
      window.localStorage.PointCenterDU0 = 0;

    // достать центр координат [1] Yandex-карты ДУ из LocalStorage
    if (window.localStorage.PointCenterDU1 === undefined)
      window.localStorage.PointCenterDU1 = 0;

    dispatch(statsaveCreate(dateStat));
    console.log("dateStat:", dateStat);
    console.log("dateMapGl:", dateMapGl);
    console.log("dateBindingsGl:", JSON.parse(JSON.stringify(dateBindingsGl)));
    console.log("dateAddObjectsGl:", dateAddObjectsGl);
  };

  const host =
    "wss://" +
    window.location.host +
    window.location.pathname +
    "W" +
    window.location.search;

  // const [openSetErr, setOpenSetErr] = React.useState(false);
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
      dateStat.debug = debug = true;
    dispatch(statsaveCreate(dateStat));
    flagOpenWS = false;
    SendSocketGetBindings();
    SendSocketGetAddObjects();
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

    const ActionOnGetPhases = (data: any) => {
      for (let i = 0; i < massdk.length; i++) {
        if (massdk[i].ID === data.pos.id) {
          massdk[i].readIt = true; // флаг прочтения картинок фаз
          if (data.phases) {
            if (data.phases.length) {
              for (let j = 0; j < data.phases.length; j++) {
                let k = Number(data.phases[j].num);
                if (k <= massdk[i].phSvg.length)
                  massdk[i].phSvg[k - 1] = data.phases[j].phase;
              }
              dispatch(massdkCreate(massdk));
            }
            break;
          }
          // else {
          //   massdk[i].phSvg[0] = imgFaza; // костыль
          //   massdk[i].phSvg[1] = null;
          //   massdk[i].phSvg[2] = imgFaza;
          //   massdk[i].phSvg[3] = null;
          //   massdk[i].phSvg[4] = imgFaza;
          // }
        }
      }
    };

    const ActionOnPhases = (data: any) => {
      //console.log("Phases:", data);
      let soob = "Пришла фаза на мёртвый светофор";
      let flagChange = false;
      for (let i = 0; i < data.phases.length; i++) {
        for (let j = 0; j < massfaz.length; j++) {
          if (data.phases[i].phase) {
            if (massfaz[j].idevice === data.phases[i].device) {
              if (massfaz[j].fazaSist !== data.phases[i].phase) {
                let statusVertex = 18;
                for (let jj = 0; jj < dateMapGl.tflight.length; jj++) {
                  if (dateMapGl.tflight[jj].idevice === massfaz[j].idevice)
                    statusVertex = dateMapGl.tflight[jj].tlsost.num;
                }
                let clinch = CLINCH.indexOf(statusVertex) < 0 ? false : true;
                let badCode = BadCODE.indexOf(statusVertex) < 0 ? false : true;
                if (!clinch && !badCode) {
                  massfaz[j].fazaSist = data.phases[i].phase;
                  flagChange = true;
                } else console.log(soob, massfaz[j].id);
              }
            }
          }
        }
      }
      if (flagChange) {
        dispatch(massfazCreate(massfaz));
        setTrigger(!trigger);
      }
    };

    const ActionOnTflight = (data: any) => {
      let flagChange = false;
      for (let i = 0; i < data.tflight.length; i++) {
        for (let j = 0; j < dateMapGl.tflight.length; j++) {
          if (dateMapGl.tflight[j].idevice === data.tflight[i].idevice) {
            dateMapGl.tflight[j].tlsost = data.tflight[i].tlsost;
            flagChange = true;
          }
        }
      }
      if (flagChange) {
        dispatch(mapCreate(dateMapGl));
        setTrigger(!trigger);
      }
    };

    WS.onmessage = function (event: any) {
      let allData = JSON.parse(event.data);
      let data = allData.data;
      //console.log("Пришло:", allData.type);
      switch (allData.type) {
        case "phases":
          ActionOnPhases(data);
          break;
        case "tflight":
          ActionOnTflight(data);
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
          ActionOnGetPhases(data);
          break;
        case "getSvg":
          //console.log("Get_getSvg:", data);
          dateStat.pictSvg = data.svg;
          dateStat.readyPict = true;
          for (let i = 0; i < massdk.length; i++) {
            if (massdk[i].ID === data.pos.id) {
              massdk[i].readVert = true; // флаг прочтения картиноки перекрёстка
              massdk[i].imgVert = data.svg;
            }
          }
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
  }

  if (flagMap && flagBindings && flagAddObjects && !flagOpenWS)
    Initialisation();

  return (
    <Grid container sx={{ height: "100vh", width: "100%", bgcolor: "#E9F5D8" }}>
      <Grid item xs>
        {/* {openSetErr && <GsErrorMessage sErr={soob} setOpen={setOpenSetErr} />} */}
        {openMapInfo && <MainMapRgs trigger={trigger} />}
      </Grid>
    </Grid>
  );
};

export default App;
