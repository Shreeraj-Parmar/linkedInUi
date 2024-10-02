import Dialog from "@mui/material/Dialog";
import { useEffect, useState, React } from "react";

const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: "auto",
  width: "470px",
  maxHeight: "140px",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F4F2EE",
};

const CheckInternet = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return (
    <Dialog open={!isOnline} PaperProps={{ sx: dialogStyle }}>
      <div className="bg-[#F4F2EE] w-[450px] overflow-hidden p-5 rounded-[20px]">
        <p className="text-center font-bold text-2xl text-[#434343]">
          Opps! Check Your Internet Connection
        </p>
      </div>
    </Dialog>
  );
};

export default CheckInternet;
