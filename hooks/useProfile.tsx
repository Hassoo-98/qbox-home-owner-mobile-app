import { ProfileContext } from "@/context";
import { useContext } from "react";

export const useProfile = () => useContext(ProfileContext);
