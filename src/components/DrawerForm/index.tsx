import { useState, useContext, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { Send } from "@mui/icons-material";
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

  const {
    setExpenseData,
    expenseData,
    isDrawerFormSubmitBtnLoading,
    handleAction,
  } = useContext(AppContext) as AppContextType;
  const { data, handlePresetsAction, setData } = useContext(
    PresetsContext
  ) as PresetsContextType;

  const { pathname } = useLocation();

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      pathname.includes("presets")
        ? handlePresetsAction(formData)
        : handleAction(formData);
    },
    [handleAction, handlePresetsAction, formData, pathname]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData, setFormData, expenseData, setExpenseData]
  );

  const handlePresetAction = useCallback(
    (
      action: PresetAction,
      { title, expense }: ExpenseData,
      idx: number
    ): void => {
      setExpenseData({ ...expenseData, title, expense });
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
    [setFormData, formData, setExpenseData, expenseData, setData, data]
  );

  const btnTextBool = expenseData.title !== "" && expenseData.expense !== "";

  useEffect(() => {
    btnTextBool && setBtnText("Update");
  }, [btnTextBool]);

  useEffect(() => {
    setFormData(expenseData);
  }, [expenseData]);

  return (
    <>
      {!pathname.includes("presets") && (
        <Presets handlePresetAction={handlePresetAction} />
      )}
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
        <Box component='div'>
          <LoadingButton
            loading={isDrawerFormSubmitBtnLoading}
            type='submit'
            color='primary'
            variant='contained'
            loadingPosition='end'
            endIcon={<Send />}
          >
            {btnText}
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default DrawerForm;
