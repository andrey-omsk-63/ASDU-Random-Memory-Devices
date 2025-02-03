import * as React from "react";
import { useSelector } from "react-redux";
//import { statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import GsErrorMessage from "./RgsErrorMessage";

import { ExitCross } from "../RgsServiceFunctions";
// import { StrTablVert, ShiftOptimal } from "../RgsServiceFunctions";
// import { PreparCurrenciesDispVert } from "../RgsServiceFunctions";
// import { InputFromList, WaysInput } from "../RgsServiceFunctions";

// import { styleSetPK03 } from "./../MainMapStyle";
import { styleSetPK01, styleSetPK02 } from "./../MainMapStyle";

// let massForm: any = null;
// let flagInput = true;
// let HAVE = 0;

// let typeRoute = 0; // тип отображаемых связей 1 - mаршрутизированные  0 - неформальные
// let typeVert = 0; // тип отображаемых CO на карте 0 - значки СО 1 - номер фаз 2 - картинка фаз
// let intervalFaza = 0; // Задаваемая длительность фазы ДУ (сек)
// let intervalFazaDop = 0; // Увеличениение длительности фазы ДУ (сек)
// let currenciesDV: any = [];

const GsFragments = (props: { close: Function }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  // let datestat = useSelector((state: any) => {
  //   const { statsaveReducer } = state;
  //   return statsaveReducer.datestat;
  // });
  //const dispatch = useDispatch();
  //========================================================
  const [open, setOpen] = React.useState(true);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  //const [badExit, setBadExit] = React.useState(false);
  //const [trigger, setTrigger] = React.useState(false);
  //=== инициализация ======================================
  // if (flagInput) {
  //   HAVE = 0;
  //   massForm = JSON.parse(JSON.stringify(datestat));
  //   massForm.ws = datestat.ws;
  //   intervalFaza = datestat.intervalFaza;
  //   intervalFazaDop = datestat.intervalFazaDop;
  //   typeVert = datestat.typeVert;
  //   currenciesDV = PreparCurrenciesDispVert();
  //   flagInput = false;
  // }
  //========================================================
  // const [currencyDV, setCurrencyDV] = React.useState(typeVert.toString());

  const handleClose = () => {
    setOpen(false);
    props.close(false);
  };

  // const handleCloseBad = () => {
  //   HAVE && setBadExit(true);
  //   !HAVE && handleClose();
  // };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };

  //if (!map.fragments) setOpenSoobErr(true);
  //=== Функции - обработчики ==============================

  const SetOpenSoobErr = (mode: boolean) => {
    console.log("SetOpenSoobErr:", mode);
    setOpenSoobErr(false);
    props.close(false);
  };

  //========================================================

  let soobErr =
    "Нет фрагментов Яндекс-карты для вашего аккаунта, создайте на главной странице системы";

  console.log("!!!!!!:", openSoobErr, map.fragments);

  return (
    <>
      <Modal open={open} onClose={CloseEnd} hideBackdrop={false}>
        <Box sx={styleSetPK01(580, 319)}>
          {ExitCross(handleClose)}
          <Box sx={styleSetPK02}>
            <b>Системные параметры по умолчанию</b>
          </Box>
          {/* <Box sx={styleSetPK03}>{SetupContent()}</Box>
          {HAVE > 0 && <>{FooterContent(SaveForm)}</>} */}
        </Box>
      </Modal>
      {openSoobErr ? (
        <GsErrorMessage setOpen={SetOpenSoobErr} sErr={soobErr} />
      ) : (
        <h1>Ку-ку</h1>
      )}
    </>
  );
};

export default GsFragments;
