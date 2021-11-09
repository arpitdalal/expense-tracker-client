import { Skeleton } from "@mui/material";
import { Box } from "@mui/system";

import { useStyles } from "../../pages/Home";

const AnimatedSkeleton = () => {
  const classes = useStyles();

  return (
    <>
      <Skeleton animation='wave' height='50px' />
      <Skeleton animation='wave' height='150px' width='320px' />
      <Box className={classes.flexWrapper}>
        <Skeleton animation='wave' height='150px' component='div' />
        <Skeleton animation='wave' height='150px' component='div' />
        <Skeleton animation='wave' height='150px' component='div' />
        <Skeleton animation='wave' height='150px' component='div' />
        <Skeleton animation='wave' height='150px' component='div' />
        <Skeleton animation='wave' height='150px' component='div' />
      </Box>
    </>
  );
};

export default AnimatedSkeleton;
