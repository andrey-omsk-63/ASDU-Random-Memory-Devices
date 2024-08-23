import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addobjCreate } from "../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import { SendSocketСreateAddObj } from "../RgsSocketFunctions";
import { SendSocketDeleteAddObj } from "../RgsSocketFunctions";

import { styleBoxForm, styleInpKnop } from "../MainMapStyle";
import { styleSet, styleEditName } from "../MainMapStyle";

let valueName = "";

const RgsEditName = (props: { setOpen: Function; idx: number }) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  let addobj = useSelector((state: any) => {
    const { addobjReducer } = state;
    return addobjReducer.addobj.dateAdd;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  //========================================================
  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  let idxObj = props.idx - map.tflight.length;

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleCloseSet = () => {
    props.setOpen(false);
    setOpenSetAdress(false);
  };

  const handleClose = () => {
    let dater = addobj.addObjects[idxObj];
    SendSocketDeleteAddObj(debug, ws, dater);
    addobj.addObjects[idxObj].description = valueName;
    dispatch(addobjCreate(addobj));
    dater = addobj.addObjects[idxObj];
    SendSocketСreateAddObj(debug, ws, dater);
    handleCloseSet();
    //props.trigger()
  };

  const InputName = () => {
    const [value, setValue] = React.useState(
      addobj.addObjects[idxObj].description
    );
    valueName = value;

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value) {
        let val = event.target.value.trimStart(); // удаление пробелов в начале строки
        setValue(val);
        valueName = val;
      } else valueName = value;
    };

    return (
      <Box sx={styleSet}>
        <Box component="form" sx={styleBoxForm}>
          <TextField
            size="small"
            onKeyPress={handleKey} //отключение Enter
            InputProps={{ disableUnderline: true, style: { fontSize: 13.3 } }}
            value={value}
            onChange={handleChangeName}
            variant="standard"
            helperText="Измените наименование объекта"
            color="secondary"
          />
        </Box>
      </Box>
    );
  };

  return (
    <Modal open={openSetAdress} onClose={handleCloseSet}>
      <Grid item container sx={styleEditName}>
        <Grid item xs={9.7}>
          <InputName />
        </Grid>
        <Grid item xs={2.3}>
          <Box sx={{ border: 1, borderColor: "#FFDB4D" }}>
            <Button sx={styleInpKnop} onClick={handleClose}>
              Ввод
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default RgsEditName;
