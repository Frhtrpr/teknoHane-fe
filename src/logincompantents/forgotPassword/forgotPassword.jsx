import styled from "@emotion/styled";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import HomeAppBar from "../../AppBars/homeAppBar";
import UsersService from "../../service/usersService";

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

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityCode,setSecurityCode] = useState(null)
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const exists = await UsersService.checkEmail(email);
      if (!exists) {
        enqueueSnackbar(
          "Bu e-posta adresi ile ilişkili bir hesap bulunamadı.",
          { variant: "error" }
        );
        return;
      }

      if (!password || !confirmPassword) {
        enqueueSnackbar("Lütfen yeni şifrenizi girin ve doğrulayın.", {
          variant: "error",
        });
        return;
      }

      if (password !== confirmPassword) {
        enqueueSnackbar("Girmiş olduğunuz şifreler aynı değil", {
          variant: "error",
        });
        return;
      }
          
      if (!/^\d{6}$/.test(securityCode)) {
      enqueueSnackbar("Güvenlik kodu 6 haneli ve sadece rakamlardan oluşmalıdır.", {
        variant: "error",
      });
      return;
    }

      await UsersService.forgotResetPassword(email, password,securityCode);

      enqueueSnackbar("Şifreniz başarıyla değiştirildi.", {
        variant: "success",
      });

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSecurityCode(null)
    } catch (error) {
      console.error("Failed to update password:", error);
      enqueueSnackbar(
        "Şifre değiştirme işlemi başarısız oldu. Lütfen tekrar deneyin.",
        { variant: "error" }
      );
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToogleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const handleLoginPageButtonClick = () => {
    navigate("/giris");
  };

  return (
    <>
      <HomeAppBar />
      <StyledContainer maxWidth="xs">
        <Paper>
          <StyledTypography variant="h5">Şifremi Unuttum</StyledTypography>
          <StyledForm onSubmit={handleSubmit}>
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              size="small"
              onChange={(e) => setEmail(e.target.value)}
            />
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Yeni Şifre"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              size="small"
              sx={{marginTop:-0.5}}
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
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Yeni Şifreyi Onayla"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              size="small"
              sx={{marginTop:-0.5}}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleToogleConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
  variant="outlined"
  margin="normal"
  required
  id="securityCode"
  label="Güvenlik Kodu"
  name="securityCode"
  value={securityCode}
  onChange={(e) => setSecurityCode(e.target.value)}
  size="small"
  sx={{
    width: "150px",
    margin: "10px auto",   
    display: "block",     
    marginTop:-0.5
  }}
  inputProps={{ maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }}
/>

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Şifremi Yenile
            </StyledButton>
            <StyledButton
              fullWidth
              variant="contained"
              color="grey"
              onClick={handleLoginPageButtonClick}
            >
              Önceki Sayfaya Dön
            </StyledButton>
          </StyledForm>
        </Paper>
      </StyledContainer>
    </>
  );
}
