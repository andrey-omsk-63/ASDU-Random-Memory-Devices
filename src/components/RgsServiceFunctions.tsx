import * as React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
//import { BiExpand } from "react-icons/bi";
import { MdOpenWith } from "react-icons/md";

import { Pointer } from "../App";
import { Tflink, WayPointsArray } from "../interfaceBindings";

import { FullscreenControl, GeolocationControl } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import { BAN } from "./MainMapRgs";

import { styleAppSt02, styleAppSt03, styleModalEnd } from "./MainMapStyle";
import { styleModalEndAttent, searchControl } from "./MainMapStyle";
import { styleSetPK04 } from "./MainMapStyle";

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

export const ExitCross = (func: any) => {
  return (
    <Button sx={styleModalEnd} onClick={() => func()}>
      <b>&#10006;</b>
    </Button>
  );
};

export const FooterContent = (SaveForm: Function) => {
  const styleFormPK03 = {
    maxHeight: "24px",
    minHeight: "24px",
    backgroundColor: "#E6F5D6", // светло салатовый
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    textTransform: "unset !important",
    boxShadow: 6,
    textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
    color: "black",
    padding: "2px 8px 0px 8px",
  };

  return (
    <Box sx={styleSetPK04}>
      <Box sx={{ display: "inline-block", margin: "0px 5px 0px 0px" }}>
        <Button sx={styleFormPK03} onClick={() => SaveForm(0)}>
          Выйти без сохранения
        </Button>
      </Box>
      <Box sx={{ display: "inline-block", margin: "0px 5px 0px 5px" }}>
        <Button sx={styleFormPK03} onClick={() => SaveForm(1)}>
          Сохранить изменения
        </Button>
      </Box>
    </Box>
  );
};

