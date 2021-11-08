import { createContext, useState, useCallback, useEffect } from "react";
import { SwipeableHandlers, useSwipeable } from "react-swipeable";
import { ErrorResponse, Sheet } from "use-google-sheets/dist/types";

import {
  isNextMonthYear,
  isPrevMonthYear,
  generateAddMonthSheetName,
} from "../utils";
import { Severity } from "../components/SnackBarAlert";
import { Action } from "../components/DrawerForm";
import useGoogleSheets from "../hooks/useGoogleSheets";
import PresetsContextProvider from "./presetsContext";
import AddMonthContextProvider from "./addMonthContext";
import TotalMenuContextProvider from "./totalMenuContext";

export type AppContextType = {
  selectedMonthYear: number;
  setSelectedMonthYear: React.Dispatch<React.SetStateAction<number>>;
  monthYears: string[] | null;
  setMonthYears: React.Dispatch<React.SetStateAction<string[] | null>>;
  setNextMonthYear: () => void;
  setPrevMonthYear: () => void;
  drawerOpen: boolean;
  action: Action;
  setAction: React.Dispatch<React.SetStateAction<Action>>;
  expenseData: ExpenseData;
  setExpenseData: React.Dispatch<React.SetStateAction<ExpenseData>>;
  toggleDrawer: (newOpen: boolean, action?: Action) => void;
  expenseIdx: number;
  setExpenseIdx: React.Dispatch<React.SetStateAction<number>>;
  data: Sheet[] | null;
  setData: React.Dispatch<React.SetStateAction<Sheet[] | null>>;
  loading: boolean;
  error: ErrorResponse | null;
  openAlert: boolean;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  openDialog: boolean;
  isDrawerFormSubmitBtnLoading: boolean;
  setIsDrawerFormSubmitBtnLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  severity: Severity;
  setSeverity: React.Dispatch<React.SetStateAction<Severity>>;
  handleAction: (formData?: ExpenseData, customAction?: Action) => void;
  toggleDialog: (newOpen: boolean) => void;
  isFetchLoading: boolean;
  setIsFetchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  total: number[];
  setTotal: React.Dispatch<React.SetStateAction<number[]>>;
  swiperHandlers: SwipeableHandlers;
  handleCarryForwardAction: (
    customAction: Action,
    formData?: ExpenseData | undefined
  ) => void;
  handleTotalActions: (action: TotalActions, formData: ExpenseData) => void;
};

export type ExpenseData = {
  title: string;
  expense: string;
};

export type TotalActions = "Paid" | "Received" | "Carry forward";

export const AppContext = createContext<AppContextType | null>(null);

