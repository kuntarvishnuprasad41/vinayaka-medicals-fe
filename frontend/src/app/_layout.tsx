import "../global.css";

import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

// import "../global.css";
// import { Slot } from "expo-router";

// export default function Layout() {
//   return <Slot />;
// }