export const StrTablVert = (xss: number, recLeft: string, recRight: any) => {
  return (
    <>
      <Grid container sx={{ marginTop: 1 }}>
        <Grid item xs={0.25}></Grid>
        <Grid item xs={xss} sx={{ border: 0 }}>
          <b>{recLeft}</b>
        </Grid>
        {typeof recRight === "object" ? (
          <Grid item xs>
            {recRight}
          </Grid>
        ) : (
          <Grid item xs sx={{ fontSize: 15, color: "#5B1080", border: 0 }}>
            <b>{recRight}</b>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export const ShiftOptimal = (
  mode: boolean,
  ChangeOptimal: Function,
  shift: number
) => {
  const styleOptimalNo = {
    marginTop: shift,
    marginRight: 1,
    maxHeight: "27px",
    minHeight: "27px",
    maxWidth: 58,
    minWidth: 58,
    backgroundColor: "#E6F5D6", // светло салатовый
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    textTransform: "unset !important",
    boxShadow: 2,
    color: "black",
  };

  const styleOptimalYes = {
    marginTop: shift,
    marginRight: 1,
    maxHeight: "27px",
    minHeight: "27px",
    maxWidth: 58,
    minWidth: 58,
    backgroundColor: "#bae186", // тёмно салатовый
    border: "1px solid #bae186", // тёмно салатовый
    borderRadius: 1,
    textTransform: "unset !important",
    boxShadow: 6,
    color: "black",
  };

  let illum = mode ? styleOptimalYes : styleOptimalNo;
  let soob = mode ? "Да" : "Нет";

  return (
    <Button sx={illum} onClick={() => ChangeOptimal()}>
      {soob}
    </Button>
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
  for (let i = 0; i < 8; i++) masskPoint.phSvg.push(img);
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
  for (let i = 0; i < bindings.tfLinks.length; i++)
    if (bindings.tfLinks[i].id === kluLast) hv = i;
  let mass: any = bindings.tfLinks[hv].tflink;
  let haveLink = false;
  let idd = TakeAreaId(klu)[1];

  if (TakeAreaId(mass.west.id)[1] === idd) haveLink = true;
  if (TakeAreaId(mass.add4.id)[1] === idd) haveLink = true; // северо-запад
  if (TakeAreaId(mass.north.id)[1] === idd) haveLink = true;
  if (TakeAreaId(mass.add1.id)[1] === idd) haveLink = true; // северо-восток
  if (TakeAreaId(mass.east.id)[1] === idd) haveLink = true;
  if (TakeAreaId(mass.add2.id)[1] === idd) haveLink = true; // юго-восток
  if (TakeAreaId(mass.south.id)[1] === idd) haveLink = true;
  if (TakeAreaId(mass.add3.id)[1] === idd) haveLink = true; // юго-запад

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
  if (mass.add4.id) massKlu.push(mass.add4.id); // северо-запад
  if (mass.north.id) massKlu.push(mass.north.id);
  if (mass.add1.id) massKlu.push(mass.add1.id); // северо-восток
  if (mass.east.id) massKlu.push(mass.east.id);
  if (mass.add2.id) massKlu.push(mass.add2.id); // юго-восток
  if (mass.south.id) massKlu.push(mass.south.id);
  if (mass.add3.id) massKlu.push(mass.add3.id); // юго-запад

  for (let j = 0; j < massKlu.length; j++) {
    let area = TakeAreaId(massKlu[j])[0];
    let id = TakeAreaId(massKlu[j])[1];

    if (id < 10000) {
      for (let i = 0; i < map.tflight.length; i++) {
        if (
          Number(map.tflight[i].area.num) === area &&
          map.tflight[i].ID === id
        ) {
          massRoute.push([map.tflight[i].points.Y, map.tflight[i].points.X]);
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
  return [massRoute, massKlu];
};

export const MakeMassRouteFirst = (klu: string, bindings: any, map: any) => {
  let massRoute = [];
  let massklu = [];
  let idd = TakeAreaId(klu)[1];
  for (let i = 0; i < bindings.tfLinks.length; i++) {
    let mass = bindings.tfLinks[i].tflink;
    if (TakeAreaId(mass.west.id)[1] === idd)
      massklu.push(bindings.tfLinks[i].id);
    if (TakeAreaId(mass.north.id)[1] === idd)
      massklu.push(bindings.tfLinks[i].id);
    if (TakeAreaId(mass.east.id)[1] === idd)
      massklu.push(bindings.tfLinks[i].id);
    if (TakeAreaId(mass.south.id)[1] === idd)
      massklu.push(bindings.tfLinks[i].id);

    if (TakeAreaId(mass.add1.id)[1] === idd)
      massklu.push(bindings.tfLinks[i].id);
    if (TakeAreaId(mass.add2.id)[1] === idd)
      massklu.push(bindings.tfLinks[i].id);
    if (TakeAreaId(mass.add3.id)[1] === idd)
      massklu.push(bindings.tfLinks[i].id);
    if (TakeAreaId(mass.add4.id)[1] === idd)
      massklu.push(bindings.tfLinks[i].id);
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
  let mass: any = bind.tflink;
  let id = TakeAreaId(klu)[1];

  let fazer = "";
  switch (id) {
    case TakeAreaId(mass.west.id)[1]:
      fazer = "З";
      break;
    case TakeAreaId(mass.north.id)[1]:
      fazer = "С";
      break;
    case TakeAreaId(mass.east.id)[1]:
      fazer = "В";
      break;
    case TakeAreaId(mass.south.id)[1]:
      fazer = "Ю";
      break;
    case TakeAreaId(mass.add1.id)[1]:
      fazer = "СВ";
      break;
    case TakeAreaId(mass.add2.id)[1]:
      fazer = "ЮВ";
      break;
    case TakeAreaId(mass.add3.id)[1]:
      fazer = "ЮЗ";
      break;
    case TakeAreaId(mass.add4.id)[1]:
      fazer = "СЗ";
  }
  return fazer;
};

export const Сrossroad = (datestatFinish: boolean) => {
  return (
    <>
      {!datestatFinish && (
        <Box sx={{ fontSize: 15, padding: "4px 0px 10px 0px" }}>
          {/* <BiExpand /> */}
          <MdOpenWith />
        </Box>
      )}
    </>
  );
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
  let contSV = "";
  let contV = "";
  let contUV = "";
  let contU = "";
  let contUZ = "";
  let contZ = "";
  let contSZ = "";

  const ExtrId = (rec: string, SL: number) => {
    return rec.indexOf("-") < 0 ? rec : rec.slice(SL);
  };

  if (index < map.tflight.length) {
    let sl = Number(map.tflight[index].region.num) < 10 ? 4 : 5;
    let SL = Number(map.tflight[index].area.num) < 10 ? sl : sl + 1; //============================
    cont1 = map.tflight[index].description + "<br/>";
    cont3 = map.tflight[index].tlsost.description + "<br/>";
    cont2 =
      "[" + map.tflight[index].ID + ", " + map.tflight[index].idevice + "]";
    for (let i = 0; i < bindings.tfLinks.length; i++) {
      let rec = map.tflight[index];
      let klu = MakingKey(rec.region.num, rec.area.num, rec.ID);

      if (bindings.tfLinks[i].id === klu) {
        let recc = JSON.parse(JSON.stringify(bindings.tfLinks[i].tflink));
        cont4 = "<br/>Связи:";
        if (recc.north.id)
          contS = "<br/><b>C:</b> " + ExtrId(recc.north.id, SL);
        if (recc.add1.id)
          contSV = "<br/><b>CВ:</b> " + ExtrId(recc.add1.id, SL);
        if (recc.east.id) contV = "<br/><b>В:</b> " + ExtrId(recc.east.id, SL);
        if (recc.add2.id)
          contUV = "<br/><b>ЮВ:</b> " + ExtrId(recc.add2.id, SL);
        if (recc.south.id)
          contU = "<br/><b>Ю:</b> " + ExtrId(recc.south.id, SL);
        if (recc.add3.id)
          contUZ = "<br/><b>ЮЗ:</b> " + ExtrId(recc.add3.id, SL);
        if (recc.west.id) contZ = "<br/><b>З:</b> " + ExtrId(recc.west.id, SL);
        if (recc.add4.id)
          contSZ = "<br/><b>СЗ:</b> " + ExtrId(recc.add4.id, SL);
        break;
      }
    }
  } else {
    let idx = index - map.tflight.length;
    cont1 = addobjects[idx].description + "<br/>";
    cont2 = "[" + addobjects[idx].area + ", " + addobjects[idx].id + "]";
  }

  return {
    hintContent:
      cont1 +
      cont3 +
      cont2 +
      cont4 +
      contS +
      contSV +
      contV +
      contUV +
      contU +
      contUZ +
      contZ +
      contSZ,
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

export const MakeSoobErr = (mode: number, Klu: string, Klu2: string) => {
  let soobErr = "";
  let vert = ";";
  let klu = -1;
  let klu2 = -1;
  let aa = Klu.indexOf("-");
  if (aa >= 0) {
    klu = TakeAreaId("1-" + Klu)[1];
    klu2 = TakeAreaId("1-" + Klu2)[1];
  } else {
    klu = Number(Klu);
    klu2 = Number(Klu2);
  }

  switch (mode) {
    case 1:
      soobErr = "Перекрёсток #";
      if (klu > 10000) soobErr = "Объект #";
      vert = "перекрёстком #";
      if (klu2 > 10000) vert = "объектом #";
      soobErr += klu + " не связан с " + vert;
      soobErr += klu2;
      break;
    case 2:
      soobErr = "Перекрёсток";
      if (klu > 10000) soobErr = "Объект";
      soobErr += " уже используется";
      break;
    case 3:
      vert = "перекрёстка #";
      if (klu > 10000) vert = "объекта #";
      soobErr = "Нет массива связности " + vert + klu;
      break;
    case 4:
      soobErr =
        "В радиусе 100м от указанной точки управляемые перекрёстки отсутствуют";
      break;
    case 5:
      vert = "перекрёстком #";
      if (klu > 10000) vert = "объектом #";
      soobErr =
        "Нет связи с " + vert + klu + " в массиве связности перекрёстка #";
      soobErr += klu2;
  }
  return soobErr;
};

//=== addRoute =====================================
export const getReferencePoints = (pointA: any, pointB: any) => {
  return { referencePoints: [pointA, pointB] };
};

export const getReferenceLine = (massCoord: any, between: any) => {
  return {
    referencePoints: massCoord,
    params: { viaIndexes: between },
  };
};

export const getMultiRouteOptions = () => {
  return {
    routeActiveStrokeWidth: 5, // толщина линии
    //routeActiveStrokeColor: "#224E1F",
    routeStrokeWidth: 0, // толщина линии альтернативного маршрута
    wayPointVisible: false, // отметки "начало - конец"
    strokeWidth: 5, // толщина линии Polyline
    strokeColor: '#9B59DA', // цвет линии Polyline - сиреневый
  };
};

export const getMassMultiRouteOptions = (i: number) => {
  let massColor = ["#FF2626", "#0078D7", "#E6762D", "#547A25"];
  let col = "#000000";
  if (i < 4) col = massColor[i];

  return {
    balloonCloseButton: false,
    routeStrokeStyle: "dot",
    strokeStyle: "dot",
    //strokeColor: '#1A9165',
    //routeActiveStrokeColor: '#FF2626', // красный
    //routeActiveStrokeColor: '#E6762D', // оранж
    //routeActiveStrokeColor: '#0078D7', // синий
    //routeActiveStrokeColor: '#547A25', // зелёный
    //routeActiveStrokeColor: '#000000', // чёрный
    routeActiveStrokeColor: col, // цвет линии
    strokeColor: col, // цвет линии Polyline
    routeActiveStrokeWidth: 4, // толщина линии
    strokeWidth: 3, // толщина линии Polyline
    routeStrokeWidth: 0, // толщина линии альтернативного маршрута
    wayPointVisible: false, // отметки "начало - конец"
  };
};

export const getMassMultiRouteOptionsDemo = (i: number, coler: string) => {
  return {
    balloonCloseButton: false,
    routeStrokeStyle: "dot",
    routeActiveStrokeColor: coler, // цвет линии
    strokeColor: coler, // цвет линии Polyline
    routeActiveStrokeWidth: 3,
    strokeWidth: 2, // толщина линии Polyline
    routeStrokeWidth: 0,
    wayPointVisible: false, // отметки "начало - конец"
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
      {!img && <Box sx={{ color: "#7620a2", fontSize: 33 }}>{i}</Box>}
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
    border: "1px solid #fff", // белый
    borderRadius: 1,
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    boxShadow: 24,
    textAlign: "center",
    p: 1,
  };

  const styleModalMenu = {
    marginTop: 0.5,
    maxHeight: "24px",
    minHeight: "24px",
    backgroundColor: "#E6F5D6",
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    boxShadow: 6,
    textTransform: "unset !important",
    color: "black",
  };

  const handleClose = (mode: boolean) => handleCloseEnd(mode);

  return (
    <Modal open={badExit} onClose={() => handleClose(false)}>
      <Box sx={styleSetPoint}>
        <Button sx={styleModalEndAttent} onClick={() => handleClose(false)}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ color: "red" }}>
          ⚠️Предупреждение
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

export const GetFaza = (
  mass: any,
  mas: any,
  maxFaza: number,
  kluch: string
) => {
  let faza = 0;
  if (mass)
    for (let i = 0; i < mas.length; i++)
      if (mas[i].id === kluch) faza = Number(mas[i].phase);
  if (faza > maxFaza || !faza) faza = 1;
  return faza;
};

export const AppointHeader = (hBlock: number) => {
  const RecHeader = (xss: number, rec: string) => {
    return (
      <Grid item xs={xss} sx={{ height: hBlock / 10, paddingTop: 2 }}>
        <Box sx={styleAppSt03}>
          <b>{rec}</b>
        </Box>
      </Grid>
    );
  };
  return (
    <Grid container sx={{ bgcolor: "#B8CBB9" }}>
      <Grid item xs={1}></Grid>
      {RecHeader(5.5, "Откуда")}
      {RecHeader(4.0, "Куда")}
      {RecHeader(1.5, "Фаза")}
    </Grid>
  );
};

export const AppointDirect = (rec1: string, hBlock: number) => {
  let hB = hBlock / 6;
  let rec2 = "";
  let thick = 800;
  if (rec1 === "З") rec2 = "⬅";
  if (rec1 === "С") rec2 = "⬆";
  if (rec1 === "В") rec2 = "➡";
  if (rec1 === "Ю") rec2 = "⬇";
  if (rec1 === "СЗ") rec2 = "⬉";
  if (rec1 === "СВ") rec2 = "⬈";
  if (rec1 === "ЮВ") rec2 = "⬊";
  if (rec1 === "ЮЗ") rec2 = "⬋";
  if (rec1 === "З" || rec1 === "С" || rec1 === "В" || rec1 === "Ю") thick = 200;

  const styleAppointDirect = {
    fontSize: 18,
    textAlign: "center",
    height: hB,
    color: "#7620a2", // сиреневый
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  };

  const styleAppointRec2 = {
    fontWeight: thick,
    paddingTop: "2px",
    fontSize: 14.0,
  };

  return (
    <Grid item xs={1} sx={{ height: hBlock / 2.1 }}>
      <Grid container>
        <Grid item xs={12} sx={{ height: hBlock / 6 }}></Grid>
        <Grid item xs={12} sx={styleAppointDirect}>
          <Box sx={styleAppSt02}>
            <Box sx={{ display: "flex", paddingLeft: "5px" }}>
              <b>{rec1}</b>
              <Box sx={styleAppointRec2}>{rec2}</Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const OutputKey = (klush: string, hBlock: number, dir: string) => {
  // let rec1 = dir.slice(0, -1); // без последнего символа
  // let rec2 = dir.slice(-1); // последний символ
  // let thick = 50; // 800
  // if (rec1 === "З" || rec1 === "С" || rec1 === "В" || rec1 === "Ю") thick = 50;

  const styleOutputKey = {
    textAlign: "center",
    height: hBlock / 15.5,
  };

  const styleOutputKlush = {
    fontWeight: 700,
    display: "inline-block",
    color: "#661C8E", // сиреневый
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  };

  const styleOutputHint = {
    fontSize: 11.5,
    color: "#A8A8A8", // серый
    fontWeight: 50,
    display: "inline-block",
  };

  return (
    <Grid container sx={{ border: 0 }}>
      <Grid item xs={12} sx={styleOutputKey}>
        <Box sx={styleAppSt02}>
          <Box sx={styleOutputKlush}>{klush}</Box>{" "}
          {klush && <Box sx={styleOutputHint}>{dir}</Box>}
        </Box>
      </Grid>
    </Grid>
  );
};

export const TakeAreaId = (kluch: string) => {
  let bb = "1";
  let bbb = kluch;
  let aa = kluch.indexOf("-");
  if (aa >= 0) {
    // сложный ключ хх-хх-ххх
    let aaa = kluch.indexOf("-", aa + 1);
    bb = kluch.slice(aa + 1, aaa);
    bbb = kluch.slice(aaa + 1);
  }
  return [Number(bb), Number(bbb)];
};

export const TakeAreaIdd = (kluch: string) => {
  //console.log("1!!!:", kluch);
  let bb = "1";
  let bbb = kluch;
  let bbbb = "";
  let aa = kluch.indexOf("-");
  if (aa >= 0) {
    // сложный ключ хх-хх-ххх-XXX
    let aaa = kluch.indexOf("-", aa + 1);
    let aaaa = kluch.indexOf("-", aaa + 1);
    bb = kluch.slice(aa + 1, aaa);
    bbb = kluch.slice(aaa + 1, aaaa);
    bbbb = kluch.slice(aaaa + 1);
  }
  return [Number(bb), Number(bbb), Number(bbbb)];
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

export const MakeMasDirect = (rec1: string) => {
  let masDirect: Array<string> = [];
  switch (rec1) {
    case "З":
      masDirect = ["ЮЗ⬋", "Ю⬇", "ЮВ⬊", "В➡", "СВ⬈", "С⬆", "СЗ⬉"];
      break;
    case "СЗ":
      masDirect = ["З⬅", "ЮЗ⬋", "Ю⬇", "ЮВ⬊", "В➡", "СВ⬈", "С⬆"];
      break;
    case "С":
      masDirect = ["СЗ⬉", "З⬅", "ЮЗ⬋", "Ю⬇", "ЮВ⬊", "В➡", "СВ⬈"];
      break;
    case "СВ":
      masDirect = ["С⬆", "СЗ⬉", "З⬅", "ЮЗ⬋", "Ю⬇", "ЮВ⬊", "В➡"];
      break;
    case "В":
      masDirect = ["СВ⬈", "С⬆", "СЗ⬉", "З⬅", "ЮЗ⬋", "Ю⬇", "ЮВ⬊"];
      break;
    case "ЮВ":
      masDirect = ["В➡", "СВ⬈", "С⬆", "СЗ⬉", "З⬅", "ЮЗ⬋", "Ю⬇"];
      break;
    case "Ю":
      masDirect = ["ЮВ⬊", "В➡", "СВ⬈", "С⬆", "СЗ⬉", "З⬅", "ЮЗ⬋"];
      break;
    case "ЮЗ":
      masDirect = ["Ю⬇", "ЮВ⬊", "В➡", "СВ⬈", "С⬆", "СЗ⬉", "З⬅"];
  }
  return masDirect;
};

export const AdditionalButton = (
  rec1: string,
  hBlock: number,
  massFlDir: any,
  funcAddKnop: Function
) => {
  let dir = "";
  let find = "";
  let flOpen = 0;
  if (rec1 === "З") {
    dir = "СЗ";
    flOpen = massFlDir[0];
    find = "⬉";
  }
  if (rec1 === "С") {
    dir = "СВ";
    flOpen = massFlDir[1];
    find = "⬈";
  }
  if (rec1 === "В") {
    dir = "ЮВ";
    flOpen = massFlDir[2];
    find = "⬊";
  }
  if (rec1 === "Ю") {
    dir = "ЮЗ";
    flOpen = massFlDir[3];
    find = "⬋";
  }

  const styleAppSt06 = {
    fontSize: 12.1,
    maxHeight: "21px",
    minHeight: "21px",
    backgroundColor: "#E6F5D6",
    color: "black",
    textTransform: "unset !important",
    textAlign: "center",
    boxShadow: 5,
  };

  return (
    <>
      {!flOpen && dir && (
        <Box sx={{ height: hBlock / 15, marginTop: "12px" }}>
          <Button sx={styleAppSt06} onClick={() => funcAddKnop(dir)}>
            Доп.направление {dir} &nbsp; <b>{find}</b>
          </Button>
        </Box>
      )}
    </>
  );
};

export const MakeTflink = (
  homeRegion: any,
  massAreaId: Array<number>,
  massFaz: Array<number>
) => {
  let valAreaZ = massAreaId[0];
  let valIdZ = massAreaId[1];
  let valAreaSZ = massAreaId[2]; //====== new ======
  let valIdSZ = massAreaId[3];
  let valAreaS = massAreaId[4];
  let valIdS = massAreaId[5];
  let valAreaSV = massAreaId[6]; //====== new ======
  let valIdSV = massAreaId[7];
  let valAreaV = massAreaId[8];
  let valIdV = massAreaId[9];
  let valAreaUV = massAreaId[10]; //====== new ======
  let valIdUV = massAreaId[11];
  let valAreaU = massAreaId[12];
  let valIdU = massAreaId[13];
  let valAreaUZ = massAreaId[14]; //====== new ======
  let valIdUZ = massAreaId[15];
  let maskPoints: WayPointsArray = {
    id: "",
    phase: "",
  };
  let maskTflink: Tflink = {
    add1: { id: "", wayPointsArray: [] },
    add2: { id: "", wayPointsArray: [] },
    add3: { id: "", wayPointsArray: [] },
    add4: { id: "", wayPointsArray: [] },
    east: { id: "", wayPointsArray: [] },
    north: { id: "", wayPointsArray: [] },
    south: { id: "", wayPointsArray: [] },
    west: { id: "", wayPointsArray: [] },
  };
  //=== запад ===
  if (valAreaZ && valIdZ) {
    maskTflink.west.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
    if (valAreaUZ && valIdUZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUZ + "-" + valIdUZ;
      maskPoint.phase = massFaz[0].toString();
      maskTflink.west.wayPointsArray.push(maskPoint);
    }
    if (valAreaU && valIdU) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaU + "-" + valIdU;
      maskPoint.phase = massFaz[1].toString();
      maskTflink.west.wayPointsArray.push(maskPoint);
    }
    if (valAreaUV && valIdUV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUV + "-" + valIdUV;
      maskPoint.phase = massFaz[2].toString();
      maskTflink.west.wayPointsArray.push(maskPoint);
    }
    if (valAreaV && valIdV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaV + "-" + valIdV;
      maskPoint.phase = massFaz[3].toString();
      maskTflink.west.wayPointsArray.push(maskPoint);
    }
    if (valAreaSV && valIdSV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSV + "-" + valIdSV;
      maskPoint.phase = massFaz[4].toString();
      maskTflink.west.wayPointsArray.push(maskPoint);
    }
    if (valAreaS && valIdS) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaS + "-" + valIdS;
      maskPoint.phase = massFaz[5].toString();
      maskTflink.west.wayPointsArray.push(maskPoint);
    }
    if (valAreaSZ && valIdSZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSZ + "-" + valIdSZ;
      maskPoint.phase = massFaz[6].toString();
      maskTflink.west.wayPointsArray.push(maskPoint);
    }
  }
  //=== северо-запад ===
  if (valAreaSZ && valIdSZ) {
    maskTflink.add4.id = homeRegion + "-" + valAreaSZ + "-" + valIdSZ;
    if (valAreaZ && valIdZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
      maskPoint.phase = massFaz[7].toString();
      maskTflink.add4.wayPointsArray.push(maskPoint);
    }
    if (valAreaUZ && valIdUZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUZ + "-" + valIdUZ;
      maskPoint.phase = massFaz[8].toString();
      maskTflink.add4.wayPointsArray.push(maskPoint);
    }
    if (valAreaU && valIdU) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaU + "-" + valIdU;
      maskPoint.phase = massFaz[9].toString();
      maskTflink.add4.wayPointsArray.push(maskPoint);
    }
    if (valAreaUV && valIdUV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUV + "-" + valIdUV;
      maskPoint.phase = massFaz[10].toString();
      maskTflink.add4.wayPointsArray.push(maskPoint);
    }
    if (valAreaV && valIdV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaV + "-" + valIdV;
      maskPoint.phase = massFaz[11].toString();
      maskTflink.add4.wayPointsArray.push(maskPoint);
    }
    if (valAreaSV && valIdSV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSV + "-" + valIdSV;
      maskPoint.phase = massFaz[12].toString();
      maskTflink.add4.wayPointsArray.push(maskPoint);
    }
    if (valAreaS && valIdS) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaS + "-" + valIdS;
      maskPoint.phase = massFaz[13].toString();
      maskTflink.add4.wayPointsArray.push(maskPoint);
    }
  }
  //=== север ===
  if (valAreaS && valIdS) {
    maskTflink.north.id = homeRegion + "-" + valAreaS + "-" + valIdS;
    if (valAreaSZ && valIdSZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSZ + "-" + valIdSZ;
      maskPoint.phase = massFaz[14].toString();
      maskTflink.north.wayPointsArray.push(maskPoint);
    }
    if (valAreaZ && valIdZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
      maskPoint.phase = massFaz[15].toString();
      maskTflink.north.wayPointsArray.push(maskPoint);
    }
    if (valAreaUZ && valIdUZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUZ + "-" + valIdUZ;
      maskPoint.phase = massFaz[16].toString();
      maskTflink.north.wayPointsArray.push(maskPoint);
    }
    if (valAreaU && valIdU) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaU + "-" + valIdU;
      maskPoint.phase = massFaz[17].toString();
      maskTflink.north.wayPointsArray.push(maskPoint);
    }
    if (valAreaUV && valIdUV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUV + "-" + valIdUV;
      maskPoint.phase = massFaz[18].toString();
      maskTflink.north.wayPointsArray.push(maskPoint);
    }
    if (valAreaV && valIdV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaV + "-" + valIdV;
      maskPoint.phase = massFaz[19].toString();
      maskTflink.north.wayPointsArray.push(maskPoint);
    }
    if (valAreaSV && valIdSV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSV + "-" + valIdSV;
      maskPoint.phase = massFaz[20].toString();
      maskTflink.north.wayPointsArray.push(maskPoint);
    }
  }
  //=== северo-восток ===
  if (valAreaSV && valIdSV) {
    maskTflink.add1.id = homeRegion + "-" + valAreaSV + "-" + valIdSV;
    if (valAreaS && valIdS) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaS + "-" + valIdS;
      maskPoint.phase = massFaz[21].toString();
      maskTflink.add1.wayPointsArray.push(maskPoint);
    }
    if (valAreaSZ && valIdSZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSZ + "-" + valIdSZ;
      maskPoint.phase = massFaz[22].toString();
      maskTflink.add1.wayPointsArray.push(maskPoint);
    }
    if (valAreaZ && valIdZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
      maskPoint.phase = massFaz[23].toString();
      maskTflink.add1.wayPointsArray.push(maskPoint);
    }
    if (valAreaUZ && valIdUZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUZ + "-" + valIdUZ;
      maskPoint.phase = massFaz[24].toString();
      maskTflink.add1.wayPointsArray.push(maskPoint);
    }
    if (valAreaU && valIdU) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaU + "-" + valIdU;
      maskPoint.phase = massFaz[25].toString();
      maskTflink.add1.wayPointsArray.push(maskPoint);
    }
    if (valAreaUV && valIdUV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUV + "-" + valIdUV;
      maskPoint.phase = massFaz[26].toString();
      maskTflink.add1.wayPointsArray.push(maskPoint);
    }
    if (valAreaV && valIdV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaV + "-" + valIdV;
      maskPoint.phase = massFaz[27].toString();
      maskTflink.add1.wayPointsArray.push(maskPoint);
    }
  }
  //=== восток ===
  if (valAreaV && valIdV) {
    maskTflink.east.id = homeRegion + "-" + valAreaV + "-" + valIdV;
    if (valAreaSV && valIdSV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSV + "-" + valIdSV;
      maskPoint.phase = massFaz[28].toString();
      maskTflink.east.wayPointsArray.push(maskPoint);
    }
    if (valAreaS && valIdS) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaS + "-" + valIdS;
      maskPoint.phase = massFaz[29].toString();
      maskTflink.east.wayPointsArray.push(maskPoint);
    }
    if (valAreaSZ && valIdSZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSZ + "-" + valIdSZ;
      maskPoint.phase = massFaz[30].toString();
      maskTflink.east.wayPointsArray.push(maskPoint);
    }
    if (valAreaZ && valIdZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
      maskPoint.phase = massFaz[31].toString();
      maskTflink.east.wayPointsArray.push(maskPoint);
    }
    if (valAreaUZ && valIdUZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUZ + "-" + valIdUZ;
      maskPoint.phase = massFaz[32].toString();
      maskTflink.east.wayPointsArray.push(maskPoint);
    }
    if (valAreaU && valIdU) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaU + "-" + valIdU;
      maskPoint.phase = massFaz[33].toString();
      maskTflink.east.wayPointsArray.push(maskPoint);
    }
    if (valAreaUV && valIdUV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUV + "-" + valIdUV;
      maskPoint.phase = massFaz[34].toString();
      maskTflink.east.wayPointsArray.push(maskPoint);
    }
  }
  //=== юго-восток ===
  if (valAreaUV && valIdUV) {
    maskTflink.add2.id = homeRegion + "-" + valAreaUV + "-" + valIdUV;
    if (valAreaV && valIdV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaV + "-" + valIdV;
      maskPoint.phase = massFaz[35].toString();
      maskTflink.add2.wayPointsArray.push(maskPoint);
    }
    if (valAreaSV && valIdSV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSV + "-" + valIdSV;
      maskPoint.phase = massFaz[36].toString();
      maskTflink.add2.wayPointsArray.push(maskPoint);
    }
    if (valAreaS && valIdS) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaS + "-" + valIdS;
      maskPoint.phase = massFaz[37].toString();
      maskTflink.add2.wayPointsArray.push(maskPoint);
    }
    if (valAreaSZ && valIdSZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSZ + "-" + valIdSZ;
      maskPoint.phase = massFaz[38].toString();
      maskTflink.add2.wayPointsArray.push(maskPoint);
    }
    if (valAreaZ && valIdZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
      maskPoint.phase = massFaz[39].toString();
      maskTflink.add2.wayPointsArray.push(maskPoint);
    }
    if (valAreaUZ && valIdUZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUZ + "-" + valIdUZ;
      maskPoint.phase = massFaz[40].toString();
      maskTflink.add2.wayPointsArray.push(maskPoint);
    }
    if (valAreaU && valIdU) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaU + "-" + valIdU;
      maskPoint.phase = massFaz[41].toString();
      maskTflink.add2.wayPointsArray.push(maskPoint);
    }
  }
  //=== юг ===
  if (valAreaU && valIdU) {
    maskTflink.south.id = homeRegion + "-" + valAreaU + "-" + valIdU;
    if (valAreaUV && valIdUV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUV + "-" + valIdUV;
      maskPoint.phase = massFaz[42].toString();
      maskTflink.south.wayPointsArray.push(maskPoint);
    }
    if (valAreaV && valIdV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaV + "-" + valIdV;
      maskPoint.phase = massFaz[43].toString();
      maskTflink.south.wayPointsArray.push(maskPoint);
    }
    if (valAreaSV && valIdSV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSV + "-" + valIdSV;
      maskPoint.phase = massFaz[44].toString();
      maskTflink.south.wayPointsArray.push(maskPoint);
    }
    if (valAreaS && valIdS) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaS + "-" + valIdS;
      maskPoint.phase = massFaz[45].toString();
      maskTflink.south.wayPointsArray.push(maskPoint);
    }
    if (valAreaSZ && valIdSZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSZ + "-" + valIdSZ;
      maskPoint.phase = massFaz[46].toString();
      maskTflink.south.wayPointsArray.push(maskPoint);
    }
    if (valAreaZ && valIdZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
      maskPoint.phase = massFaz[47].toString();
      maskTflink.south.wayPointsArray.push(maskPoint);
    }
    if (valAreaUZ && valIdUZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUZ + "-" + valIdUZ;
      maskPoint.phase = massFaz[48].toString();
      maskTflink.south.wayPointsArray.push(maskPoint);
    }
  }
  //=== юго-запад ===
  if (valAreaUZ && valIdUZ) {
    maskTflink.add3.id = homeRegion + "-" + valAreaUZ + "-" + valIdUZ;
    if (valAreaU && valIdU) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaU + "-" + valIdU;
      maskPoint.phase = massFaz[49].toString();
      maskTflink.add3.wayPointsArray.push(maskPoint);
    }
    if (valAreaUV && valIdUV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaUV + "-" + valIdUV;
      maskPoint.phase = massFaz[50].toString();
      maskTflink.add3.wayPointsArray.push(maskPoint);
    }
    if (valAreaV && valIdV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaV + "-" + valIdV;
      maskPoint.phase = massFaz[51].toString();
      maskTflink.add3.wayPointsArray.push(maskPoint);
    }
    if (valAreaSV && valIdSV) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSV + "-" + valIdSV;
      maskPoint.phase = massFaz[52].toString();
      maskTflink.add3.wayPointsArray.push(maskPoint);
    }
    if (valAreaS && valIdS) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaS + "-" + valIdS;
      maskPoint.phase = massFaz[53].toString();
      maskTflink.add3.wayPointsArray.push(maskPoint);
    }
    if (valAreaSZ && valIdSZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints)); //====== new ======
      maskPoint.id = homeRegion + "-" + valAreaSZ + "-" + valIdSZ;
      maskPoint.phase = massFaz[54].toString();
      maskTflink.add3.wayPointsArray.push(maskPoint);
    }
    if (valAreaZ && valIdZ) {
      let maskPoint = JSON.parse(JSON.stringify(maskPoints));
      maskPoint.id = homeRegion + "-" + valAreaZ + "-" + valIdZ;
      maskPoint.phase = massFaz[55].toString();
      maskTflink.add3.wayPointsArray.push(maskPoint);
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
  let klushTo4 = "";
  let klushTo5 = "";
  let klushTo6 = "";
  let klushTo7 = "";
  let valAreaZ = massAreaId[0];
  let valIdZ = massAreaId[1];
  let valAreaSZ = massAreaId[2]; //====== new ======
  let valIdSZ = massAreaId[3];
  let valAreaS = massAreaId[4];
  let valIdS = massAreaId[5];
  let valAreaSV = massAreaId[6]; //====== new ======
  let valIdSV = massAreaId[7];
  let valAreaV = massAreaId[8];
  let valIdV = massAreaId[9];
  let valAreaUV = massAreaId[10]; //====== new ======
  let valIdUV = massAreaId[11];
  let valAreaU = massAreaId[12];
  let valIdU = massAreaId[13];
  let valAreaUZ = massAreaId[14]; //====== new ======
  let valIdUZ = massAreaId[15];

  switch (rec1) {
    case "З":
      if (valAreaZ && valIdZ) {
        klushTo1 = MakingKey(homeRegion, valAreaUZ, valIdUZ);
        klushTo2 = MakingKey(homeRegion, valAreaU, valIdU);
        klushTo3 = MakingKey(homeRegion, valAreaUV, valIdUV);
        klushTo4 = MakingKey(homeRegion, valAreaV, valIdV);
        klushTo5 = MakingKey(homeRegion, valAreaSV, valIdSV);
        klushTo6 = MakingKey(homeRegion, valAreaS, valIdS);
        klushTo7 = MakingKey(homeRegion, valAreaSZ, valIdSZ);
      }
      break;
    case "СЗ":
      if (valAreaSZ && valIdSZ) {
        klushTo1 = MakingKey(homeRegion, valAreaZ, valIdZ);
        klushTo2 = MakingKey(homeRegion, valAreaUZ, valIdUZ);
        klushTo3 = MakingKey(homeRegion, valAreaU, valIdU);
        klushTo4 = MakingKey(homeRegion, valAreaUV, valIdUV);
        klushTo5 = MakingKey(homeRegion, valAreaV, valIdV);
        klushTo6 = MakingKey(homeRegion, valAreaSV, valIdSV);
        klushTo7 = MakingKey(homeRegion, valAreaS, valIdS);
      }
      break;
    case "С":
      if (valAreaS && valIdS) {
        klushTo1 = MakingKey(homeRegion, valAreaSZ, valIdSZ);
        klushTo2 = MakingKey(homeRegion, valAreaZ, valIdZ);
        klushTo3 = MakingKey(homeRegion, valAreaUZ, valIdUZ);
        klushTo4 = MakingKey(homeRegion, valAreaU, valIdU);
        klushTo5 = MakingKey(homeRegion, valAreaUV, valIdUV);
        klushTo6 = MakingKey(homeRegion, valAreaV, valIdV);
        klushTo7 = MakingKey(homeRegion, valAreaSV, valIdSV);
      }
      break;
    case "СВ":
      if (valAreaSV && valIdSV) {
        klushTo1 = MakingKey(homeRegion, valAreaS, valIdS);
        klushTo2 = MakingKey(homeRegion, valAreaSZ, valIdSZ);
        klushTo3 = MakingKey(homeRegion, valAreaZ, valIdZ);
        klushTo4 = MakingKey(homeRegion, valAreaUZ, valIdUZ);
        klushTo5 = MakingKey(homeRegion, valAreaU, valIdU);
        klushTo6 = MakingKey(homeRegion, valAreaUV, valIdUV);
        klushTo7 = MakingKey(homeRegion, valAreaV, valIdV);
      }
      break;
    case "В":
      if (valAreaV && valIdV) {
        klushTo1 = MakingKey(homeRegion, valAreaSV, valIdSV);
        klushTo2 = MakingKey(homeRegion, valAreaS, valIdS);
        klushTo3 = MakingKey(homeRegion, valAreaSZ, valIdSZ);
        klushTo4 = MakingKey(homeRegion, valAreaZ, valIdZ);
        klushTo5 = MakingKey(homeRegion, valAreaUZ, valIdUZ);
        klushTo6 = MakingKey(homeRegion, valAreaU, valIdU);
        klushTo7 = MakingKey(homeRegion, valAreaUV, valIdUV);
      }
      break;
    case "ЮВ":
      if (valAreaUV && valIdUV) {
        klushTo1 = MakingKey(homeRegion, valAreaV, valIdV);
        klushTo2 = MakingKey(homeRegion, valAreaSV, valIdSV);
        klushTo3 = MakingKey(homeRegion, valAreaS, valIdS);
        klushTo4 = MakingKey(homeRegion, valAreaSZ, valIdSZ);
        klushTo5 = MakingKey(homeRegion, valAreaZ, valIdZ);
        klushTo6 = MakingKey(homeRegion, valAreaUZ, valIdUZ);
        klushTo7 = MakingKey(homeRegion, valAreaU, valIdU);
      }
      break;
    case "Ю":
      if (valAreaU && valIdU) {
        klushTo1 = MakingKey(homeRegion, valAreaUV, valIdUV);
        klushTo2 = MakingKey(homeRegion, valAreaV, valIdV);
        klushTo3 = MakingKey(homeRegion, valAreaSV, valIdSV);
        klushTo4 = MakingKey(homeRegion, valAreaS, valIdS);
        klushTo5 = MakingKey(homeRegion, valAreaSZ, valIdSZ);
        klushTo6 = MakingKey(homeRegion, valAreaZ, valIdZ);
        klushTo7 = MakingKey(homeRegion, valAreaUZ, valIdUZ);
      }
      break;
    case "ЮЗ":
      if (valAreaUZ && valIdUZ) {
        klushTo1 = MakingKey(homeRegion, valAreaU, valIdU);
        klushTo2 = MakingKey(homeRegion, valAreaUV, valIdUV);
        klushTo3 = MakingKey(homeRegion, valAreaV, valIdV);
        klushTo4 = MakingKey(homeRegion, valAreaSV, valIdSV);
        klushTo5 = MakingKey(homeRegion, valAreaS, valIdS);
        klushTo6 = MakingKey(homeRegion, valAreaSZ, valIdSZ);
        klushTo7 = MakingKey(homeRegion, valAreaZ, valIdZ);
      }
  }

  return [klushTo1, klushTo2, klushTo3, klushTo4, klushTo5, klushTo6, klushTo7];
};

