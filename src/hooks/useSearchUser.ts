import { useQuery } from '@tanstack/react-query';

const useSearchUser: any = (userName: string) => {
  return useQuery({
    queryKey: ['searchUser', userName],
    queryFn: async () => {
      console.log("chamado")
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}user/userName/${userName}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(response);
        if (!response.ok) {
          return ""
        }
        const data = await response.json();
        return data;
      } catch (error) {
        return ""
      }
    },
  });
};

export default useSearchUser;
