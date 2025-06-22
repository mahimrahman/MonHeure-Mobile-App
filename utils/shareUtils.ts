import Share from 'react-native-share';
import { Platform } from 'react-native';

export const shareReport = async (filePath: string, reportTitle: string) => {
  try {
    const shareOptions = {
      title: reportTitle,
      message: `Time tracking report: ${reportTitle}`,
      url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
      type: 'application/pdf',
      subject: reportTitle,
    };

    await Share.open(shareOptions);
  } catch (error) {
    console.error('Error sharing report:', error);
    throw new Error('Failed to share report');
  }
};

export const shareReportAsEmail = async (filePath: string, reportTitle: string, recipientEmail?: string) => {
  try {
    const shareOptions = {
      title: reportTitle,
      message: `Please find attached the time tracking report for ${reportTitle}.`,
      url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
      type: 'application/pdf',
      subject: `Time Tracking Report - ${reportTitle}`,
      email: recipientEmail,
    };

    await Share.open(shareOptions);
  } catch (error) {
    console.error('Error sharing report via email:', error);
    throw new Error('Failed to share report via email');
  }
};

export const getShareOptions = (filePath: string, reportTitle: string) => {
  return [
    {
      title: 'Share Report',
      icon: 'share',
      onPress: () => shareReport(filePath, reportTitle),
    },
    {
      title: 'Send via Email',
      icon: 'mail',
      onPress: () => shareReportAsEmail(filePath, reportTitle),
    },
    {
      title: 'Save to Files',
      icon: 'folder',
      onPress: () => {
        // This would typically open the file picker to save to a specific location
        console.log('Save to files functionality');
      },
    },
  ];
}; 