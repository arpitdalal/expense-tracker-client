import {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { ErrorResponse, Sheet } from "use-google-sheets/dist/types";

import { FormData } from "../components/DrawerForm";
import useGoogleSheets from "../hooks/useGoogleSheets";
import { AppContext, AppContextType, serverUrl } from "./appContext";

export type PresetsContextType = {
  data: Sheet[] | null;
  loading: boolean;
  error: ErrorResponse | null;
  handlePresetsAction: (formData?: FormData | undefined) => void;
};

export const PresetsContext = createContext({});

const PresetsContextProvider = (
  props: React.PropsWithChildren<React.ReactNode>
) => {
  const [data, setData] = useState<Sheet[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ErrorResponse | null>(null);

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
              resSheetName: "Presets",
            }),
          })
            .then((resData) => {
              if (resData.status !== 201)
                throw new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Preset Created");
              setSeverity("snack-success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  sheet.data.push({
                    Title: formData.title,
                    Expense: formData.expense,
                  });
                  return sheet;
                });
              setData(newData);
              toggleDrawer(false);
            })
            .catch(() => {
              setOpenAlert(true);
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
              resSheetName: "Presets",
            }),
          })
            .then((resData) => {
              if (resData.status !== 200)
                throw new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Preset Updated");
              setSeverity("snack-success");
              let newData: Sheet[] | null = null;
              newData =
                data &&
                data.map((sheet) => {
                  sheet.data[expenseIdx] = {
                    Title: formData.title,
                    Expense: formData.expense,
                  };
                  return sheet;
                });
              setData(newData);
              toggleDrawer(false);
            })
            .catch(() => {
              setOpenAlert(true);
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
              resSheetName: "Presets",
            }),
          })
            .then((resData) => {
              if (resData.status !== 200)
                throw new Error("Something went wrong");
              setOpenAlert(true);
              setMessage("Preset Deleted");
              setSeverity("snack-success");
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
      data,
      expenseIdx,
      setIsDrawerFormSubmitBtnLoading,
      setIsFetchLoading,
      setMessage,
      setOpenAlert,
      setSeverity,
      toggleDialog,
      toggleDrawer,
    ]
  );

  useEffect(() => {
    setData(googleData);
    setLoading(googleLoading);
    setError(googleError);
  }, [googleData, googleLoading, googleError]);

  return (
    <PresetsContext.Provider
      value={{ data, loading, error, handlePresetsAction }}
      {...props}
    >
      {props.children}
    </PresetsContext.Provider>
  );
};

export default PresetsContextProvider;
