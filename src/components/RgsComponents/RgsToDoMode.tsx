import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { massfazCreate, statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import GsErrorMessage from "./RgsErrorMessage";
import GsFieldOfMiracles from "./GsFieldOfMiracles";

import { Fazer } from "../../App";
import { PressESC } from "../MainMapRgs";
import { NoClose, MaskFaz } from "../MapConst";

import { HeaderTabl, OutputFazaImg, TakeAreaId } from "../RgsServiceFunctions";
import { HeadingTabl } from "../RgsServiceFunctions";

import { SendSocketRoute, SendSocketDispatch } from "../RgsSocketFunctions";

import { styleModalMenu, styleStrokaTabl03 } from "./GsComponentsStyle";
import { styleStrokaTabl01, styleStrokaTakt } from "./GsComponentsStyle";
import { styleStrokaTabl02, StyleToDoMode } from "./GsComponentsStyle";
import { styleToDo01, styleToDo03 } from "./GsComponentsStyle";

let init = true;
let lengthMassMem = 0;
let timerId: any[] = [];
let massInt: any[][] = []; // null

let oldFaz = -1;
let needRend = false;
let nomIllum = -1;
let soobError = "";

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
  //========================================================
  const debug = datestat.debug;
  const DEMO = datestat.demo;
  const styleToDoMode = StyleToDoMode(DEMO);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [trigger, setTrigger] = React.useState(true);
  const [flagPusk, setFlagPusk] = React.useState(false);
  const scRef: any = React.useRef(null);
  const LastEntryRef: any = React.useRef(null);
  let intervalFaza = datestat.intervalFaza; // Задаваемая длительность фазы ДУ (сек)
  let intervalFazaDop = datestat.intervalFazaDop; // Увеличениение длительности фазы ДУ (сек)
  if (!datestat.counterFaza) intervalFaza = intervalFazaDop = 0; // наличие счётчика длительность фазы ДУ
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
      maskFaz.coordinates = addobj.addObjects[index].dgis;
    } else {
      maskFaz.name = map.tflight[maskFaz.idx].description; // перекрёсток
      maskFaz.area = Number(map.tflight[maskFaz.idx].area.num);
      maskFaz.id = map.tflight[maskFaz.idx].ID;
      maskFaz.idevice = map.tflight[maskFaz.idx].idevice;
      maskFaz.coordinates[0] = map.tflight[maskFaz.idx].points.Y;
      maskFaz.coordinates[1] = map.tflight[maskFaz.idx].points.X;
    }
    if (i) {
      datestat.massPath.push(maskFaz.coordinates); // не начало маршрута
      dispatch(statsaveCreate(datestat));
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

  const ForcedClearInterval = () => {
    // сброс таймеров отправки фаз
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
    // сброс таймеров счётчиков длительности фаз
    for (let i = 0; i < datestat.timerId.length; i++) {
      if (datestat.timerId[i]) {
        for (let j = 0; j < datestat.massInt[i].length; j++) {
          if (datestat.massInt[i][j]) {
            clearInterval(datestat.massInt[i][j]);
            datestat.massInt[i][j] = null;
          }
        }
        datestat.timerId[i] = null;
      }
    }
    dispatch(statsaveCreate(datestat));
  };

  const handleCloseSetEnd = () => {
    ForcedClearInterval(); // обнуление всех интервалов и остановка всех таймеров
    datestat.finish = false; // закончить исполнение
    datestat.massPath = null; // точки рабочего маршрута
    dispatch(statsaveCreate(datestat));
    props.funcMode(0);
    props.funcSize(11.99);
    props.ban(false);
    init = true;
    oldFaz = -1;
    lengthMassMem = 0;
    massfaz = [];
    dispatch(massfazCreate(massfaz));
  };

  const RemovalFromTheRoute = () => {
    if (datestat.massPath) {
      if (datestat.massPath.length) {
        datestat.massPath.splice(0, 1); // удалить первый элемент
        dispatch(statsaveCreate(datestat));
      }
    }
    props.pererisovka(true);
  };
  //====== Таймеры ========================================
  const DoTimerCount = (mode: number) => {
    if (datestat.counterId[mode]) {
      for (let i = 0; i < datestat.massInt[mode].length - 1; i++) {
        if (datestat.massInt[mode][i]) {
          clearInterval(datestat.massInt[mode][i]);
          datestat.massInt[mode][i] = null;
        }
      }
      datestat.massInt[mode] = datestat.massInt[mode].filter(function (
        el: any
      ) {
        return el !== null;
      });
      if (massfaz[mode].fazaSist > 0) datestat.counterId[mode]--; // счётчик
      if (!datestat.counterId[mode]) {
        console.log("Нужно послать КУ на", mode + 1); // остановка и очистка счётчика
        for (let i = 0; i < datestat.massInt[mode].length; i++) {
          if (datestat.massInt[mode][i]) {
            clearInterval(datestat.massInt[mode][i]);
            datestat.massInt[mode][i] = null;
          }
        }
        datestat.timerId[mode] = null;
        RemovalFromTheRoute();
        CloseVertex(mode); // закрыть светофор
      }
      dispatch(statsaveCreate(datestat));
      needRend = true; // нужен ререндеринг
      setFlagPusk(!flagPusk);
    }
  };

  const DoTimerId = (mode: number) => {
    let fazer = massfaz[mode];
    if (!DEMO) {
      fazer.runRec === 2 && SendSocketDispatch(fazer.idevice, 9, fazer.faza);
    } else {
      if (!fazer.runRec || fazer.runRec === 5 || fazer.runRec === 1) {
        fazer.fazaSist = fazer.faza; // начало или финиш
      } else {
        if (fazer.fazaSist < 0) {
          massfaz[mode].fazaSist = 1;
        } else fazer.fazaSist = fazer.fazaSist === 2 ? 1 : 2;
      }
      dispatch(massfazCreate(massfaz));
      props.changeDemo(mode);
      needRend = true; // нужен ререндеринг
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
  //=======================================================
  const ToDoMode = (mode: number) => {
    let massIdevice: Array<number> = [];
    if (mode) {
      massIdevice.push(massfaz[mode].idevice);
      !DEMO && SendSocketRoute(massIdevice, true); // выполнение режима
      props.funcMode(mode); // сбросить PressESC
      setTrigger(!trigger);
    } else {
      console.log("Принудительный Финиш:"); // принудительное закрытие
      for (let i = 0; i < massfaz.length; i++) {
        if (massfaz[i].runRec === 2) {
          !DEMO && SendSocketDispatch(massfaz[i].idevice, 9, 9);
          massfaz[i].runRec = 1;
          massIdevice.push(massfaz[i].idevice);
        }
      }
      !DEMO && SendSocketRoute(massIdevice, false);
      dispatch(massfazCreate(massfaz));
      handleCloseSetEnd();
    }
  };

  const RunVertex = (mode: number) => {
    // запуск таймеров отправки фаз
    timerId[mode] = setInterval(() => DoTimerId(mode), timer); // 60000
    massInt[mode].push(JSON.parse(JSON.stringify(timerId[mode])));
    // запуск таймеров счётчиков длительности фаз
    if (intervalFaza) {
      datestat.timerId[mode] = setInterval(() => DoTimerCount(mode), 1000);
      datestat.massInt[mode].push(
        JSON.parse(JSON.stringify(datestat.timerId[mode]))
      );
      dispatch(statsaveCreate(datestat));
    }
    //=========================================================================
    ToDoMode(mode);
    console.log(mode + 1 + "-й светофор АКТИВИРОВАН", timerId[mode], massfaz);

    let fazer = massfaz[mode];
    if (DEMO) {
      massfaz[mode].fazaSist = fazer.faza;
    } else SendSocketDispatch(fazer.idevice, 9, fazer.faza);
    massfaz[mode].runRec = DEMO ? 4 : 2;
    dispatch(massfazCreate(massfaz));
    //=========================================================================
    if (DEMO) massfaz[mode].faza = massfaz[mode].fazaBegin;
    console.log(mode + 1 + "-й светофор", DEMO, mode, massfaz[mode].runRec);

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
    if (massfaz.length > 2) {
      for (let i = 0; i < massfaz.length; i++) {
        if (i && massfaz[i].id <= 10000)
          if (massfaz[i].runRec === 2 || massfaz[i].runRec === 4) ch++;
      }
    }
    !ch && handleCloseSetEnd();
  };

  const CloseVertex = (idx: number) => {
    nomIllum = idx;
    for (let i = 0; i < massInt[idx].length; i++) {
      if (massInt[idx][i]) {
        clearInterval(massInt[idx][i]);
        massInt[idx][i] = null;
      }
      if (datestat.massInt[idx][i]) {
        clearInterval(datestat.massInt[idx][i]);
        datestat.massInt[idx][i] = null;
      }
    }
    timerId[idx] = null;
    datestat.timerId[idx] = null;
    if (!DEMO) {
      SendSocketDispatch(massfaz[idx].idevice, 9, 9);
      let massIdevice: Array<number> = [];
      massIdevice.push(massfaz[idx].idevice);
      SendSocketRoute(massIdevice, false); // завершенение режима
    }
    massfaz[idx].runRec = DEMO ? 5 : 1;
    massfaz[idx].fazaSist = -1;

    console.log(idx + 1 + "-й светофор закрыт!!!");

    dispatch(statsaveCreate(datestat));
    dispatch(massfazCreate(massfaz));
    FindEnd();
  };
  //====== ИНИЦИАЛИЗАЦИЯ ====================================================================
  if (init) {
    if (datestat.start) {
      massfaz = []; // первое вхождение
      timerId = [];
      massInt = [];
      nomIllum = -1;
      datestat.start = false; // первая точка маршрута
      datestat.massPath = []; // точки рабочего маршрута
      datestat.counterId = []; // счётчик длительности фаз
      datestat.timerId = []; // массив времени отправки команд на счётчики
      datestat.massInt = []; // массив интервалов отправки команд на счётчики

      for (let i = 0; i < props.massMem.length; i++) {
        massfaz.push(MakeMaskFaz(i));
        timerId.push(null);
        datestat.counterId.push(intervalFaza); // длительность фазы ДУ
        datestat.timerId.push(null); // массив времени отправки команд
      }
      for (let i = 0; i < props.massMem.length; i++) {
        massInt.push(JSON.parse(JSON.stringify(timerId)));
        datestat.massInt.push(JSON.parse(JSON.stringify(datestat.timerId)));
      }
      dispatch(statsaveCreate(datestat));
      init = false;
      lengthMassMem = props.massMem.length;
      FindFaza();
      oldFaz = props.changeFaz;
      nomIllum = massfaz.length - 1;
    }
  } else {
    if (lengthMassMem && !props.massMem.length) {
      ToDoMode(0); // в списке 3 светофора/объекта и нажато ESC
    } else {
      if (PressESC) {
        massfaz.pop(); // удалим из массива последний элемент - удаление светофора из списка c хвоста
        let idx = massfaz.length - 1;
        datestat.counterId.pop();
        datestat.counterId[idx] = intervalFaza;
        CloseVertex(idx);
        if (massfaz.length) {
          massfaz[idx].runRec = massfaz[idx].faza = massfaz[idx].fazaBegin = 0;
          massfaz[idx].fazaSist = massfaz[idx].fazaSistOld = -1;
          dispatch(massfazCreate(massfaz));
        }
        props.funcMode(lengthMassMem - 2); // сбросить PressESC
        lengthMassMem--;
        setTrigger(!trigger);
      } else {
        if (lengthMassMem < props.massMem.length) {
          console.log("появился новый перекрёсток");
          setTimeout(() => {
            LastEntryRef.current && LastEntryRef.current.scrollIntoView(); // 👇️ scroll to bottom
          }, 150);
          timerId.push(null); // появился новый перекрёсток
          massfaz.push(MakeMaskFaz(props.massMem.length - 1));
          nomIllum = massfaz.length - 1;
          let mass = Array(props.massMem.length).fill(null);
          massInt.push(mass);
          let leng = datestat.counterId.length;
          let intFaza = JSON.parse(JSON.stringify(intervalFaza));
          if (leng > 2 && intervalFaza < datestat.counterId[leng - 2]) {
            intFaza =
              JSON.parse(JSON.stringify(datestat.counterId[leng - 2])) + 1;
            datestat.counterId[leng - 1] = intFaza; // длительность фазы ДУ предпоследнего объекта
          }
          datestat.counterId.push(intervalFaza); // длительность фазы ДУ последнего объекта
          datestat.timerId.push(null); // массив времени отправки команд
          let mas = Array(props.massMem.length).fill(null);
          datestat.massInt.push(mas);
          lengthMassMem = props.massMem.length;
          FindFaza();
          props.pererisovka(true);
        }
        if (props.changeFaz !== oldFaz) {
          CloseVertex((oldFaz = props.changeFaz));
          setTimeout(() => {
            scRef.current && scRef.current.scrollTo(0, nomIllum * 56);
          }, 150);
        }
        dispatch(massfazCreate(massfaz));
        dispatch(statsaveCreate(datestat));
      }
    }
  }
  //====== Компоненты =====================================
  const StrokaTabl = () => {
    const ClickKnop = (mode: number) => {
      nomIllum = mode;
      props.funcCenter(props.massCoord[mode]);
      setTrigger(!trigger);
    };

    const ClickVertex = (mode: number) => {
      if (mode > 0) {
        if (
          massfaz[mode - 1].runRec !== 0 && // 0 -начало
          massfaz[mode - 1].runRec !== 1 && // 1 - финиш
          massfaz[mode - 1].runRec !== 5 // 5 - финиш Демо
        ) {
          soobError = NoClose;
          setOpenSoobErr(true);
        } else {
          RemovalFromTheRoute(); // МОЖНО закрыть
          CloseVertex(mode);
          setTrigger(!trigger);
        }
      }
    };

    const ClickBox = (idx: number) => {
      if (props.massMem.length - 1 === idx) {
        props.funcMode(-1); // удалить "хвост" маршрута
      } else {
        soobError = "Данный светофор из маршрута удалять нельзя";
        setOpenSoobErr(true);
      }
    };

    const ClickAddition = (idx: number) => {
      for (let i = 0; i < datestat.counterId.length - 1; i++) {
        if (i === idx) datestat.counterId[i] += intervalFazaDop;
        if (i > idx && datestat.counterId[i] < datestat.counterId[idx])
          datestat.counterId[i] = datestat.counterId[i - 1] + 1;
      }
      dispatch(statsaveCreate(datestat));
      setTrigger(!trigger);
    };

    return massfaz.map((massf: any, idx: number) => {
      let runREC = JSON.parse(JSON.stringify(massf.runRec));
      let bull = runREC === 2 || runREC === 4 ? " •" : " ";
      let takt: any = massf.faza;
      if (!massf.faza) takt = "";
      let fazaImg: null | string = null;
      fazaImg = massf.img[takt - 1];
      let pictImg: any = "";
      if (massf.faza) pictImg = OutputFazaImg(fazaImg, massf.faza);
      let illum = nomIllum === idx ? styleStrokaTabl01 : styleStrokaTabl02;

      return (
        <Grid key={idx} container sx={styleStrokaTabl03}>
          <Grid item xs={0.8} sx={{ paddingTop: 0.7, textAlign: "center" }}>
            <Button sx={illum} onClick={() => ClickKnop(idx)}>
              {massf.id}
            </Button>
          </Grid>
          <GsFieldOfMiracles
            idx={idx}
            func={ClickAddition}
            ClVert={ClickVertex}
            ClBox={ClickBox}
          />
          <Grid item xs={0.2} sx={styleToDo03}>
            {bull}
          </Grid>
          <Grid item xs={1.0} sx={styleStrokaTakt}>
            {takt}
          </Grid>
          <Grid item xs={2} sx={{ height: "78px", textAlign: "center" }}>
            {pictImg}
          </Grid>
          <Grid item xs sx={{ fontSize: 14, padding: "6px 0 0 0" }}>
            {massf.name}
          </Grid>
        </Grid>
      );
    });
  };
  //========================================================
  if (DEMO) {
    for (let i = 0; i < massfaz.length; i++) {
      if (massfaz[i].runRec === 4) massfaz[i].runRec = 2;
      if (massfaz[i].runRec === 5) massfaz[i].runRec = 1;
    }
    dispatch(massfazCreate(massfaz));
  }
  if (needRend) {
    needRend = false; // задать ререндеринг
    setFlagPusk(!flagPusk);
  }

  return (
    <>
      <Box sx={styleToDoMode}>
        {HeadingTabl(DEMO)}
        <Box sx={styleToDo01}>
          {HeaderTabl()}
          <Box ref={scRef} sx={{ overflowX: "auto", height: hTabl }}>
            {StrokaTabl()}
            <div ref={LastEntryRef} />
          </Box>
        </Box>
        <Box sx={{ marginTop: 0.5, textAlign: "center" }}>
          <Button sx={styleModalMenu} onClick={() => ToDoMode(0)}>
            Закончить исполнение
          </Button>
        </Box>
      </Box>
      {openSoobErr && (
        <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobError} />
      )}
    </>
  );
};

export default RgsToDoMode;
