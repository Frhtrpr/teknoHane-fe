import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import * as React from 'react';

export default function AlertDialog({open,setOpen, handleAggree,message }) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>

 <Dialog
  open={open}
  onClose={handleClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      {message}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button
      variant="outlined"
      color="primary"
      onClick={handleClose}
      sx={{
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: "600",
        borderWidth: "2px",
        "&:hover": {
          backgroundColor: "primary.light",
          borderColor: "primary.dark",
          boxShadow: "0 4px 10px rgba(25, 118, 210, 0.2)",
        },
      }}
    >
      İptal
    </Button>
    <Button
      variant="outlined"
      color="error"
      onClick={handleAggree}
      autoFocus
      sx={{
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: "600",
        borderWidth: "2px",
        "&:hover": {
          backgroundColor: "error.light",
          borderColor: "error.dark",
          boxShadow: "0 4px 10px rgba(211, 47, 47, 0.2)",
        },
      }}
    >
      Kaldır
    </Button>
  </DialogActions>
</Dialog>

    </React.Fragment>
  );
}
