import { useState, useContext, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { TextField, Typography, Box, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { HelpRounded, Send } from "@mui/icons-material";
import { Sheet } from "use-google-sheets/dist/types";

import {
  AppContext,
  AppContextType,
  ExpenseData,
} from "../../context/appContext";
import {
  PresetsContext,
  PresetsContextType,
} from "../../context/presetsContext";
import Presets from "../Presets";
import Switch from "../Switch";
import {
  DialogBoxContext,
  DialogBoxContextType,
} from "../../context/dialogBoxContext";
import DialogBox from "../DialogBox";

export type Action = "update" | "create" | "delete" | "";
export type PresetAction = "remove" | "add";
export type HandlePresetAction = (
  action: PresetAction,
  { title, expense }: ExpenseData,
  idx: number
) => void;

const DrawerForm = () => {
  const [formData, setFormData] = useState<ExpenseData>({
    title: "",
    expense: "",
  });
  const [btnText, setBtnText] = useState<string>("Create");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);

  const {
    setExpenseData,
    expenseData,
    isDrawerFormSubmitBtnLoading,
    handleAction,
  } = useContext(AppContext) as AppContextType;
  const { data, handlePresetsAction, setData } = useContext(
    PresetsContext
  ) as PresetsContextType;
  const { setOpen } = useContext(DialogBoxContext) as DialogBoxContextType;

  const btnTextBool = useRef(
    expenseData.title !== "" && expenseData.expense !== ""
  );

  const { pathname } = useLocation();

  const isPresetsPage = pathname === "/presets";

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      setExpenseData({
        ...expenseData,
        title: formData.title,
        expense: formData.expense,
      });
      pathname.includes("presets")
        ? handlePresetsAction(formData)
        : handleAction(formData);
    },
    [
      setExpenseData,
      expenseData,
      handleAction,
      handlePresetsAction,
      formData,
      pathname,
    ]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData, setFormData]
  );

  const handlePresetAction = useCallback(
    (
      action: PresetAction,
      { title, expense }: ExpenseData,
      idx: number
    ): void => {
      setFormData({ ...formData, title, expense });

      let newData: Sheet[] | null = null;
      if (action === "add") {
        newData =
          data &&
          data.map((sheet) => {
            let newSheet = sheet;
            newSheet.data.map((expense: any, id) => {
              if (id !== idx) expense.disabled = true;
              return expense as Sheet;
            });
            return newSheet;
          });
      } else {
        newData =
          data &&
          data.map((sheet) => {
            let newSheet = sheet;
            newSheet.data.map((expense: any) => {
              expense.disabled = false;
              return expense as Sheet;
            });
            return newSheet;
          });
      }
      newData && setData(newData);
    },
    [setFormData, formData, setData, data]
  );

  const openDialogBox = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  useEffect(() => {
    btnTextBool.current && setBtnText("Update");
  }, [btnTextBool]);

  useEffect(() => {
    if (formData.title === "" || formData.expense === "") {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
  }, [formData]);

  useEffect(() => {
    setFormData(expenseData);
  }, [expenseData]);

  return (
    <>
      <Typography variant='h4' textAlign='center'>
        {formData.title}
      </Typography>
      {!isPresetsPage && <Presets handlePresetAction={handlePresetAction} />}
      <Box
        component='form'
        sx={{
          "& > :not(style)": { m: 1 },
        }}
        marginTop='1rem'
        noValidate
        onSubmit={handleFormSubmit}
        textAlign='center'
      >
        <TextField
          label='Title'
          value={formData.title}
          name='title'
          onChange={handleChange}
        />
        <TextField
          label='Expense'
          value={formData.expense}
          name='expense'
          onChange={handleChange}
        />
        {isPresetsPage && (
          <Box component='div'>
            <Switch />
            <IconButton onClick={openDialogBox} sx={{ padding: "0" }}>
              <HelpRounded />
            </IconButton>
            <DialogBox content='If this is checked, this preset will be automatically added to new months.' />
          </Box>
        )}
        <Box component='div'>
          <LoadingButton
            loading={isDrawerFormSubmitBtnLoading}
            type='submit'
            color='primary'
            variant='contained'
            loadingPosition='end'
            endIcon={<Send />}
            disabled={isSubmitDisabled}
          >
            {btnText}
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default DrawerForm;
