import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface UseAddCommentPayload {
  text: string;
  animeId: string;
  parentId: string | null;
}

const useBanUser: any = () => {
  const queryClient = useQueryClient();

  return useMutation<any>({
    mutationKey: ['BannedUser'],
    mutationFn: async (payload: any) => {
      const { status, userId } = payload;
      console.log(payload);

      const response = await fetch(
        ` ${process.env.NEXT_PUBLIC_API_URL}user/banStatus/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isBanned: status }),
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      const data = await response.json();

      return data;
    },
    onSuccess: async (data, params) => {
      console.log(data, params);
      await queryClient.invalidateQueries({
        queryKey: ['searchUser'],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useBanUser;