export const serverSheetUrl = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PATH}sheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}`;
export const serverRowUrl = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PATH}sheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/row`;

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
  const [severity, setSeverity] = useState<Severity | undefined>();

  const setNextMonthYear = useCallback(() => {
    setSelectedMonthYear(selectedMonthYear + 1);
  }, [setSelectedMonthYear, selectedMonthYear]);

  const setPrevMonthYear = useCallback(() => {
    setSelectedMonthYear(selectedMonthYear - 1);
  }, [setSelectedMonthYear, selectedMonthYear]);

  const swipePrevMontYear = useCallback(() => {
    isPrevMonthYear(monthYears, selectedMonthYear) === true &&
      setPrevMonthYear();
  }, [monthYears, selectedMonthYear, setPrevMonthYear]);

  const swipeNextMontYear = useCallback(() => {
    isNextMonthYear(monthYears, selectedMonthYear) === true &&
      setNextMonthYear();
  }, [monthYears, selectedMonthYear, setNextMonthYear]);

  const swiperHandlers = useSwipeable({
    onSwipedLeft: swipeNextMontYear,
    onSwipedRight: swipePrevMontYear,
  });

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
    (formData?: ExpenseData, customAction?: Action, sheetName?: string) => {
      switch (customAction ?? action) {
        case "create": {
          if (!formData) break;

          setIsFetchLoading(true);
          setIsDrawerFormSubmitBtnLoading(true);
          const resSheetName =
            sheetName ??
            (monthYears ? monthYears[selectedMonthYear].replace(" ", "-") : "");

          fetch(serverRowUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              ...formData,
              resSheetName,
            }),
          })
            .then((resData) => {
              if (resData.status !== 201)
                throw new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Expense Created");
              setSeverity("success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  if (sheet.id === resSheetName) {
                    sheet.data.push({
                      Title: formData.title,
                      Expense: formData.expense,
                      CreatedAt: new Date().toLocaleString(),
                    });
                  }
                  return sheet;
                });
              setData(newData);
              toggleDrawer(false);
            })
            .catch(() => {
              setOpenAlert(true);
              setMessage("Something went wrong");
              setSeverity("error");
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
          const resSheetName =
            sheetName ??
            (monthYears ? monthYears[selectedMonthYear].replace(" ", "-") : "");

          fetch(serverRowUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify({
              id: expenseIdx,
              ...formData,
              resSheetName,
            }),
          })
            .then((resData) => {
              if (resData.status !== 200)
                throw new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Expense Updated");
              setSeverity("success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  if (sheet.id === resSheetName) {
                    sheet.data[expenseIdx] = {
                      ...sheet.data[expenseIdx],
                      Title: formData.title,
                      Expense: formData.expense,
                      UpdatedAt: new Date().toLocaleDateString(),
                    };
                  }
                  return sheet;
                });
              setData(newData);
              toggleDrawer(false);
            })
            .catch(() => {
              setOpenAlert(true);
              setMessage("Something went wrong");
              setSeverity("error");
            })
            .finally(() => {
              setIsDrawerFormSubmitBtnLoading(false);
              setIsFetchLoading(false);
            });
          break;
        }
        case "delete": {
          setIsFetchLoading(true);

          const resSheetName =
            sheetName ??
            (monthYears ? monthYears[selectedMonthYear].replace(" ", "-") : "");

          fetch(serverRowUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({
              id: expenseIdx,
              resSheetName,
            }),
          })
            .then((resData) => {
              if (resData.status !== 200)
                throw new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Expense Deleted");
              setSeverity("success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  if (sheet.id === resSheetName) {
                    sheet.data.splice(expenseIdx, 1);
                  }
                  return sheet;
                });
              setData(newData);
            })
            .catch(() => {
              setOpenAlert(true);
              setMessage("Something went wrong");
              setSeverity("error");
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
      toggleDrawer,
      toggleDialog,
    ]
  );

  const handleTotalActions = useCallback(
    (action: TotalActions, formData: ExpenseData) => {
      setIsFetchLoading(true);

      const sheetName = monthYears
        ? monthYears[selectedMonthYear].replace(" ", "-")
        : "";

      fetch(serverRowUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          ...formData,
          resSheetName: sheetName,
        }),
      })
        .then((resData) => {
          if (resData.status !== 201) throw new Error("Something went wrong");
          setOpenAlert(true);
          setMessage(`${action} expense added`);
          setSeverity("success");

          setData((prevData) => {
            if (!prevData) return null;
            const newData: Sheet[] = [...prevData];
            newData.map((sheet) => {
              if (sheet.id === sheetName) {
                sheet.data.push({
                  Title: formData.title,
                  Expense: formData.expense,
                  CreatedAt: new Date().toLocaleDateString(),
                });
              }
              return sheet;
            });
            return newData;
          });
        })
        .catch(() => {
          setOpenAlert(true);
          setMessage("Something went wrong");
          setSeverity("error");
        })
        .finally(() => {
          setIsFetchLoading(false);
        });
    },
    [
      setIsFetchLoading,
      setOpenAlert,
      setMessage,
      setSeverity,
      setData,
      monthYears,
      selectedMonthYear,
    ]
  );

  const handleCarryForwardAction = useCallback(
    (customAction: Action, formData?: ExpenseData) => {
      if (!formData || customAction !== "create") return;

      setIsFetchLoading(true);

      const sheetName = generateAddMonthSheetName(data || []);
      fetch(serverRowUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          ...formData,
          resSheetName: sheetName,
        }),
      })
        .then((resData) => {
          if (resData.status !== 201) throw new Error("Something went wrong");
          setOpenAlert(true);
          setMessage("Carry forward expense added");
          setSeverity("success");

          setData((prevData) => {
            if (!prevData) return null;
            const newData: Sheet[] = [...prevData];
            newData.push({ id: sheetName, data: [] });
            newData[newData.length - 1].data.push({
              Title: formData.title,
              Expense: formData.expense,
              CreatedAt: new Date().toLocaleDateString(),
            });
            return newData;
          });
          handleTotalActions("Carry forward", {
            title: `Carry forwarded to ${sheetName.split("-")[0]}`,
            expense: formData.expense.replace("-", ""),
          });
        })
        .catch(() => {
          setOpenAlert(true);
          setMessage("Something went wrong");
          setSeverity("error");
        })
        .finally(() => {
          setIsFetchLoading(false);
        });
    },
    [
      setOpenAlert,
      setMessage,
      setSeverity,
      setIsFetchLoading,
      handleTotalActions,
      setData,
      data,
    ]
  );

  useEffect(() => {
    const filteredGoogleData =
      googleData && googleData.filter(({ id }) => !id.includes("Presets"));
    setData(filteredGoogleData);
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
        setAction,
        drawerOpen,
        expenseData,
        setExpenseData,
        toggleDrawer,
        expenseIdx,
        setExpenseIdx,
        data,
        setData,
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
        swiperHandlers,
        setIsDrawerFormSubmitBtnLoading,
        setIsFetchLoading,
        setMessage,
        setSeverity,
        handleCarryForwardAction,
        handleTotalActions,
      }}
      {...props}
    >
      <PresetsContextProvider>
        <AddMonthContextProvider>
          <TotalMenuContextProvider>{props.children}</TotalMenuContextProvider>
        </AddMonthContextProvider>
      </PresetsContextProvider>
    </AppContext.Provider>
  );
};

export default AppContextProvider;
