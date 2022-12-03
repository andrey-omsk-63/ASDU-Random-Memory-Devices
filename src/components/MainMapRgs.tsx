import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { coordinatesCreate } from "../redux/actions";

import Grid from "@mui/material/Grid";

import { YMaps, Map, FullscreenControl } from "react-yandex-maps";
import { GeolocationControl, YMapsApi } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import GsErrorMessage from "./RgsComponents/GsErrorMessage";
import GsDoPlacemarkDo from "./RgsComponents/RgsDoPlacemarkDo";
import RgsCreateObject from "./RgsComponents/RgsCreateObject";
import RgsProcessObject from "./RgsComponents/RgsProcessObject";

import { getMultiRouteOptions, StrokaHelp } from "./MapServiceFunctions";
import { getReferencePoints, CenterCoord } from "./MapServiceFunctions";
import { StrokaMenuGlob } from "./MapServiceFunctions";

//mport { SendSocketUpdateRoute } from "./MapSocketFunctions";

import { searchControl } from "./MainMapStyle";

let flagOpen = false;

const zoomStart = 10;
let zoom = zoomStart;
let pointCenter: any = 0;
let pointCenterEt: any = 0;

let massMem: Array<number> = [];
let massCoord: any = [];
let newMode = -1;
let soobErr = "";
//let helper = true;

let xsMap = 11.99;
//let xsTab = 0.01;
let widthMap = "99.9%";

let modeToDo = 0;
let inTarget = true;
let newCenter: any = [];
let leftCoord: Array<number> = [0, 0];
//let idxObj = -1;

//let beginInTarget = true;

const MainMapRgs = () =>
  //props: { trigger: boolean }
  {
    //== Piece of Redux =======================================
    const map = useSelector((state: any) => {
      const { mapReducer } = state;
      return mapReducer.map.dateMap;
    });
    // let massdk = useSelector((state: any) => {
    //   const { massdkReducer } = state;
    //   return massdkReducer.massdk;
    // });
    //console.log("massdk", massdk);
    let bindings = useSelector((state: any) => {
      const { bindingsReducer } = state;
      return bindingsReducer.bindings.dateBindings;
    });
    console.log("bindings", bindings);
    let addobj = useSelector((state: any) => {
      const { addobjReducer } = state;
      return addobjReducer.addobj.dateAdd;
      //return addobjReducer.addobj.addObjects;
    });
    let coordinates = useSelector((state: any) => {
      const { coordinatesReducer } = state;
      return coordinatesReducer.coordinates;
    });
    // let datestat = useSelector((state: any) => {
    //   const { statsaveReducer } = state;
    //   return statsaveReducer.datestat;
    // });
    //const debug = datestat.debug;
    //const ws = datestat.ws;
    const dispatch = useDispatch();
    //===========================================================
    const [flagPusk, setFlagPusk] = React.useState(false);
    const [createObject, setCreateObject] = React.useState(false);
    const [processObject, setProcessObject] = React.useState(false);
    const [idxObj, setIdxObj] = React.useState(-1);

    const [beginInTarget, setBeginInTarget] = React.useState(true);
    //const [setPhase, setSetPhase] = React.useState(false);

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
      newMode = -1;
      zoom = zoomStart - 0.01;
      ymaps && addRoute(ymaps, false); // перерисовка связей
      NewPointCenter(pointCenterEt);
    };

    const OnPlacemarkClickPoint = (index: number) => {
      if (index >= map.tflight.length) {
        console.log("реж.назначения:", index, map.tflight.length);
        //idxObj = index
        setIdxObj(index);
        setProcessObject(true);
      } else {
        let nomInMass = massMem.indexOf(index);
        let masscoord: any = [];
        setFlagPusk(!flagPusk);
        // if (newMode < 0) {
        // создание нового режима
        if (nomInMass < 0) {
          massMem.push(index);
          //if (massMem.length === 1) setBeginInTarget(false);
          console.log("реж.управления", massMem, index, map.tflight.length);
          masscoord[0] = map.tflight[index].points.Y;
          masscoord[1] = map.tflight[index].points.X;
          massCoord.push(masscoord);
        } else {
          massMem.splice(nomInMass, 1);
          massCoord.splice(nomInMass, 1);
        }
        if (massMem.length) {
          ymaps && addRoute(ymaps, false); // перерисовка связей
          //setFlagPusk(!flagPusk);
        }

        // } else {
        //   // работа с существующем режимом
        //   if (nomInMass >= 0 && nomInMass + 1 < massMem.length) {
        //     masscoord[0] = map.tflight[massMem[nomInMass + 1]].points.Y;
        //     masscoord[1] = map.tflight[massMem[nomInMass + 1]].points.X;
        //     NewPointCenter(masscoord);
        //   }
        // }
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

    const InputerObject = (coord: Array<number>) => {
      if (coord[0] !== leftCoord[0] || coord[1] !== leftCoord[1]) {
        leftCoord = coord;
        setCreateObject(true);
        modeToDo = 1;
        setFlagPusk(!flagPusk);
      }
    };

    const InstanceRefDo = (ref: React.Ref<any>) => {
      if (ref) {
        mapp.current = ref;
        mapp.current.events.add("contextmenu", function (e: any) {
          if (mapp.current.hint && inTarget) {
            InputerObject(e.get("coords"));
          }
        });
        mapp.current.events.add("mousedown", function (e: any) {
          pointCenter = mapp.current.getCenter(); // нажата левая/правая кнопка мыши 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
        });
        mapp.current.events.add(["boundschange"], function () {
          pointCenter = mapp.current.getCenter();
          zoom = mapp.current.getZoom(); // покрутили колёсико мыши
        });
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
      if (!modeToDo) StatusQuo();
      setFlagPusk(!flagPusk);
    };

    const SetHelper = () => {
      inTarget = !inTarget;
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
        case 45: // выполнить режим
      }
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

    console.log("!@@@@@@:", massMem.length);
    //if (massMem.length) setFlagPusk(!flagPusk);

    const MenuGl = () => {
      let soobHelpFiest = "Добавьте/удалите перекрёстки в маршруте [";
      soobHelpFiest += massMem.length + "✳]";
      console.log("@@@@@@:", !inTarget, massMem.length, soobHelpFiest);

      return (
        <>
          {modeToDo === 1 && (
            <>{StrokaHelp("Введите реквизиты доп.объекта (<Esc> - сброс)")}</>
          )}
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
                  {StrokaHelp("Вы находитесь в режиме управления")}
                  {/* {beginInTarget && ( */}
                  {massMem.length === 0 && (
                    <>
                      {StrokaHelp("Начала работы - выбор первого перекрёстка")}
                    </>
                  )}
                  {/* {!beginInTarget && <>{StrokaHelp(soobHelpFiest)}</>} */}
                  {massMem.length > 0 && <>{StrokaHelp(soobHelpFiest)}</>}
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
                      <RgsProcessObject
                        setOpen={setProcessObject}
                        idx={idxObj}
                      />
                    )}
                    {openSoobErr && (
                      <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
                    )}
                  </Map>
                </YMaps>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

export default MainMapRgs;
