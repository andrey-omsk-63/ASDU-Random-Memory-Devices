export const searchControl = {
  float: "left",
  provider: "yandex#search",
  size: "large",
};

export const styleMenuGl = {
  maxHeight: "28px",
  minHeight: "28px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
};

export const styleModalEnd = {
  position: "absolute",
  top: "0%",
  left: "auto",
  right: "-0.5%",
  height: "21px",
  maxWidth: "2%",
  minWidth: "2%",
  color: "black",
  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
};

export const styleSetInf = {
  position: "absolute",
  marginTop: "15vh",
  marginLeft: "24vh",
  width: 380,
  bgcolor: "background.paper",
  border: "3px solid #000",
  borderColor: "primary.main",
  borderRadius: 2,
  boxShadow: 24,
  p: 1.5,
};

export const styleModalEndAttent = {
  position: "absolute",
  top: "0%",
  left: "auto",
  right: "-0%",
  maxHeight: "21px",
  minHeight: "21px",
  maxWidth: "2%",
  minWidth: "2%",
  color: "red",
};
//=== InputObject =====================================================
export const styleSetAdress = {
  outline: "none",
  width: "319px",
  height: "160px",
  marginTop: "9vh",
  marginLeft: "48px",
  //===
  // position: 'absolute',
  // left: '206px',
  // top: '157px',
  // transform: 'translate(-50%, -50%)',
  //===
  border: "3px solid #000",
  borderColor: "#FFFEF7",
  borderRadius: 1,
  boxShadow: 24,
  bgcolor: "#FFFEF7",
  opacity: 0.85,
};

export const styleSet = {
  //marginTop: '2vh',
  width: "230px",
  maxHeight: "4px",
  minHeight: "4px",
  bgcolor: "#FFFBE5",
  boxShadow: 3,
  textAlign: "center",
  p: 1.5,
};

export const styleInpKnop = {
  border: 1,
  borderColor: "#FFDB4D",
  fontSize: 13.3,
  color: "black",
  maxHeight: "27px",
  minHeight: "27px",
  maxWidth: "62px",
  minWidth: "62px",
  backgroundColor: "#FFDB4D",
  textTransform: "unset !important",
};

export const styleBoxForm = {
  "& > :not(style)": {
    marginTop: "-9px",
    marginLeft: "-12px",
    width: "250px",
  },
};

export const styleSetAdrAreaID = {
  marginTop: "10vh",
  marginLeft: "48px",
  width: "316px",
  height: "14vh",
  bgcolor: "#FFFEF7",
  opacity: 0.8,
};

export const styleSetAdrArea = {
  marginTop: "1vh",
  width: "319px",
  height: "30px",
};

export const styleSetAdrID = {
  width: "319px",
  height: "30px",
  //marginTop: '-1vh',
};

export const styleSetArea = {
  width: "230px",
  maxHeight: "3px",
  minHeight: "3px",
  bgcolor: "#FFFBE5",
  boxShadow: 3,
  textAlign: "center",
  p: 1.5,
};

export const styleSetID = {
  border: 0,
  width: "230px",
  maxHeight: "3px",
  minHeight: "3px",
  bgcolor: "#FFFBE5",
  boxShadow: 3,
  textAlign: "center",
  p: 1.5,
};

export const styleBoxFormArea = {
  "& > :not(style)": {
    marginTop: "-10px",
    marginLeft: "-12px",
    width: "253px",
  },
};

// export const styleBoxFormID = {
//   '& > :not(style)': {
//     marginTop: '-9px',
//     marginLeft: '-12px',
//     width: '253px',
//   },
// };
//=== ProcessObject ===================================================
export const styleModalMenu = {
  fontSize: 15,
  maxHeight: "21px",
  minHeight: "21px",
  backgroundColor: "#E6F5D6",
  color: "black",
  marginBottom: "12px",
  textTransform: "unset !important",
  textAlign: "center",
  boxShadow: 5,
};

