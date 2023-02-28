import { createContext } from "react";

export interface StoreContextData {
  user?: any;
  roomPlayerMap?: boolean;
  userIsPermitted?: (bit: number) => boolean;
}

const StoreContext = createContext<StoreContextData>({});

export default StoreContext;
