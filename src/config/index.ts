import { z } from 'zod';

export const formConfig = {
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        validation: z.string().min(1, 'Please input your username!'),
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        validation: z.string().min(1, 'Please input your password!'),
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        validation: z.string().min(1, 'Please re-enter your password!'),
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        validation: z.string().email('Please enter a valid email address!'),
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        options: ['male', 'female', 'other'],
        validation: z.string().min(1, 'Please select your gender!'),
      },
      {
        name: 'prefix',
        label: 'Prefix Preferences',
        type: 'radio',
        options: ['Mr.', 'Mrs.', 'other'],
        validation: z.string().min(1, 'Please select your prefix!'),
      },
      {
        name: 'interests',
        label: 'Interests',
        type: 'multiselect',
        options: ['sports', 'music', 'reading', 'travel'],
        validation: z.array(z.string()).min(1, 'Please select at least one interest!'),
      },
      {
        name: 'notifications',
        label: 'Notification Preferences',
        type: 'checkbox',
        options:[{
            name:'email',value:'Email Notifications'
        },
        {
            name:'sms',value:'SMS Notifications'
        },{
            name:'push',value:'Push Notifications'
        },],
        validation: z.object({
            email: z.boolean(),
            sms: z.boolean(),
            push: z.boolean(),
          })
      },
      {
        name: 'dateRange',
        label: 'Date Range',
        type: 'rangePicker',
        validation: z.object({
          start: z.string().nullable().refine((val) => val !== null, {
            message: 'Please select a start date',
          }),
          end: z.string().nullable().refine((val) => val !== null, {
            message: 'Please select an end date',
          }),
        }).refine(
          (val) => val.start !== null && val.end !== null && val.start <= val.end,
          {
            message: 'Please select a valid date range',
          }
        ),
      },
    ],
  };
  