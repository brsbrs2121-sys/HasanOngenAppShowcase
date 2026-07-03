'use client';

import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, PermissionStatus } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Prevent multiple initialization attempts.
let isNotificationsInitialized = false;

// Store the current FCM token in the production database.
const updateFcmTokenInLiveDb = async (userId: string, token: string) => {
    if (!userId || !token) {
        console.error('updateFcmTokenInLiveDb was called with an invalid user ID or token.');
        return;
    }

    const userDocRef = doc(db, 'users', userId);

    try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            await updateDoc(userDocRef, {
                fcmToken: token,
            });

            console.log(`FCM token successfully updated for user ${userId}.`);
        } else {
            console.warn(`User document not found for ${userId}.`);
        }
    } catch (error) {
        console.error(`Failed to update FCM token for user ${userId}.`, error);
        throw error;
    }
};
/*

100 line of codes

*/
        // Retrieve the Firebase Cloud Messaging token.

        const { token: fcmToken } =
            await FirebaseMessaging.getToken();

        if (fcmToken) {

            console.log('FCM token retrieved successfully.');

            await updateFcmTokenInLiveDb(
                userId,
                fcmToken
            );

        } else {

            console.warn(
                'Unable to retrieve an FCM token.'
            );

        }

        // Listen for future token refresh events.

        await FirebaseMessaging.addListener(
            'tokenReceived',
            async (event) => {

                await updateFcmTokenInLiveDb(
                    userId,
                    event.token
                );

            }
        );

    } catch (error) {

        console.error(
            'Unexpected error while initializing notifications.',
            error
        );

    }

};
