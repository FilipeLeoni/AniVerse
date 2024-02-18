import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const useModifyRole: any = () => {
  const queryClient = useQueryClient();

  return useMutation<any>({
    mutationKey: ['modifyRole'],
    mutationFn: async (payload: any) => {
      const { role, userId } = payload;

      const response = await fetch(
        ` ${process.env.NEXT_PUBLIC_API_URL}user/role/update/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: role }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      const data = await response.json();

      return data;
    },
    onSuccess: async (params) => {
      toast.success(`User role updated to ${params?.role} successfully`);
      await queryClient.invalidateQueries({
        queryKey: ['searchUser'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['usersRolesHigh'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['userRolesModerator'],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useModifyRole;
