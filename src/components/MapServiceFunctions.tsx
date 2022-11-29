import * as React from "react";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";

import { Pointer } from "./../App";
//import { DateMAP } from "./../interfaceMAP.d";

import { styleInfoSoob } from "./MainMapStyle";

export const MasskPoint = (debug: boolean, rec: any, imgFaza: string) => {
  let masskPoint: Pointer = {
    ID: -1,
    coordinates: [],
    nameCoordinates: "",
    region: 0,
    area: 0,
    phases: [],
    phSvg: [],
  };
  let img = null;
  if (debug) img = imgFaza;
  masskPoint.ID = rec.ID;
  masskPoint.coordinates[0] = rec.points.Y;
  masskPoint.coordinates[1] = rec.points.X;
  masskPoint.nameCoordinates = rec.description;
  masskPoint.region = Number(rec.region.num);
  masskPoint.area = Number(rec.area.num);
  masskPoint.phases = rec.phases;
  for (let i = 0; i < rec.phases.length; i++) {
    masskPoint.phSvg.push(img);
  }
  return masskPoint;
};

export const DecodingCoord = (coord: string) => {
  return coord.split(",").map(Number);
};

export const CodingCoord = (coord: Array<number>) => {
  return String(coord[0]) + "," + String(coord[1]);
};

export const DoublRoute = (massroute: any, pointA: any, pointB: any) => {
  let flDubl = false;
  let pointAcod = CodingCoord(pointA);
  let pointBcod = CodingCoord(pointB);
  for (let i = 0; i < massroute.length; i++) {
    if (massroute[i].starts === pointAcod && massroute[i].stops === pointBcod)
      flDubl = true;
  }
  return flDubl;
};

export const CenterCoord = (aY: number, aX: number, bY: number, bX: number) => {
  let coord0 = (aY - bY) / 2 + bY;
  if (aY < bY) coord0 = (bY - aY) / 2 + aY;
  let coord1 = (aX - bX) / 2 + bX;
  if (aX < bX) coord1 = (bX - aX) / 2 + aX;
  return [coord0, coord1];
};

export const Distance = (coord1: Array<number>, coord2: Array<number>) => {
  if (coord1[0] === coord2[0] && coord1[1] === coord2[1]) {
    return 0;
  } else {
    let radlat1 = (Math.PI * coord1[0]) / 180;
    let radlat2 = (Math.PI * coord2[0]) / 180;
    let theta = coord1[1] - coord2[1];
    let radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) dist = 1;
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1609.344;
    return dist;
  }
};

//=== Placemark =====================================
export const GetPointData = (index: number, map: any, addobjects: any) => {
  let cont1 = "";
  let cont2 = "";
  let cont3 = "";
  if (index < map.tflight.length) {
    cont1 = map.tflight[index].description + "<br/>";
    cont3 = map.tflight[index].tlsost.description + "<br/>";
    cont2 = "[" + map.tflight[index].region.num + ", ";
    cont2 += map.tflight[index].area.num;
    cont2 +=
      ", " + map.tflight[index].ID + ", " + map.tflight[index].idevice + "]";
  } else {
    let idx = index - map.tflight.length;
    cont1 = addobjects[idx].description + "<br/>";
    cont2 = "[" + addobjects[idx].region + ", " + addobjects[idx].area;
    cont2 += ", " + addobjects[idx].id + "]";
  }

  return {
    hintContent: cont1 + cont3 + cont2,
    //+ "<br/>",
  };
};

export const GetPointOptions1 = (Hoster: any) => {
  return {
    // данный тип макета
    iconLayout: "default#image",
    // изображение иконки метки
    iconImageHref: Hoster(),
    // размеры метки
    iconImageSize: [30, 38],
    // её "ножки" (точки привязки)
    iconImageOffset: [-15, -38],
  };
};

// export const GetPointOptions2 = (index: number, massMem: Array<number>) => {
//   let colorBalloon = "islands#violetCircleDotIcon";
//   let aaa = massMem.indexOf(index);

//   if (aaa >= 0) {
//     colorBalloon = "islands#redCircleDotIcon";
//     if (massMem.length === aaa + 1 && massMem.length) {
//       colorBalloon = "islands#darkBlueStretchyIcon";
//     }
//     if (!aaa && massMem.length) {
//       colorBalloon = "islands#redStretchyIcon";
//     }
//   }

//   return {
//     preset: colorBalloon,
//   };
// };

export const ErrorHaveVertex = (rec: any) => {
  alert(
    "Не существует светофор: Регион " +
      rec.region +
      " Район " +
      rec.area +
      " ID " +
      rec.id +
      ". Устройство будет проигнорировано и удалёно из плана"
  );
};

//=== addRoute =====================================
export const getReferencePoints = (pointA: any, pointB: any) => {
  return {
    referencePoints: [pointA, pointB],
  };
};

export const getMultiRouteOptions = () => {
  return {
    routeActiveStrokeWidth: 4,
    //routeActiveStrokeColor: "#224E1F",
    routeStrokeWidth: 0,
    wayPointVisible: false,
  };
};

//=== GsSetPhase ===================================
export const NameMode = () => {
  let nameMode =
    "(" +
    new Date().toLocaleDateString() +
    " " +
    new Date().toLocaleTimeString() +
    ")";
  return nameMode;
};
//=== GsToDoMode ===================================
export const OutputFazaImg = (img: any) => {
  let widthHeight = 60;
  if (!img) widthHeight = 30;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ width: widthHeight, height: widthHeight }}
    >
      <image
        width={"100%"}
        height={"100%"}
        xlinkHref={"data:image/png;base64," + img}
      />
    </svg>
  );
};

export const OutputVertexImg = (host: string) => {
  return (
    <CardMedia
      component="img"
      sx={{ textAlign: "center", height: 40, width: 30 }}
      image={host}
    />
  );
};
//=== Разное =======================================
export const StrokaMenuGlob = (soob: string, func: any, mode: number) => {
  let dlSoob = (soob.length + 5) * 8;
  const styleApp01 = {
    fontSize: 14,
    marginRight: 0.1,
    maxWidth: dlSoob,
    minWidth: dlSoob,
    maxHeight: "21px",
    minHeight: "21px",
    backgroundColor: "#D7F1C0",
    color: "black",
    textTransform: "unset !important",
  };

  return (
    <Button sx={styleApp01} onClick={() => func(mode)}>
      <b>{soob}</b>
    </Button>
  );
};

export const StrokaHelp = (soobInfo: string) => {
  return (
    <Button sx={styleInfoSoob}>
      <em>{soobInfo}</em>
    </Button>
  );
};
