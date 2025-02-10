import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { BadExit, ExitCross, FooterContent } from "../RgsServiceFunctions";
import { StrTablVert, ShiftOptimal } from "../RgsServiceFunctions";
import { PreparCurrenciesDispVert } from "../RgsServiceFunctions";
import { InputFromList, WaysInput } from "../RgsServiceFunctions";

import { styleSetPK03 } from "./../MainMapStyle";
import { styleSetPK01, styleSetPK02 } from "./../MainMapStyle";

let massForm: any = null;
let flagInput = true;
let HAVE = 0;

let typeRoute = 0; // тип отображаемых связей 1 - mаршрутизированные  0 - неформальные
let typeVert = 0; // тип отображаемых CO на карте 0 - значки СО 1 - номер фаз 2 - картинка фаз
let intervalFaza = 0; // Задаваемая длительность фазы ДУ (сек)
let intervalFazaDop = 0; // Увеличениение длительности фазы ДУ (сек)
let currenciesDV: any = [];

const GsSetup = (props: { close: Function }) => {
  //== Piece of Redux =======================================
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const dispatch = useDispatch();
  //========================================================
  const [open, setOpen] = React.useState(true);
  const [badExit, setBadExit] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  //=== инициализация ======================================
  if (flagInput) {
    HAVE = 0;
    massForm = JSON.parse(JSON.stringify(datestat));
    massForm.ws = datestat.ws;
    intervalFaza = datestat.intervalFaza;
    intervalFazaDop = datestat.intervalFazaDop;
    typeVert = datestat.typeVert;
    currenciesDV = PreparCurrenciesDispVert();
    flagInput = false;
  }
  //========================================================
  const [currencyDV, setCurrencyDV] = React.useState(typeVert.toString());

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
      //записать в LocalStorage
      typeRoute = massForm.typeRoute ? 1 : 0;
      window.localStorage.typeRoute = typeRoute; // тип отображаемых связей
      window.localStorage.typeVert = typeVert; // тип отображаемых CO на карте
      window.localStorage.intervalFaza = intervalFaza; // задаваемая длительность фазы ДУ (сек)
      window.localStorage.intervalFazaDop = intervalFazaDop; // увеличениение длительности фазы ДУ (сек)
      //записать в datestat
      datestat = massForm;
      dispatch(statsaveCreate(datestat));
      handleClose();
    } else handleCloseBad();
  };

  const Haver = () => {
    HAVE++;
    setTrigger(!trigger); // ререндер
  };

  const ChangeTypeRoute = () => {
    massForm.typeRoute = !massForm.typeRoute;
    Haver();
  };

  const handleChangeDV = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyDV(event.target.value);
    massForm.typeVert = typeVert = Number(event.target.value);
    Haver();
  };

  const SetInterval = (valueInp: number) => {
    massForm.intervalFaza = intervalFaza = valueInp; // задаваемая длительность фазы ДУ (сек)
    if(!intervalFaza) massForm.intervalFazaDop = intervalFazaDop = 0; // увеличениение длительности фазы ДУ (сек)
    Haver();
  };

  const SetIntervalDop = (valueInp: number) => {
    if(massForm.intervalFaza)
    {massForm.intervalFazaDop = intervalFazaDop = valueInp; // увеличениение длительности фазы ДУ (сек)
    Haver();}
  };
  //========================================================
  const SetupContent = () => {
    return (
      <>
        <Box sx={{ fontSize: 12, color: "#5B1080" }}>
          Тип отображаемых связей
        </Box>
        {StrTablVert(
          7.7,
          "Маршрутизированные (неформальные) связи",
          ShiftOptimal(massForm.typeRoute, ChangeTypeRoute, -0.1)
        )}
        <Box sx={{ fontSize: 12, marginTop: 0.5, color: "#5B1080" }}>
          Отображение светофорных объектов на маршруте
        </Box>
        {StrTablVert(
          7.7,
          "Светофоры отображаются",
          InputFromList(handleChangeDV, currencyDV, currenciesDV)
        )}
        <Box sx={{ fontSize: 12, marginTop: 0.5, color: "#5B1080" }}>
          Параметры перекрёстков
        </Box>
        {StrTablVert(
          7.7,
          "Задаваемая длительность фазы ДУ (сек)",
          WaysInput(0, massForm.intervalFaza, SetInterval, 0, 1000)
        )}
        {StrTablVert(
          7.7,
          "Увеличениение длительности фазы ДУ (сек)",
          WaysInput(0, massForm.intervalFazaDop, SetIntervalDop, 0, 1000)
        )}
      </>
    );
  };

  return (
    <>
      <Modal open={open} onClose={CloseEnd} hideBackdrop={false}>
        <Box sx={styleSetPK01(580, 319)}>
          {ExitCross(handleCloseBad)}
          <Box sx={styleSetPK02}>
            <b>Системные параметры по умолчанию</b>
          </Box>
          <Box sx={styleSetPK03}>{SetupContent()}</Box>
          {HAVE > 0 && <>{FooterContent(SaveForm)}</>}
        </Box>
      </Modal>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
    </>
  );
};

export default GsSetup;
