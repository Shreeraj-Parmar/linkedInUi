import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDataAccId } from "../../services/api.js";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const getUserDataFunc = async () => {
    let res = await getUserDataAccId(userId);
    // console.log(res.data.user);
    if (res.status === 200) {
      setUserData(res.data.user);
    } else {
      console.log(res.data.message);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, []);

  useLayoutEffect(() => {
    getUserDataFunc();
  }, []);

  return <div>UserProfile</div>;
};

export default UserProfile;
