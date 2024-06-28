import React, { useState } from "react";
import {
  Button,
  Typography,
  Container,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import styled from "@emotion/styled";
import UsersService from "../../service/usersService";
import { useSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import HomeAppBar from "../../AppBars/homeAppBar";
import { useNavigate } from "react-router";

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

      await UsersService.resetPassword(email, password);

      enqueueSnackbar("Şifreniz başarıyla değiştirildi.", {
        variant: "success",
      });

      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
