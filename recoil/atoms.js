import { atom } from 'recoil';

export const authTokenState = atom({
    key: 'authTokenState',
    default: null, // Initially, no token
});
