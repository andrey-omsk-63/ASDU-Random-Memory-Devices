import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { massfazCreate, statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import GsErrorMessage from "./RgsErrorMessage";

import { Fazer } from "../../App";
//import { PressESC } from "../MainMapRgs";
import { NoClose, MaskFaz } from "../MapConst";

import { OutputFazaImg, OutputVertexImg } from "../RgsServiceFunctions";
import { CircleObj, TakeAreaId } from "../RgsServiceFunctions";

import { SendSocketRoute, SendSocketDispatch } from "../RgsSocketFunctions";

import { styleModalMenu, styleStrokaTablImg } from "./GsComponentsStyle";
import { styleStrokaTabl01, styleStrokaTakt } from "./GsComponentsStyle";
import { styleStrokaTabl02, StyleToDoMode } from "./GsComponentsStyle";
import { styleToDo01, styleToDo02, styleToDo03 } from "./GsComponentsStyle";

let init = true;
let lengthMassMem = 0;
let timerId: any[] = [];
let massInt: any[][] = []; // null

let oldFaz = -1;
let needRend = false;
let nomIllum = -1;
const tShadow = "2px 2px 3px rgba(0,0,0,0.3)";

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
  changeDemo: Function;
  pererisovka: Function; // функция перерисовки рабочего маршрута
}) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
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
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const dispatch = useDispatch();
  const debug = datestat.debug;
  const ws = datestat.ws;
  const DEMO = datestat.demo;
  const styleToDoMode = StyleToDoMode(DEMO);

  //console.log("1RgsToDoMode:", datestat.massPath);

  //========================================================
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [trigger, setTrigger] = React.useState(true);
  const [flagPusk, setFlagPusk] = React.useState(false);
  let timer = debug || DEMO ? 20000 : 60000;
  let hTabl = DEMO ? "78vh" : "81vh";

  const MakeMaskFaz = (i: number) => {
    let maskFaz: Fazer = JSON.parse(JSON.stringify(MaskFaz));

    maskFaz.idx = props.massMem[i];
    if (maskFaz.idx >= map.tflight.length) {
      let index = maskFaz.idx - map.tflight.length; // объект
      maskFaz.name = addobj.addObjects[index].description;
      maskFaz.area = addobj.addObjects[index].area;
      maskFaz.id = addobj.addObjects[index].id;
    } else {
      maskFaz.name = map.tflight[maskFaz.idx].description; // перекрёсток
      maskFaz.area = Number(map.tflight[maskFaz.idx].area.num);
      maskFaz.id = map.tflight[maskFaz.idx].ID;
      maskFaz.idevice = map.tflight[maskFaz.idx].idevice;
      maskFaz.coordinates[0] = map.tflight[maskFaz.idx].points.Y;
      maskFaz.coordinates[1] = map.tflight[maskFaz.idx].points.X;
      if (i) {
        datestat.massPath.push(maskFaz.coordinates); // не начало маршрута
        dispatch(statsaveCreate(datestat));
      }
    }
    if (maskFaz.id < 10000) {
      for (let j = 0; j < massdk.length; j++) {
        if (massdk[j].area === maskFaz.area && massdk[j].ID === maskFaz.id) {
          maskFaz.img = massdk[j].phSvg;
          break;
        }
      }
    }
    return maskFaz;
  };
  //========================================================
  const ForcedClearInterval = () => {
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
  };

  const handleCloseSetEnd = () => {
    datestat.finish = false; // закончить исполнение
    datestat.massPath = null; // точки рабочего маршрута
    dispatch(statsaveCreate(datestat));
    props.funcSize(11.99);
    props.funcMode(0);
    props.ban(false);
    init = true;
    oldFaz = -1;
    lengthMassMem = 0;
    DEMO && ForcedClearInterval();
  };
  //========================================================
  const ToDoMode = (mode: number) => {
    let massIdevice: Array<number> = [];
    if (mode) {
      massIdevice.push(massfaz[mode].idevice);
      !DEMO && SendSocketRoute(debug, ws, massIdevice, true); // выполнение режима
      props.funcMode(mode);
      setTrigger(!trigger);
    } else {
      // принудительное закрытие
      ForcedClearInterval();

      console.log("Принудительный Финиш:", timerId, massInt);

      for (let i = 0; i < massfaz.length; i++) {
        if (massfaz[i].runRec === 2) {
          !DEMO && SendSocketDispatch(debug, ws, massfaz[i].idevice, 9, 9);
          massfaz[i].runRec = 1;
          massIdevice.push(massfaz[i].idevice);
        }
      }
      !DEMO && SendSocketRoute(debug, ws, massIdevice, false);
      dispatch(massfazCreate(massfaz));
      handleCloseSetEnd();
    }
  };

  const RunVertex = (mode: number) => {
    let fazer = massfaz[mode];
    timerId[mode] = setInterval(() => DoTimerId(mode), timer); // 60000
    massInt[mode].push(JSON.parse(JSON.stringify(timerId[mode])));
    ToDoMode(mode);
    //=========================================================================
    console.log(mode + 1 + "-й светофор АКТИВИРОВАН", timerId[mode]);

    if (DEMO) {
      massfaz[mode].fazaSist = fazer.faza;
      dispatch(massfazCreate(massfaz));
    } else SendSocketDispatch(debug, ws, fazer.idevice, 9, fazer.faza);
    massfaz[mode].runRec = DEMO ? 4 : 2;
    //=========================================================================
    console.log(mode + 1 + "-й светофор", DEMO, massfaz[mode].runRec);

    if (DEMO) massfaz[mode].faza = massfaz[mode].fazaBegin;
    setTrigger(!trigger);
  };

  const FindFaza = () => {
    let mode = lengthMassMem - 2;
    let faz = massfaz[mode];
    let klu = faz.id;
    let kluIn = massfaz[lengthMassMem - 3].id;
    let kluOn = massfaz[lengthMassMem - 1].id;

    let numRec = -1;
    for (let i = 0; i < bindings.tfLinks.length; i++) {
      if (TakeAreaId(bindings.tfLinks[i].id)[1] === klu) {
        numRec = i;
        break;
      }
    }
    let mass = bindings.tfLinks[numRec].tflink;
    let inFaz = [];

    if (TakeAreaId(mass.west.id)[1] === kluIn) inFaz = mass.west.wayPointsArray;
    if (TakeAreaId(mass.north.id)[1] === kluIn)
      inFaz = mass.north.wayPointsArray;
    if (TakeAreaId(mass.east.id)[1] === kluIn) inFaz = mass.east.wayPointsArray;
    if (TakeAreaId(mass.south.id)[1] === kluIn)
      inFaz = mass.south.wayPointsArray;
    if (TakeAreaId(mass.add1.id)[1] === kluIn) inFaz = mass.add1.wayPointsArray;
    if (TakeAreaId(mass.add2.id)[1] === kluIn) inFaz = mass.add2.wayPointsArray;
    if (TakeAreaId(mass.add3.id)[1] === kluIn) inFaz = mass.add3.wayPointsArray;
    if (TakeAreaId(mass.add4.id)[1] === kluIn) inFaz = mass.add4.wayPointsArray;

    for (let i = 0; i < inFaz.length; i++) {
      if (TakeAreaId(inFaz[i].id)[1] === kluOn) {
        faz.faza = Number(inFaz[i].phase);
        faz.fazaBegin = faz.faza;
      }
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
    !ch && handleCloseSetEnd();
  };

  const CloseVertex = (idx: number) => {
    if (!DEMO) {
      SendSocketDispatch(debug, ws, massfaz[idx].idevice, 9, 9);
      let massIdevice: Array<number> = [];
      massIdevice.push(massfaz[idx].idevice);
      SendSocketRoute(debug, ws, massIdevice, false); // завершенение режима
    }
    for (let i = 0; i < massInt[idx].length; i++) {
      if (massInt[idx][i]) {
        clearInterval(massInt[idx][i]);
        massInt[idx][i] = null;
      }
    }
    timerId[idx] = null;
    massfaz[idx].runRec = DEMO ? 5 : 1;
    FindEnd();

    console.log(
      idx + 1 + "-й светофор закрыт!!!",
      props.changeFaz,
      massfaz[idx].runRec,
      timerId[idx]
    );
  };

  //===========================================================================================
  //=== ИНИЦИАЛИЗАЦИЯ ======================================
  if (init) {
    massfaz = [];
    timerId = [];
    massInt = [];
    nomIllum = -1;
    datestat.massPath = []; // точки рабочего маршрута
    dispatch(statsaveCreate(datestat));
    for (let i = 0; i < props.massMem.length; i++) {
      massfaz.push(MakeMaskFaz(i));
      timerId.push(null);
    }
    for (let i = 0; i < props.massMem.length; i++)
      massInt.push(JSON.parse(JSON.stringify(timerId)));
    init = false;
    lengthMassMem = props.massMem.length;
    FindFaza();
    oldFaz = props.changeFaz;
  } else {
    // console.log(
    //   "2RgsToDoMode:",
    //   props.changeFaz,
    //   PressESC,
    //   lengthMassMem,
    //   props.massMem.length,
    //   oldFaz
    // );

    if (lengthMassMem && !props.massMem.length) {
      ToDoMode(0); // в списке 3 светофора/объекта и нажато ESC
    } else {
      if (lengthMassMem !== props.massMem.length) {
        timerId.push(null); // появился новый перекрёсток
        massfaz.push(MakeMaskFaz(props.massMem.length - 1));
        let mass = [];
        for (let i = 0; i < props.massMem.length; i++) mass.push(null);
        massInt.push(mass);
        lengthMassMem = props.massMem.length;
        FindFaza();
      }

      //console.log("3RgsToDoMode:", props.changeFaz, oldFaz);

      if (props.changeFaz !== oldFaz) {
        let runrec = massfaz[props.changeFaz - 1].runRec;
        console.log("!!!Закрыть", props.changeFaz, oldFaz, runrec);
        // if (massfaz[props.changeFaz - 1].runRec > 1) {
        //   console.log("!!!НЕЛЬЗЯ");
        //   setOpenSoobErr(true);
        // } else {
        CloseVertex((oldFaz = props.changeFaz));
        setTrigger(!trigger);
        //}
      }

      dispatch(massfazCreate(massfaz));
    }
  }
  //========================================================
  const StrokaHeader = (xss: number, soob: string) => {
    return (
      <Grid item xs={xss} sx={{ fontSize: 14, textAlign: "center" }}>
        <b>{soob}</b>
      </Grid>
    );
  };

  const DoTimerId = (mode: number) => {
    let fazer = massfaz[mode];

    //console.log("Отправка с " + String(mode + 1) + "-го", DEMO, timerId,fazer.fazaSist);

    if (!DEMO) {
      fazer.runRec === 2 &&
        SendSocketDispatch(debug, ws, fazer.idevice, 9, fazer.faza);
    } else {
      // if (!fazer.runRec || fazer.runRec === 5 || fazer.runRec === 1) {
      //   if (fazer.fazaSist < 0) {
      //     massfaz[mode].fazaSist = 1;
      //   } else {
      //     console.log('переворот фазы:',fazer.fazaSist)
      //     fazer.fazaSist = fazer.fazaSist === 2 ? 1 : 2;
      //   }
      // } else massfaz[mode].fazaSist = fazer.faza;

      if (!fazer.runRec || fazer.runRec === 5 || fazer.runRec === 1) {
        fazer.fazaSist = fazer.faza;
      } else {
        if (fazer.fazaSist < 0) {
          massfaz[mode].fazaSist = 1;
        } else fazer.fazaSist = fazer.fazaSist === 2 ? 1 : 2;
      }
      dispatch(massfazCreate(massfaz));
      props.changeDemo(mode);
      needRend = true;
      setFlagPusk(!flagPusk);
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
      nomIllum = mode;
      props.funcCenter(props.massCoord[mode]);
      setTrigger(!trigger);
    };

    const ClickVertex = (mode: number) => {
      let fazer = massfaz[mode];

      console.log("1ClickVertex:", mode, fazer.runRec, props.massMem, massfaz);

      if (mode > 0) {
        console.log("2ClickVertex:", mode, mode - 1, massfaz[mode - 1].runRec);
        if (massfaz[mode - 1].runRec > 1) {
          console.log("НЕЛЬЗЯ");
          setOpenSoobErr(true);
        } else {
          console.log(
            "3###МОЖНО",
            JSON.parse(JSON.stringify(datestat.massPath))
          );
          if (datestat.massPath) {
            if (datestat.massPath.length) {
              datestat.massPath.splice(0, 1); // удалить первый элемент
              console.log(
                "5###МОЖНО",
                JSON.parse(JSON.stringify(datestat.massPath))
              );
              dispatch(statsaveCreate(datestat));
            }
          }
          console.log(
            "4###МОЖНО",
            JSON.parse(JSON.stringify(datestat.massPath))
          );
          props.pererisovka(true);

          CloseVertex(mode);
          dispatch(massfazCreate(massfaz));
          setTrigger(!trigger);
        }
      }
    };

    return massfaz.map((massf: any, idx: number) => {
      let runREC = massf.runRec;
      let bull = runREC === 2 || runREC === 4 ? " •" : " ";
      let hostt =
        window.location.origin.slice(0, 22) === "https://localhost:3000"
          ? "https://localhost:3000/"
          : "./";
      let host = hostt + "18.svg";
      if (DEMO && debug) {
        host = hostt + "1.svg";
        if (bull === " •" && runREC === 2) host = hostt + "2.svg";
        if (bull !== " •" && runREC === 5) host = hostt + "2.svg";
      }
      if (!debug && massf.id <= 10000) {
        let num = map.tflight[massf.idx].tlsost.num.toString();
        if (DEMO) {
          num = "1";
          if (bull === " •" && runREC === 2) num = "2";
          if (bull !== " •" && runREC === 5) num = "2";
        }
        host =
          window.location.origin + "/free/img/trafficLights/" + num + ".svg";
      }
      let star = "";
      let takt = massf.faza;
      if (!massf.faza) takt = "";
      let fazaImg: null | string = null;
      fazaImg = massf.img[takt - 1];
      let pictImg: any = "";
      if (massf.faza) pictImg = OutputFazaImg(fazaImg, massf.faza);
      let illum = nomIllum === idx ? styleStrokaTabl01 : styleStrokaTabl02;

      //console.log('###::',idx,massf.runRec,massf)

      return (
        <Grid key={idx} container sx={{ marginTop: 1 }}>
          <Grid item xs={1} sx={{ paddingTop: 0.7, textAlign: "center" }}>
            <Button sx={illum} onClick={() => ClickKnop(idx)}>
              {idx + 1}
            </Button>
          </Grid>
          <Grid item xs={1.2} sx={{ fontSize: 27, textAlign: "right" }}>
            {star}
          </Grid>
          <Grid item xs={1.0} sx={{}}>
            {massf.runRec <= 1 && massf.id <= 10000 && (
              <>{OutputVertexImg(host)}</>
            )}
            {massf.id > 10000 && <>{CircleObj()}</>}
            {massf.runRec > 1 && massf.id <= 10000 && (
              <Button sx={styleStrokaTablImg} onClick={() => ClickVertex(idx)}>
                {OutputVertexImg(host)}
              </Button>
            )}
          </Grid>
          <Grid item xs={0.4} sx={styleToDo03}>
            {bull}
          </Grid>
          <Grid item xs={1.1} sx={styleStrokaTakt}>
            {takt}
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            {pictImg}
          </Grid>
          <Grid item xs sx={{ fontSize: 14, padding: "6px 0px 0px 0px" }}>
            {massf.name}
          </Grid>
        </Grid>
      );
    });
  };
  //========================================================
  const CheckRun = React.useCallback(() => {
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
  }, [DEMO, CheckRun,datestat]);

  if (needRend) {
    needRend = false;
    setFlagPusk(!flagPusk);
  }

  return (
    <>
      <Box sx={styleToDoMode}>
        <Grid container sx={{ marginTop: 0 }}>
          <Grid item xs sx={styleToDo02}>
            <em>
              Режим:{" "}
              <b>
                произвольная {'"'}зелёная улица{'"'}
              </b>
            </em>
            {DEMO && (
              <Box sx={{ fontSize: 15, color: "red" }}>
                {"( "}демонстрационный{" )"}
              </Box>
            )}
          </Grid>
        </Grid>
        <Box sx={styleToDo01}>
          <Grid container sx={{ bgcolor: "#B8CBB9" }}>
            {StrokaHeader(1, "Номер")}
            {StrokaHeader(3.6, "Состояние")}
            {StrokaHeader(1.9, "Фаза")}
            {StrokaHeader(5.5, "ДК")}
          </Grid>
          <Box sx={{ overflowX: "auto", height: hTabl, textShadow: tShadow }}>
            {StrokaTabl()}
          </Box>
        </Box>
        <Box sx={{ marginTop: 0.5, textAlign: "center" }}>
          <Button sx={styleModalMenu} onClick={() => ToDoMode(0)}>
            Закончить исполнение
          </Button>
        </Box>
      </Box>
      {openSoobErr && (
        <GsErrorMessage setOpen={setOpenSoobErr} sErr={NoClose} />
      )}
    </>
  );
};

export default RgsToDoMode;
