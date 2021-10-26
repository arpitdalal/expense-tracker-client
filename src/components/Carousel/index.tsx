import { Grid, Typography } from "@mui/material";

import NextBtn from "../NextBtn";
import PrevBtn from "../PrevBtn";

type Props = {
  children: React.ReactNode;
};

const Carousel = ({ children }: Props) => {
  return (
    <Grid
      container
      justifyContent='space-between'
      sx={{ mt: "2rem" }}
      color='text.secondary'
    >
      <Grid item textAlign='left'>
        <PrevBtn />
      </Grid>
      <Grid item textAlign='center' flexGrow={1}>
        <Typography variant='h6' component='div'>
          {children}
        </Typography>
      </Grid>
      <Grid item textAlign='right'>
        <NextBtn />
      </Grid>
    </Grid>
  );
};

export default Carousel;
