import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card,
    Space,
    Button,
    Input,
    Select,
    DatePicker,
    Checkbox,
    Radio,
    Form,
} from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

type DynamicFormProps = {
    config: any
}

const DynamicForm: React.FC<DynamicFormProps> = ({ config }) => {

    const schema = z.object(
        config.fields.reduce((acc, field) => {
            acc[field.name] = field.validation;
            return acc;
        }, {})
    ).refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords don't match",
            path: ["confirmPassword"],
        }
    );


    const { handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema),
        defaultValues: config.fields.reduce((acc : any, field : any) => {
         

            switch(field.type){
                case 'rangePicker' :   acc[field.name] = { start: null, end: null }; break;
                case 'multiselect' :   acc[field.name] = []; break;
                case 'select' :   acc[field.name] = {}; break;
                case 'checkbox' :   acc[field.name] = field.options.reduce((comb: any, ele: any) => {
                    comb[ele.name] = false;
                    return comb;
                  }, {}); break;
                default:  acc[field.name] = ''; break;
            }
                

            return acc;
        }, {}),
    });

  
    const onSubmit = (values : any) => {
        console.log(errors)
        console.log('Form Values:', values);
        // reset();
    };

    const renderField = (item: any) => {
        switch (item.type) {

            case 'password':
                return (
                    <Form.Item
                        label={item.label}
                        validateStatus={errors[item.name] ? 'error' : ''}
                        help={errors[item.name]?.message as string}
                    >
                        <Controller
                            name={item.name}
                            control={control}
                            render={({ field }) => <Input.Password {...field} type={item.type} />}
                        />
                    </Form.Item>
                );

            case 'text':
            case 'email':
                return (
                    <Form.Item
                        label={item.label}
                        validateStatus={errors[item.name] ? 'error' : ''}
                        help={errors[item.name]?.message as string}
                    >
                        <Controller
                            name={item.name}
                            control={control}
                            render={({ field }) => <Input {...field} type={item.type} />}
                        />
                    </Form.Item>
                );

            case 'select':
                return (
                    <Form.Item
                        label={item.label}
                        validateStatus={errors[item.name] ? 'error' : ''}
                        help={errors[item.name]?.message as string}
                    >
                        <Controller
                            name={item.name}
                            control={control}
                            render={({ field }) => (
                                <Select {...field} placeholder="Select an option" allowClear>
                                    {item?.options?.map((option : any) => 
                                        <Option key={option} value={option}>
                                            {option}
                                        </Option>
                                    )}
                                      
                                </Select>
                            )}
                        />
                    </Form.Item>
                );
            case 'multiselect':
                return (
                    <Form.Item
                        label={item.label}
                        validateStatus={errors[item.name] ? 'error' : ''}
                        help={errors[item.name]?.message as string}
                    >
                        <Controller
                            name={item.name}
                            control={control}
                            render={({ field }) => (
                                <Select {...field} mode="multiple">
                                    {item?.options?.map((option : any) => (
                                        <Option key={option} value={option}>
                                            {option}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        />
                    </Form.Item>
                );
            case 'checkbox':
                return (
                    <Form.Item label={item.label}
                        validateStatus={errors[item.name]?.root ? 'error' : ''}
                        help={errors[item.name]?.root?.message as string}
                    >
                         <Space direction="horizontal">
                            {
                                item.options?.map((opt : any) => (
                                    <Controller
                                    name={`${item.name}.${opt.name}`}                                    key = {opt.name}
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox {...field} checked={field.value}>
                                            {opt.value}
                                        </Checkbox>
                                    )}
                                />
                                ))
                            }
                         </Space>
                       
                    </Form.Item>
                );
            case 'radio':
                return (
                    <Form.Item
                        label={item.label}
                        validateStatus={errors[item.name] ? 'error' : ''}
                        help={errors[item.name]?.message as string}
                    >
                        <Controller
                            name={item.name}
                            control={control}
                            render={({ field }) => (
                                <Radio.Group {...field}>
                                    {item?.options?.map((option :any) => (
                                        <Radio key={option} value={option}>
                                            {option}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            )}
                        />
                    </Form.Item>
                );
            case 'rangePicker':
                return (
                    <Form.Item
                        label={item.label}
                        validateStatus={
                            errors[item.name]?.start || errors[item.name]?.end || errors[item.name]
                                ? 'error'
                                : ''
                        }
                        help={
                            errors[item.name]?.start?.message ||
                            errors[item.name]?.end?.message ||
                            errors[item.name]?.message
                        }
                    >
                        <Controller
                            name={item.name}
                            control={control}
                            render={({ field }) => (
                                <RangePicker
                                    {...field}
                                    onChange={(dates) => {
                                        field.onChange({
                                            start: dates?.[0]?.toISOString() || null,
                                            end: dates?.[1]?.toISOString() || null,
                                        });
                                    }}
                                    value={
                                        field.value.start && field.value.end
                                            ? [dayjs(field.value.start), dayjs(field.value.end)]
                                            : null
                                    }
                                />
                            )}
                        />
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container">
            <Space direction="vertical" size={30}>
                <Card size="small" title="Dynamic Form" style={{ width: 600 }}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {config?.fields?.map((field: any) => (
                            <React.Fragment key={field.name}>
                                {renderField(field)}

                            </React.Fragment>
                        ))}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large">
                                Submit
                            </Button>
                        </Form.Item>
                    </form>
                </Card>
            </Space>
        </div>
    );
}

export default DynamicForm;
