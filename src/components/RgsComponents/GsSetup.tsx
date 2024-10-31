import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { BadExit, ExitCross, FooterContent } from "../RgsServiceFunctions";
import { StrTablVert, ShiftOptimal } from "../RgsServiceFunctions";

import { styleSetPK03 } from "./../MainMapStyle";
import { styleSetPK01, styleSetPK02 } from "./../MainMapStyle";

let massForm: any = null;
let flagInput = true;
let HAVE = 0;

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
    flagInput = false;
  }
  //========================================================
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

  const ChangeTypeFaza = () => {
    massForm.typeFaza = !massForm.typeFaza;
    Haver();
  };
  //========================================================
  const SetupContent = () => {
    return (
      <>
        <Box sx={{ fontSize: 12, color: "#5B1080" }}>
          Тип отображаемых связей
        </Box>
        {StrTablVert(
          9,
          "Маршрутизированные (неформальные) связи",
          ShiftOptimal(massForm.typeRoute, ChangeTypeRoute, -0.1)
        )}
        <Box sx={{ fontSize: 12, marginTop: 0.5, color: "#5B1080" }}>
          Отображение фаз на карте
        </Box>
        {StrTablVert(
          9,
          "Фазы отображаются номерами (цифрами)",
          ShiftOptimal(massForm.typeFaza, ChangeTypeFaza, -0.1)
        )}
      </>
    );
  };

  return (
    <>
      <Modal open={open} onClose={CloseEnd} hideBackdrop={false}>
        <Box sx={styleSetPK01(500, 224)}>
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
