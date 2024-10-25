import React, { useContext, useState } from "react";
import { AllContext } from "../../../../../context/UserContext";
import EastIcon from "@mui/icons-material/East";
import DeleteCompanyDialog from "./DeleteCompanyDialog";
import AdminDialog from "./AdminDialog";
const Setting = () => {
  const { setLoading } = useContext(AllContext);
  const [adminDialog, setAdminDialog] = useState(false);
  const [deleteCompanyDialog, setDeleteCompanyDialog] = useState(false);
  return (
    <div className=' border-2 border-gray-400 bg-white pb-5 border-opacity-40 rounded-lg'>
      <DeleteCompanyDialog
        deleteCompanyDialog={deleteCompanyDialog}
        setDeleteCompanyDialog={setDeleteCompanyDialog}
        setLoading={setLoading}
      />
      <AdminDialog
        adminDialog={adminDialog}
        setAdminDialog={setAdminDialog}
        setLoading={setLoading}
      />
      <div className='p-2 pl-4'>
        <p className=' font-semibold text-xl'>Settings</p>
      </div>
      <div className=' '>
        <div
          onClick={() => {
            setAdminDialog(true);
          }}
          className='p-2 flex justify-between items-center pl-4 cursor-pointer  hover:bg-[#F3F3F3] '
        >
          <div>
            <p className='text-[#444444] text-[18px] mt-2 font-semibold'>
              Manage admins
            </p>
            <p className='opacity-75 text-[#7e7979]'>
              Control who manages your page
            </p>
          </div>
          <div className='mr-8'>
            <EastIcon fontSize='medium' />
          </div>
        </div>
        <div
          onClick={() => {
            setDeleteCompanyDialog(true);
          }}
          className='p-2 flex  justify-between items-center pl-4 cursor-pointer  hover:bg-[#F3F3F3] '
        >
          <div>
            <p className='text-[#444444] text-[18px] mt-2 font-semibold'>
              Deactivate page
            </p>
            <p className='opacity-75 text-[#7e7979]'>Take your page down</p>
          </div>
          <div className='mr-8'>
            <EastIcon fontSize='medium' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
