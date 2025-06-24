
import { useQuery } from "@tanstack/react-query";
import { useFacility } from "./useFacility";

export function useOptimizedFacility(id: number | string) {
  // Use the existing useFacility hook as the implementation
  return useFacility(id);
}
