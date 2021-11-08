import {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { ErrorResponse, Sheet } from "use-google-sheets/dist/types";

import useGoogleSheets from "../hooks/useGoogleSheets";
import {
  AppContext,
  AppContextType,
  ExpenseData,
  serverRowUrl,
} from "./appContext";

export type PresetsContextType = {
  data: Sheet[] | null;
  setData: React.Dispatch<React.SetStateAction<Sheet[] | null>>;
  loading: boolean;
  error: ErrorResponse | null;
  handlePresetsAction: (formData?: ExpenseData | undefined) => void;
  isSwitchSelected: boolean;
  setIsSwitchSelected: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PresetsContext = createContext({});

const PresetsContextProvider = (
  props: React.PropsWithChildren<React.ReactNode>
) => {
  const [data, setData] = useState<Sheet[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [isSwitchSelected, setIsSwitchSelected] = useState<boolean>(false);

  const { googleData, googleLoading, googleError } = useGoogleSheets("Presets");

  const {
    action,
    setIsFetchLoading,
    setIsDrawerFormSubmitBtnLoading,
    setOpenAlert,
    setMessage,
    setSeverity,
    toggleDrawer,
    expenseIdx,
    toggleDialog,
  } = useContext(AppContext) as AppContextType;

  const handlePresetsAction = useCallback(
    (formData?: ExpenseData) => {
      switch (action) {
        case "create": {
          if (!formData) break;

          setIsFetchLoading(true);
          setIsDrawerFormSubmitBtnLoading(true);

          fetch(serverRowUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              ...formData,
              ShouldAddToNextMonth: isSwitchSelected ? "1" : "0",
              resSheetName: "Presets",
            }),
          })
            .then((resData) => {
              if (resData.status !== 201)
                throw new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Preset Created");
              setSeverity("success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  sheet.data.push({
                    Title: formData.title,
                    Expense: formData.expense,
                    ShouldAddToNextMonth: isSwitchSelected ? "1" : "0",
                    CreatedAt: new Date().toLocaleDateString(),
                  });
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

          fetch(serverRowUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify({
              id: expenseIdx,
              ...formData,
              ShouldAddToNextMonth: isSwitchSelected ? "1" : "0",
              resSheetName: "Presets",
            }),
          })
            .then((resData) => {
              if (resData.status !== 200)
                throw new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Preset Updated");
              setSeverity("success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  sheet.data[expenseIdx] = {
                    ...sheet.data[expenseIdx],
                    Title: formData.title,
                    Expense: formData.expense,
                    ShouldAddToNextMonth: isSwitchSelected ? "1" : "0",
                    UpdatedAt: new Date().toLocaleDateString(),
                  };
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

          fetch(serverRowUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({
              id: expenseIdx,
              resSheetName: "Presets",
            }),
          })
            .then((resData) => {
              if (resData.status !== 200)
                throw new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Preset Deleted");
              setSeverity("success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  sheet.data.splice(expenseIdx, 1);
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
      data,
      expenseIdx,
      setIsDrawerFormSubmitBtnLoading,
      setIsFetchLoading,
      setMessage,
      setOpenAlert,
      setSeverity,
      toggleDialog,
      toggleDrawer,
      isSwitchSelected,
    ]
  );

  useEffect(() => {
    const modifiedGoogleData =
      googleData &&
      googleData.map((sheet) => {
        sheet.data = sheet.data.map((row) => {
          return {
            ...row,
            disabled: false,
          };
        });
        return sheet;
      });
    setData(modifiedGoogleData);
    setLoading(googleLoading);
    setError(googleError);
  }, [googleData, googleLoading, googleError]);

  return (
    <PresetsContext.Provider
      value={{
        data,
        setData,
        loading,
        error,
        handlePresetsAction,
        isSwitchSelected,
        setIsSwitchSelected,
      }}
      {...props}
    >
      {props.children}
    </PresetsContext.Provider>
  );
};

export default PresetsContextProvider;
