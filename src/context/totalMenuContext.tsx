import {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { AppContext, AppContextType } from "./appContext";
import { getLastMonthInData, LastMonthInData } from "../utils";
import {
  TotalActionsContext,
  TotalActionsContextType,
} from "./totalActionsContext";

export type TotalMenuContextType = {
  shouldShow: boolean;
  setShouldShow: React.Dispatch<React.SetStateAction<boolean>>;
  handleCarryForwardClick: () => void;
  handlePaidClick: () => void;
  handleReceivedClick: () => void;
};

export const TotalMenuContext = createContext({});

const TotalMenuContextProvider = (
  props: React.PropsWithChildren<React.ReactNode>
) => {
  const [shouldShow, setShouldShow] = useState(false);

  const { data, selectedMonthYear, total } = useContext(
    AppContext
  ) as AppContextType;
  const { handleTotalActions, handleCarryForwardAction } = useContext(
    TotalActionsContext
  ) as TotalActionsContextType;

  const handleCarryForwardClick = useCallback(() => {
    handleCarryForwardAction("create", {
      title: `Amount forward from ${
        data && data[selectedMonthYear].id.split("-")[0]
      }`,
      expense: String(total[selectedMonthYear]),
    });
  }, [handleCarryForwardAction, total, selectedMonthYear, data]);

  const handlePaidClick = useCallback(() => {
    handleTotalActions("Paid", {
      title: "Paid",
      expense: String(-total[selectedMonthYear]),
    });
  }, [handleTotalActions, total, selectedMonthYear]);

  const handleReceivedClick = useCallback(() => {
    handleTotalActions("Received", {
      title: "Received",
      expense: String(-total[selectedMonthYear]),
    });
  }, [handleTotalActions, total, selectedMonthYear]);

  useEffect(() => {
    if (!data || data.length < 1) return;

    let currentMonth = new Date().getMonth();
    const { lastMonthInDataIndex }: LastMonthInData = getLastMonthInData(data);
    if (currentMonth === 0 && lastMonthInDataIndex !== 0) currentMonth = 12;
    const dataLength = data?.length || 0;

    if (
      currentMonth > lastMonthInDataIndex &&
      dataLength - 1 === selectedMonthYear
    ) {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }
  }, [setShouldShow, data, selectedMonthYear]);

  return (
    <TotalMenuContext.Provider
      value={{
        shouldShow,
        setShouldShow,
        handleCarryForwardClick,
        handlePaidClick,
        handleReceivedClick,
      }}
      {...props}
    >
      {props.children}
    </TotalMenuContext.Provider>
  );
};

export default TotalMenuContextProvider;
