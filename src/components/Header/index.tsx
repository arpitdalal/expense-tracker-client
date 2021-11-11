import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link, Toolbar, Typography, Box } from "@mui/material";

const Header = () => {
  const location = useLocation();

  return (
    <Toolbar
      sx={{
        flexDirection: "column",
      }}
    >
      <Typography variant='h3' component='h1'>
        ExTrack
      </Typography>
      <Box display='flex' gap='0.8rem' marginTop='0.8rem'>
        <Link
          component={RouterLink}
          to='/'
          underline={location && location.pathname === "/" ? "always" : "none"}
          variant='body1'
        >
          Expenses
        </Link>
        <Link
          component={RouterLink}
          to='/presets'
          underline={
            location && location.pathname.includes("presets")
              ? "always"
              : "none"
          }
          variant='body1'
        >
          Presets
        </Link>
      </Box>
    </Toolbar>
  );
};

export default Header;
