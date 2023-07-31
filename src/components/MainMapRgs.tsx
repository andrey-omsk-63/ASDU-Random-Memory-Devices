import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { coordinatesCreate, statsaveCreate } from "../redux/actions";
import { massfazCreate } from "../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

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
import { getMassMultiRouteOptions } from "./RgsServiceFunctions";
import { getMassMultiRouteOptionsDemo } from "./RgsServiceFunctions";
import { getReferencePoints, CenterCoord } from "./RgsServiceFunctions";
import { getReferenceLine, MakeMassRouteFirst } from "./RgsServiceFunctions";
import { StrokaMenuGlob, MakingKey } from "./RgsServiceFunctions";
import { MakeSoobErr, MakeMassRoute } from "./RgsServiceFunctions";
import { CheckHaveLink, MakeFazer } from "./RgsServiceFunctions";

import { SendSocketGetSvg } from "./RgsSocketFunctions";

import { searchControl, styleMenuGl } from "./MainMapStyle";

let flagOpen = false;
let needRend = false;

const zoomStart = 10;
let zoom = zoomStart;
let pointCenter: any = 0;
let pointCenterEt: any = 0;

let massMem: Array<number> = [];
let massVert: Array<number> = [];
let massCoord: any = [];
let massKlu: Array<string> = [];
let massNomBind: Array<number> = [];
let soobErr = "";
let xsMap = 11.99;
let xsTab = 0.01;
let widthMap = "99.9%";

let modeToDo = 0;
let inTarget = false;
let inDemo = false;
let newCenter: any = [];
let leftCoord: Array<number> = [0, 0];
let massRoute: any = [];
let helper = true;
let funcContex: any = null;
let funcBound: any = null;

