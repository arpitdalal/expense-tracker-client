import { createContext, useState, useCallback } from "react";

export type DialogBoxContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleClose: () => void;
};

export const DialogBoxContext = createContext<DialogBoxContextType | null>(
  null
);

const DialogBoxContextProvider = (
  props: React.PropsWithChildren<React.ReactNode>
) => {
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  return (
    <DialogBoxContext.Provider
      value={{ open, setOpen, handleClose }}
      {...props}
    >
      {props.children}
    </DialogBoxContext.Provider>
  );
};

export default DialogBoxContextProvider;
