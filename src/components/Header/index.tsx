import { Toolbar, Typography } from "@mui/material";

const Header = () => {
  return (
    <Toolbar>
      <Typography
        marginTop='1.5rem'
        width='100%'
        textAlign='center'
        variant='h3'
        component='h1'
      >
        ExTrack
      </Typography>
    </Toolbar>
  );
};

export default Header;
