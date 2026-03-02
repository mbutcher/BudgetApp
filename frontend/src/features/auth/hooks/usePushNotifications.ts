import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pushApi } from '../api/pushApi';
import type { PushSubscriptionRecord } from '../types';

const SUBSCRIPTIONS_KEY = ['push', 'subscriptions'] as const;

/** Convert a VAPID public key string (base64url) to a Uint8Array for PushManager. */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  // Use a plain Uint8Array constructor (not Uint8Array.from) to guarantee an
  // ArrayBuffer — not the broader ArrayBufferLike — which PushSubscriptionOptionsInit requires.
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/** Returns true if the browser supports the Push API. */
export function isPushSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export function usePushSubscriptions() {
  return useQuery({
    queryKey: SUBSCRIPTIONS_KEY,
    queryFn: () => pushApi.listSubscriptions(),
    staleTime: 60 * 1000,
  });
}

export function useUnsubscribePush() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pushApi.unsubscribe(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
    },
  });
}

/**
 * Hook to manage the push subscription state for the current browser/device.
 * Exposes the current subscription record (if any), permission state, and
 * subscribe/unsubscribe actions.
 */
export function usePushSubscribe() {
  const queryClient = useQueryClient();
  const [permission, setPermission] = useState<NotificationPermission>(
    isPushSupported() ? Notification.permission : 'denied'
  );

  useEffect(() => {
    if (!isPushSupported()) return;
    setPermission(Notification.permission);
  }, []);

  /** Request notification permission and subscribe. */
  const subscribe = useCallback(async (): Promise<PushSubscriptionRecord | null> => {
    if (!isPushSupported()) return null;

    const granted = await Notification.requestPermission();
    setPermission(granted);
    if (granted !== 'granted') return null;

    const vapidKey = await pushApi.getVapidKey();
    if (!vapidKey) return null;

    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    if (existing) await existing.unsubscribe();

    const newSub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    const deviceName =
      navigator.userAgent.length > 0
        ? navigator.userAgent.substring(0, 100)
        : undefined;

    const record = await pushApi.subscribe(newSub.toJSON() as PushSubscriptionJSON, deviceName);
    void queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
    return record;
  }, [queryClient]);

  /** Unsubscribe the current browser from push and remove from server. */
  const unsubscribe = useCallback(
    async (subscriptionId: string): Promise<void> => {
      if (isPushSupported()) {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
      }
      await pushApi.unsubscribe(subscriptionId);
      void queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
    },
    [queryClient]
  );

  return { permission, subscribe, unsubscribe };
}