const MainMapRgs = (props: { trigger: boolean }) => {
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
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const homeRegion = datestat.region;
  const SL = homeRegion < 10 ? 2 : 3;
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
  const [restartBan, setRestartBan] = React.useState(false);
  const [changeFaz, setChangeFaz] = React.useState(0);
  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const [demoSost, setDemoSost] = React.useState(-1);
  const mapp = React.useRef<any>(null);

  const addRoute = (ymaps: any, bound: boolean) => {
    mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
    let multiRoute: any = [];
    // if (massCoord.length === 2) {
    //   multiRoute = new ymaps.multiRouter.MultiRoute(
    //     getReferencePoints(massCoord[0], massCoord[1]),
    //     getMultiRouteOptions()
    //   );
    // } else {
    //   let between = [];
    //   for (let i = 1; i < massCoord.length - 1; i++) between.push(i);
    //   multiRoute = new ymaps.multiRouter.MultiRoute(
    //     getReferenceLine(massCoord, between),
    //     {
    //       boundsAutoApply: bound,
    //       wayPointVisible: false,
    //     }
    //   );
    // }
    // mapp.current.geoObjects.add(multiRoute);
    let massMultiRoute: any = []; // исходящие связи
    for (let i = 0; i < massRoute.length; i++) {
      massMultiRoute[i] = new ymaps.multiRouter.MultiRoute(
        getReferencePoints(massCoord[massCoord.length - 1], massRoute[i]),
        getMassMultiRouteOptions(i)
      );
      mapp.current.geoObjects.add(massMultiRoute[i]);
    }
  };

  const DoDemo = (ymaps: any) => {
    for (let i = 0; i < bindings.tfLinks.length; i++) {
      let massCoord: any = [];
      let massRoute = MakeMassRoute(bindings, i, map, addobj);
      for (let j = 0; j < map.tflight.length; j++) {
        massCoord = [];
        let rec = map.tflight[j];
        let klu = MakingKey(homeRegion, rec.area.num, rec.ID);
        if (bindings.tfLinks[i].id === klu) {
          massCoord[0] = map.tflight[j].points.Y; // перекрёсток
          massCoord[1] = map.tflight[j].points.X;
          massVert.push(j);
          break;
        }
      }
      let massMultiRoute: any = []; // исходящие связи
      for (let j = 0; j < massRoute.length; j++) {
        massMultiRoute[j] = new ymaps.multiRouter.MultiRoute(
          getReferencePoints(massCoord, massRoute[j]),
          getMassMultiRouteOptionsDemo(j)
        );
        mapp.current.geoObjects.add(massMultiRoute[j]);
      }
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
        datestat.readyPict = false;
        datestat.readyFaza = false;
      }
      SendSocketGetSvg(debug, ws, homeRegion, area, id);
      datestat.phSvg = massdk[index].phSvg;
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
    massRoute = [];
    if (massNomBind.length === 1)
      massRoute = MakeMassRouteFirst(klu, bindings, map);
    if (massNomBind.length > 1 && klu.length < 9)
      massRoute = MakeMassRoute(bindings, nom, map, addobj);
    ymaps && addRoute(ymaps, false); // перерисовка связей
    if (massMem.length === 3) {
      PressButton(53);
    } else {
      setFlagPusk(!flagPusk);
    }
  };

  const SoobErr = (soob: string) => {
    soobErr = soob;
    setOpenSoobErr(true);
  };

  const AddVertex = (klu: string, index: number, nom: number) => {
    let nomInMass = massMem.indexOf(index);
    if (nomInMass >= 0) {
      SoobErr(MakeSoobErr(2, klu.slice(SL), ""));
    } else {
      if (!massMem.length) {
        Added(klu, index, nom); // первая точка
      } else {
        if (nom < 0) {
          Added(klu, index, nom); // последняя точка
          datestat.finish = true;
          dispatch(statsaveCreate(datestat));
          needRend = true;
          setFlagPusk(!flagPusk);
        } else {
          if (!MakeFazer(massKlu[massMem.length - 1], bindings.tfLinks[nom])) {
            let soob = massKlu[massMem.length - 1].slice(SL);
            SoobErr(MakeSoobErr(1, klu.slice(SL), soob));
          } else {
            Added(klu, index, nom); // вторая точка и далее
          }
        }
      }
    }
  };

  const ClickPointNotTarget = (index: number) => {
    if (datestat.finish) {
      SoobErr("Маршрут уже полностью сформирован");
    } else {
      let klu = "";
      if (index >= map.tflight.length) {
        let mass = addobj.addObjects[index - map.tflight.length]; // объект
        klu = MakingKey(homeRegion, mass.area, mass.id);
      } else {
        let mass = map.tflight[index]; // перекрёсток
        klu = MakingKey(homeRegion, mass.area.num, mass.ID);
      }
      if (!massMem.length) {
        if (index < map.tflight.length) {
          SoobErr("Входящая точка маршрута должна быть объектом");
        } else {
          AddVertex(klu, index, -1);
        }
      } else {
        if (massMem.length === 1 && klu.length > 8) {
          SoobErr("Объекты могут задаваться только в начале и конце маршрута");
        } else {
          let have = -1;
          for (let i = 0; i < bindings.tfLinks.length; i++)
            if (bindings.tfLinks[i].id === klu) have = i;
          if (have < 0 && klu.length < 9) {
            SoobErr(MakeSoobErr(3, klu.slice(SL), "")); // нет массива связности
          } else {
            if (massMem.length > 1) {
              let kluLast = massKlu[massKlu.length - 1];
              if (!CheckHaveLink(klu, kluLast, bindings)) {
                SoobErr(MakeSoobErr(5, klu.slice(SL), kluLast.slice(SL))); // нет связи
              } else {
                AddVertex(klu, index, have);
              }
            } else {
              AddVertex(klu, index, have);
            }
          }
        }
      }
    }
  };

  const OnPlacemarkClickPoint = (index: number) => {
    if (inTarget && !inDemo) ClickPointInTarget(index); //реж.назначения
    if (!inTarget && !inDemo) ClickPointNotTarget(index); //реж.управления
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
              vert={massVert}
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
  const FindNearVertex = () => {
    let nomInMass = -1;
    for (let i = 0; i < massMem.length; i++) {
      if (massfaz[i].runRec === 2) {
        nomInMass = i;
        break;
      }
    }
    if (nomInMass >= 0) {
      massfaz[nomInMass].runRec = datestat.demo ? 5 : 1;
      dispatch(massfazCreate(massfaz));
      setChangeFaz(nomInMass);
    }
  };

  const InputerObject = (coord: Array<number>) => {
    if (coord[0] !== leftCoord[0] || coord[1] !== leftCoord[1]) {
      leftCoord = coord;
      modeToDo = 1;
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
          if (inTarget && !inDemo) InputerObject(e.get("coords")); // нажата правая кнопка мыши
          if (!inTarget && !inDemo) FindNearVertex();
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

  const SetHelper = (mode: number) => {
    if (mode) inTarget = !inTarget;
    inDemo = mode ? false : true;
    StatusQuo();
    setFlagPusk(!flagPusk);
  };

  const ModeToDo = (mod: number) => {
    modeToDo = mod;
    if (!modeToDo) setChangeFaz(0);
  };

  const PressButton = (mode: number) => {
    massVert = [];
    if (restartBan) {
      SoobErr("Завершите режим управления нормальным образом");
    } else {
      switch (mode) {
        case 51: // режим управления
          datestat.finish = false;
          datestat.demo = false;
          dispatch(statsaveCreate(datestat));
          inTarget = true;
          SetHelper(1);
          break;
        case 52: // режим назначения
          datestat.finish = false;
          datestat.demo = false;
          dispatch(statsaveCreate(datestat));
          setToDoMode(false);
          inTarget = false;
          SetHelper(1);
          break;
        case 53: // выполнить режим
          xsMap = 7.7;
          xsTab = 4.3;
          widthMap = "99.9%";
          setToDoMode(true);
          setRestartBan(true);
          setFlagPusk(!flagPusk);
          break;
        case 54: // режим Показать связи
          datestat.finish = false;
          datestat.demo = false;
          dispatch(statsaveCreate(datestat));
          SetHelper(0);
          ymaps && DoDemo(ymaps);
          break;
        case 55: // режим Демо
          datestat.finish = false;
          datestat.demo = true;
          dispatch(statsaveCreate(datestat));
          inTarget = true;
          SetHelper(1);
      }
    }
  };

  const OldSizeWind = (size: number) => {
    xsMap = size;
    xsTab = 0.01;
    widthMap = "99.9%";
    modeToDo = 0;
    setToDoMode(false);
    StatusQuo();
    setFlagPusk(!flagPusk);
  };

  //=== инициализация ======================================
  if (!flagOpen && Object.keys(map.tflight).length) {
    for (let i = 0; i < addobj.addObjects.length; i++)
      coordinates.push(addobj.addObjects[i].dgis);
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
    let soobHelpFiest = "Маршрут сформирован";
    if (!datestat.finish)
      soobHelpFiest =
        "Добавьте перекрёстки в маршруте [" +
        massMem.length +
        "🔆]  Конец работы - ввод точки выхода";

    return (
      <Box sx={styleMenuGl}>
        {StrokaMenuGlob(PressButton)}
        {modeToDo === 1 && (
          <>{StrokaHelp("Введите реквизиты доп.объекта (<Esc> - сброс)")}</>
        )}
        {modeToDo === 3 && <>{StrokaHelp("Происходит выполнение режима")}</>}
        {modeToDo === 0 && (
          <>
            {!inTarget && !inDemo && (
              <>
                {massMem.length === 0 && (
                  <>{StrokaHelp("Начала работы - выбор точки вхождения")}</>
                )}
                {massMem.length > 0 && helper && (
                  <>{StrokaHelp(soobHelpFiest)}</>
                )}
                {massMem.length > 0 && !helper && (
                  <>{StrokaHelp(soobHelpFiest)}</>
                )}
              </>
            )}
            {inTarget && !inDemo && (
              <>{StrokaHelp("Выберите перекрёсток или объект")}</>
            )}
          </>
        )}
      </Box>
    );
  };

  const ChangeDemoSost = (mode: number) => {
    setDemoSost(mode + demoSost); // костыль
  };

  if (needRend) {
    needRend = false;
    setFlagPusk(!flagPusk);
  }

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
                  {appoint && datestat.readyPict && (
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
                massCoord={massCoord}
                funcMode={ModeToDo}
                funcSize={OldSizeWind}
                funcCenter={NewPointCenter}
                funcHelper={SetHelper}
                trigger={props.trigger}
                changeFaz={changeFaz}
                ban={setRestartBan}
                changeDemo={ChangeDemoSost}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MainMapRgs;
