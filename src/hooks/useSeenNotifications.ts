import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useApi } from "./useApi";

const convertToReadNotifcations = (notifications: Partial<Notification>[]) => {
  return notifications.map((notification: any) => ({
    ...notification,
    notificationUsers: notification.map((notificationUser: any) => {
      notificationUser.isRead = true;

      return notificationUser;
    }),
  }));
};

const useSeenNotifications = () => {
  const { data: session } = useSession();
  const user: any = session?.user;
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation<any>({
    mutationKey: ["seenNotification"],
    mutationFn: async (notifications: any) => {
      console.log(notifications);
      const response = await api.seenNotifications(user?.id, notifications);
      return response?.data;
    },
    onMutate: (notifications: any) => {
      const readNotifications = convertToReadNotifcations(notifications);

      queryClient.setQueryData(["notifications"], readNotifications);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export default useSeenNotifications;
