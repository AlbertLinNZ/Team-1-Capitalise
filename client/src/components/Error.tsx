import Logo from "../assets/Logo.svg";
import { Box, Stack, Typography, styled } from "@mui/material";

interface Props {
  errorMessage?: string;
}

const Error = ({ errorMessage = "" }: Props) => {
  const AnimatedImg = styled("img")({
    "@keyframes spin": {
      from: {
        transform: "rotate(0deg)",
      },
      to: {
        transform: "rotate(360deg)",
      },
    },
    justifyContent: "center",
    alignItems: "center",
    animation: "spin infinite 20s linear",
  });

  return (
    <Box mt="8vh">
      <Stack
        height="92vh"
        minHeight="92vh"
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          display="flex"
          height="40%"
          justifyContent="center"
          alignItems="center"
        >
          <AnimatedImg src={Logo} alt="logo" height="20%"></AnimatedImg>
        </Box>
        <Stack
          display="flex"
          direction="column"
          height="60%"
          alignItems="center"
        >
          <Typography variant="body1" fontSize="100pt">
            404
          </Typography>
          <Typography
            variant="body1"
            fontSize="25pt"
            sx={{ wordWrap: "break-word", textAlign: "center" }}
          >
            {"Oops, page not found..."}
          </Typography>
          <Typography
            variant="body1"
            sx={{ wordWrap: "break-word", textAlign: "center" }}
          >
            {errorMessage}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Error;

//
