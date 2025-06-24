
import { useQuery } from "@tanstack/react-query";

export function useSimpleQuery<T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery({
    queryKey: key,
    queryFn,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 0,
  });
}
