import React from "react";
import {
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import Button from "../Reusable Components/Button";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";

//MUI-style:
const Tcell = styled(TableCell)`
  ${"" /* border: 2px solid red; */}
  font-weight: 700;
  ${"" /* font-size: 16px; */}
`;

const ListsTable = ({ allData }) => {
  const navigate = useNavigate();
  // Add a null check to ensure allData is an array before using it
  return (
    <div className="list-table-wrapper h-[100vh]  p-5">
      <div className="table-wrapper h-[90%] overflow-y-scroll p-5">
        <Table
          sx={{ minWidth: 650 }}
          className="border border-[#EFEFEF]"
          aria-label="simple table"
        >
          <TableHead>
            <TableRow className="">
              <Tcell className="">Name</Tcell>
              <Tcell align="center">Email</Tcell>
              <Tcell align="center">Mobile</Tcell>
              <Tcell align="center">Gender</Tcell>
              <Tcell align="center">City</Tcell>
              <Tcell align="center">PinCode</Tcell>
              <Tcell align="center">Action</Tcell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allData && allData.length > 0 ? (
              allData.map((user) => (
                <TableRow
                  className="hover:bg-[#c5c5c5] cursor-pointer"
                  onClick={() => {
                    navigate(`/admin/user/profile/${user._id}`);
                  }}
                  key={user._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  {/* <div className="diplay-none">
                    <UserProfile />
                  </div> */}
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.mobile}</TableCell>
                  <TableCell align="center">{user.gender}</TableCell>
                  <TableCell align="center">{user.city}</TableCell>
                  <TableCell align="center">{user.pincode}</TableCell>
                  <TableCell align="center" className="flex space-x-1">
                    <Button
                      lable={"edit"}
                      className={
                        "btn w-[70px] h-[30px] bg-black text-white rounded-md"
                      }
                    />
                    <Button
                      lable={"delete"}
                      className={
                        "btn w-[70px] h-[30px] bg-black text-white rounded-md"
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListsTable;
