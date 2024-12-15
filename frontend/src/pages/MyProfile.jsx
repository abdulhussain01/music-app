import { useEffect, useState } from "react";
import Container from "../components/subcomponents/Container";

import { useSelector } from "react-redux";
import Profile from "./sub-pages/Profile";
import EditProfile from "./sub-pages/EditProfile";
import DeleteAccount from "./sub-pages/DeleteAccount";
import ChangePassword from "./sub-pages/ChangePassword";
import { useNavigate } from "react-router-dom";
const MyProfile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  const [setting, setSetting] = useState("Profile");

  return (
    <Container>
      <div className=" flex flex-col gap-10 md:h-[75vh]">
        <h1 className="text-6xl">{user?.fullName}</h1>
        <div className="flex flex-col md:flex-row flex-1  gap-10 ">
          <aside className=" md:w-72  ">
            <div className=" bg-commonbackgroundtwo rounded-lg sticky top-10 ">
              <ul className="p-4 flex flex-col gap-2">
                <li
                  className={`flex items-center gap-4 text-lg p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack cursor-pointer ${
                    setting === "Profile" ? "bg-commonbackground" : ""
                  }`}
                  onClick={() => setSetting("Profile")}
                >
                  Profile
                </li>
                <li
                  className={`flex items-center gap-4 text-lg p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack cursor-pointer ${
                    setting === "EditProfile" ? "bg-commonbackground" : ""
                  }`}
                  onClick={() => setSetting("EditProfile")}
                >
                  Edit Profile
                </li>
                <li
                  className={`flex items-center gap-4 text-lg p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack cursor-pointer ${
                    setting === "ChangePassword" ? "bg-commonbackground" : ""
                  }`}
                  onClick={() => setSetting("ChangePassword")}
                >
                  Change Password
                </li>
                <li
                  className={`flex items-center gap-4 text-lg p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack cursor-pointer ${
                    setting === "DeleteAccount" ? "bg-commonbackground" : ""
                  }`}
                  onClick={() => setSetting("DeleteAccount")}
                >
                  Delete Account
                </li>
              </ul>
            </div>
          </aside>
          <div className=" bg-commonbackgroundtwo p-4 rounded-lg w-full ">
            {(() => {
              switch (setting) {
                case "Profile":
                  return <Profile />;
                case "EditProfile":
                  return <EditProfile />;
                case "ChangePassword":
                  return <ChangePassword />;
                case "DeleteAccount":
                  return <DeleteAccount />;
              }
            })()}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MyProfile;
