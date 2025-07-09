import { useEffect, useRef } from 'react';
import { Task } from '../types';
import { sendReminderEmail } from '../services/emailService';
import { isWithinInterval, subMinutes, parseISO } from 'date-fns';

const REMINDER_EMAIL = 'thirushivanya2020@gmail.com';
const REMINDER_MINUTES = 30;

export const useReminders = (tasks: Task[]) => {
  const sentReminders = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      tasks.forEach(task => {
        if (task.completed || !task.dueDate || sentReminders.current.has(task.id)) {
          return;
        }

        const dueDate = parseISO(task.dueDate);
        const reminderTime = subMinutes(dueDate, REMINDER_MINUTES);
        
        // Check if current time is within the reminder window (30 minutes before due date)
        if (isWithinInterval(now, { start: reminderTime, end: dueDate })) {
          sendReminderEmail({
            taskTitle: task.title,
            taskDescription: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            category: task.category,
            recipientEmail: REMINDER_EMAIL
          }).then(success => {
            if (success) {
              sentReminders.current.add(task.id);
              // Show notification to user
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`Task Reminder: ${task.title}`, {
                  body: `Due in 30 minutes - ${task.description}`,
                  icon: '/favicon.ico'
                });
              }
            }
          });
        }
      });
    };

    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000);
    
    // Initial check
    checkReminders();

    return () => clearInterval(interval);
  }, [tasks]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
};