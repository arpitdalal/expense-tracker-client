import { useEffect, useState } from "react";
import useGoogleSheets from "use-google-sheets";
import { ErrorResponse, Sheet } from "use-google-sheets/dist/types";

const useGoogleSheetsFunc = (sheetName?: string) => {
  const [googleData, setGoogleData] = useState<Sheet[] | null>(null);
  const [googleLoading, setGoogleLoading] = useState<boolean>(true);
  const [googleError, setGoogleError] = useState<ErrorResponse | null>(null);

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY as string;
  const sheetId = process.env.REACT_APP_GOOGLE_SHEETS_ID as string;

  const { data, loading, error } = useGoogleSheets({
    apiKey,
    sheetId,
    sheetsNames: sheetName ? [sheetName] : [],
  });

  useEffect(() => {
    setGoogleData(data);
    setGoogleLoading(loading);
    setGoogleError(error);
  }, [data, loading, error]);

  return { googleData, googleLoading, googleError };
};

export default useGoogleSheetsFunc;
