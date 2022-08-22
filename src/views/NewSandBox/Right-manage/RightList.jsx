import React, { useState, useEffect } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

export default function RightList() {
    const [dataSource, setDataSource] = useState([])
    const confirmMethods = (item) => {
        console.log(item, '查看删除那一个组件');
        Modal.confirm({
            title: '确定删除当前组件吗？',
            icon: <ExclamationCircleOutlined />,
            // content: 'Bla bla ...',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                // console.log('ok');
                deleteMethod(item)
            },
            onCancel: () => {
                console.log('cancle');
            }
        });
    }
    const deleteMethod = (item) => {
        //如果grade==1证明是一级菜单，直接删除掉整个层级的导航菜单
        if (item.grade == 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`http://localhost:5001/rights/${item.id}`)
        } else {
            // 否则是二级菜单不可以直接删除掉，先从children里面寻找到父组件的数据
            let list = dataSource.filter(data => {
                if (data.id === item.rightId) {
                    return data
                }
            })
            //重新改写父组件里面的数据，先过滤出所有没有点击的子数据到一个新的数组里面
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            //重新赋值一个对象地址，让页面进行重新render达到数据的刷新目的
            setDataSource([...dataSource])
            //从json server里面删除指定数据
            axios.delete(`http://localhost:5001/children/${item.id}`)
        }
    }

    //获得初始的数据
    useEffect(() => {
        axios.get('http://localhost:5001/rights?_embed=children').then(res => {
            const list = res.data;
            // console.log(list[0], '123');
            list.forEach(value => {
                if (value.children.length === 0) {
                    value.children = ''
                }
            })
            // list[0].children = '';
            setDataSource(list)
            // console.log(dataSource, 'res');

        })
        // console.log(dataSource, '123123');
    }, [])


    //控制switch开关的函数
    const switchChange = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        console.log(item, 'item');
        setDataSource([...dataSource])

        //同步一下后端
        if (item.grade === 1) {
            axios.patch(`http://localhost:5001/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`http://localhost:5001/children/${item.id}`, {
                pagepermisson: item.pagepermisson

            })
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',

        },
        {
            title: '权限名称',
            dataIndex: 'label',
            key: 'label',

        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            render: (key) => {
                return <Tag color={'orange'}>{key}</Tag>
            }
        },
        {
            title: '操作',
            //一行一行开始渲染的，点击这一行的事件触发就能获取到这一行的数据
            render: (item) => {
                // 这里的item就是dataSource数据里面的每一条，点击的时候就是选中的那一条
                return (
                    <div>
                        <Button onClick={() => { confirmMethods(item) }} danger shape='circle' icon={<DeleteOutlined />}></Button>
                        <Popover content={
                            <div style={{ textAlign: 'center' }}>
                                <Switch checked={item.pagepermisson} onChange={() => switchChange(item)}>开关</Switch>
                            </div>
                        } title="配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                            <Button type="primary" shape='circle' icon={<EditOutlined />} disabled={item.pagepermisson === undefined}></Button>
                        </Popover>
                    </div>
                )
            }
        }
    ];

    //pop弹窗



    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />;
        </div>
    )
}
