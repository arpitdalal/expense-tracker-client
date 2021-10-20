import { useState, useContext, useCallback } from "react";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Send } from "@mui/icons-material";

import { AppContext, ContextType } from "../../context/appContext";

type Props = {
  title: string;
  expense: string;
  idx: number;
  action: "update" | "create" | "delete";
};

type FormData = {
  title: string;
  expense: string;
};

const DrawerForm = ({ title, expense, idx, action }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    title,
    expense,
  });

  const { monthYears, selectedMonthYear } = useContext(
    AppContext
  ) as ContextType;

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      switch (action) {
        case "update": {
          await fetch(
            `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PATH}sheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              method: "PATCH",
              body: JSON.stringify({
                id: idx,
                title: formData.title,
                expense: formData.expense,
                resSheetName: monthYears && monthYears[selectedMonthYear],
              }),
            }
          )
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
          break;
        }
      }
    },
    [action, formData, idx, monthYears, selectedMonthYear]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData]
  );

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
        <Button
          type='submit'
          color='primary'
          variant='contained'
          endIcon={<Send />}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default DrawerForm;
