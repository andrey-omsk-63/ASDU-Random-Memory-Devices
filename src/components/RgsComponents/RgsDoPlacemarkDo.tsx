import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { massfazCreate } from "../../redux/actions";

import { Placemark, YMapsApi } from "react-yandex-maps";

import { GetPointData } from "../RgsServiceFunctions";

//import { ZOOM } from "../MainMapRgs";
import { zoom } from "../MainMapRgs";

let FAZASIST = -1;
let nomInMassfaz = -1;

const RgsDoPlacemarkDo = (props: {
  ymaps: YMapsApi | null;
  coordinate: any;
  idx: number;
  massMem: Array<number>;
  OnPlacemarkClickPoint: Function;
  vert: Array<number>;
}) => {
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
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const DEMO = datestat.demo;
  const typeVert = datestat.typeVert;
  const dispatch = useDispatch();
  //===========================================================
  let idx = props.idx;
  let mapp = map.tflight[0].tlsost.num.toString();
  let mappp = map.tflight[0];
  let pC = -1;
  let nomSvg = -1;
  if (idx < map.tflight.length) {
    mapp = map.tflight[idx].tlsost.num.toString();
    mappp = map.tflight[idx];
  }
  if (props.massMem.length >= 1) pC = props.massMem.indexOf(props.idx);
  let fazaImg: null | string = null;
  FAZASIST = -1;
  nomInMassfaz = -1;
  if (pC >= 0) {
    for (let i = 0; i < massfaz.length; i++) {
      if (mappp.idevice === massfaz[i].idevice) {
        FAZASIST = massfaz[i].fazaSist;
        nomInMassfaz = i;
        if (massfaz[i].fazaSist === 11 || massfaz[i].fazaSist === 15) {
          nomSvg = 12; // ОС
          pC = -1;
        } else {
          if (massfaz[i].fazaSist === 10 || massfaz[i].fazaSist === 14) {
            nomSvg = 7; // ЖМ
            pC = -1;
          } else {
            if (
              massfaz[i].fazaSist > 0 &&
              massfaz[i].fazaSist < 9 &&
              massfaz[i].img
            ) {
              if (massfaz[i].fazaSist <= massfaz[i].img.length)
                fazaImg = massfaz[i].img[massfaz[i].fazaSist - 1];
              massfaz[i].fazaSistOld = massfaz[i].fazaSist;
              dispatch(massfazCreate(massfaz));
            }
          }
        }
      }
    }
  }

  const Hoster = React.useCallback(() => {
    let hostt =
      window.location.origin.slice(0, 22) === "https://localhost:3000"
        ? "https://localhost:3000/"
        : "./";
    let host = hostt + "18.svg";
    let linked = props.vert.indexOf(idx);
    if (linked >= 0) host = hostt + "77.svg";
    if (!debug) {
      let mpp = mapp;
      if (DEMO) {
        mpp = "1"; // режим Демо
      } else {
        if (nomSvg > 0) mpp = nomSvg.toString();
        if (linked >= 0) mpp = "4";
      }
      host = window.location.origin + "/free/img/trafficLights/" + mpp + ".svg";
    } else if (DEMO) host = hostt + "1.svg";

    return host;
  }, [mapp, nomSvg, idx, props.vert, debug, DEMO]);

  const createChipsLayout = React.useCallback(
    (calcFunc: Function, currnum: number, rotateDeg?: number) => {
      const Chips = props.ymaps?.templateLayoutFactory.createClass(
        '<div class="placemark"  ' +
          `style="background-image:url(${Hoster()}); ` +
          `background-size: 100%; transform: rotate(${
            rotateDeg ?? 0
          }deg);\n"></div>`,
        {
          build: function () {
            Chips.superclass.build.call(this);
            const map = this.getData().geoObject.getMap();
            if (!this.inited) {
              this.inited = true;
              // Получим текущий уровень зума.
              let zoom = map.getZoom();
              // Подпишемся на событие изменения области просмотра карты.
              map.events.add(
                "boundschange",
                function () {
                  // Запустим перестраивание макета при изменении уровня зума.
                  const currentZoom = map.getZoom();
                  if (currentZoom !== zoom) {
                    zoom = currentZoom;
                    //@ts-ignore
                    this.rebuild();
                  }
                },
                this
              );
            }
            const options = this.getData().options,
              // Получим размер метки в зависимости от уровня зума.
              size = calcFunc(map.getZoom()) + 6,
              element =
                this.getParentElement().getElementsByClassName("placemark")[0],
              // По умолчанию при задании своего HTML макета фигура активной области не задается,
              // и её нужно задать самостоятельно.
              // Создадим фигуру активной области "Круг".
              circleShape = {
                type: "Circle",
                coordinates: [0, 0],
                radius: size / 2,
              };
            // Зададим высоту и ширину метки.
            element.style.width = element.style.height = size + "px";
            // Зададим смещение.
            //element.style.marginLeft = element.style.marginTop =
            //-size / 2 + "px";
            element.style.marginLeft = -size / 2.0 + "px";
            element.style.marginTop = -size / 1.97 + "px";
            // Зададим фигуру активной области.
            options.set("shape", circleShape);
          },
        }
      );
      return Chips;
    },
    [Hoster, props.ymaps?.templateLayoutFactory]
  );

  const calculate = function (zoom: number): number {
    switch (zoom) {
      case 14:
        return 30;
      case 15:
        return 35;
      case 16:
        return 40;
      case 17:
        return 45;
      case 18:
        return 50;
      case 19:
        return 55;
      default:
        return 25;
    }
  };

  const CalcSize = () => {
    switch (zoom) {
      case 14:
        return 30;
      case 15:
        return 35;
      case 16:
        return 40;
      case 17:
        return 45;
      case 18:
        return 50;
      case 19:
        return 55;
      default:
        return 25;
    }
  };

  const GetPointOptions0 = React.useCallback(
    (hoster: any) => {
      let Hoster = hoster;
      let imger = "";
      let hostt = "";
      let FZSIST = FAZASIST;
      if (FAZASIST === 9 || !FAZASIST) {
        FZSIST = massfaz[nomInMassfaz].fazaSistOld;
        Hoster =
          massfaz[nomInMassfaz].img[massfaz[nomInMassfaz].fazaSistOld - 1];
      }
      let iconSize = Hoster ? 50 : 25;
      let iconOffset = Hoster ? -25 : -12.5;
      //  typeVert - тип отображаемых CO на карте 0 - значки СО 1 - номер фаз 2 - картинка фаз
      if (typeVert) {
        //console.log('GetPointOptions0')
        // номер фазы или картнка фазы
        if (Hoster) imger = "data:image/png;base64," + Hoster;
        if (!Hoster) {
          if (FZSIST > 0) {
            hostt =
              window.location.origin.slice(0, 22) === "https://localhost:3000"
                ? "https://localhost:3000/phases/"
                : "./phases/";
            imger = debug
              ? hostt + FZSIST + ".svg"
              : "/file/static/img/buttons/" + FZSIST + ".svg";
          }
        }
      } else {
        // значёк светофоры
        if (FZSIST > 0) {
          iconSize = CalcSize() + 6; // размер метки светофора
          iconOffset = -iconSize / 2;
          hostt =
            window.location.origin.slice(0, 22) === "https://localhost:3000"
              ? "https://localhost:3000/"
              : "./";
          imger = debug ? hostt + "2.svg" : "/free/img/trafficLights/2.svg";
        }
      }

      return {
        // данный тип макета
        iconLayout: "default#image",
        // изображение иконки метки
        iconImageHref: imger,
        // размеры метки
        iconImageSize: [iconSize, iconSize],
        // её "ножки" (точки привязки)
        iconImageOffset: [iconOffset, iconOffset],
      };
    },
    [debug, massfaz, typeVert]
  );

  const getPointOptions1 = React.useCallback(() => {
    let numSost = DEMO ? 18 : mappp.tlsost.num;

    return pC < 0 ||
      FAZASIST < 0 ||
      (FAZASIST === 9 && massfaz[nomInMassfaz].fazaSistOld < 0)
      ? {
          iconLayout: createChipsLayout(calculate, numSost),
        }
      : GetPointOptions0(fazaImg);
  }, [
    createChipsLayout,
    GetPointOptions0,
    mappp.tlsost.num,
    massfaz,
    fazaImg,
    pC,
    DEMO,
  ]);

  const getPointOptions2 = () => {
    return {
      preset: "islands#circleDotIcon",
      //preset: "islands#blueAutoCircleIcon",
      iconColor: "#A05AD4",
      // iconOffset: [0, 0],
      // iconSize: [10, 10],
      iconImageSize: [10, 10],
      //fillOpacity: 1,
      //iconFillOpacity: 1,
      //iconOpacity: 50,
    };
  };

  const MemoPlacemarkDo = React.useMemo(
    () => (
      <Placemark
        key={idx}
        geometry={props.coordinate}
        properties={GetPointData(idx, map, bindings, addobj.addObjects)}
        options={
          idx < map.tflight.length ? getPointOptions1() : getPointOptions2()
        }
        modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
        onClick={() => props.OnPlacemarkClickPoint(idx)}
      />
    ),
    [
      idx,
      map,
      addobj,
      getPointOptions1,
      //getPointOptions2,
      bindings,
      props,
    ]
  );
  return MemoPlacemarkDo;
};

export default RgsDoPlacemarkDo;
