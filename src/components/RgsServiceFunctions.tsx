import * as React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { Pointer } from "../App";
import { Tflink, WayPointsArray } from "../interfaceBindings";

import { FullscreenControl, GeolocationControl } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import { styleAppSt02, styleAppSt03 } from "./MainMapStyle";
import { styleModalEndAttent, searchControl } from "./MainMapStyle";

export const YandexServices = () => {
  return (
    <>
      <FullscreenControl />
      <GeolocationControl options={{ float: "left" }} />
      <RulerControl options={{ float: "right" }} />
      <SearchControl options={searchControl} />
      <TrafficControl options={{ float: "right" }} />
      <TypeSelector options={{ float: "right" }} />
      <ZoomControl options={{ float: "right" }} />
    </>
  );
};

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
  masskPoint.ID = rec.ID;
  masskPoint.coordinates[0] = rec.points.Y;
  masskPoint.coordinates[1] = rec.points.X;
  masskPoint.nameCoordinates = rec.description;
  masskPoint.region = Number(rec.region.num);
  masskPoint.area = Number(rec.area.num);
  masskPoint.phases = rec.phases;
  //for (let i = 0; i < rec.phases.length; i++) {
  for (let i = 0; i < 8; i++) {
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
export const GetPointData = (
  index: number,
  map: any,
  bindings: any,
  addobjects: any
) => {
  let cont1 = "";
  let cont2 = "";
  let cont3 = "";
  let cont4 = "";
  let contS = "";
  let contV = "";
  let contU = "";
  let contZ = "";
  if (index < map.tflight.length) {
    let SL = Number(map.tflight[index].region.num) < 10 ? 4 : 5;
    cont1 = map.tflight[index].description + "<br/>";
    cont3 = map.tflight[index].tlsost.description + "<br/>";
    //cont2 = "[" + map.tflight[index].region.num + ", ";
    //cont2 = "[" + map.tflight[index].area.num + ", ";
    cont2 =
      "[" + map.tflight[index].ID + ", " + map.tflight[index].idevice + "]";
    for (let i = 0; i < bindings.tfLinks.length; i++) {
      let rec = map.tflight[index];
      let klu = MakingKey(rec.region.num, rec.area.num, rec.ID);
      if (bindings.tfLinks[i].id === klu) {
        let recc = bindings.tfLinks[i].tflink;
        cont4 = "<br/>Связи:";
        if (recc.north.id) contS = "<br/><b>C:</b> " + recc.north.id.slice(SL);
        if (recc.east.id) contV = "<br/><b>В:</b> " + recc.east.id.slice(SL);
        if (recc.south.id) contU = "<br/><b>Ю:</b> " + recc.south.id.slice(SL);
        if (recc.west.id) contZ = "<br/><b>З:</b> " + recc.west.id.slice(SL);
        break;
      }
    }
  } else {
    let idx = index - map.tflight.length;
    cont1 = addobjects[idx].description + "<br/>";
    cont2 = "[" + addobjects[idx].area + ", " + addobjects[idx].id + "]";
  }

  return {
    hintContent: cont1 + cont3 + cont2 + cont4 + contS + contV + contU + contZ,
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

export const MakeSoobErr = (mode: number, klu: string, klu2: string) => {
  let soobErr = "";
  let vert = ";";
  switch (mode) {
    case 1:
      soobErr = "Перекрёсток [";
      if (klu.length > 6) soobErr = "Объект [";
      vert = "перекрёстком [";
      if (klu2.length > 6) vert = "объектом [";
      soobErr += klu + "] не связан с " + vert;
      soobErr += klu2 + "]";
      break;
    case 2:
      soobErr = "Перекрёсток";
      if (klu.length > 6) soobErr = "Объект";
      soobErr += " уже используется";
      break;
    case 3:
      vert = "перекрёстка [";
      if (klu.length > 6) vert = "объекта [";
      soobErr = "Нет массива связности " + vert + klu + "]";
      break;
    case 4:
      soobErr =
        "В радиусе 100м от указанной точки управляемые перекрёстки отсутствуют";
      break;
    case 5:
      soobErr = "Нет связи с [" + klu + "] в массиве связности перекрёстка [";
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
export const OutputFazaImg = (img: any, i: number) => {
  let widthHeight = 60;
  if (!img) widthHeight = 30;
  return (
    <>
      {img && (
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
      )}
      {!img && <Box sx={{ fontSize: 33 }}>{i}</Box>}
    </>
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
export const BadExit = (badExit: boolean, handleCloseEnd: Function) => {
  const styleSetPoint = {
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    borderColor: "red",
    borderRadius: 2,
    boxShadow: 24,
    textAlign: "center",
    p: 1,
  };

  const styleModalMenu = {
    marginTop: 0.5,
    maxHeight: "24px",
    minHeight: "24px",
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };

  const handleClose = (mode: boolean) => {
    handleCloseEnd(mode);
  };

  return (
    <Modal open={badExit} onClose={() => handleClose(false)}>
      <Box sx={styleSetPoint}>
        <Button sx={styleModalEndAttent} onClick={() => handleClose(false)}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ color: "red" }}>
          Предупреждение
        </Typography>
        <Box sx={{ marginTop: 0.5 }}>
          <Box sx={{ marginBottom: 1.2 }}>
            <b>Будет произведён выход без сохранения. Продолжать?</b>
          </Box>
          <Button sx={styleModalMenu} onClick={() => handleClose(true)}>
            Да
          </Button>
          &nbsp;
          <Button sx={styleModalMenu} onClick={() => handleClose(false)}>
            Нет
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

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
      <>
        {img && (
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
        )}
        {!img && <Box sx={{ fontSize: 36 }}>{num}</Box>}
      </>
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

export const OutputPict = (pict: any) => {
  return (
    <Box sx={{ border: 0, boxShadow: 24, }}>
      <div dangerouslySetInnerHTML={{ __html: ReplaceInSvg(pict) }} />
    </Box>
  );
};

export function AppIconAsdu() {
  let heightImg = window.innerWidth / 3.333;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={heightImg - 10}
      height={heightImg - 10}
      version="1"
      viewBox="0 0 91 54"
    >
      <path
        d="M425 513C81 440-106 190 91 68 266-41 640 15 819 176c154 139 110 292-98 341-73 17-208 15-296-4zm270-14c208-38 257-178 108-308C676 79 413 8 240 40 29 78-30 199 100 329c131 131 396 207 595 170z"
        transform="matrix(.1 0 0 -.1 0 54)"
      ></path>
      <path
        d="M425 451c-11-18-5-20 74-30 108-14 157-56 154-133-2-52-41-120-73-129-44-12-110-10-110 4 1 6 7 62 14 122 7 61 12 113 10 117-4 6-150 1-191-8-45-9-61-40-74-150-10-90-14-104-30-104-12 0-19-7-19-20 0-11 7-20 15-20s15-7 15-15c0-11 11-15 35-15 22 0 38 6 41 15 4 9 19 15 35 15 22 0 29 5 29 20s-7 20-25 20c-29 0-31 10-14 127 12 82 31 113 71 113 18 0 20-5 15-42-4-24-9-74-12-113-3-38-8-87-11-107l-6-38h46c34 0 46 4 46 15s12 15 48 15c97 0 195 47 227 110 59 115-44 225-223 237-56 4-81 2-87-6z"
        transform="matrix(.1 0 0 -.1 0 54)"
      ></path>
    </svg>
  );
}

export const ChangeArea = (event: any, funcAr: Function, funcId: Function) => {
  //let valueInp = event.target.value.replace(/^0+/, "");
  let valueInp = event.target.value;
  if (valueInp === "") valueInp = 1;
  if (Number(valueInp) < 0) valueInp = 1;
  if (Number(valueInp) === 0) {
    valueInp = 0;
    funcId(0);
  }
  if (Number(valueInp) < 100) funcAr(Number(valueInp));
};

// export const ChangeId = (
//   event: any,
//   funcId: Function,
//   funcAr: Function,
//   map: any,
//   addobj: any,
//   AREA: number
// ) => {
//   //let valueInp = event.target.value.replace(/^0+/, "");
//   let valueInp = event.target.value;
//   if (valueInp === "") valueInp = 1;
//   if (Number(valueInp) < 0) valueInp = 1;
//   if (Number(valueInp) < 100000) funcId(Number(valueInp));
//   let have = false;
//   HAVE++;
//   if (Number(valueInp) < 9999) {
//     // перекрёсток
//     for (let i = 0; i < map.tflight.length; i++) {
//       // if (map.tflight[i].ID === Number(valueInp)) {
//       //   funcAr(Number(map.tflight[i].area.num));
//       //   have = true;
//       // }
//       if (
//         map.tflight[i].ID === Number(valueInp) &&
//         Number(map.tflight[i].area.num) === AREA
//       ) {
//         funcAr(Number(map.tflight[i].area.num));
//         have = true;
//       }
//     }
//   } else {
//     // объект
//     for (let i = 0; i < addobj.addObjects.length; i++) {
//       if (addobj.addObjects[i].id === Number(valueInp)) {
//         funcAr(addobj.addObjects[i].area);
//         have = true;
//       }
//     }
//   }
//   if (!have) funcAr(0);
// };

export const OutPutZZ = (zz: string) => {
  const styleZId = {
    fontSize: 19,
    transform: "rotate(270deg)",
    position: "relative",
    top: "50%",
    color: "blue",
    marginLeft: -0.5,
  };
  return (
    <Grid item xs={0.15} sx={{ border: 0 }}>
      <Box sx={styleZId}>
        <b>{zz}</b>
      </Box>
    </Grid>
  );
};

export const OutPutSS = (ss: string) => {
  return (
    <Box
      sx={{
        marginTop: -2.5,
        color: "blue",
        textAlign: "center",
        maxHeight: "18px",
        minHeight: "18px",
      }}
    >
      <b>{ss}</b>
    </Box>
  );
};

export const OutPutUU = (uu: string) => {
  return (
    <Box sx={{ marginTop: -0.5, color: "blue", textAlign: "center" }}>
      <b>{uu}</b>
    </Box>
  );
};

export const OutPutVV = (vv: string) => {
  const styleVId = {
    fontSize: 19,
    transform: "rotate(90deg)",
    position: "relative",
    top: "50%",
    color: "blue",
    marginLeft: 0.7,
  };
  return (
    <Grid item xs={0.15} sx={{ border: 0 }}>
      <Box sx={styleVId}>
        <b>{vv}</b>
      </Box>
    </Grid>
  );
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
    borderColor: "#B51EFF", // сереневый
  };
  return <Box sx={circle}></Box>;
};
//=== Разное =======================================
export const InputDirect = (func: any) => {
  const styleSetNapr = {
    //border: 1,
    width: "165px",
    maxHeight: "1px",
    minHeight: "1px",
    bgcolor: "#93D145",
    boxShadow: 3,
    paddingTop: 1.5,
    paddingBottom: 1.5,
    textAlign: "center",
  };

  const styleBoxFormNapr = {
    "& > :not(style)": {
      marginTop: "-12px",
      width: "165px",
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
      case 2: // режим Показать связи
        func(54);
        break;
      case 3: // режим Demo
        func(55);
    }
  };

  let dat = [
    "Режим управления",
    "Режим назначения",
    "Показать связи",
    "Режим Демо",
  ];
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
          InputProps={{
            disableUnderline: true,
            style: {
              fontSize: currency === 3 ? 17 : 15,
              fontWeight: 700,
              color: currency === 3 ? "red" : "black",
              marginTop: currency === 3 ? -3 : 0,
            },
          }}
          variant="standard"
          color="secondary"
        >
          {currencies.map((option: any) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                fontSize: 14,
                color: option.label === "Режим Демо" ? "red" : "black",
              }}
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
    marginLeft: 0.5,
    width: 165,
    maxHeight: "24px",
    minHeight: "24px",
    backgroundColor: "#93D145",
    color: "black",
    boxShadow: 4,
  };

  return <Box sx={styleApp01}>{InputDirect(func)}</Box>;
};

export const StrokaHelp = (soobInfo: string) => {
  let dlSoob = (soobInfo.length + 12) * 8;
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
