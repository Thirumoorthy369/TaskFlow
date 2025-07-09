import emailjs from 'emailjs-com';

// EmailJS configuration
const SERVICE_ID = 'service_taskflow';
const TEMPLATE_ID = 'template_reminder';
const USER_ID = 'your_emailjs_user_id'; // You'll need to replace this with your actual EmailJS user ID

export interface ReminderEmail {
  taskTitle: string;
  taskDescription: string;
  dueDate: string;
  priority: string;
  category: string;
  recipientEmail: string;
}

export const sendReminderEmail = async (emailData: ReminderEmail): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: emailData.recipientEmail,
      task_title: emailData.taskTitle,
      task_description: emailData.taskDescription,
      due_date: emailData.dueDate,
      priority: emailData.priority,
      category: emailData.category,
      reminder_time: new Date().toLocaleString(),
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
    console.log('Reminder email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    return false;
  }
};

export const initializeEmailJS = () => {
  emailjs.init(USER_ID);
};