export const styleSetProcess = {
  outline: "none",
  position: "relative",
  marginTop: 8,
  marginLeft: 8,
  marginRight: "auto",
  width: 333,
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderColor: "primary.main",
  borderRadius: 2,
  boxShadow: 24,
  p: 1.5,
};
//=== ProcessObject ===================================================
export const styleEditName = {
  outline: "none",
  width: "319px",
  height: "60px",
  marginTop: "9vh",
  marginLeft: "48px",
  border: "3px solid #000",
  borderColor: "#FFFEF7",
  borderRadius: 2,
  boxShadow: 24,
  bgcolor: "#FFFEF7",
  opacity: 0.9,
};
//=== AppointVertex ===================================================
export const styleSetAppoint = {
  outline: "none",
  position: "relative",
  // marginTop: "12vh",
  // marginLeft: 1,
  // marginRight: "auto",
  //===
  // position: 'absolute',
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  //===
  width: "98.5%",
  bgcolor: "background.paper",
  border: "1px solid #fff",
  borderRadius: 1,
  boxShadow: 24,
};

export const styleAppSt02 = {
  transform: "translate(-50%, -50%)",
  position: "relative",
  top: "50%",
  left: "50%",
};

export const styleAppSt03 = {
  textAlign: "center",
  transform: "translate(-50%, -100%)",
  position: "relative",
  top: "50%",
  left: "50%",
};

export const styleAppSt04 = {
  fontSize: 17,
  marginTop: 1,
  textAlign: "center",
  color: "#7620a2", // сиреневый
  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
};

export const styleAppSt05 = {
  marginTop: -0.25,
  bgcolor: "#F1F5FB", // светло-серый
  border: "1px solid #d4d4d4",
  borderRadius: 1,
  boxShadow: 9,
};

export const StyleAppSt06 = (top: number, heightImg: number) => {
  const styleBind09 = {
    fontSize: 18,
    cursor: "pointer",
    padding: top + "px 0px 5px 10px",
    textIndent: "20px", // с красной строки
    height: heightImg - 123,
    bgcolor: "background.paper",
    border: "1px solid #fff",
    borderRadius: 1,
    boxShadow: 24,
  };
  return styleBind09;
};

export const styleSetAV = {
  width: "52px",
  maxHeight: "21px",
  minHeight: "21px",
  border: "1px solid #000",
  borderRadius: 1,
  borderColor: "#d4d4d4", // серый
  textTransform: "unset !important",
  bgcolor: "#FFFBE5",
  boxShadow: 6,
  paddingTop: 0.5,
};

export const styleBoxFormAV = {
  "& > :not(style)": {
    marginTop: "-0px",
    marginLeft: "1px",
    width: "50px",
  },
};

export const styleSetFazaNull = {
  position: "relative",
  marginTop: "-1px",
  left: "27%",
  width: "30px",
  maxHeight: "19px",
  minHeight: "19px",
  //bgcolor: "background.paper",
  //bgcolor: "#F1F5FB", // светло-серый
};

export const styleSetFaza = {
  position: "relative",
  marginTop: "-1px",
  left: "27%",
  width: "30px",
  maxHeight: "19px",
  minHeight: "19px",
  //maxHeight: "17px",
  //minHeight: "17x",
  bgcolor: "#FFFBE5", // молоко
  border: "1px solid #000",
  borderRadius: 1,
  borderColor: "#d4d4d4", // серый
  boxShadow: 6,
};

export const styleBoxFormFaza = {
  "& > :not(style)": {
    marginTop: "0px",
    marginLeft: "-1px",
    width: "32px",
  },
};

// export const styleZId = {
//   fontSize: 19,
//   transform: 'rotate(270deg)',
//   position: 'relative',
//   top: '50%',
//   color: 'blue',
// };

// export const styleVId = {
//   fontSize: 19,
//   transform: 'rotate(90deg)',
//   position: 'relative',
//   top: '50%',
//   color: 'blue',
// };
//=====================================================================
