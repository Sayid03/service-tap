import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/users";
import { authStore } from "../store/authStore";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: authStore.isAuthenticated(),
    retry: false,
  });
}