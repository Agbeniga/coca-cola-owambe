interface EmailData {
  fullName: string;
  guestName: string;
  email: string;
  registrationId: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
}

export const sendInvitationEmail = async (
  data: EmailData
): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Email sending failed:', errorData);
      return false;
    }

    const result: EmailResponse = await response.json();
    console.log('Email sent successfully:', result);
    return result.success;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const testEmailConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};