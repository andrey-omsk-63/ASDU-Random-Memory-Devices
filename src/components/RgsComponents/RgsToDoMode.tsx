import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { massfazCreate, statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { Fazer } from "../../App";

import { OutputFazaImg, OutputVertexImg } from "../RgsServiceFunctions";
import { CircleObj } from "../RgsServiceFunctions";

import { SendSocketRoute, SendSocketDispatch } from "../RgsSocketFunctions";

//import { styleModalEnd } from "../MainMapStyle";
import { styleModalMenu, styleStrokaTablImg } from "./GsComponentsStyle";
import { styleToDoMode, styleStrokaTabl } from "./GsComponentsStyle";
import { styleStrokaTakt } from "./GsComponentsStyle";

let init = true;
let lengthMassMem = 0;
let timerId: any[] = [];

let massInt: any[][] = []; //null
let oldFaz = -1;

const RgsToDoMode = (props: {
  massMem: Array<number>;
  massCoord: any;
  funcMode: any;
  funcSize: any;
  funcCenter: any;
  funcHelper: any;
  trigger: boolean;
  changeFaz: number;
  ban: Function;
}) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let addobj = useSelector((state: any) => {
    const { addobjReducer } = state;
    return addobjReducer.addobj.dateAdd;
  });
  let bindings = useSelector((state: any) => {
    const { bindingsReducer } = state;
    return bindingsReducer.bindings.dateBindings;
  });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  //console.log("TODOmassfaz", massfaz);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const DEMO = datestat.demo;
  const homeRegion = datestat.region;
  const dispatch = useDispatch();
  //========================================================
  const [trigger, setTrigger] = React.useState(true);

  const handleCloseSetEnd = () => {
    datestat.finish = false; // закончить исполнение
    dispatch(statsaveCreate(datestat));
    props.funcSize(11.99);
    props.funcMode(0);
    props.ban(false);
    init = true;
    oldFaz = -1;
    lengthMassMem = 0;
  };

  const MakeMaskFaz = (i: number) => {
    let maskFaz: Fazer = {
      idx: 0,
      area: 0,
      id: 0,
      faza: 0,
      fazaSist: -1,
      phases: [],
      idevice: 0,
      name: "",
      starRec: false,
      runRec: 0,
      img: [],
    };
    maskFaz.idx = props.massMem[i];
    if (maskFaz.idx >= map.tflight.length) {
      maskFaz.name =
        addobj.addObjects[maskFaz.idx - map.tflight.length].description; // объект
      maskFaz.area = addobj.addObjects[maskFaz.idx - map.tflight.length].area;
      maskFaz.id = addobj.addObjects[maskFaz.idx - map.tflight.length].id;
    } else {
      maskFaz.name = map.tflight[maskFaz.idx].description; // перекрёсток
      maskFaz.area = Number(map.tflight[maskFaz.idx].area.num);
      maskFaz.id = map.tflight[maskFaz.idx].ID;
      maskFaz.idevice = map.tflight[maskFaz.idx].idevice;
    }
    maskFaz.img = datestat.phSvg[0]; // для отладки
    return maskFaz;
  };

  const RunVertex = (mode: number) => {
    let faz = massfaz[mode];
    console.log(mode + 1 + "-й светофор пошёл", DEMO, timerId[mode]);
    !DEMO && SendSocketDispatch(debug, ws, faz.idevice, 9, faz.faza);
    //=====================================
    let timer = debug ? 15000 : 30000;
    timerId[mode] = setInterval(() => DoTimerId(mode), timer); // 60000
    massInt[mode].push(JSON.parse(JSON.stringify(timerId[mode])));
    //=====================================
    // massfaz[mode].runRec = DEMO ? 4 : 2;
    // dispatch(massfazCreate(massfaz));
    let massIdevice: Array<number> = [];
    for (let i = 1; i < massfaz.length - 1; i++) {
      massIdevice.push(massfaz[i].idevice);
    }
    !DEMO && SendSocketRoute(debug, ws, massIdevice, true);
  };

  const FindFaza = () => {
    let mode = lengthMassMem - 2;
    let faz = massfaz[mode];
    let fazIn = massfaz[lengthMassMem - 3];
    let fazOn = massfaz[lengthMassMem - 1];
    let klu = homeRegion + "-" + faz.area + "-" + faz.id;
    let kluIn = homeRegion + "-" + fazIn.area + "-" + fazIn.id;
    let kluOn = homeRegion + "-" + fazOn.area + "-" + fazOn.id;
    let numRec = -1;
    for (let i = 0; i < bindings.tfLinks.length; i++) {
      if (bindings.tfLinks[i].id === klu) {
        numRec = i;
        break;
      }
    }
    let mass = bindings.tfLinks[numRec].tflink;
    let inFaz = [];
    if (mass.west.id === kluIn) inFaz = mass.west.wayPointsArray;
    if (mass.north.id === kluIn) inFaz = mass.north.wayPointsArray;
    if (mass.east.id === kluIn) inFaz = mass.east.wayPointsArray;
    if (mass.south.id === kluIn) inFaz = mass.south.wayPointsArray;
    for (let i = 0; i < inFaz.length; i++) {
      if (inFaz[i].id === kluOn) faz.faza = Number(inFaz[i].phase);
    }
    dispatch(massfazCreate(massfaz));
    RunVertex(mode);
  };

  const FindEnd = () => {
    let ch = 0;
    for (let i = 0; i < massfaz.length; i++) {
      if (massfaz[i].id <= 10000) {
        let runREC = massfaz[i].runRec;
        if (runREC === 0 || runREC === 2 || runREC === 4) ch++;
      }
    }
    //console.log("CH:", ch, massfaz);
    if (!ch) {
      console.log("Финиш");
      handleCloseSetEnd();
    }
  };

  const ToDoMode = (mode: number) => {
    let massIdevice: Array<number> = [];
    if (mode) {
      for (let i = 1; i < massfaz.length - 1; i++) {
        massIdevice.push(massfaz[i].idevice);
      }
      !DEMO && SendSocketRoute(debug, ws, massIdevice, true); // выполнение режима
      props.funcMode(mode);
      setTrigger(!trigger);
    } else {
      // принудительное закрытие
      for (let i = 0; i < timerId.length; i++) {
        if (timerId[i]) {
          for (let j = 0; j < massInt[i].length; j++) {
            if (massInt[i][j]) {
              clearInterval(massInt[i][j]);
              massInt[i][j] = null;
            }
          }
          timerId[i] = null;
        }
      }
      console.log("Финиш", timerId, massInt);
      for (let i = 0; i < massfaz.length; i++) {
        if (massfaz[i].runRec === 2) {
          !DEMO && SendSocketDispatch(debug, ws, massfaz[i].idevice, 9, 9);
          massfaz[mode].runRec = 1;
        }
      }
      dispatch(massfazCreate(massfaz));
      !DEMO && SendSocketRoute(debug, ws, massIdevice, false);
      handleCloseSetEnd();
    }
  };

  const StrokaHeader = (xss: number, soob: string) => {
    return (
      <Grid item xs={xss} sx={{ fontSize: 14, textAlign: "center" }}>
        <b>{soob}</b>
      </Grid>
    );
  };

  const DoTimerId = (mode: number) => {
    let fazer = massfaz[mode];
    console.log("Отправка с " + String(mode + 1) + "-го", DEMO, timerId);
    if (!DEMO) {
      SendSocketDispatch(debug, ws, fazer.idevice, 9, fazer.faza);
    } else {
      massfaz[mode].faza = fazer.faza === 2 ? 1 : 2;
      console.log('massfaz[mode].faza:',mode,massfaz[mode].faza)
      dispatch(massfazCreate(massfaz));
      setTrigger(!trigger);
    }
    for (let i = 0; i < massInt[mode].length - 1; i++) {
      if (massInt[mode][i]) {
        clearInterval(massInt[mode][i]);
        massInt[mode][i] = null;
      }
    }
    massInt[mode] = massInt[mode].filter(function (el: any) {
      return el !== null;
    });
  };

  const StrokaTabl = () => {
    const ClickKnop = (mode: number) => {
      props.funcCenter(props.massCoord[mode]);
      setTrigger(!trigger);
    };

    const ClickVertex = (mode: number) => {
      let fazer = massfaz[mode];
      if (fazer.runRec === 0) {
        console.log(mode + 1 + "-й светофор пошёл!!!", timerId[mode]);
        if (!DEMO) {
          !DEMO && SendSocketDispatch(debug, ws, fazer.idevice, 9, fazer.faza);
        } else {
          // massfaz[mode].faza = fazer.faza === 2 ? 1 : 2;
          // dispatch(massfazCreate(massfaz));
          // setTrigger(!trigger);
        }
        //============
        // let timer = debug ? 15000 : 30000;
        // timerId[mode] = setInterval(() => DoTimerId(mode), timer); // 60000
        // massInt[mode].push(JSON.parse(JSON.stringify(timerId[mode])));
        //============
        massfaz[mode].runRec = DEMO ? 4 : 2;
      } else {
        if (fazer.runRec === 2) {
          console.log(mode + 1 + "-й светофор закрыт", timerId[mode]);
          !DEMO && SendSocketDispatch(debug, ws, fazer.idevice, 9, 9);
          for (let i = 0; i < massInt[mode].length; i++) {
            if (massInt[mode][i]) {
              clearInterval(massInt[mode][i]);
              massInt[mode][i] = null;
            }
          }
          timerId[mode] = null;
          massfaz[mode].runRec = DEMO ? 5 : 1;
          console.log("@@@", massfaz[mode].runRec);
        }
      }
      dispatch(massfazCreate(massfaz));
      FindEnd();
      setTrigger(!trigger);
    };

    let resStr = [];
    for (let i = 0; i < massfaz.length; i++) {
      let runREC = massfaz[i].runRec;
      let bull = runREC === 2 || runREC === 4 ? " •" : " ";
      let host = "https://localhost:3000/18.svg";
      if (DEMO && debug) {
        //console.log("###:",i,bull,runREC)
        host = "https://localhost:3000/1.svg";
        if (bull === " •" && runREC === 2)
          host = "https://localhost:3000/2.svg";
        if (bull !== " •" && runREC === 5)
          host = "https://localhost:3000/2.svg";
      }
      if (!debug && massfaz[i].id <= 10000) {
        let num = map.tflight[massfaz[i].idx].tlsost.num.toString();
        if (DEMO) {
          num = "1";
          if (bull === " •" && runREC === 2) num = "2";
          if (bull !== " •" && runREC === 5) num = "2";
        }
        host =
          window.location.origin + "/free/img/trafficLights/" + num + ".svg";
      }
      let star = "";
      let takt = massfaz[i].faza;
      console.log('ФАЗА:',i,massfaz[i].faza)
      if (!massfaz[i].faza) takt = "";
      let fazaImg: null | string = null;
      debug && (fazaImg = datestat.phSvg[0]); // для отладки
      let pictImg: any = "";
      if (massfaz[i].faza) pictImg = OutputFazaImg(fazaImg);
      if (massfaz[i].id > 10000) pictImg = CircleObj();

      resStr.push(
        <Grid key={i} container sx={{ marginTop: 1 }}>
          <Grid item xs={1} sx={{ paddingTop: 0.7, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleStrokaTabl}
              onClick={() => ClickKnop(i)}
            >
              {i + 1}
            </Button>
          </Grid>

          <Grid item xs={1.2} sx={{ fontSize: 27, textAlign: "right" }}>
            {star}
          </Grid>
          <Grid item xs={1.0} sx={{}}>
            {massfaz[i].runRec === 1 && massfaz[i].id <= 10000 && (
              <>{OutputVertexImg(host)}</>
            )}
            {massfaz[i].runRec !== 1 && massfaz[i].id <= 10000 && (
              <Button
                variant="contained"
                sx={styleStrokaTablImg}
                onClick={() => ClickVertex(i)}
              >
                {OutputVertexImg(host)}
              </Button>
            )}
          </Grid>
          <Grid item xs={0.4} sx={{ fontSize: 30, marginLeft: 1 }}>
            {bull}
          </Grid>

          <Grid item xs={1.1} sx={styleStrokaTakt}>
            {takt}
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            {pictImg}
          </Grid>

          <Grid item xs sx={{ fontSize: 14 }}>
            {massfaz[i].name}
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  //=== инициализация ======================================
  if (init) {
    massfaz = [];
    timerId = [];
    massInt = [];
    for (let i = 0; i < props.massMem.length; i++) {
      massfaz.push(MakeMaskFaz(i));
      timerId.push(null);
    }
    for (let i = 0; i < props.massMem.length; i++) {
      massInt.push(JSON.parse(JSON.stringify(timerId)));
    }
    init = false;
    lengthMassMem = props.massMem.length;
    FindFaza();
    oldFaz = props.changeFaz;
  } else {
    if (lengthMassMem !== props.massMem.length) {
      massfaz.push(MakeMaskFaz(props.massMem.length - 1));
      timerId.push(null);
      let mass = [];
      for (let i = 0; i < props.massMem.length; i++) mass.push(null);
      massInt.push(mass);
      lengthMassMem = props.massMem.length;
      FindFaza();
    }
    if (props.changeFaz !== oldFaz) {
      let mode = props.changeFaz;
      console.log(mode + 1 + "-й светофор закрыт", timerId[mode]);
      !DEMO && SendSocketDispatch(debug, ws, massfaz[mode].idevice, 9, 9);
      for (let i = 0; i < massInt[mode].length; i++) {
        if (massInt[mode][i]) {
          clearInterval(massInt[mode][i]);
          massInt[mode][i] = null;
        }
      }
      timerId[mode] = null;
      oldFaz = props.changeFaz;
      FindEnd();
    }
  }
  //========================================================
  const CheckRun = React.useCallback(() => {
    //console.log("Запуск проверки");
    for (let i = 0; i < massfaz.length; i++) {
      const TmOut = (mode: number) => {
        setTimeout(() => {
          massfaz[i].runRec = mode;
          dispatch(massfazCreate(massfaz));
          setTrigger(!trigger);
        }, 5000);
      };
      if (massfaz[i].runRec === 4) TmOut(2);
      if (massfaz[i].runRec === 5) TmOut(1);
    }
  }, [massfaz, dispatch, trigger]);

  React.useEffect(() => {
    DEMO && CheckRun();
  }, [DEMO, CheckRun, props.changeFaz, trigger]);

  console.log('Перересовка')

  return (
    <>
      <Box sx={styleToDoMode}>
        <Grid container sx={{ marginTop: 0 }}>
          <Grid item xs sx={{ fontSize: 18, textAlign: "center" }}>
            Режим:{" "}
            <b>
              произвольная {'"'}зелёная улица{'"'}
            </b>
            {DEMO && (
              <Box sx={{ fontSize: 15, color: "red" }}>
                {"( "}демонстрационный{" )"}
              </Box>
            )}
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 1 }}>
          <Grid container sx={{ bgcolor: "#C0E2C3" }}>
            {StrokaHeader(1, "Номер")}
            {StrokaHeader(3.6, "Состояние")}
            {StrokaHeader(1.9, "Фаза")}
            {StrokaHeader(5.5, "ДК")}
          </Grid>
          <Box
            sx={{
              overflowX: "auto",
              height: DEMO ? "78vh" : "81vh",
            }}
          >
            {StrokaTabl()}
          </Box>
          <Box sx={{ marginTop: 1.5, textAlign: "center" }}>
            <Button sx={styleModalMenu} onClick={() => ToDoMode(0)}>
              Закончить исполнение
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RgsToDoMode;
