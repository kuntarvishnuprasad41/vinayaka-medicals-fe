import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { authTokenState } from "../../recoil/atoms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const AuthChecker = ({ children }) => {
  const setAuthToken = useSetRecoilState(authTokenState);
  const router = useRouter();

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        setAuthToken(token);
      } else {
        router.push("/login");
      }
    };

    checkAuthToken();
  }, []);

  return children;
};

export default AuthChecker;
