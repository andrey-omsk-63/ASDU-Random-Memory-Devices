import * as React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
//import Button from '@mui/material/Button';
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { Pointer } from "../App";
//import { DateMAP } from "./../interfaceMAP.d";
import { Tflink, WayPointsArray } from "../interfaceBindings";

import {
  styleAppSt02,
  styleAppSt03,
  //styleAppSt021
} from "./MainMapStyle";
//getReferencePoints
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

export const CheckHaveLink = (klu: string, kluLast: string, bindings: any) => {
  let hv = -1;
  for (let i = 0; i < bindings.tfLinks.length; i++) {
    if (bindings.tfLinks[i].id === kluLast) hv = i;
  }
  let mass: any = bindings.tfLinks[hv].tflink;
  let haveLink = false;
  if (mass.west.id === klu) haveLink = true;
  if (mass.north.id === klu) haveLink = true;
  if (mass.east.id === klu) haveLink = true;
  if (mass.south.id === klu) haveLink = true;
  return haveLink;
};

export const MakeMassRoute = (
  bindings: any,
  nom: number,
  map: any,
  addobj: any
) => {
  let massRoute = [];
  let mass = bindings.tfLinks[nom].tflink;
  let massKlu = [];
  if (mass.west.id) massKlu.push(mass.west.id);
  if (mass.north.id) massKlu.push(mass.north.id);
  if (mass.east.id) massKlu.push(mass.east.id);
  if (mass.south.id) massKlu.push(mass.south.id);

  for (let j = 0; j < massKlu.length; j++) {
    let area = TakeAreaId(massKlu[j])[0];
    let id = TakeAreaId(massKlu[j])[1];
    if (massKlu[j].length < 9) {
      for (let i = 0; i < map.tflight.length; i++) {
        if (
          Number(map.tflight[i].area.num) === area &&
          map.tflight[i].ID === id
        ) {
          massRoute.push([
            [map.tflight[i].points.Y],
            [map.tflight[i].points.X],
          ]);
          break;
        }
      }
    } else {
      for (let i = 0; i < addobj.addObjects.length; i++) {
        if (
          addobj.addObjects[i].area === area &&
          addobj.addObjects[i].id === id
        ) {
          massRoute.push(addobj.addObjects[i].dgis);
          break;
        }
      }
    }
  }
  return massRoute;
};

export const MakeMassRouteFirst = (klu: string, bindings: any, map: any) => {
  let massRoute = [];
  let massklu = [];
  for (let i = 0; i < bindings.tfLinks.length; i++) {
    let mass = bindings.tfLinks[i].tflink;
    if (mass.west.id === klu) massklu.push(bindings.tfLinks[i].id);
    if (mass.north.id === klu) massklu.push(bindings.tfLinks[i].id);
    if (mass.east.id === klu) massklu.push(bindings.tfLinks[i].id);
    if (mass.south.id === klu) massklu.push(bindings.tfLinks[i].id);
  }
  for (let j = 0; j < massklu.length; j++) {
    let area = TakeAreaId(massklu[j])[0];
    let id = TakeAreaId(massklu[j])[1];
    for (let i = 0; i < map.tflight.length; i++) {
      if (
        Number(map.tflight[i].area.num) === area &&
        map.tflight[i].ID === id
      ) {
        massRoute.push([[map.tflight[i].points.Y], [map.tflight[i].points.X]]);
        break;
      }
    }
  }
  return massRoute;
};

