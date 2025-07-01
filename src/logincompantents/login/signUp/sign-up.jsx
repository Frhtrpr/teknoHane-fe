import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import bcrypt from "bcryptjs";
import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  Container,
  //AppBar,
  //Tabs,
  //Tab,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import BackGround from "../../../backGroundColor/auth-backgroundColor";
import UsersService from "../../../service/usersService";
//Icons
import { Visibility, VisibilityOff } from "@mui/icons-material";
import StoreIcon from "@mui/icons-material/Store";
//import HandshakeIcon from "@mui/icons-material/Handshake";
import CloseIcon from "@mui/icons-material/Close";
//Approve and Error message
import { useSnackbar } from "notistack";
//Google
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import HomeAppBar from "../../../AppBars/loginAppBar";

const StyledContainer = styled(Container)`
  
  margin-top: 40px;
  margi-bottom: 50px
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Paper = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledTypography = styled(Typography)`
  margin-bottom: 20px;
`;

const StyledForm = styled.form`
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 20px;
  }
`;

const SocialButton = styled(Button)`
  && {
    text-transform: none;
    margin-bottom: 12px;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  && small {
    margin-left: 5px;
  }
`;

export default function LoginForm() {
  const [firstName,setFirstName] = React.useState("");
  const [lastName,setLastName] = React.useState("")
  const [eposta, setEposta] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = useState("male");
  const [birthday, setBirthday] = useState(null);
  const [agreementChecked, setAgreementChecked] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [epostaError, setEpostaError] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {

        const nameRegex = /^[A-Za-zÇŞĞÜÖİçşğüöıİ]{3,}$/;

  if (!nameRegex.test(firstName)) {
    enqueueSnackbar("İsim en az 3 harf olmalı ve sadece harflerden oluşmalıdır.", { variant: "error" });
    return;
  }

  if (!nameRegex.test(lastName)) {
    enqueueSnackbar("Soyisim en az 3 harf olmalı ve sadece harflerden oluşmalıdır.", { variant: "error" });
    return;
  }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(eposta)) {
        setEpostaError(true);
        enqueueSnackbar("Geçerli bir e-posta adresi girin", {
          variant: "error",
        });
        return;
      }

      if (!agreementChecked) {
        enqueueSnackbar("Lütfen sözleşmeyi onaylayın.", { variant: "error" });
        return;
      }

      const emailExists = await UsersService.checkEmail(eposta);
      if (emailExists) {
        setEpostaError(true);
        enqueueSnackbar("Bu e-posta zaten kullanılıyor", { variant: "error" });
        return;
      }

      if (phone.length !== 11 || isNaN(phone)) {
        enqueueSnackbar("Telefon numarası 11 haneli bir rakam olmalıdır.", {
          variant: "error",
        });
        return;
      }

      const newUser = {
        firstName,
        lastName,
        eposta,
        password,
        phone,
        gender,
        birthday
      };

      await UsersService.saveUser(newUser);
      enqueueSnackbar(`Üyelik başarıyla oluşturuldu.`, { variant: "success" });
      navigate("/giris");
    } catch (error) {
      console.error("Üyelik oluşturma başarısız:", error);
      enqueueSnackbar("Bu telefon numarası  kullanılıyor", {
        variant: "error",
      });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  return (
    <>
      <HomeAppBar />
      <StyledContainer maxWidth="xs">
        <BackGround />
        <Paper>
          <StyledTypography
            component="h1"
            variant="body1"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <StoreIcon sx={{ color: "#007bff", marginRight: "5px" }} />{" "}
            TeknoHane'ye üye ol!
          </StyledTypography>

          <StyledForm onSubmit={handleSignUp}>
<Grid container spacing={2}>
  <Grid item xs={6}>
    <StyledTextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="firstName"
      label="İsim"
      name="firstName"
      autoFocus
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      size="small"
    />
  </Grid>
  <Grid item xs={6}>
    <StyledTextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="lastName"
      label="Soyisim"
      name="lastName"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      size="small"
    />
  </Grid>
</Grid>
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="eposta"
              label="E-posta"
              name="eposta"
              autoComplete="eposta"
              value={eposta}
              onChange={(e) => setEposta(e.target.value)}
              error={epostaError}
              size="small"
            />
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              size="small"
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Doğum Tarihi"
                  value={birthday}
                  onChange={(date) => {
                    if (date) {
                      setBirthday(date);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth variant="outlined"        size="small"
/>
                  )}
                  required
                />
              </DemoContainer>
            </LocalizationProvider>

          <Grid container spacing={2}>
  <Grid item xs={12}>
    <StyledTextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="phone"
      label="Telefon Numarası"
      name="phone"
      autoComplete="tel"
      size="small"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />
  </Grid>

</Grid>

           <Grid container spacing={2}>
  <Grid item xs={12}>
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend" sx={{ textAlign: "center" }}>
        Cinsiyet
      </FormLabel>
      <RadioGroup
        aria-label="gender"
        name="gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        row
        sx={{ justifyContent: "center", display: "flex" }} // ortalama için
      >
        <FormControlLabel
          value="male"
          control={<Radio />}
          label={<Typography sx={{ fontSize: "14px" }}>Erkek</Typography>}
        />
        <FormControlLabel
          value="female"
          control={<Radio />}
          label={<Typography sx={{ fontSize: "14px" }}>Kadın</Typography>}
        />
      </RadioGroup>
    </FormControl>
  </Grid>
</Grid>


            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle sx={{ marginLeft: "170px", fontSize: "23px" }}>
                {" "}
                Üyelik Sözleşmesi
              </DialogTitle>
              <DialogContent>
                İşbu Üyelik Sözleşmesi ("Sözleşme"); Maslak Mahallesi, Saat
                Sokak (Spine Tower), No: 5, İç Kapı No: 19, Sarıyer/İstanbul
                adresinde bulunan DSM GRUP DANIŞMANLIK İLETİŞİM VE SATIŞ TİC.
                A.Ş. (“DSM”) ile; kullanıcı (“Üye”, “Üyeler”) arasındaÜye'nin,
                DSM'nin Üye’ye işbu Sözleşme’yi sunduğu mobil uygulama ve/veya
                internet sitesine (“Platform”) üye olması ve DSM’nin sunduğu
                Sözleşme’de bahsi geçen diğer hizmetlerden yararlanmasına
                ilişkin koşul ve şartların belirlenmesi için düzenlenmiştir.
                <br />
                <br /> DSM aynı veya farklı mobil uygulamalar veya internet
                siteleri aracılığıyla çok kategorili ve çok modelli e-pazaryeri
                ve elektronik ticaret hizmetleri (“Platform Hizmetleri”) sunan
                sırasıyla elektronik ticaret aracı hizmet sağlayıcı ve
                elektronik ticaret hizmet sağlayıcı olarak faaliyet
                göstermektedir.
              </DialogContent>
              <IconButton sx={{ color: "blue" }} onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Dialog>

            <FormControlLabel
              control={
                <Checkbox
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                />
              }
              label={
                <Typography sx={{ fontSize: "15px" }}>
                  <Link to="#" onClick={handleOpenDialog}>
                    Üyelik sözleşmesini
                  </Link>{" "}
                  okudum ve onaylıyorum.
                </Typography>
              }
            />
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Üye ol
            </StyledButton>
          </StyledForm>

          <Typography
            sx={{ marginTop: "12px" }}
            variant="body2"
            color="textSecondary"
            align="center"
          >
            Zaten bir hesabınız var mı? <a href="/giris">Giriş Yap</a>
          </Typography>
        </Paper>
      </StyledContainer>
    </>
  );
}
