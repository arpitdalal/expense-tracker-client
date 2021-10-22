import { createContext, useState, useCallback, useEffect } from "react";
import { ErrorResponse, Sheet } from "use-google-sheets/dist/types";
import { Severity } from "../components/Alert";

import { Action, FormData } from "../components/DrawerForm";
import useGoogleSheets from "../hooks/useGoogleSheets";

export type ContextType = {
  selectedMonthYear: number;
  setSelectedMonthYear: React.Dispatch<React.SetStateAction<number>>;
  monthYears: string[] | null;
  setMonthYears: React.Dispatch<React.SetStateAction<string[] | null>>;
  setNextMonthYear: () => void;
  setPrevMonthYear: () => void;
  drawerOpen: boolean;
  action: Action;
  expenseData: ExpenseData;
  setExpenseData: React.Dispatch<React.SetStateAction<ExpenseData>>;
  toggleDrawer: (newOpen: boolean, action?: Action) => void;
  expenseIdx: number;
  setExpenseIdx: React.Dispatch<React.SetStateAction<number>>;
  data: Sheet[] | null;
  loading: boolean;
  error: ErrorResponse | null;
  openAlert: boolean;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  openDialog: boolean;
  isDrawerFormSubmitBtnLoading: boolean;
  message: string;
  severity: Severity;
  handleAction: (formData?: FormData | undefined) => void;
  toggleDialog: (newOpen: boolean) => void;
  isFetchLoading: boolean;
  total: number[];
  setTotal: React.Dispatch<React.SetStateAction<number[]>>;
};

export type ExpenseData = {
  title: string;
  expense: string;
};

export const AppContext = createContext<ContextType | null>(null);

const AppContextProvider = (
  props: React.PropsWithChildren<React.ReactNode>
) => {
  const [selectedMonthYear, setSelectedMonthYear] = useState<number>(0);
  const [monthYears, setMonthYears] = useState<string[] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [action, setAction] = useState<Action>("");
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    title: "",
    expense: "",
  });
  const [expenseIdx, setExpenseIdx] = useState<number>(0);
  const [data, setData] = useState<Sheet[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(true);
  const [isDrawerFormSubmitBtnLoading, setIsDrawerFormSubmitBtnLoading] =
    useState<boolean>(false);
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [total, setTotal] = useState<number[]>([]);
  const [severity, setSeverity] = useState<Severity>("");

  const serverUrl = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PATH}sheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}`;

  const setNextMonthYear = useCallback(() => {
    setSelectedMonthYear(selectedMonthYear + 1);
  }, [setSelectedMonthYear, selectedMonthYear]);

  const setPrevMonthYear = useCallback(() => {
    setSelectedMonthYear(selectedMonthYear - 1);
  }, [setSelectedMonthYear, selectedMonthYear]);

  const { googleData, googleLoading, googleError } = useGoogleSheets();

  const toggleDrawer = useCallback(
    (newOpen: boolean, action?: Action) => {
      setDrawerOpen(newOpen);
      if (action === "create" || !newOpen) {
        setExpenseData({ title: "", expense: "" });
      }
      action && setAction(action);
    },
    [setDrawerOpen, setExpenseData, setAction]
  );

  const toggleDialog = useCallback(
    (newOpen: boolean) => {
      setOpenDialog(newOpen);
      newOpen && setAction("delete");
    },
    [setOpenDialog, setAction]
  );

  const handleAction = useCallback(
    (formData?: FormData) => {
      switch (action) {
        case "create": {
          if (!formData) break;

          setIsFetchLoading(true);
          setIsDrawerFormSubmitBtnLoading(true);

          fetch(serverUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              ...formData,
              resSheetName:
                monthYears && monthYears[selectedMonthYear].replace(" ", "-"),
            }),
          })
            .then((resData) => {
              resData.status !== 201 && new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Expense Created");
              setSeverity("snack-success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  if (
                    sheet.id ===
                    (monthYears &&
                      monthYears[selectedMonthYear].replace(" ", "-"))
                  ) {
                    sheet.data.push({
                      Title: formData.title,
                      Expense: formData.expense,
                    });
                  }
                  return sheet;
                });
              setData(newData);
              toggleDrawer(false);
            })
            .catch(() => {
              setMessage("Something went wrong");
              setSeverity("snack-error");
            })
            .finally(() => {
              setIsDrawerFormSubmitBtnLoading(false);
              setIsFetchLoading(false);
            });
          break;
        }
        case "update": {
          if (!formData) break;

          setIsFetchLoading(true);
          setIsDrawerFormSubmitBtnLoading(true);

          fetch(serverUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify({
              id: expenseIdx,
              ...formData,
              resSheetName:
                monthYears && monthYears[selectedMonthYear].replace(" ", "-"),
            }),
          })
            .then((resData) => {
              resData.status !== 200 && new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Expense Updated");
              setSeverity("snack-success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  if (
                    sheet.id ===
                    (monthYears &&
                      monthYears[selectedMonthYear].replace(" ", "-"))
                  ) {
                    sheet.data[expenseIdx] = {
                      Title: formData.title,
                      Expense: formData.expense,
                    };
                  }
                  return sheet;
                });
              setData(newData);
              toggleDrawer(false);
            })
            .catch(() => {
              setMessage("Something went wrong");
              setSeverity("snack-error");
            })
            .finally(() => {
              setIsDrawerFormSubmitBtnLoading(false);
              setIsFetchLoading(false);
            });
          break;
        }
        case "delete": {
          setIsFetchLoading(true);

          fetch(serverUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({
              id: expenseIdx,
              resSheetName:
                monthYears && monthYears[selectedMonthYear].replace(" ", "-"),
            }),
          })
            .then((resData) => {
              resData.status !== 200 && new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Expense Deleted");
              setSeverity("snack-success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  if (
                    sheet.id ===
                    (monthYears &&
                      monthYears[selectedMonthYear].replace(" ", "-"))
                  ) {
                    sheet.data.splice(expenseIdx, 1);
                  }
                  return sheet;
                });
              setData(newData);
            })
            .catch(() => {
              setMessage("Something went wrong");
              setSeverity("snack-error");
            })
            .finally(() => {
              toggleDialog(false);
              setIsFetchLoading(false);
            });
          break;
        }
        default: {
          break;
        }
      }
    },
    [
      action,
      monthYears,
      selectedMonthYear,
      setOpenAlert,
      setMessage,
      setSeverity,
      setIsDrawerFormSubmitBtnLoading,
      data,
      setIsFetchLoading,
      setData,
      expenseIdx,
      serverUrl,
      toggleDrawer,
      toggleDialog,
    ]
  );

  useEffect(() => {
    setData(googleData);
    setLoading(googleLoading);
    setError(googleError);
  }, [googleData, googleLoading, googleError]);

  return (
    <AppContext.Provider
      value={{
        monthYears,
        setMonthYears,
        selectedMonthYear,
        setSelectedMonthYear,
        setNextMonthYear,
        setPrevMonthYear,
        action,
        drawerOpen,
        expenseData,
        setExpenseData,
        toggleDrawer,
        expenseIdx,
        setExpenseIdx,
        data,
        error,
        loading,
        isDrawerFormSubmitBtnLoading,
        message,
        openAlert,
        openDialog,
        setOpenAlert,
        severity,
        handleAction,
        toggleDialog,
        isFetchLoading,
        total,
        setTotal,
      }}
      {...props}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
