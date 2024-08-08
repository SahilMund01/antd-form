import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert } from 'antd';
import dayjs from 'dayjs';
import "./App.css";

import {
  Card,
  Space,
  Button,
  Checkbox,
  Input,
  Select,
  DatePicker,
  Form,
} from 'antd';

const { Option } = Select;

const schema = z.object({
  username: z.string().min(1, 'Please input your username!'),
  password: z.string().min(1, 'Please input your password!'),
  email: z.string().email('Please enter a valid email address!'),
  gender: z.string().min(1, 'Please select your gender!'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest!'),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions!',
  }),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }).refine(
    (notifications) =>
      notifications.email || notifications.sms || notifications.push,
    {
      message: 'Please select at least one notification preference',
    }
  ),
  datePicker: z
    .string()
    .nullable()
    .refine((val) => val !== null, {
      message: 'Please select a date',
    }),
});

type FieldType = z.infer<typeof schema>;

function App() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FieldType>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      gender: '',
      interests: [],
      agreeTerms: false,
      notifications: {
        email: false,
        sms: false,
        push: false,
      },
      prefix: {
       mr: false,
       mrs: false,
       other: false
      },
      datePicker: null,
    },
  });

  const onSubmit = (values: FieldType) => {
    console.log('Success:', values);
    reset();
    setFormSubmitted(true);

  };


  return (
    <div className="App">

      <Space direction="vertical" size={30}>
        <Card size="small" title="Registration Form" style={{ width: 600 }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Item
              label="Username"
              validateStatus={errors.username ? 'error' : ''}
              help={errors.username?.message}
            >
              <Controller
                name="username"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => <Input.Password {...field} />}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Input {...field} type="email" />}
              />
            </Form.Item>

            <Form.Item
              label="DatePicker"
              validateStatus={errors.datePicker ? 'error' : ''}
              help={errors.datePicker?.message}
            >
              <Controller
                name="datePicker"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    onChange={(date) => {
                      field.onChange(date ? date.toISOString() : null);
                    }}
                    value={field.value ? dayjs(field.value) : null}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              validateStatus={errors.gender ? 'error' : ''}
              help={errors.gender?.message}
            >
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select an option" allowClear>
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item
              label="Interests"
              validateStatus={errors.interests ? 'error' : ''}
              help={errors.interests?.message}
            >
              <Controller
                name="interests"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    placeholder="Select your interests"
                    allowClear
                  >
                    <Option value="sports">Sports</Option>
                    <Option value="music">Music</Option>
                    <Option value="reading">Reading</Option>
                    <Option value="travel">Travel</Option>
                  </Select>
                )}
              />
            </Form.Item>



            <Form.Item label="Notification Preferences"
             validateStatus={
              errors.notifications?.root
              ? 'error' : ''
            }
             help={errors.notifications?.root?.message}
            >
         
              <Space direction="horizontal">
                
                <Controller
                  name="notifications.email"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value}>
                      Email Notifications
                    </Checkbox>
                  )}
                />
                <Controller
                  name="notifications.sms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value}>
                      SMS Notifications
                    </Checkbox>
                  )}
                />
                <Controller
                  name="notifications.push"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value}>
                      Push Notifications
                    </Checkbox>
                  )}
                />
              </Space>
            </Form.Item>

            <Form.Item
              validateStatus={errors.agreeTerms ? 'error' : ''}
              help={errors.agreeTerms?.message}
            >
              <Controller
                name="agreeTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    I agree to the terms and conditions
                  </Checkbox>
                )}
              />
            </Form.Item>


            <Form.Item>
              <Button type="primary" htmlType="submit"  size="large">
                Submit
              </Button>
            </Form.Item>

            {formSubmitted && <Alert message="Form Submitted Successfully !!" type="success" showIcon closable />
            }
          </form>
        </Card>
      </Space>
    </div>
  );
}

export default App;
