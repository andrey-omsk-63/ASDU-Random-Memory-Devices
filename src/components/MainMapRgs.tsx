import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { coordinatesCreate, statsaveCreate } from "../redux/actions";

import Grid from "@mui/material/Grid";

import { YMaps, Map, FullscreenControl } from "react-yandex-maps";
import { GeolocationControl, YMapsApi } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import GsErrorMessage from "./RgsComponents/RgsErrorMessage";
import GsDoPlacemarkDo from "./RgsComponents/RgsDoPlacemarkDo";
import RgsCreateObject from "./RgsComponents/RgsCreateObject";
import RgsProcessObject from "./RgsComponents/RgsProcessObject";
import RgsAppointVertex from "./RgsComponents/RgsAppointVertex";
import RgsToDoMode from "./RgsComponents/RgsToDoMode";

import { getMultiRouteOptions, StrokaHelp } from "./RgsServiceFunctions";
import { getReferencePoints, CenterCoord } from "./RgsServiceFunctions";
import { StrokaMenuGlob, Distance, MakingKey } from "./RgsServiceFunctions";
import { MakeSoobErr } from "./RgsServiceFunctions";

import { SendSocketGetPhases } from "./RgsSocketFunctions";
import { SendSocketGetSvg } from "./RgsSocketFunctions";

import { searchControl } from "./MainMapStyle";

let flagOpen = false;

const zoomStart = 10;
let zoom = zoomStart;
let pointCenter: any = 0;
let pointCenterEt: any = 0;

let massMem: Array<number> = [];
let massCoord: any = [];
let massKlu: Array<string> = [];
let massNomBind: Array<number> = [];
let soobErr = "";
let xsMap = 11.99;
let xsTab = 0.01;
let widthMap = "99.9%";

let modeToDo = 0;
let inTarget = false;
let newCenter: any = [];
let leftCoord: Array<number> = [0, 0];
let rightCoord: Array<number> = [0, 0];

let helper = true;
let funcContex: any = null;
let funcBound: any = null;

