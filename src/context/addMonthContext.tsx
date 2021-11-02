import { useContext, createContext, useCallback } from "react";

import { AppContext, AppContextType, serverUrl } from "./appContext";

export type AddMonthContextType = {
  handleAddMonth: () => Promise<void>;
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const AddMonthContext = createContext({});

const AddMonthContextProvider = (
  props: React.PropsWithChildren<React.ReactNode>
) => {
  const {
    data,
    setIsFetchLoading,
    setOpenAlert,
    setMessage,
    setSeverity,
    setData,
  } = useContext(AppContext) as AppContextType;

  const handleAddMonthAction = useCallback(
    (sheetName: string) => {
      setIsFetchLoading(true);

      fetch(`${serverUrl}/add-month`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          resSheetName: sheetName,
        }),
      })
        .then((resData) => {
          if (resData.status !== 201) throw new Error("Something went wrong");
          setOpenAlert(true);
          setMessage("Month Added");
          setSeverity("snack-success");
          setData(
            (prevData) => prevData && [...prevData, { id: sheetName, data: [] }]
          );
        })
        .catch(() => {
          setOpenAlert(true);
          setMessage("Something went wrong");
          setSeverity("snack-error");
        })
        .finally(() => {
          setIsFetchLoading(false);
        });
    },
    [setOpenAlert, setMessage, setSeverity, setData, setIsFetchLoading]
  );

  const handleAddMonth = useCallback(() => {
    if (!data) return;
    const date = new Date();
    const lastMonthInData: string = data[data.length - 1].id.split("-")[0];
    const monthIndex: number = months.indexOf(lastMonthInData);
    date.setMonth(monthIndex + 1);

    const lastYearInData: string = data[data.length - 1].id.split("-")[1];
    const year: string = date.toLocaleString("default", {
      year: "2-digit",
    });
    if (monthIndex !== 11 && lastYearInData !== year) {
      date.setFullYear(date.getFullYear() + 1);
      console.log(date.getFullYear());
    }

    const sheetName = `${date.toLocaleString("default", {
      month: "short",
    })}-${date.toLocaleString("default", {
      year: "2-digit",
    })}`;
    handleAddMonthAction(sheetName);
  }, [data, handleAddMonthAction]);

  return (
    <AddMonthContext.Provider value={{ handleAddMonth }} {...props}>
      {props.children}
    </AddMonthContext.Provider>
  );
};

export default AddMonthContextProvider;
