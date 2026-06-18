import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserStatus } from '../services/admin.service';
import { ADMIN_USERS_KEY } from './useAdminUsers';
import type { UserStatus } from '@core/types/admin.types';

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
    },
  });
}
