import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import packageJson from "../../../package.json";

const Footer = () => {
  return (
    <Box mt='2rem' width='100%' textAlign='center'>
      <Typography component='small' variant='body2'>
        v{packageJson.version}
      </Typography>
    </Box>
  );
};

export default Footer;
