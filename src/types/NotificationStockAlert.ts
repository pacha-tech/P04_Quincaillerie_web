

export interface NotificationStockAlert {
  idNotification: string;
  message: string;
  type: string;
  targetId: string;
  isRead: boolean;
  createdAt?: string;
}