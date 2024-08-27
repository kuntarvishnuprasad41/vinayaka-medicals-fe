import { atom } from "recoil";

export const loginStatusState = atom({
  key: "isLoggedIn",
  default: false,
});
