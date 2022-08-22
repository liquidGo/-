import React, { forwardRef, useState, useEffect } from 'react'
import { Table, Switch, Button, Modal, Form, Input, Radio, Select } from 'antd'
const { Option } = Select


const UserManage = forwardRef(({ roleList, regionList, isUpdateDisabled, form }, ref) => {
    const [isDisabled, setisDisabled] = useState(false)
    useEffect(() => {
        setisDisabled(isUpdateDisabled)
    }, [isUpdateDisabled])
    return (
        <Form
            ref={ref}
            // form={form}
            layout="vertical"
        >
            <Form.Item
                name="userName"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >

                <Select disabled={isDisabled}>
                    {
                        regionList.map(value => {
                            return (
                                <Option value={value.value} key={value.id}>{value.title}</Option>
                            )
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select onChange={(value) => {
                    //判断选中的第几个option
                    // console.log(value, 'value');
                    if (value === 1) {
                        setisDisabled(true)
                        console.log(ref,'refffff');
                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setisDisabled(false)
                    }
                }}>
                    {
                        roleList.map(value => {
                            console.log(value.value, 'value');
                            return (
                                <Option value={value.id} key={value.id}>{value.roleName}</Option>
                            )
                        })
                    }
                </Select>
            </Form.Item>
        </Form>
    )
}
)
export default UserManage