const MainMapRgs = () => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let bindings = useSelector((state: any) => {
    const { bindingsReducer } = state;
    return bindingsReducer.bindings.dateBindings;
  });
  let addobj = useSelector((state: any) => {
    const { addobjReducer } = state;
    return addobjReducer.addobj.dateAdd;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  let homeRegion = datestat.region;
  const dispatch = useDispatch();
  //===========================================================
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [createObject, setCreateObject] = React.useState(false);
  const [processObject, setProcessObject] = React.useState(false);
  const [appoint, setAppoint] = React.useState(false);
  const [toDoMode, setToDoMode] = React.useState(false);
  const [idxObj, setIdxObj] = React.useState(-1);

  const [flagCenter, setFlagCenter] = React.useState(false);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [risovka, setRisovka] = React.useState(false);

  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const mapp = React.useRef<any>(null);

  const addRoute = (ymaps: any, bound: boolean) => {
    mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
    if (massCoord.length > 1) {
      let multiRoute: any = [];
      if (massCoord.length === 2) {
        multiRoute = new ymaps.multiRouter.MultiRoute(
          getReferencePoints(massCoord[0], massCoord[1]),
          getMultiRouteOptions()
        );
      } else {
        let between = [];
        for (let i = 1; i < massCoord.length - 1; i++) {
          between.push(i);
        }
        multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: massCoord,
            params: { viaIndexes: between },
          },
          { boundsAutoApply: bound, wayPointVisible: false }
        );
      }
      mapp.current.geoObjects.add(multiRoute);
    }
  };

  const StatusQuo = () => {
    massMem = [];
    massCoord = [];
    massKlu = [];
    massNomBind = [];
    zoom = zoomStart - 0.01;
    ymaps && addRoute(ymaps, false); // перерисовка связей
    NewPointCenter(pointCenterEt);
  };

  const ClickPointInTarget = (index: number) => {
    console.log("реж.назначения:", index, bindings);
    setIdxObj(index);
    if (index >= map.tflight.length) {
      setProcessObject(true);
    } else {
      let area = map.tflight[index].area.num;
      let id = map.tflight[index].ID;
      datestat.area = area;
      datestat.id = id;
      if (!debug) {
        datestat.phSvg = Array(8).fill(null);
        datestat.pictSvg = null;
      }
      SendSocketGetPhases(debug, ws, homeRegion, area, id);
      SendSocketGetSvg(debug, ws, homeRegion, area, id);
      dispatch(statsaveCreate(datestat));
      setAppoint(true);
    }
  };

  const Added = (klu: string, index: number, nom: number) => {
    helper = !helper;
    let masscoord: any = [];
    if (index < map.tflight.length) {
      masscoord[0] = map.tflight[index].points.Y; // перекрёсток
      masscoord[1] = map.tflight[index].points.X;
    } else {
      let idxObj = index - map.tflight.length; // объект
      masscoord = addobj.addObjects[idxObj].dgis;
    }
    massMem.push(index);
    massCoord.push(masscoord);
    massKlu.push(klu);
    massNomBind.push(nom);
    console.log("!!!!!!:", massMem, massKlu, massNomBind);
    ymaps && addRoute(ymaps, false); // перерисовка связей
    if (massMem.length === 3) {
      PressButton(53);
    } else {
      setFlagPusk(!flagPusk);
    }
  };

  const AddVertex = (klu: string, index: number, nom: number) => {
    let nomInMass = massMem.indexOf(index);
    if (nomInMass >= 0) {
      soobErr = MakeSoobErr(2, klu, "");
      setOpenSoobErr(true);
    } else {
      if (!massMem.length) {
        Added(klu, index, nom); // первая точка
      } else {
        let lastMem = massMem.length - 1;
        let mass = bindings.tfLinks[nom].tflink;
        let fazer = "";
        switch (massKlu[lastMem]) {
          case mass.west.id:
            fazer = "З";
            break;
          case mass.north.id:
            fazer = "С";
            break;
          case mass.east.id:
            fazer = "В";
            break;
          case mass.south.id:
            fazer = "Ю";
        }
        if (!fazer) {
          soobErr = MakeSoobErr(1, klu, massKlu[lastMem]);
          setOpenSoobErr(true);
        } else {
          Added(klu, index, nom); // вторая точка и далее
        }
      }
    }
  };

  const ClickPointNotTarget = (index: number) => {
    let klu = "";
    if (index >= map.tflight.length) {
      let mass = addobj.addObjects[index - map.tflight.length]; // объект
      klu = MakingKey(homeRegion, mass.area, mass.id);
    } else {
      let mass = map.tflight[index]; // перекрёсток
      klu = MakingKey(homeRegion, mass.area.num, mass.ID);
    }
    if (!massMem.length) {
      AddVertex(klu, index, -1);
    } else {
      if (massMem.length === 1 && klu.length > 8) {
        soobErr = "Объекты могут задаваться только в начале и конце маршрута";
        setOpenSoobErr(true);
      } else {
        let have = -1;
        for (let i = 0; i < bindings.tfLinks.length; i++) {
          if (bindings.tfLinks[i].id === klu) have = i;
        }
        if (have < 0) {
          soobErr = MakeSoobErr(3, klu, "");
          setOpenSoobErr(true);
        } else {
          AddVertex(klu, index, have);
        }
      }
    }
  };

  const OnPlacemarkClickPoint = (index: number) => {
    if (inTarget) {
      ClickPointInTarget(index); //реж.назначения
    } else {
      ClickPointNotTarget(index); //реж.управления
    }
  };
  //=== вывод светофоров ===================================
  const PlacemarkDo = () => {
    return (
      <>
        {flagOpen &&
          coordinates.map((coordinate: any, idx: any) => (
            <GsDoPlacemarkDo
              key={idx}
              ymaps={ymaps}
              coordinate={coordinate}
              idx={idx}
              massMem={massMem}
              OnPlacemarkClickPoint={OnPlacemarkClickPoint}
            />
          ))}
      </>
    );
  };

  const Pererisovka = () => {
    if (risovka) {
      ymaps && addRoute(ymaps, false); // перерисовка связей
      setRisovka(false);
    }
  };
  //=== обработка instanceRef ==============================
  const FindNearVertex = (coord: Array<number>) => {
    let nomInMap = -1;
    if (coord[0] !== rightCoord[0] || coord[1] !== rightCoord[1]) {
      rightCoord = coord;
      let minDist = 999999;
      nomInMap = -1;
      for (let i = 0; i < map.tflight.length; i++) {
        let corFromMap = [map.tflight[i].points.Y, map.tflight[i].points.X];
        let dister = Distance(coord, corFromMap);
        if (dister < 100 && minDist > dister) {
          minDist = dister;
          nomInMap = i;
        }
      }
      if (nomInMap < 0) {
        soobErr = MakeSoobErr(4, "", "");
        //"В радиусе 100м от указанной точки управляемые перекрёстки отсутствуют";
        setOpenSoobErr(true);
      } else {
        if (massMem.indexOf(nomInMap) >= 0) {
          let mass = map.tflight[nomInMap]; // перекрёсток
          let klu = MakingKey(homeRegion, mass.area.num, mass.ID);
          soobErr = "Перекрёсток [" + klu + "] уже используется";
          setOpenSoobErr(true);
        } else {
          massMem.push(nomInMap);
          massCoord.push(coord);
          setRisovka(true);
        }
      }
    }
  };

  const InputerObject = (coord: Array<number>) => {
    if (coord[0] !== leftCoord[0] || coord[1] !== leftCoord[1]) {
      leftCoord = coord;
      modeToDo = 1;
      console.log("5modeToDo", modeToDo);
      setFlagPusk(!flagPusk);
      setCreateObject(true);
    }
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      mapp.current = ref;
      mapp.current.events.remove("contextmenu", funcContex);
      funcContex = function (e: any) {
        if (mapp.current.hint) {
          if (inTarget) InputerObject(e.get("coords")); // нажата правая кнопка мыши
          if (!inTarget) FindNearVertex(e.get("coords"));
        }
      };
      mapp.current.events.add("contextmenu", funcContex);
      mapp.current.events.remove("boundschange", funcBound);
      funcBound = function () {
        pointCenter = mapp.current.getCenter();
        zoom = mapp.current.getZoom(); // покрутили колёсико мыши
      };
      mapp.current.events.add("boundschange", funcBound);
      if (flagCenter) {
        pointCenter = newCenter;
        setFlagCenter(false);
      }
    }
  };
  //========================================================
  const NewPointCenter = (coord: any) => {
    newCenter = coord;
    setFlagCenter(true);
  };

  const ModeToDo = (mod: number) => {
    modeToDo = mod;
    console.log("3modeToDo", modeToDo);
    if (!modeToDo) StatusQuo();
    setFlagPusk(!flagPusk);
  };

  const SetHelper = () => {
    inTarget = !inTarget;
    StatusQuo();
    setFlagPusk(!flagPusk);
  };

  const PressButton = (mode: number) => {
    switch (mode) {
      case 51: // режим управления
        SetHelper();
        break;
      case 52: // режим назначения
        SetHelper();
        break;
      case 53: // выполнить режим
        xsMap = 7.7;
        xsTab = 4.3;
        widthMap = "99.9%";
        modeToDo = 2;
        console.log("4modeToDo", modeToDo);
        setToDoMode(true);
        setFlagPusk(!flagPusk);
    }
  };

  const OldSizeWind = (size: number) => {
    xsMap = size;
    xsTab = 0.01;
    widthMap = "99.9%";
    modeToDo = 0;
    console.log("2modeToDo", modeToDo);
    setToDoMode(false);
    setFlagPusk(!flagPusk);
  };

  //=== инициализация ======================================
  if (!flagOpen && Object.keys(map.tflight).length) {
    for (let i = 0; i < addobj.addObjects.length; i++) {
      coordinates.push(addobj.addObjects[i].dgis);
    }
    dispatch(coordinatesCreate(coordinates));

    pointCenter = CenterCoord(
      map.boxPoint.point0.Y,
      map.boxPoint.point0.X,
      map.boxPoint.point1.Y,
      map.boxPoint.point1.X
    );
    pointCenterEt = pointCenter;
    flagOpen = true;
  }
  //========================================================
  let mapState: any = {
    center: pointCenter,
    zoom,
  };

  const MenuGl = () => {
    let soobHelpFiest = "Добавьте перекрёстки в маршруте [";
    soobHelpFiest += massMem.length + "🔆]";

    return (
      <>
        {modeToDo === 1 && (
          <>{StrokaHelp("Введите реквизиты доп.объекта (<Esc> - сброс)")}</>
        )}
        {modeToDo === 2 && (
          <>{StrokaHelp("Проверьте правильность ввода маршрута")}</>
        )}
        {modeToDo === 3 && <>{StrokaHelp("Происходит выполнение режима")}</>}
        {modeToDo === 0 && (
          <>
            {inTarget && (
              <>
                {StrokaMenuGlob("Режим управления", PressButton, 51)}
                {StrokaHelp("Вы находитесь в режиме назначения")}
              </>
            )}
            {!inTarget && (
              <>
                {StrokaMenuGlob("Режим назначения", PressButton, 52)}
                {massMem.length > 2 && (
                  <>{StrokaMenuGlob("Выполнить режим", PressButton, 53)}</>
                )}
                {StrokaHelp("Вы находитесь в режиме управления")}
                {massMem.length === 0 && (
                  <>{StrokaHelp("Начала работы - выбор первого перекрёстка")}</>
                )}
                {massMem.length > 0 && helper && (
                  <>{StrokaHelp(soobHelpFiest)}</>
                )}
                {massMem.length > 0 && !helper && (
                  <>{StrokaHelp(soobHelpFiest)}</>
                )}
              </>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <Grid container sx={{ border: 0, height: "99.9vh" }}>
      <Grid item xs sx={{ border: 0 }}>
        {MenuGl()}
        <Grid container sx={{ border: 0, height: "96.9vh" }}>
          <Grid item xs={xsMap} sx={{ border: 0 }}>
            {Object.keys(map.tflight).length && (
              <YMaps
                query={{
                  apikey: "65162f5f-2d15-41d1-a881-6c1acf34cfa1",
                  lang: "ru_RU",
                }}
              >
                <Map
                  modules={[
                    "multiRouter.MultiRoute",
                    "Polyline",
                    "templateLayoutFactory",
                  ]}
                  state={mapState}
                  instanceRef={(ref) => InstanceRefDo(ref)}
                  onLoad={(ref) => {
                    ref && setYmaps(ref);
                  }}
                  width={widthMap}
                  height={"99.9%"}
                >
                  {/* сервисы Яндекса */}
                  <FullscreenControl />
                  <GeolocationControl options={{ float: "left" }} />
                  <RulerControl options={{ float: "right" }} />
                  <SearchControl options={searchControl} />
                  <TrafficControl options={{ float: "right" }} />
                  <TypeSelector options={{ float: "right" }} />
                  <ZoomControl options={{ float: "right" }} />
                  {/* служебные компоненты */}
                  {Pererisovka()}
                  <PlacemarkDo />
                  {createObject && (
                    <RgsCreateObject
                      setOpen={setCreateObject}
                      coord={leftCoord}
                      funcMode={ModeToDo}
                    />
                  )}
                  {processObject && (
                    <RgsProcessObject setOpen={setProcessObject} idx={idxObj} />
                  )}
                  {appoint && (
                    <RgsAppointVertex setOpen={setAppoint} idx={idxObj} />
                  )}
                  {openSoobErr && (
                    <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
                  )}
                </Map>
              </YMaps>
            )}
          </Grid>
          <Grid item xs={xsTab} sx={{ height: "97.0vh" }}>
            {toDoMode && (
              <RgsToDoMode
                massMem={massMem}
                funcMode={ModeToDo}
                funcSize={OldSizeWind}
                funcCenter={NewPointCenter}
                funcHelper={SetHelper}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MainMapRgs;
