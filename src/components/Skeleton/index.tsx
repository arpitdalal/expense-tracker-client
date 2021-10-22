import { Skeleton } from "@mui/material";

const AnimatedSkeleton = () => {
  return (
    <>
      <Skeleton animation='wave' height='50px' />
      <Skeleton animation='wave' height='150px' />
      <Skeleton animation='wave' height='150px' />
      <Skeleton animation='wave' height='150px' />
      <Skeleton animation='wave' height='50px' width='400px' />
    </>
  );
};

export default AnimatedSkeleton;
