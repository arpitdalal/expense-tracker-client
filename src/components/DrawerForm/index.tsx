import { useState, useContext, useCallback, useEffect } from "react";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { Send } from "@mui/icons-material";

import { AppContext, ContextType } from "../../context/appContext";

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
  } = useContext(AppContext) as ContextType;

  const handleFormSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>): void => {
      e && e.preventDefault();
      handleAction(formData);
    },
    [handleAction, formData]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData, setFormData, expenseData, setExpenseData]
  );

  useEffect(() => {
    setFormData(expenseData);
  }, [expenseData]);

  return (
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
  );
};

export default DrawerForm;
