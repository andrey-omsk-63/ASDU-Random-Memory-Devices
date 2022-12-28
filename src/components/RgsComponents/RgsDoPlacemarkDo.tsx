import * as React from "react";
import { useSelector } from "react-redux";

import { Placemark, YMapsApi } from "react-yandex-maps";

import { GetPointData } from "../RgsServiceFunctions";

const RgsDoPlacemarkDo = (props: {
  ymaps: YMapsApi | null;
  coordinate: any;
  idx: number;
  massMem: Array<number>;
  OnPlacemarkClickPoint: Function;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let addobj = useSelector((state: any) => {
    const { addobjReducer } = state;
    return addobjReducer.addobj.dateAdd;
    //return addobjReducer.addobj.addObjects;
  });
  //console.log('DoPlacemarkDo', addobj);
  // let massdk = useSelector((state: any) => {
  //   const { massdkReducer } = state;
  //   return massdkReducer.massdk;
  // });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  //===========================================================
  let idx = props.idx;
  let mapp = map.tflight[0].tlsost.num.toString();
  let mappp = map.tflight[0];
  // let pA = -1;
  // let pB = -1;
  let pC = -1;
  if (idx < map.tflight.length) {
    mapp = map.tflight[idx].tlsost.num.toString();
    mappp = map.tflight[idx];
  }
  if (props.massMem.length >= 1) {
    // pA = props.massMem[0];
    // pB = props.massMem[props.massMem.length - 1];
    //if (datestat.toDoMode) pC = props.massMem.indexOf(props.idx);
    pC = props.massMem.indexOf(props.idx);
  }
  let fazaImg: null | string = null;
  if (!debug && pC >= 0) {
    let idv = mappp.idevice;
    for (let i = 0; i < massfaz.length; i++) {
      if (idv === massfaz[i].idevice)
        if (massfaz[i].fazaSist > 0) {
          if (massfaz[i].fazaSist <= massfaz[i].img.length)
            fazaImg = massfaz[i].img[massfaz[i].fazaSist - 1];
        }
    }
  }
  debug && (fazaImg = datestat.phSvg[0]); // для отладки

  const Hoster = React.useCallback(() => {
    let host = "https://localhost:3000/18.svg";
    if (!debug) {
      host =
        window.location.origin + "/free/img/trafficLights/" + mapp + ".svg";
    }
    return host;
  }, [mapp, debug]);

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

  // const getPointOptions1 = React.useCallback(() => {
  //   return {
  //     iconLayout: createChipsLayout(calculate, mappp.tlsost.num),
  //   };
  // }, [createChipsLayout, mappp.tlsost.num]);

  const GetPointOptions0 = (Hoster: any) => {
    let imger = window.location.origin + "/free/img/notImage.png";
    if (Hoster) imger = "data:image/png;base64," + Hoster;

    return {
      // данный тип макета
      iconLayout: "default#image",
      // изображение иконки метки
      //iconImageHref: '/faza.png',
      // iconImageHref: 'data:image/png;base64,' + Hoster,
      iconImageHref: imger,
      // размеры метки
      iconImageSize: [50, 50],
      // её "ножки" (точки привязки)
      iconImageOffset: [-15, -38],
    };
  };

  const getPointOptions1 = React.useCallback(() => {
    return pC < 0
      ? {
          iconLayout: createChipsLayout(calculate, mappp.tlsost.num),
        }
      : GetPointOptions0(fazaImg);
  }, [createChipsLayout, mappp.tlsost.num,fazaImg,pC]);

  const getPointOptions2 = () => {
    let colorBalloon = "islands#violetCircleIcon";
    return {
      preset: colorBalloon,
    };
  };

  const MemoPlacemarkDo = React.useMemo(
    () => (
      <Placemark
        key={idx}
        geometry={props.coordinate}
        properties={GetPointData(idx, map, addobj.addObjects)}
        // options={{
        //   iconLayout: createChipsLayout(calculate, mappp.tlsost.num),
        // }}

        options={
          idx < map.tflight.length ? getPointOptions1() : getPointOptions2()
        }
        modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
        onClick={() => props.OnPlacemarkClickPoint(idx)}
      />
    ),
    [idx, map, addobj, getPointOptions1, props]
  );
  return MemoPlacemarkDo;
};

export default RgsDoPlacemarkDo;
