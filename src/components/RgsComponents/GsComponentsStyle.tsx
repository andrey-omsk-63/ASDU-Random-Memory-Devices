//=== GsSetPhase =========================================
export const styleSetInf = {
  position: "relative",
  marginTop: 4,
  marginLeft: "auto",
  marginRight: 69,
  width: 777,
  bgcolor: "background.paper",
  border: "3px solid #000",
  borderColor: "primary.main",
  borderRadius: 2,
  boxShadow: 24,
  p: 1.5,
};

export const styleModalMenu = {
  marginTop: 0.5,
  marginRight: 1,
  maxHeight: "24px",
  minHeight: "24px",
  backgroundColor: "#E6F5D6",
  textTransform: "unset !important",
  color: "black",
  boxShadow: 2,
};

export const styleBoxFormFaza = {
  "& > :not(style)": {
    marginTop: "-10px",
    marginLeft: "-12px",
    width: "36px",
  },
};

export const styleSet = {
  width: "512px",
  maxHeight: "4px",
  minHeight: "4px",
  bgcolor: "#FFFBE5",
  boxShadow: 3,
  textAlign: "center",
  p: 1,
};

export const styleBoxFormName = {
  "& > :not(style)": {
    marginTop: "-9px",
    marginLeft: "-8px",
    width: "530px",
  },
};
//=== GsToDoMode =========================================
export const styleToDoMode = {
  position: "relative",
  marginTop: 0.1,
  marginLeft: "auto",
  marginRight: 1,
  width: "96%",
  bgcolor: "background.paper",
  border: "3px solid #000",
  borderColor: "primary.main",
  borderRadius: 2,
  boxShadow: 24,
  p: 1.0,
};

export const styleStrokaTabl = {
  border: "2px solid #000",
  bgcolor: "#E6F5D6",
  maxWidth: "3px",
  minWidth: "3px",
  maxHeight: "20px",
  minHeight: "20px",
  borderColor: "#E6F5D6",
  borderRadius: 2,
  color: "black",
  textTransform: "unset !important",
};

export const styleStrokaTablImg = {
  border: "2px solid #000",
  bgcolor: "#EFF9E6",
  maxWidth: "10px",
  minWidth: "10px",
  maxHeight: "45px",
  minHeight: "45px",
  borderColor: "#EFF9E6",
  borderRadius: 2,
  color: "black",
  textTransform: "unset !important",
};

export const styleStrokaTakt = {
  fontSize: 12,
  paddingTop: 1.7,
  textAlign: "right",
};

export const StyleToDoMode = (DEMO: boolean) => {
  const styleToDoMode = {
    position: "relative",
    marginTop: 0.1,
    marginLeft: "auto",
    marginRight: 1,
    width: "96%",
    bgcolor: "background.paper",
    border: "1px solid #000",
    borderColor: DEMO ? "red" : "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.0,
  };
  return styleToDoMode;
};
//========================================================
