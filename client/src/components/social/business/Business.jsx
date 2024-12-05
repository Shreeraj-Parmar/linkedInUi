import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SnakBar from "../../SnakBar";
import { AllContext } from "../../../context/UserContext";
import { checkAccountStatus } from "../../../services/api";
import Loader from "../../../../src/components/Loader/Loader";

// components:
import Navbar from "../Navbar";

// icons:
import BusinessIcon from "@mui/icons-material/Business";
const Business = () => {
  const [snak, setSnak] = useState({ type: null, text: null });
  const { currUserData, setIsSnakBar, setLoading } = useContext(AllContext);

  const navigate = useNavigate();

  const handleNavigate = async () => {
    setIsSnakBar(true);
    setLoading(true);

    let res = await checkAccountStatus();
    if (res.status === 200) {

      setTimeout(() => {
        navigate("/company/new");
      }, 500);
    } else if (res.status === 201) {
      setSnak({
        type: "error",
        text: `${res.data.message}`,
      });
    }
    setLoading(false);
  };
  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        <Loader />
        {snak.type && <SnakBar type={snak.type} text={snak.text} />}

        <div className='main-display w-[80vw]  min-h-[100vh] h-fit m-auto mt-[55px] p-4'>
          <div className=' flex mt-10 flex-col justify-center items-center '>
            <p className='text-[32px] text-[#444444] '>Create a Company Page</p>
            <p className=' mt-2 opacity-75'>
              Connect with clients, employees, and the LinkedIn community. To
              get started, choose a page type.
            </p>
          </div>
          <div className=' flex mt-12  justify-center items-center'>
            <div
              onClick={() => {
                setIsSnakBar(true);
                if (!currUserData.payment_method || !currUserData.payment_method === "") {
                  setSnak({
                    type: "error",
                    text: "Please First Connect Payment Method Then Create Company Page",
                  });
                  return;
                }
                handleNavigate();
              }}
              className='  flex cursor-pointer  flex-col justify-center items-center border-[3px] hover:border-opacity-100 border-gray-400 border-opacity-40 w-fit p-3 rounded-md'
            >
              <BusinessIcon sx={{ fontSize: "100px", color: "#444444" }} />
              <p>Company</p>
              <p>small, medium & large businesses</p>
            </div>
          </div>
          <div className=' mt-10 flex justify-center items-center'>
            <img
              src='/business.png'
              alt='business image'
              className='w-[1500px] h-[800px] '
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;
