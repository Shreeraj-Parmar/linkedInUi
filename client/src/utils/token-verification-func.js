import { checkAdmin, verifyToken, checkRoutes } from "../services/api";

export const checkAdminFunc = async () => {
  let res = await checkAdmin();
  if (res.status === 200) {
    console.log("you are admin");
  } else {
    console.log(res.data.message);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  }
};

export const verifyTokenFunc = async () => {
  let res = await verifyToken();
  if (res.status === 200) {
    console.log("TOken is valid");
  } else if (res.status === 204) {
    console.log("TOken is invalid ! please relogin");
    window.location.href = "/login";
    return;
  }
};

export const loginRedirect = async () => {
  let res = await checkRoutes();
  if (res.status === 200) {
    window.location.href = res.data.route;
  } else if (res.status === 204) {
    console.log("TOken is invalid ! please relogin");

    return false;
  }
};

export const verifyOnlyTokenFunc = async () => {
  let res = await verifyToken();
  if (res.status === 200) {
    console.log("TOken is valid");
    return true;
  } else if (res.status === 204) {
    console.log("TOken is invalid ! please relogin");
    // window.location.href = "/login";
    return false;
  }
};
