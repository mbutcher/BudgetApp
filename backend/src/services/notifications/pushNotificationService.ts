import webpush from 'web-push';
import { env } from '@config/env';
import { logger } from '@utils/logger';
import { pushSubscriptionRepository } from '@repositories/pushSubscriptionRepository';
import type { NotificationPayload } from '@typings/core.types';

const isPushConfigured =
  Boolean(env.push.vapidPublicKey) &&
  Boolean(env.push.vapidPrivateKey) &&
  Boolean(env.push.vapidEmail);

if (isPushConfigured) {
  webpush.setVapidDetails(
    `mailto:${env.push.vapidEmail}`,
    env.push.vapidPublicKey,
    env.push.vapidPrivateKey
  );
}

export function isPushEnabled(): boolean {
  return isPushConfigured;
}

export async function sendToUser(userId: string, payload: NotificationPayload): Promise<void> {
  if (!isPushConfigured) return;

  const subscriptions = await pushSubscriptionRepository.findByUser(userId);
  await Promise.all(
    subscriptions.map((sub) =>
      sendToSubscription(sub.id, sub.endpoint, sub.p256dh, sub.auth, payload)
    )
  );
}

async function sendToSubscription(
  id: string,
  endpoint: string,
  p256dh: string,
  auth: string,
  payload: NotificationPayload
): Promise<void> {
  try {
    await webpush.sendNotification({ endpoint, keys: { p256dh, auth } }, JSON.stringify(payload));
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 410 || status === 404) {
      // Subscription expired or invalid — remove it
      await pushSubscriptionRepository.delete(id);
      logger.debug('Push subscription removed (expired)', { id });
    } else {
      logger.warn('Push notification delivery failed', { id, status, err });
    }
  }
}

export async function sendUpcomingBillAlert(
  userId: string,
  billName: string,
  amount: number,
  currency: string
): Promise<void> {
  await sendToUser(userId, {
    title: 'Upcoming Bill',
    body: `${billName} — ${new Intl.NumberFormat('en', { style: 'currency', currency }).format(amount)} due tomorrow`,
    tag: `bill-${userId}-${billName}`,
    url: '/budget',
  });
}

export async function sendGoalDeadlineAlert(
  userId: string,
  goalName: string,
  daysLeft: number
): Promise<void> {
  await sendToUser(userId, {
    title: 'Savings Goal Deadline',
    body: `"${goalName}" is due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    tag: `goal-deadline-${userId}-${goalName}`,
    url: '/savings-goals',
  });
}

export async function sendSimplefinSyncError(userId: string, errorMessage: string): Promise<void> {
  await sendToUser(userId, {
    title: 'SimpleFIN Sync Error',
    body: `Bank sync failed: ${errorMessage}`,
    tag: `simplefin-error-${userId}`,
    url: '/settings/integrations',
  });
}
