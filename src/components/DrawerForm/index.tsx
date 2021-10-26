import { useState, useContext, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { Send } from "@mui/icons-material";

import {
  AppContext,
  AppContextType,
  ExpenseData,
} from "../../context/appContext";
import {
  PresetsContext,
  PresetsContextType,
} from "../../context/presetsContext";

export type Action = "update" | "create" | "delete" | "";

export type FormData = {
  title: string;
  expense: string;
};

const DrawerForm = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    expense: "",
  });

  const {
    setExpenseData,
    expenseData,
    isDrawerFormSubmitBtnLoading,
    handleAction,
  } = useContext(AppContext) as AppContextType;
  const { handlePresetsAction, data, loading, error } = useContext(
    PresetsContext
  ) as PresetsContextType;

  const { pathname } = useLocation();

  const handleFormSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>): void => {
      e && e.preventDefault();
      pathname.includes("presets")
        ? handlePresetsAction(formData)
        : handleAction(formData);
      handleAction(formData);
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

  const handleAddPreset = useCallback(
    ({ title, expense }: ExpenseData): void => {
      setFormData((prevFormData) => {
        return { ...prevFormData, title, expense };
      });
    },
    []
  );

  useEffect(() => {
    setFormData(expenseData);
  }, [expenseData]);

  return (
    <>
      {!pathname.includes("presets") &&
        !loading &&
        !error &&
        formData.title === "" &&
        formData.expense === "" &&
        data &&
        data[0].data.map((preset: any, idx) => (
          <Button
            key={`${preset.Title}-${idx}`}
            variant='outlined'
            onClick={() => {
              handleAddPreset({
                title: preset.Title,
                expense: preset.Expense,
              });
            }}
          >
            Add {preset.Title} preset
          </Button>
        ))}
      <Box
        component='form'
        sx={{
          "& > :not(style)": { m: 1 },
        }}
        marginTop='2rem'
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
            {expenseData.title === "" && expenseData.expense === ""
              ? "Create"
              : "Update"}
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default DrawerForm;
