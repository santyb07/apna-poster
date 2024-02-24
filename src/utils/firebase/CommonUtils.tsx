import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidStyle } from '@notifee/react-native';
import { Text,View } from 'react-native';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}


export async function notificationListner() {
      //get notification in foreground state
  const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // const url = buildDeepLinkFromNotificationData(remoteMessage.data)
    // if (typeof url === 'string') {
    //   listener(url)
    // }

    //get notification in background state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
          );
        }
      });
  });
};

export const getToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  console.log('********************');
  console.log(token);
  console.log('********************');
  return token;
};



export async function onDisplayNotification({title,body}:any) {
  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title,
    body,
    // picture:{uri:},
    android: {
      channelId,
      largeIcon:'https://logos.flamingtext.com/City-Logos/Todo-Logo.png',
      style: {
        type: AndroidStyle.BIGPICTURE,
        picture: "https://logos.flamingtext.com/City-Logos/Todo-Logo.png",
      },
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}