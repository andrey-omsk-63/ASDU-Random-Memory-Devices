import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate, massmodeCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { SendSocketDeleteRoute } from "../MapSocketFunctions";

import { styleModalEnd } from "../MainMapStyle";
import GsErrorMessage from "./GsErrorMessage";

let knop2 = "удалить";
let soobErr = "";

const GsSelectMD = (props: { setOpen: any; receive: any; funcHelper: any }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let massmode = useSelector((state: any) => {
    const { massmodeReducer } = state;
    return massmodeReducer.massmode;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  //===========================================================
  const [trigger, setTrigger] = React.useState(true);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);

  const styleSetInf = {
    position: "relative",
    marginTop: 4,
    marginLeft: 6,
    marginRight: "auto",
    width: 444,
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const styleModalMenu = {
    marginRight: 1,
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };

  const [openSetMode, setOpenSetMode] = React.useState(true);

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    props.funcHelper(true);
    setOpenSetMode(false);
  };

  const ClickKnop1 = (idx: number) => {
    if (massmode[idx].delRec) {
      soobErr = "Данный режим помечен к удалению";
      setOpenSoobErr(true);
    } else {
      if (map.routes[idx].listTL.length < 2) {
        soobErr = "Некорректный режим. Количество светофоров = 1";
        setOpenSoobErr(true);
      } else {
        props.receive(idx);
        props.setOpen(false);
        setOpenSetMode(false);
      }
    }
  };

  const ClickKnop2 = (idx: number) => {
    massmode[idx].delRec = !massmode[idx].delRec;
    dispatch(massmodeCreate(massmode));
    setTrigger(!trigger);
  };

  const DeleteRec = () => {
    let massRab = [];
    let massRoute = [];
    for (let i = 0; i < massmode.length; i++) {
      if (!massmode[i].delRec) {
        massRab.push(massmode[i]);
        massRoute.push(map.routes[i]);
      } else {
        SendSocketDeleteRoute(debug,ws,map.routes[i])
      }
    }
    massmode = massRab;
    map.routes = massRoute;
    dispatch(massmodeCreate(massmode));
    dispatch(mapCreate(map));
    setTrigger(!trigger);
  };

  const LookDel = () => {
    let chDel = 0;
    for (let i = 0; i < massmode.length; i++) {
      if (massmode[i].delRec) chDel++;
    }
    return chDel;
  };

  const StrokaTabl = () => {
    let resStr = [];
    for (let i = 0; i < massmode.length; i++) {
      knop2 = "удалить";
      let fSize = 12;
      let colorRec = "black";
      if (massmode[i].delRec) {
        knop2 = "восстановить";
        fSize = 11;
        colorRec = "red";
      }
      const styleBut01 = {
        fontSize: fSize + 2,
        marginTop: 1,
        border: "2px solid #000",
        bgcolor: "#E6F5D6",
        width: "320px",
        maxHeight: "20px",
        minHeight: "20px",
        borderColor: "#E6F5D6",
        borderRadius: 2,
        color: colorRec,
        textTransform: "unset !important",
      };
      const styleBut02 = {
        fontSize: fSize,
        marginTop: 1,
        border: "2px solid #000",
        bgcolor: "#E6F5D6",
        width: "105px",
        maxHeight: "20px",
        minHeight: "20px",
        borderColor: "#E6F5D6",
        borderRadius: 2,
        color: colorRec,
        textTransform: "unset !important",
      };
      resStr.push(
        <Grid key={i} container>
          <Grid item xs={8.9} sx={{ border: 0, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleBut01}
              onClick={() => ClickKnop1(i)}
            >
              {massmode[i].name}
            </Button>
          </Grid>
          <Grid item xs sx={{ border: 0, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleBut02}
              onClick={() => ClickKnop2(i)}
            >
              {knop2}
            </Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Выбор режима ЗУ
        </Typography>
        <Box sx={{ overflowX: "auto", height: "69vh" }}>{StrokaTabl()}</Box>
        {LookDel() > 0 && (
          <Box sx={{ marginTop: 1, textAlign: "center" }}>
            <Button sx={styleModalMenu} onClick={() => DeleteRec()}>
              Удалить отмеченные
            </Button>
          </Box>
        )}
        {openSoobErr && (
          <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
        )}
      </Box>
    </Modal>
  );
};

export default GsSelectMD;
