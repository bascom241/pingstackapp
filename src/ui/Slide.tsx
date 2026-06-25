import Slide from "@mui/material/Slide";

export function SlowSlide(props: any ) {
  return (
    <Slide
      {...props}
      timeout={{
        enter: 400,  // slower appear
        exit: 400,   // slower disappear
      }}
    />
  );
}