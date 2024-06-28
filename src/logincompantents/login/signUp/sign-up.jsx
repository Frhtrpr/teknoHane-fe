import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import bcrypt from "bcryptjs";
import BackGround from "../../../backGroundColor/auth-backgroundColor";
import {
  Button,
  TextField,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  //AppBar,
  //Tabs,
  //Tab,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import styled from "@emotion/styled";
import UsersService from "../../../service/usersService";
//Icons
import StoreIcon from "@mui/icons-material/Store";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { Visibility, VisibilityOff } from "@mui/icons-material";
//import HandshakeIcon from "@mui/icons-material/Handshake";
import CloseIcon from "@mui/icons-material/Close";
//Approve and Error message
import { useSnackbar } from "notistack";
//Google
import { GoogleLogin } from "react-google-login";
import HomeAppBar from "../../../AppBars/loginAppBar";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
  const clientId =
    "700211963251-rm90nnjq8uekcvr5ltif6g65vieka13n.apps.googleusercontent.com";
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
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

      // Telefon numarasının uzunluğunu kontrol et
      if (phone.length !== 11 || isNaN(phone)) {
        enqueueSnackbar("Telefon numarası 11 haneli bir rakam olmalıdır.", {
          variant: "error",
        });
        return;
      }

      // Kullanıcıyı veritabanına kaydet
      const newUser = {
        eposta,
        password,
        phone,
        gender,
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

  const onSuccess = (res) => {
    console.llog("Google ile giriş yapıldı", res.profileObj);
  };

  const onFailure = (res) => {
    console.log("Google ile giriş yapılamadı", res);
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
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="eposta"
              label="E-posta"
              name="eposta"
              autoComplete="eposta"
              autoFocus
              value={eposta}
              onChange={(e) => setEposta(e.target.value)}
              error={epostaError}
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
                    <TextField {...params} fullWidth variant="outlined" />
                  )}
                  required
                />
              </DemoContainer>
            </LocalizationProvider>

            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Telefon Numarası"
              name="phone"
              autoComplete="tel"
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">
                    Cinsiyet(İsteğe bağlı)
                  </FormLabel>
                  <RadioGroup
                    aria-label="gender"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    row // Display options horizontally
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label={
                            <Typography sx={{ fontSize: "14px" }}>
                              Erkek
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label={
                            <Typography sx={{ fontSize: "14px" }}>
                              Kadın
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <FormControlLabel
                          value="other"
                          control={<Radio />}
                          label={
                            <Typography sx={{ fontSize: "14px" }}>
                              Diğer
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <FormControlLabel
                          value=""
                          control={<Radio />}
                          label={
                            <Typography sx={{ fontSize: "12px" }}>
                              Belirtmek istemiyorum
                            </Typography>
                          }
                        />
                      </Grid>
                    </Grid>
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

            <Grid container spacing={2} sx={{ marginTop: "20px" }}>
              <Grid item xs={6}>
                <SocialButton
                  fullWidth
                  variant="outlined"
                  startIcon={<FacebookIcon style={{ marginLeft: "15px" }} />}
                  sx={{ color: "#1877f2", borderColor: "#1877f2" }}
                >
                  <Grid container alignItems="center" justifyContent="center">
                    <Grid item>Facebook</Grid>
                    <Grid item xs={12}>
                      <small>ile Giriş Yap</small>
                    </Grid>
                  </Grid>
                </SocialButton>
              </Grid>
              <Grid item xs={6}>
                <div>
                  <GoogleLogin
                    clientId={clientId}
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={"single_host_origin"}
                    isSignedIn={true}
                  ></GoogleLogin>
                </div>
                {/*<SocialButton
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon style={{ marginLeft: "15px" }} />}
            sx={{ color: "#db4437", borderColor: "#db4437" }}
            >
                  <Grid container alignItems="center" justifyContent="center">
                    <Grid item>Google</Grid>
                    <Grid item xs={12}>
                      <small>ile Giriş Yap</small>
                    </Grid>
            </Grid>
                </SocialButton>*/}
              </Grid>
            </Grid>
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
