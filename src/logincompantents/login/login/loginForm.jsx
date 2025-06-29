import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackGround from '../../../backGroundColor/auth-backgroundColor';
import { loginUser } from "../../../service/authService.js";

import styled from "@emotion/styled";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import StoreIcon from "@mui/icons-material/Store";
import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import HomeAppBar from "../../../AppBars/loginAppBar.jsx";
//Approve and error message
import { useSnackbar } from "notistack";

const StyledContainer = styled(Container)`
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
    text-transform: none;
  }
`;


const ForgotPasswordLink = styled.a`
  color: black;
  text-decoration: none;
  &:hover {
    color: #007bff;
  }
`;

export default function LoginForm() {
  const [eposta, setEposta] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun otomatik olarak submit olmasını engellemek için
  
    try {
      const response = await loginUser(eposta, password);
  
      const storedToken = localStorage.getItem("jwtToken");
  
      if (storedToken) {
        navigate("/teknoHane");
        console.log(storedToken);
      }
      console.log("Login successful:", response);
    } catch (error) {
      console.error("Login failed:", error);
  
      if (error.response && error.response.status === 401) {
        // HTTP 401 hatası, yetkilendirme hatası anlamına gelir, yani şifre yanlış demektir
      enqueueSnackbar("E-posta veya şifre hatalı", {variant:'error'})
      } else {
        // Diğer hatalar için genel bir uyarı
      enqueueSnackbar("E-Posta veya şifre hatalı", {variant:'error'})
      }
    }
  };
  

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    <HomeAppBar/>
      <StyledContainer maxWidth="xs">
        <BackGround/>
        <Paper>
          <StyledTypography
            component="h1"
            variant="body1"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <StoreIcon sx={{ color: "#007bff", marginRight: "5px" }} />{" "}
            TeknoHane'ye giriş Yap!
          </StyledTypography>

          <StyledForm onSubmit={handleSubmit}>
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
            <Typography variant="body2" color="textSecondary" align="right">
              <ForgotPasswordLink href="/sifremi-unuttum">
                Şifremi Unuttum
              </ForgotPasswordLink>
            </Typography>
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Giriş Yap
            </StyledButton>
          </StyledForm>

          <Typography
            sx={{ marginTop: "12px" }}
            variant="body2"
            color="textSecondary"
            align="center"
          >
            Henüz hesabınız yok mu? <a href="/uye-ol">Üye Ol</a>
          </Typography>
        </Paper>
      </StyledContainer>
    </>
  );
}
