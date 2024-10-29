import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
//import { massplanCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { BadExit } from "../RgsServiceFunctions";
// import { FooterContent, BadExit, WaysInput } from "./../MapServiceFunctions";
// import { StrTablVert, ShiftOptimal, ExitCross } from "./../MapServiceFunctions";
// import { PreparCurrenciesFaza, InputFromList } from "./../MapServiceFunctions";

// import { MaxFaz } from "./../MapConst";

//import { Setuper } from "./../../interfacePlans.d"; // интерфейс

// import { styleSetPK03 } from "./../MainMapStyle";
// import { styleSetPK01, styleSetPK02 } from "./../MainMapStyle";

// let maskForm: Setuper = {
//   sumPhases: 3, // количество фаз
//   minDuration: 8, // миним. длительность фазы
//   optimal: false, // участие в автоматической оптимизации
//   satur: 3636, // поток насыщения(т.е./ч.)
//   intens: 600, // интенсивность(т.е./ч.)
//   peregon: 250, // Длинна перегона(м)
//   dispers: 50, // Дисперсия пачки(%)
//   offsetBeginGreen: 8, // Смещ.начала зелёного(сек)
//   offsetEndGreen: 0, // Смещ.конца зелёного(сек)
//   wtStop: 0, // Вес остановки
//   wtDelay: 0, // Вес задержки
// };

let currenciesFaza: any = [];
let massForm: any = null;
let flagInput = true;
let HAVE = 0;

const GsSetup = (props: { close: Function }) => {
  //== Piece of Redux =======================================
  // let massplan = useSelector((state: any) => {
  //   const { massplanReducer } = state;
  //   return massplanReducer.massplan;
  // });
  const dispatch = useDispatch();
  //========================================================
  const [open, setOpen] = React.useState(true);
  const [badExit, setBadExit] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  //=== инициализация ======================================
  if (flagInput) {
    HAVE = 0;
    //currenciesFaza = PreparCurrenciesFaza(MaxFaz);
    //massForm = JSON.parse(JSON.stringify(massplan.setup));
    flagInput = false;
  }
  //========================================================
  const [currencyFaza, setCurrencyFaza] = React.useState("1");

  const handleClose = () => {
    flagInput = true;
    setOpen(false);
    props.close(false);
  };

  const handleCloseBad = () => {
    HAVE && setBadExit(true);
    !HAVE && handleClose();
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleCloseBad();
  };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && handleClose(); // выход без сохранения
  };
  //=== Функции - обработчики ==============================
  const SaveForm = (mode: number) => {
    if (mode) {
      //massplan.setup = massForm;
      //dispatch(massplanCreate(massplan));
      handleClose();
    } else handleCloseBad();
  };

  const Haver = () => {
    HAVE++;
    setTrigger(!trigger); // ререндер
  };

  const SetMinDuration = (valueInp: number) => {
    massForm.minDuration = valueInp;
    Haver();
  };

  const ChangeOptimal = () => {
    massForm.optimal = !massForm.optimal;
    Haver();
  };

  const SetSatur = (valueInp: number) => {
    massForm.satur = valueInp; // поток насыщения(т.е./ч.)
    Haver();
  };

  const SetIntens = (valueInp: number) => {
    massForm.intens = valueInp;
    Haver();
  };

  const SetDispers = (valueInp: number) => {
    massForm.dispers = valueInp;
    Haver();
  };

  const SetOffsetBeginGreen = (valueInp: number) => {
    massForm.offsetBeginGreen = valueInp;
    Haver();
  };

  const SetOffsetEndGreen = (valueInp: number) => {
    massForm.offsetEndGreen = valueInp;
    Haver();
  };

  const SetWtStop = (valueInp: number) => {
    massForm.wtStop = valueInp;
    Haver();
  };

  const SetWtDelay = (valueInp: number) => {
    massForm.wtDelay = valueInp;
    Haver();
  };

  const handleChangeFaza = (event: React.ChangeEvent<HTMLInputElement>) => {
    massForm.sumPhases = Number(event.target.value) + 2;
    HAVE++;
    setCurrencyFaza(event.target.value);
  };
  //========================================================
  const VertexContent = () => {
    return (
      <>
        <Box sx={{ fontSize: 12, color: "#5B1080" }}>Параметры перекрёстка</Box>
        {/* {StrTablVert(
          9,
          "Количество фаз",
          InputFromList(handleChangeFaza, currencyFaza, currenciesFaza)
        )}
        {StrTablVert(
          9,
          "Минимальная длительность фазы",
          WaysInput(0, massForm.minDuration, SetMinDuration, 0, 10000)
        )}
        {StrTablVert(
          9,
          "Участвует в автоматической оптимизации",
          ShiftOptimal(massForm.optimal, ChangeOptimal, -0.1)
        )} */}
      </>
    );
  };

  const DirectContent = () => {
    return (
      <>
        <Box sx={{ fontSize: 12, marginTop: 0.5, color: "#5B1080" }}>
          Параметры направлений
        </Box>
        {/* {StrTablVert(
          9,
          "Насыщение(т.е./ч.)",
          WaysInput(0, massForm.satur, SetSatur, 0, 10000)
        )}
        {StrTablVert(
          9,
          "Средняя интенсивность(т.е./ч.)",
          WaysInput(0, massForm.intens, SetIntens, 0, 10000)
        )}
        {StrTablVert(
          9,
          "Дисперсия пачки(%)",
          WaysInput(0, massForm.dispers, SetDispers, 0, 100)
        )}
        {StrTablVert(
          9,
          "Смещ.начала зелёного(сек)",
          WaysInput(0, massForm.offsetBeginGreen, SetOffsetBeginGreen, 0, 20)
        )}
        {StrTablVert(
          9,
          "Смещ.конца зелёного(сек)",
          WaysInput(0, massForm.offsetEndGreen, SetOffsetEndGreen, 0, 20)
        )}
        {StrTablVert(
          9,
          "Вес остановки",
          WaysInput(0, massForm.wtStop, SetWtStop, 0, 10)
        )}
        {StrTablVert(
          9,
          "Вес задержки",
          WaysInput(0, massForm.wtDelay, SetWtDelay, 0, 10)
        )} */}
      </>
    );
  };

  const styleSetPK01 = (wdth: number, hdth: number) => {
    const styleSetPK01 = {
      outline: "none",
      position: "absolute",
      left: "50%",
      top: "45%",
      transform: "translate(-50%, -50%)",
      width: wdth,
      height: hdth,
      bgcolor: "background.paper",
      border: "1px solid #FFFFFF",
      borderRadius: 1,
      boxShadow: 24,
      textAlign: "center",
      padding: "1px 10px 10px 10px",
    };
    return styleSetPK01;
  };

  return (
    <>
      <Modal open={open} onClose={CloseEnd} hideBackdrop={false}>
        <Box sx={styleSetPK01(500, 505)}>
          {/* {ExitCross(handleCloseBad)}
          <Box sx={styleSetPK02}>
            <b>Системные параметры по умолчанию</b>
          </Box>
          <Box sx={styleSetPK03}>
            {VertexContent()}
            {DirectContent()}
          </Box>
          {HAVE > 0 && <>{FooterContent(SaveForm)}</>} */}
        </Box>
      </Modal>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
    </>
  );
};

export default GsSetup;