export const OutputNumFaza = (
  num: number,
  imgFaza: any,
  maxFaza: number,
  hBlock: number
) => {
  const styleOutputFaza01 = {
    fontSize: 36,
    color: "#7620A2", // сиреневый
    textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
  };

  const styleOutputFaza02 = {
    fontSize: 12,
    textAlign: "right",
    height: hBlock / 3,
  };

  const OutputFaza = (img: any) => {
    let widthHeight = (hBlock / 12) * 3.0;
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
        {!img && <Box sx={styleOutputFaza01}>{num}</Box>}
      </>
    );
  };

  return (
    <>
      {num <= maxFaza && (
        <>
          <Grid item xs={0.4} sx={styleOutputFaza02}>
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

export const ReplaceInSvg = (svgPict: any, wh: string) => {
  let svgPipa = svgPict;
  if (svgPict) {
    let widthHeight = "";
    if (wh) {
      widthHeight = wh;
    } else {
      let heightImg = window.innerWidth / 3.333;
      let aa = (heightImg / 100) * 9.5;
      heightImg = heightImg + aa;
      widthHeight = heightImg.toString();
    }

    let ch = "";
    let vxod = svgPict.indexOf("width=");
    for (let i = 0; i < 100; i++) {
      if (isNaN(Number(svgPipa[vxod + 7 + i]))) break;
      ch = ch + svgPipa[vxod + 7 + i];
    }
    for (let i = 0; i < 6; i++) svgPipa = svgPipa.replace(ch, widthHeight);
  }
  return svgPipa;
};

export const OutputPict = (pict: any) => {
  return (
    <Box sx={{ border: 0, boxShadow: 24 }}>
      <div dangerouslySetInnerHTML={{ __html: ReplaceInSvg(pict, "") }} />
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

export const OutPutZZ = (zz: string) => {
  const styleZId = {
    fontSize: 19,
    transform: "rotate(270deg)",
    position: "relative",
    top: "33%",
    color: "blue",
  };

  return (
    <Grid item xs={0.15}>
      <Box sx={styleZId}>
        <b>{zz}</b>
      </Box>
    </Grid>
  );
};

export const OutPutSZ = (sz: string) => {
  return (
    <Grid item xs={4}>
      <Box sx={{ textAlign: "left" }}>
        <b>{sz}</b>
      </Box>
    </Grid>
  );
};

export const OutPutSS = (ss: string) => {
  return (
    <Grid item xs={4}>
      <Box sx={{ textAlign: "center" }}>
        <b>{ss}</b>
      </Box>
    </Grid>
  );
};

export const OutPutSV = (sv: string) => {
  return (
    <Grid item xs={4}>
      <Box sx={{ textAlign: "right" }}>
        <b>{sv}</b>
      </Box>
    </Grid>
  );
};

export const OutTopRow = (sz: string, ss: string, sv: string) => {
  return (
    <Grid container sx={{ color: "blue", marginTop: -2.5 }}>
      {OutPutSZ(sz)}
      {OutPutSS(ss)}
      {OutPutSV(sv)}
    </Grid>
  );
};

export const OutPutUZ = (uz: string) => {
  return (
    <Grid item xs={4}>
      <Box sx={{ textAlign: "left" }}>
        <b>{uz}</b>
      </Box>
    </Grid>
  );
};

export const OutPutUU = (uu: string) => {
  return (
    <Grid item xs={4}>
      <Box sx={{ textAlign: "center" }}>
        <b>{uu}</b>
      </Box>
    </Grid>
  );
};

export const OutPutUV = (uv: string) => {
  return (
    <Grid item xs={4}>
      <Box sx={{ textAlign: "right" }}>
        <b>{uv}</b>
      </Box>
    </Grid>
  );
};

export const OutBottomRow = (uz: string, uu: string, uv: string) => {
  return (
    <Grid container sx={{ color: "blue", marginTop: -0.25 }}>
      {OutPutUZ(uz)}
      {OutPutUU(uu)}
      {OutPutUV(uv)}
    </Grid>
  );
};

export const OutPutVV = (vv: string) => {
  const styleVId = {
    fontSize: 19,
    transform: "rotate(90deg)",
    position: "relative",
    top: "33%",
    color: "blue",
  };

  return (
    <Grid item xs={0.15}>
      <Box sx={styleVId}>
        <b>{vv}</b>
      </Box>
    </Grid>
  );
};

const StrokaMenuFooter = (soob: string, handleClose: Function) => {
  const styleAppBind = {
    fontSize: 14,
    marginRight: 1,
    border: "1px solid #d4d4d4", // серый
    bgcolor: "#E6F5D6", // светло салатовый
    width: (soob.length + 6) * 7,
    maxHeight: "24px",
    minHeight: "24px",
    borderRadius: 1,
    color: "black",
    textTransform: "unset !important",
    //padding: "3px 0px 0px 0px",
    boxShadow: 6,
  };

  return (
    <Box
      sx={{
        marginBottom: "12px",
        display: "inline-block",
        textAlign: "center",
      }}
    >
      <Button sx={styleAppBind} onClick={() => handleClose()}>
        <b>{soob}</b>
      </Button>
    </Box>
  );
};

export const SaveСhange = (
  HAVE: number,
  have: number,
  func1: Function,
  func2: Function
) => {
  return (
    <>
      {HAVE > 0 || have > 0 ? (
        <Box sx={{ margin: "12px 0px 0px 9.5vh", textAlign: "center" }}>
          {StrokaMenuFooter("Отмена", func1)}
          {StrokaMenuFooter("Сохранить изменения", func2)}
        </Box>
      ) : (
        <Box sx={{ marginTop: "12px", height: "37px" }}> </Box>
      )}
    </>
  );
};

export const ViewSvg = (setOpenSvg: Function, pictSvg: any) => {
  const handleClose = () => setOpenSvg(false);

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };

  const stylePKForm01 = {
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: window.innerHeight * 0.9 + 10,
    bgcolor: "background.paper",
    border: "1px solid #FFFFFF",
    borderRadius: 1,
    boxShadow: 24,
    textAlign: "center",
    padding: "10px 5px 5px 5px",
  };

  const styleWindPK04 = {
    border: "1px solid #d4d4d4",
    marginTop: 1,
    bgcolor: "#F1F5FB",
    height: window.innerHeight * 0.9 + 4,
    borderRadius: 1,
    overflowX: "auto",
    boxShadow: 6,
  };

  const styleModalEnd = {
    position: "absolute",
    top: "0%",
    left: "auto",
    right: "-0.0%",
    height: "21px",
    maxWidth: "2%",
    minWidth: "2%",
    color: "#7620a2", // сиреневый
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  };

  let lngth = Math.round(window.innerHeight * 0.9).toString();
  let expSvg = ReplaceInSvg(pictSvg, lngth);

  return (
    <Modal open={true} onClose={CloseEnd} hideBackdrop={false}>
      <Box sx={stylePKForm01}>
        <Button sx={styleModalEnd} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleWindPK04}>
          <div dangerouslySetInnerHTML={{ __html: expSvg }} />
        </Box>
      </Box>
    </Modal>
  );
};

//=== ToDoMode =====================================
export const CircleObj = () => {
  const circle = {
    bgcolor: "#C585E7", // светло-сиреневый
    width: 18,
    height: 18,
    border: 3,
    justifyContent: "center",
    marginTop: 1.0,
    marginLeft: 0.6,
    borderRadius: 9,
    borderColor: "#7620A2", // сереневый
    boxShadow: 5,
  };

  return (
    <Box sx={{ height: 36 }}>
      <Box sx={circle}></Box>
    </Box>
  );
};
//=== Разное =======================================
export const InputDirect = (func: any) => {
  const styleSetNapr = {
    width: "185px",
    maxHeight: "1px",
    minHeight: "1px",
    bgcolor: "#BAE186",
    border: "1px solid #93D145",
    borderRadius: 1,
    boxShadow: 6,
    paddingTop: 1.5,
    paddingBottom: 1.2,
    textAlign: "center",
  };

  const styleBoxFormNapr = {
    "& > :not(style)": {
      marginTop: "-12px",
      width: "185px",
    },
  };
  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    !BAN && setCurrency(Number(event.target.value));
    switch (Number(event.target.value)) {
      case 0: // заголовок
        func(51);
        setCurrency(1);
        break;
      case 1: // режим управления
        func(51);
        break;
      case 2: // режим назначения
        func(52);
        break;
      case 3: // режим Показать связи
        func(54);
        break;
      case 4: // Настройки
        func(1);
        setCurrency(0);
        break;
      case 5: // режим Demo
        func(55);
    }
  };

  let dat = [
    "Режимы работы:",
    "● Режим управления",
    "● Режим назначения",
    "● Показать связи",
    "● Настройки",
    "● Режим Демо",
  ];
  let massKey = [];
  let massDat: any[] = [];
  const currencies: any = [];
  for (let key in dat) {
    massKey.push(key);
    massDat.push(dat[key]);
  }
  for (let i = 0; i < massKey.length; i++)
    currencies.push({ value: massKey[i], label: massDat[i] });

  const [currency, setCurrency] = React.useState(1);

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
              fontSize: 15,
              fontWeight: 500,
              color: currency === 5 ? "red" : currency === 0 ? "blue" : "black",
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
                fontSize: 15,
                color:
                  option.label === "● Режим Демо"
                    ? "red"
                    : option.label === "Режимы работы:"
                    ? "blue"
                    : "black",
                cursor: option.label === "Режимы работы:" ? "none" : "pointer",
                fontWeight: option.label === "Режимы работы:" ? 800 : 300,
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
    marginLeft: 0.2,
    width: 185,
  };

  return <Box sx={styleApp01}>{InputDirect(func)}</Box>;
};

export const StrokaHelp = (soobInfo: string, mode: number) => {
  let dlSoob = (soobInfo.length + 9) * 8;
  let moder = mode ? "left" : "right";

  const styleInfoSoob = {
    width: dlSoob,
    color: "#E6761B", // оранж
    textAlign: moder,
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    fontWeight: 500,
  };

  return (
    <Box sx={styleInfoSoob}>
      <em>{soobInfo}</em>
    </Box>
  );
};
