import { apiClient } from '@lib/api/client';
import type { PushSubscriptionRecord } from '../types';

interface ApiResponse<T> {
  status: string;
  data: T;
}

export const pushApi = {
  /** Fetch the VAPID public key from the server. Returns null if push is not configured. */
  getVapidKey: async (): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<{ vapidPublicKey: string | null }>>('/push/vapid-key');
    return res.data.data.vapidPublicKey;
  },

  /** Register a new push subscription for the current user. */
  subscribe: async (
    subscription: PushSubscriptionJSON,
    deviceName?: string
  ): Promise<PushSubscriptionRecord> => {
    const { endpoint, keys } = subscription;
    const res = await apiClient.post<ApiResponse<{ subscription: PushSubscriptionRecord }>>(
      '/push/subscribe',
      { endpoint, keys, deviceName }
    );
    return res.data.data.subscription;
  },

  /** Remove a push subscription by ID. */
  unsubscribe: async (id: string): Promise<void> => {
    await apiClient.delete(`/push/subscribe/${id}`);
  },

  /** List all push subscriptions for the current user. */
  listSubscriptions: async (): Promise<PushSubscriptionRecord[]> => {
    const res = await apiClient.get<ApiResponse<{ subscriptions: PushSubscriptionRecord[] }>>(
      '/push/subscriptions'
    );
    return res.data.data.subscriptions;
  },
};
