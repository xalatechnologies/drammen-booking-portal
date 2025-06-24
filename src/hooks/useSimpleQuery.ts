
import { useQuery } from '@tanstack/react-query';
import { SimpleRepository } from '@/dal/repositories/SimpleRepository';

export function useSimpleQuery(tableName: string, id?: string) {
  const repository = new SimpleRepository(tableName);
  
  return useQuery({
    queryKey: [tableName, id],
    queryFn: () => id ? repository.getById(id) : repository.getAll(),
    enabled: !!tableName,
  });
}
