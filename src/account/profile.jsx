import {
  Box,
  Button,
  Dialog,
  DialogActions,
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
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import HomeAppBar from "../AppBars/homeAppBar";
import "../css/profile.css";
import UsersService from "../service/usersService";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//Icons
import {
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import BoyIcon from "@mui/icons-material/Boy";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EnhancedEncryptionOutlinedIcon from "@mui/icons-material/EnhancedEncryptionOutlined";
import GirlIcon from "@mui/icons-material/Girl";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import TransgenderOutlinedIcon from "@mui/icons-material/TransgenderOutlined";
import { useNavigate } from "react-router";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmailEdit, setShowEmailEdit] = React.useState(false);
  const [showPhoneEdit, setShowPhoneEdit] = React.useState(false);
  const [showGenderEdit, setShowGenderEdit] = React.useState(false);
  const [showBirthdayEdit, setShowBirthdayEdit] = React.useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleShowEmailEdit = () => {
    setShowEmailEdit(true);
  };

  const handleShowPhoneEdit = () => {
    setShowPhoneEdit(true);
  };

  const handleShowGenderEdit = () => {
    setShowGenderEdit(true);
  };

  const handleShowBirthdayEdit = () => {
    setShowBirthdayEdit(true);
  };

  const handleShowPasswordEdit = () => {
    setShowPasswordEdit(true);
  };

  const fetchUserInfo = async () => {
    try {
      const storedToken = localStorage.getItem("jwtToken");
      if (storedToken) {
        const userInfo = await UsersService.getUserInfo(storedToken);
        setUserData(userInfo);
        setLoading(false);
      } else {
        enqueueSnackbar("Lütfen giriş yapınız.", { variant: "error" });
        console.log("Token yok");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar(
          "Giriş yapmadığınız için profil bilgisi bulunmamaktadır"
        );
      } else {
        setError(error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  function EpostaEditPopup() {
    const [newEPosta, setNewEPosta] = React.useState(null);

    const handleUpdateEmail = async () => {
      try {
        // E-posta doğrulaması
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEPosta)) {
          enqueueSnackbar("Geçerli bir e-posta adresi girin", {
            variant: "error",
          });
          return;
        }
        if (userData.eposta === newEPosta) {
          enqueueSnackbar("Zaten bu e-posta adresine sahipsiniz", {
            variant: "error",
          });
          return;
        }
        const emailExists = await UsersService.checkEmail(newEPosta);
        if (emailExists) {
          enqueueSnackbar("Bu e-posta adresi zaten kullanılıyor", {
            variant: "error",
          });
          return;
        }

        await UsersService.resetEmail(userData.id, newEPosta);
        enqueueSnackbar("E-posta adresiniz başarıyla güncellendi", {
          variant: "success",
        });
        setShowEmailEdit(false);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        navigate("/giris");
        window.location.reload();
      } catch (error) {
        enqueueSnackbar("E-posta adresini güncellerken bir hata oluştu.", {
          variant: "error",
        });
        console.error("E-posta adresi güncellenirken hata:", error);
      }
    };

    return (
      <>
        <Box sx={{ minHeight: 400, flexGrow: 1, maxWidth: 400 }}>
          <Dialog
            open={showEmailEdit}
            onClose={() => setShowEmailEdit(false)}
            fullWidth={true}
            maxWidth={"md"}
          >
            <DialogTitle>E-posta güncelle </DialogTitle>
            <DialogContent>
              {showEmailEdit && (
                <React.Fragment>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Yeni E-posta Adresi"
                    type="email"
                    fullWidth
                    value={newEPosta}
                    onChange={(e) => setNewEPosta(e.target.value)}
                  />
                </React.Fragment>
              )}
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" color="secondary" sx={{ borderRadius: '6px' }} onClick={() => setShowEmailEdit(false)}>Kapat</Button>
              <Button variant="outlined" sx={{ borderRadius: '6px' }} onClick={handleUpdateEmail}>Güncelle</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    );
  }

  function PhoneEditPopup() {
    const [newPhone, setNewPhone] = React.useState(null);

    const handleUpdatePhone = async () => {
      try {
        if (newPhone.length !== 11 || isNaN(newPhone)) {
          enqueueSnackbar("Telefon numarası 11 haneli bir rakam olmalıdır.", {
            variant: "error",
          });
          return;
        }

        await UsersService.updateUser(userData.id, { phone: newPhone });
        enqueueSnackbar("Telefon bilginiz başarıyla güncellendi", {
          variant: "success",
        });
        setShowPhoneEdit(false);
        fetchUserInfo();
      } catch (error) {
        enqueueSnackbar("Bu telefon numarası kullanılıyor", {
          variant: "error",
        });
        console.error("Telefon bilginizi güncellenirken hata:", error);
      }
    };

    return (
      <Box sx={{ minHeight: 400, flexGrow: 1, maxWidth: 400 }}>
        <Dialog
          open={showPhoneEdit}
          onClose={() => setShowPhoneEdit(false)}
          fullWidth={true}
          maxWidth={"md"}
        >
          <DialogTitle>Telefon bilgini güncelle</DialogTitle>
          <DialogContent>
            {" "}
            {showPhoneEdit && (
              <React.Fragment>
                <TextField
                  autoFocus
                  margin="dense"
                  id="phone"
                  label="Yeni telefon numarası"
                  type="phone"
                  fullWidth
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </React.Fragment>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="secondary" sx={{ borderRadius: '6px' }} onClick={() => setShowPhoneEdit(false)}>Kapat</Button>
            <Button variant="outlined" sx={{ borderRadius: '6px' }}  onClick={handleUpdatePhone}>Güncelle</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  function GenderEditPopup() {
    const [newGender, setNewGender] = React.useState(userData.gender);

    const handlUpdateGender = async () => {
      try {
        await UsersService.updateUser(userData.id, { gender: newGender });
        enqueueSnackbar("Cinsiyet bilginiz güncellendi", {
          variant: "success",
        });
        setShowGenderEdit(false);
        fetchUserInfo();
      } catch (error) {
        enqueueSnackbar("Cinsiyet bilgisi güncellenemedi.", {
          variant: "error",
        });
        console.error("Cinsiyet bilgisi güncellenirken hata:", error);
      }
    };

    return (
      <>
        {" "}
        <Box sx={{ minHeight: 400, flexGrow: 1, maxWidth: 400 }}>
          <Dialog
            open={showGenderEdit}
            onClose={() => setShowGenderEdit(false)}
            fullWidth={true}
            maxWidth={"md"}
          >
            <DialogTitle>Cinsiyet bilgini güncelle </DialogTitle>
            <DialogContent>
              {" "}
              {showGenderEdit && (
                <React.Fragment>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend"></FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value)}
                      row
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <FormControlLabel
                            value="male"
                            control={<Radio />}
                            label={
                              <Typography sx={{ fontSize: "15px" }}>
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
                              <Typography sx={{ fontSize: "15px" }}>
                                Kadın
                              </Typography>
                            }
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <FormControlLabel
                            value="other" // Corrected value here
                            control={<Radio />}
                            label={
                              <Typography sx={{ fontSize: "15px" }}>
                                Diğer
                              </Typography>
                            }
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <FormControlLabel
                            value="berlirtmek istemiyorum"
                            control={<Radio />}
                            label={
                              <Typography sx={{ fontSize: "15px" }}>
                                Belirtmek istemiyorum
                              </Typography>
                            }
                          />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </React.Fragment>
              )}
            </DialogContent>
            <DialogActions>
              <Button  variant="outlined" color="secondary" sx={{ borderRadius: '6px' }} onClick={() => setShowGenderEdit(false)}>Kapat</Button>
              <Button variant="outlined" sx={{ borderRadius: '6px' }} onClick={handlUpdateGender}>Güncelle</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    );
  }

function BirthdayEditPopup() {
  const [birthday, setBirthday] = React.useState(userData.birthday);

  const handleUpdateBirthday = async () => {
    try {
      await UsersService.updateUser(userData.id, { birthday: birthday });
      enqueueSnackbar("Doğum tarihiniz güncellendi", { variant: "success" });
      setShowBirthdayEdit(false);
      fetchUserInfo();
    } catch (error) {
      enqueueSnackbar("Doğum tarihiniz güncellenemedi", { variant: "error" });
      console.log("Doğum tarihi güncellerken oluşan hata", error);
    }
  };

  return (
    <Box sx={{ minHeight: 200, maxHeight:500,flexGrow: 1, maxWidth: 400 }}>
      <Dialog
        open={showBirthdayEdit}
        onClose={() => setShowBirthdayEdit(false)}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>Doğum tarihini güncelle</DialogTitle>
        <DialogContent>
          {showBirthdayEdit && (
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
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" sx={{ borderRadius: '6px' }} onClick={() => setShowBirthdayEdit(false)}>Kapat</Button>
          <Button  variant="outlined" sx={{ borderRadius: '6px' }} onClick={handleUpdateBirthday}>Güncelle</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


  const PasswordEditPopup = () => {
    const [newPassword, setNewPassword] = React.useState("");
    const [newConfirmPassword, setNewConfirmPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    const handleToggleConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };

    const handleResetPassword = async () => {
      try {
        if (!newPassword || !newConfirmPassword) {
          enqueueSnackbar("Lütfen yeni şifrenizi girin ve doğrulayın", {
            variant: "error",
          });
          return;
        }

        if (newPassword !== newConfirmPassword) {
          enqueueSnackbar("Girmiş olduğunuz şifreler aynı değil", {
            variant: "error",
          });
          return;
        }

        await UsersService.resetPassword(userData.eposta, newPassword);
        enqueueSnackbar("Şifreniz başarıyla sıfırlandı ve güncellendi", {
          variant: "success",
        });

        setNewPassword("");
        setNewConfirmPassword("");
        setShowPasswordEdit(false);
        fetchUserInfo();
      } catch (error) {
        enqueueSnackbar("Şifreniz sıfırlanırken bir hata oluştu", {
          variant: "error",
        });
        console.error("Şifre sıfırlanırken hata:", error);
      }
    };

    return (
      <>
        <Box sx={{ minHeight: 400, flexGrow: 1, maxWidth: 400 }}>
          <Dialog
            open={showPasswordEdit}
            onClose={() => setShowPasswordEdit(false)}
            fullWidth={true}
            maxWidth={"md"}
          >
            <DialogTitle>Yeni Şifre</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="newPassword"
                label="Yeni Şifre"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="newConfirmPassword"
                label="Yeni Şifreyi Onayla"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                value={newConfirmPassword}
                onChange={(e) => setNewConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleToggleConfirmPassword}
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </DialogContent>
            <DialogActions>
              {" "}
              <Button variant="outlined" color="secondary" sx={{ borderRadius: '6px' }} onClick={() => setShowPasswordEdit(false)}>Kapat</Button>
              <Button variant="outlined" sx={{ borderRadius: '6px' }} onClick={handleResetPassword}>Güncelle</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    );
  };

  return (
    <>
      <HomeAppBar /> <br />
      <div className="profile-container">
        {" "}
        {loading ? (
          <div>Bilgiler yükleniyor...</div>
        ) : error ? (
          <div>Hata oluştu: {error.message}</div>
        ) : userData ? (
          <div>
            <h1>Profil Bilgileri</h1>
            <Table
              sx={{ marginLeft: 65, width: 550 }}
              aria-label="caption table"
            >
              <TableBody>
                <TableRow>
                  <TableCell>
                    <EmailOutlinedIcon />
                  </TableCell>
                  <TableCell>
                    <strong>E-posta:</strong>
                  </TableCell>
                  <TableCell>{userData.eposta}</TableCell>
                  <IconButton onClick={handleShowEmailEdit}>
                    <EditIcon
                      sx={{
                        color: "#007bff",
                        marginTop: "10px",
                        marginRight: "35px",
                      }}
                    />
                  </IconButton>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <LocalPhoneIcon />
                  </TableCell>

                  <TableCell>
                    <strong>Telefon:</strong>
                  </TableCell>
                  <TableCell>{userData.phone}</TableCell>
                  <IconButton onClick={handleShowPhoneEdit}>
                    <EditIcon
                      sx={{
                        color: "#007bff",
                        marginTop: "10px",
                        marginRight: "35px",
                      }}
                    />
                  </IconButton>
                </TableRow>
                <TableRow>
                  <TableCell>
                    {userData.gender === "male" && <BoyIcon />}
                    {userData.gender === "female" && <GirlIcon />}
                    {userData.gender !== "male" &&
                      userData.gender !== "female" && (
                        <TransgenderOutlinedIcon />
                      )}
                  </TableCell>
                  <TableCell>
                    <strong>Cinsiyet:</strong>
                  </TableCell>
                  <TableCell>{userData.gender}</TableCell>
                  <IconButton onClick={handleShowGenderEdit}>
                    <EditIcon
                      sx={{
                        color: "#007bff",
                        marginTop: "10px",
                        marginRight: "35px",
                      }}
                    />
                  </IconButton>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <CakeOutlinedIcon />
                  </TableCell>
                  <TableCell>
                    <strong>Doğum Tarihiniz:</strong>
                  </TableCell>
                  <TableCell>
                    {new Date(userData.birthday).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <IconButton>
                    <EditIcon
                      onClick={handleShowBirthdayEdit}
                      sx={{
                        color: "#007bff",
                        marginTop: "10px",
                        marginRight: "35px",
                      }}
                    />
                  </IconButton>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <EnhancedEncryptionOutlinedIcon />
                  </TableCell>
                  <TableCell>
                    <strong>Şifreniz:</strong>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="password"
                      value="******"
                      disabled
                      InputProps={{
                        disableUnderline: true,
                        style: { color: "black" },
                      }}
                    />
                  </TableCell>
                  <IconButton>
                    {" "}
                    <EditIcon
                      onClick={handleShowPasswordEdit}
                      sx={{
                        color: "#007bff",
                        marginTop: "10px",
                        marginRight: "35px",
                      }}
                    />
                  </IconButton>{" "}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div>Bilgi bulunamadı.</div>
        )}
      </div>
      {showEmailEdit && <EpostaEditPopup />}
      {showPhoneEdit && <PhoneEditPopup />}
      {showGenderEdit && <GenderEditPopup />}
      {showPasswordEdit && <PasswordEditPopup />}
      {showBirthdayEdit && <BirthdayEditPopup />}
    </>
  );
}

export default Profile;
