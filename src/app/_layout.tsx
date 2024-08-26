import { RecoilRoot } from "recoil";
import "../global.css";
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <RecoilRoot>
      <Slot />
    </RecoilRoot>
  );
}