export const MakeFazer = (klu: string, bind: any) => {
  let mass = bind.tflink;
  let fazer = "";
  switch (klu) {
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
  return fazer;
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

export const MakeSoobErr = (mode: number, klu: string, klu2: string) => {
  let soobErr = "";
  let vert = ";";
  switch (mode) {
    case 1:
      soobErr = "Перекрёсток [";
      if (klu.length > 8) soobErr = "Объект [";
      vert = "перекрёстком [";
      //if (massKlu[lastMem].length > 8) vert = "объектом [";
      if (klu2.length > 8) vert = "объектом [";
      soobErr += klu + "] не связан с " + vert;
      //soobErr += massKlu[lastMem] + "]";
      soobErr += klu2 + "]";
      break;
    case 2:
      soobErr = "Перекрёсток";
      if (klu.length > 8) soobErr = "Объект";
      soobErr += " уже используется";
      break;
    case 3:
      vert = "перекрёстка [";
      if (klu.length > 8) vert = "объекта [";
      soobErr = "Нет массива связности " + vert + klu + "]";
      break;
    case 4:
      soobErr =
        "В радиусе 100м от указанной точки управляемые перекрёстки отсутствуют";
      break;
    case 5:
      soobErr = "Нет связи с [" + klu + "] в массиве сязности перекрёстка [";
      soobErr += klu2 + "]";
  }
  return soobErr;
};

//=== addRoute =====================================
export const getReferencePoints = (pointA: any, pointB: any) => {
  return {
    referencePoints: [pointA, pointB],
  };
};

export const getReferenceLine = (massCoord: any, between: any) => {
  return {
    referencePoints: massCoord,
    params: { viaIndexes: between },
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

export const getMassMultiRouteOptions = (i: number) => {
  let massColor = ["#FF2626", "#0078D7", "#E6762D", "#EB3941"];
  let col = "#000000";
  if (i < 4) col = massColor[i];

  return {
    balloonCloseButton: false,
    routeStrokeStyle: "dot",
    //strokeColor: '#1A9165',
    //routeActiveStrokeColor: '#EB3941', // красный
    //routeActiveStrokeColor: '#E6762D', // оранж
    //routeActiveStrokeColor: '#0078D7', // синий
    //routeActiveStrokeColor: '#547A25', // зелёный
    //routeActiveStrokeColor: '#000000', // чёрный
    routeActiveStrokeColor: col,
    routeActiveStrokeWidth: 4,
    routeStrokeWidth: 0,
    wayPointVisible: false,
  };
};

export const getMassMultiRouteOptionsDemo = (i: number) => {
  return {
    balloonCloseButton: false,
    routeStrokeStyle: "dot",
    //strokeColor: '#1A9165',
    routeActiveStrokeColor: "#000000", // чёрный
    routeActiveStrokeWidth: 3,
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
//=== AppointVertex ================================
export const AppointHeader = (hBlock: number) => {
  return (
    <Grid container sx={{ bgcolor: "#C0E2C3" }}>
      <Grid item xs={1}></Grid>
      <Grid item xs={5.5} sx={{ height: hBlock / 10, paddingTop: 3 }}>
        <Box sx={styleAppSt03}>
          <b>Откуда</b>
        </Box>
      </Grid>
      <Grid item xs={4} sx={{ height: hBlock / 10, paddingTop: 3 }}>
        <Box sx={styleAppSt03}>
          <b>Куда</b>
        </Box>
      </Grid>
      <Grid item xs sx={{ height: hBlock / 10, paddingTop: 3 }}>
        <Box sx={styleAppSt03}>
          <b>Фаза</b>
        </Box>
      </Grid>
    </Grid>
  );
};
//StrokaMenuGlob
export const AppointDirect = (rec1: string, hBlock: number) => {
  let hB = hBlock / 15;
  return (
    <Grid container>
      <Grid item xs={12} sx={{ height: hBlock / 15 }}></Grid>
      <Grid item xs={12} sx={{ fontSize: 21, textAlign: "center", height: hB }}>
        <Box sx={styleAppSt02}>
          <b>{rec1}</b>
        </Box>
      </Grid>
    </Grid>
  );
};

export const OutputKey = (klush: string, hBlock: number) => {
  return (
    <Grid container>
      <Grid item xs={12} sx={{ textAlign: "center", height: hBlock / 15 }}>
        <Box sx={styleAppSt02}>{klush}</Box>
      </Grid>
    </Grid>
  );
};

export const TakeAreaId = (kluch: string) => {
  let aa = kluch.indexOf("-");
  let aaa = kluch.indexOf("-", aa + 1);
  let bb = kluch.slice(aa + 1, aaa);
  let bbb = kluch.slice(aaa + 1);
  return [Number(bb), Number(bbb)];
};

export const MakingKey = (homeRegion: any, valueAr: any, valueId: any) => {
  let klushFrom = "";
  if (valueAr && valueId)
    klushFrom = homeRegion + "-" + valueAr + "-" + valueId;
  return klushFrom;
};

export const CheckKey = (kluch: string, map: any, addobj: any) => {
  let klArea = TakeAreaId(kluch)[0];
  // ====
  let klId = TakeAreaId(kluch)[1];
  // ====
  let have = false;
  if (klId < 10000) {
    for (let i = 0; i < map.tflight.length; i++) {
      if (
        klArea === Number(map.tflight[i].area.num) &&
        klId === map.tflight[i].ID
      )
        have = true;
    }
  } else {
    for (let i = 0; i < addobj.addObjects.length; i++) {
      if (
        klArea === addobj.addObjects[i].area &&
        klId === addobj.addObjects[i].id
      )
        have = true;
    }
  }
  return have;
};

export const MakeTflink = (
  homeRegion: any,
  massAreaId: Array<number>,
  massFaz: Array<number>
) => {
  let valAreaZ = massAreaId[0];
  let valIdZ = massAreaId[1];
  let valAreaS = massAreaId[2];
  let valIdS = massAreaId[3];
  let valAreaV = massAreaId[4];
  let valIdV = massAreaId[5];
  let valAreaU = massAreaId[6];
  let valIdU = massAreaId[7];
  let maskPoints: WayPointsArray = {
    id: "",
    phase: "",
  };
  let maskTflink: Tflink = {
    add1: { id: "", wayPointsArray: [] },
    add2: { id: "", wayPointsArray: [] },
    east: { id: "", wayPointsArray: [] },
    north: { id: "", wayPointsArray: [] },
    south: { id: "", wayPointsArray: [] },
    west: { id: "", wayPointsArray: [] },
  };
  // запад
  if (valAreaZ && valIdZ) {
    maskTflink.west.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
    if (valAreaU && valIdU) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaU + "-" + valIdU;
      maskPoint.phase = massFaz[0].toString();
      maskTflink.west.wayPointsArray.push(maskPoint);
    }
    if (valAreaV && valIdV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaV + "-" + valIdV;
      maskPoint.phase = massFaz[1].toString();
      maskTflink.west.wayPointsArray.push(maskPoint);
    }
    if (valAreaS && valIdS) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaS + "-" + valIdS;
      maskPoint.phase = massFaz[2].toString();
      maskTflink.west.wayPointsArray.push(maskPoint);
    }
  }
  // север
  if (valAreaS && valIdS) {
    maskTflink.north.id = homeRegion + "-" + valAreaS + "-" + valIdS;
    if (valAreaZ && valIdZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
      maskPoint.phase = massFaz[3].toString();
      maskTflink.north.wayPointsArray.push(maskPoint);
    }
    if (valAreaU && valIdU) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaU + "-" + valIdU;
      maskPoint.phase = massFaz[4].toString();
      maskTflink.north.wayPointsArray.push(maskPoint);
    }
    if (valAreaV && valIdV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaV + "-" + valIdV;
      maskPoint.phase = massFaz[5].toString();
      maskTflink.north.wayPointsArray.push(maskPoint);
    }
  }
  // восток
  if (valAreaV && valIdV) {
    let maskPoint = JSON.parse(JSON.stringify(maskPoints));
    maskTflink.east.id = homeRegion + "-" + valAreaV + "-" + valIdV;
    if (valAreaS && valIdS) {
      maskPoint.id = homeRegion + "-" + valAreaS + "-" + valIdS;
      maskPoint.phase = massFaz[6].toString();
      maskTflink.east.wayPointsArray.push(maskPoint);
    }
    if (valAreaZ && valIdZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
      maskPoint.phase = massFaz[7].toString();
      maskTflink.east.wayPointsArray.push(maskPoint);
    }
    if (valAreaU && valIdU) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaU + "-" + valIdU;
      maskPoint.phase = massFaz[8].toString();
      maskTflink.east.wayPointsArray.push(maskPoint);
    }
  }
  // юг
  if (valAreaU && valIdU) {
    maskTflink.south.id = homeRegion + "-" + valAreaU + "-" + valIdU;
    if (valAreaV && valIdV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaV + "-" + valIdV;
      maskPoint.phase = massFaz[9].toString();
      maskTflink.south.wayPointsArray.push(maskPoint);
    }
    if (valAreaS && valIdS) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaS + "-" + valIdS;
      maskPoint.phase = massFaz[10].toString();
      maskTflink.south.wayPointsArray.push(maskPoint);
    }
    if (valAreaZ && valIdZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
      maskPoint.phase = massFaz[11].toString();
      maskTflink.south.wayPointsArray.push(maskPoint);
    }
  }
  return maskTflink;
};

export const MakingKluch = (
  rec1: string,
  homeRegion: any,
  massAreaId: Array<number>
) => {
  let klushTo1 = "";
  let klushTo2 = "";
  let klushTo3 = "";
  let valAreaZ = massAreaId[0];
  let valIdZ = massAreaId[1];
  let valAreaS = massAreaId[2];
  let valIdS = massAreaId[3];
  let valAreaV = massAreaId[4];
  let valIdV = massAreaId[5];
  let valAreaU = massAreaId[6];
  let valIdU = massAreaId[7];

  switch (rec1) {
    case "З":
      if (valAreaZ && valIdZ) {
        klushTo1 = MakingKey(homeRegion, valAreaU, valIdU);
        klushTo2 = MakingKey(homeRegion, valAreaV, valIdV);
        klushTo3 = MakingKey(homeRegion, valAreaS, valIdS);
      }
      break;
    case "С":
      if (valAreaS && valIdS) {
        klushTo1 = MakingKey(homeRegion, valAreaZ, valIdZ);
        klushTo2 = MakingKey(homeRegion, valAreaU, valIdU);
        klushTo3 = MakingKey(homeRegion, valAreaV, valIdV);
      }
      break;
    case "В":
      if (valAreaV && valIdV) {
        klushTo1 = MakingKey(homeRegion, valAreaS, valIdS);
        klushTo2 = MakingKey(homeRegion, valAreaZ, valIdZ);
        klushTo3 = MakingKey(homeRegion, valAreaU, valIdU);
      }
      break;
    case "Ю":
      if (valAreaU && valIdU) {
        klushTo1 = MakingKey(homeRegion, valAreaV, valIdV);
        klushTo2 = MakingKey(homeRegion, valAreaS, valIdS);
        klushTo3 = MakingKey(homeRegion, valAreaZ, valIdZ);
      }
  }
  return [klushTo1, klushTo2, klushTo3];
};

export const OutputNumFaza = (
  num: number,
  imgFaza: any,
  maxFaza: number,
  hBlock: number
) => {
  const OutputFaza = (img: any) => {
    let widthHeight = (hBlock / 12) * 3.7;
    if (!img) widthHeight = hBlock / 12;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ width: widthHeight, height: widthHeight }}
      >
        <image
          width={"95%"}
          height={"100%"}
          xlinkHref={"data:image/png;base64," + img}
        />
      </svg>
    );
  };

  return (
    <>
      {num <= maxFaza && (
        <>
          <Grid
            item
            xs={0.4}
            sx={{ fontSize: 12, textAlign: "right", height: hBlock / 3 }}
          >
            <Box sx={styleAppSt02}>{num}</Box>
          </Grid>
          <Grid item xs={3.6} sx={{ textAlign: "center" }}>
            <Box sx={styleAppSt02}>{OutputFaza(imgFaza)}</Box>
          </Grid>
        </>
      )}
    </>
  );
};

