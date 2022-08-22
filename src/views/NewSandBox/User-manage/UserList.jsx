import React, { useState, useEffect, useRef } from 'react'
import { Table, Switch, Button, Modal, Form, Input, Radio, Select } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import UserManage from '../../../components/SandBox/sandUserManege/UserManage'

export default function UserList() {
    const [dataSource, setDataSource] = useState([])
    const [isAddVisible, setisAddVisible] = useState(false)
    const [updateVisible, setupdateVisible] = useState(false)
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const [roleList, setroleList] = useState([])
    const [regionList, setregionList] = useState([])
    const [form] = Form.useForm();
    const addForm = useRef(null)
    const updateForm = useRef(null)
    const [current, setcurrent] = useState(null)

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            key: 'region',
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                })),
                {
                    text: '全球',
                    value: '全球'
                }
            ],
            onFilter: (value, item) => {
                // console.log(value,item,'valueItem');
                if (value === '全球') {
                    console.log(item.region);
                    return item.region === '';
                }
                return item.region === value
            },
            render: (region) => {
                return (
                    <b>{region == '' ? '全球' : region}</b>
                )
            }
        }, {
            title: '角色名称',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                return role?.roleName
            }
        }, {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName'
        }, {
            title: '用户状态',
            dataIndex: 'roleState',
            key: 'roleState',
            //roleState是后台给的默认状态，item是点击改变时候的值
            render: (roleState, item) => {
                return (
                    <Switch checked={roleState} onChange={() => { handleChange(item) }} disabled={item.default}></Switch>
                )
            }
        }, {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button disabled={item.default} onClick={() => { confirmMethods(item) }} style={{ marginRight: '10px' }} danger shape='circle' icon={<DeleteOutlined />}></Button>
                        <Button disabled={item.default} type="primary" onClick={() => {
                            handleUpdate(item)
                        }} shape='circle' icon={<EditOutlined />}></Button>
                    </div>
                )
            }
        },
    ]
    useEffect(() => {
        axios.get('http://localhost:5001/users?_expand=role').then(res => {
            setDataSource(res.data)
        })
    }, [])
    //添加用户调用的城市
    useEffect(() => {
        axios.get('http://localhost:5001/regions').then(res => {
            setregionList(res.data)
            console.log(regionList, 'regionList');
        })
    }, [])
    // 添加用户调用的权限
    useEffect(() => {
        axios.get('http://localhost:5001/roles').then(res => {
            setroleList(res.data)
        })
    }, [])


    const confirmMethods = (item) => {
        Modal.confirm({
            title: '确定删除当前组件吗？',
            icon: <ExclamationCircleOutlined />,
            // content: 'Bla bla ...',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                deleteMethod(item)
            },
            onCancel: () => {
            }
        });
    }
    const deleteMethod = (item) => {
        // 这里把表面上的data过滤出来重新渲染，把选中的那一条排出
        setDataSource(dataSource.filter(data => data.id !== item.id))
        // 从后端里面删除掉选中的制定数据
        axios.delete(`http://localhost:5001/users/${item.id}`)
    }


    // Modal弹出的表单
    const add = () => {
        setisAddVisible(true)
    }
    const onCancel = () => {
        setisAddVisible(false)
    }
    const addFormOk = () => {
        console.log(roleList, 'datas');
        addForm.current.validateFields()
            .then(value => {
                // console.log(value)
                setisAddVisible(false)
                addForm.current.resetFields()
                axios.post(`http://localhost:5001/users`, {
                    ...value,
                    "roleState": true,
                    "default": false
                }).then(res => {
                    // 后端添加成功返回添加成功的那一条，将这一条添加到现有的dataSource结构中
                    // console.log(roleList, value, '插入成功');
                    setDataSource([...dataSource, { ...res.data, role: roleList.filter(item => item.id === Number(value.roleId))[0] }])
                })
            })
            .catch(err => {
                console.log(err);
            })
    }


    // 两个按钮的方法
    const handleChange = (item) => {
        item.roleState = !item.roleState
        setDataSource([...dataSource])

        axios.patch(`http://localhost:5001/users/${item.id}`, {
            roleState: item.roleState
        })
    }
    const handleUpdate = (item) => {
        console.log(item, 'item');
        setupdateVisible(true)

        setTimeout(() => {
            if (item.roleId === 1) {
                // 第一级管理员禁用
                setisUpdateDisabled(true)

            } else {
                // 其它层级取消禁用 
                setisUpdateDisabled(false)


            }
            updateForm.current.setFieldsValue(item)

        }, 0)
        // 点击修改按钮的时候将当前选中的那项存入数据
        setcurrent(item)
        // console.log(updateForm, '123123');
    }

    const updateFormOk = () => {
        // 点击的时候可以获取到ref值
        updateForm.current.validateFields().then(value => {
            setupdateVisible(false)
            console.log(dataSource, 'dataSource');
            setDataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item;
            }))
            // console.log(value, 'value');
            setisUpdateDisabled(!isUpdateDisabled)
            axios.patch(`http://localhost:5001/users/${current.id}`, value)
        })
    }
    return (
        <div>
            <Button type='primary' onClick={add}>添加用户</Button>
            <Table rowKey={item => {
                return item.id;
            }} dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }}></Table>
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={(e) => {
                    addFormOk()
                }}
            >
                <UserManage ref={addForm} regionList={regionList} roleList={roleList} form={form} />
            </Modal>


            <Modal
                visible={updateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setupdateVisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => {
                    updateFormOk()
                }}
            >
                <UserManage ref={updateForm} regionList={regionList} roleList={roleList} isUpdateDisabled={isUpdateDisabled} form={form} />
            </Modal>
        </div >
    )
}
