import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

//import { styleModalEnd } from '../MainMapStyle';

const GsErrorMessage = (props: { sErr: string; setOpen: any }) => {
  const [openSet, setOpenSet] = React.useState(true);

  const styleSetInf = {
    outline: "none",
    position: 'absolute',
    marginTop: '15vh',
    marginLeft: '24vh',
    width: 380,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    borderColor: 'red',
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const styleModalEnd = {
    position: 'absolute',
    top: '0%',
    left: 'auto',
    right: '-0%',
    height: '21px',
    maxWidth: '2%',
    minWidth: '2%',
    color: 'red',
  };

  const handleClose = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  return (
    <Modal open={openSet} onClose={handleClose} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleClose}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ textAlign: 'center', color: 'red' }}>
          {props.sErr}
        </Typography>
      </Box>
    </Modal>
  );
};

export default GsErrorMessage;