export const ReplaceInSvg = (svgPict: any) => {
  let svgPipa = svgPict;
  if (svgPict) {
    let heightImg = window.innerWidth / 3.333;
    let aa = (heightImg / 100) * 9.5;
    heightImg = heightImg + aa;
    let widthHeight = heightImg.toString();
    let ch = "";
    let vxod = svgPict.indexOf("width=");
    for (let i = 0; i < 100; i++) {
      if (isNaN(Number(svgPipa[vxod + 7 + i]))) break;
      ch = ch + svgPipa[vxod + 7 + i];
    }
    for (let i = 0; i < 6; i++) {
      svgPipa = svgPipa.replace(ch, widthHeight);
    }
  }
  return svgPipa;
};
//=== ToDoMode =====================================
export const CircleObj = () => {
  const circle = {
    width: 18,
    height: 18,
    border: 3,
    marginTop: 1.2,
    marginLeft: 2.5,
    borderRadius: 9,
    borderColor: "#9B5BDD",
  };
  return <Box sx={circle}></Box>;
};
//=== Разное =======================================
export const InputDirect = (func: any) => {
  const styleSetNapr = {
    //border: 1,
    width: "150px",
    maxHeight: "3px",
    minHeight: "3px",
    bgcolor: "#D7F1C0",
    boxShadow: 3,
    marginLeft: "auto",
    p: 1.5,
  };

  const styleBoxFormNapr = {
    "& > :not(style)": {
      marginTop: "-12px",
      //marginLeft: '-12px',
      width: "155px",
    },
  };
  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(Number(event.target.value));

    switch (Number(event.target.value)) {
      case 0: // режим управления
        func(51);
        break;
      case 1: // режим назначения
        func(52);
        break;
      case 2: // режим назначения
        func(54);
    }
  };

  let dat = ["Режим управления", "Режим назначения", "Показать связи"];
  let massKey = [];
  let massDat: any[] = [];
  const currencies: any = [];
  for (let key in dat) {
    massKey.push(key);
    massDat.push(dat[key]);
  }
  for (let i = 0; i < massKey.length; i++) {
    let maskCurrencies = {
      value: "",
      label: "",
    };
    maskCurrencies.value = massKey[i];
    maskCurrencies.label = massDat[i];
    currencies.push(maskCurrencies);
  }

  const [currency, setCurrency] = React.useState(0);

  return (
    <Box sx={styleSetNapr}>
      <Box component="form" sx={styleBoxFormNapr}>
        <TextField
          select
          size="small"
          onKeyPress={handleKey} //отключение Enter
          value={currency}
          onChange={handleChange}
          InputProps={{ disableUnderline: true, style: { fontSize: 14 } }}
          variant="standard"
          color="secondary"
        >
          {currencies.map((option: any) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ fontSize: 14 }}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};

export const StrokaMenuGlob = (func: any) => {
  const styleApp01 = {
    fontSize: 14,
    marginRight: 0.1,
    width: 170,
    maxHeight: "21px",
    minHeight: "21px",
    backgroundColor: "#D7F1C0",
    color: "black",
  };

  return <Box sx={styleApp01}>{InputDirect(func)}</Box>;
};

export const StrokaHelp = (soobInfo: string) => {
  let dlSoob = (soobInfo.length + 24) * 8;
  const styleInfoSoob = {
    fontSize: 15,
    marginRight: 0.1,
    width: dlSoob,
    maxHeight: "21px",
    minHeight: "21px",
    backgroundColor: "#E9F5D8",
    color: "#E6761B",
    textAlign: "center",
    marginTop: "-1px",
  };
  return (
    <Box sx={styleInfoSoob}>
      <b>
        <em>{soobInfo}</em>
      </b>
    </Box>
  );
};
