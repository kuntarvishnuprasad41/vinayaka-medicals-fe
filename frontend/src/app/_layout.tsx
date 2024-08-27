import "../global.css";
import { RecoilRoot } from "recoil";

import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <RecoilRoot>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </RecoilRoot>
  );
}

// import "../global.css";
// import { Slot } from "expo-router";

// export default function Layout() {
//   return <Slot />;
// }
