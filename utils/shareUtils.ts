import { Platform, Alert } from 'react-native';

export const shareReport = async (filePath: string, reportTitle: string) => {
  try {
    // Temporary fallback - show alert instead of sharing
    Alert.alert(
      'Share Report',
      `Report "${reportTitle}" would be shared here. This feature is temporarily disabled due to native module compatibility.`,
      [{ text: 'OK' }]
    );
    
    // TODO: Re-enable when react-native-share is properly linked
    // const Share = require('react-native-share');
    // const shareOptions = {
    //   title: reportTitle,
    //   message: `Time tracking report: ${reportTitle}`,
    //   url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
    //   type: 'application/pdf',
    //   subject: reportTitle,
    // };
    // await Share.open(shareOptions);
  } catch (error) {
    console.error('Error sharing report:', error);
    throw new Error('Failed to share report');
  }
};

export const shareReportAsEmail = async (filePath: string, reportTitle: string, recipientEmail?: string) => {
  try {
    // Temporary fallback - show alert instead of emailing
    Alert.alert(
      'Email Report',
      `Report "${reportTitle}" would be sent via email here. This feature is temporarily disabled due to native module compatibility.`,
      [{ text: 'OK' }]
    );
    
    // TODO: Re-enable when react-native-share is properly linked
    // const Share = require('react-native-share');
    // const shareOptions = {
    //   title: reportTitle,
    //   message: `Please find attached the time tracking report for ${reportTitle}.`,
    //   url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
    //   type: 'application/pdf',
    //   subject: `Time Tracking Report - ${reportTitle}`,
    //   email: recipientEmail,
    // };
    // await Share.open(shareOptions);
  } catch (error) {
    console.error('Error sharing report via email:', error);
    throw new Error('Failed to share report via email');
  }
};

export const getShareOptions = (filePath: string, reportTitle: string) => {
  return [
    {
      title: 'Share Report (Coming Soon)',
      icon: 'share',
      onPress: () => shareReport(filePath, reportTitle),
    },
    {
      title: 'Send via Email (Coming Soon)',
      icon: 'mail',
      onPress: () => shareReportAsEmail(filePath, reportTitle),
    },
    {
      title: 'Save to Files (Coming Soon)',
      icon: 'folder',
      onPress: () => {
        Alert.alert('Save to Files', 'This feature is coming soon!');
      },
    },
  ];
}; 