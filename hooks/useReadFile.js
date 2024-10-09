import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";

const useReadFile = (fileName) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const readFile = async () => {
      try {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        const jsonData = JSON.parse(fileContent);
        setData(jsonData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    readFile();
  }, [fileName]);

  return { data, error, loading };
};

export default useReadFile;
