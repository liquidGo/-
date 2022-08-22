import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

export default function RoleList() {
    const [dataSource, setDataSource] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [treeData, setTreeData] = useState([])
    const [currentId, setCurrentId] = useState(0)
    const [currentRights, setCurrentRights] = useState([])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName'
        }, {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button onClick={() => { confirmMethods(item) }} style={{ marginRight: '10px' }} danger shape='circle' icon={<DeleteOutlined />}></Button>
                        <Button type="primary" onClick={() => { setIsModalVisible(true); setCurrentRights(item.rights); setCurrentId(item.id) }} shape='circle' icon={<EditOutlined />}></Button>
                    </div>
                )
            }
        }
    ]
    useEffect(() => {
        axios.get('http://localhost:5001/roles').then(res => {
            setDataSource(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get('http://localhost:5001/rigs?_embed=children2').then(res => {
            res.data = res.data.map(value => {
                if (value.children2) {
                    value.children = value.children2
                }
                return value
            })
            setTreeData(res.data)
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
        axios.delete(`http://localhost:5001/roles/${item.id}`)
    }





    const handleOk = () => {
        setIsModalVisible(false);
        console.log(dataSource, 'dataSource');
        // 遍历当前全部的管理员，找出选中那一条管理员对他的权限进行重新更新
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                console.log(item, 'immmmm');
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        // console.log(dataSource, 'datasource');
        // 在后端找到指定的管理员，把他的数据指定为当前选中后的数据
        axios.patch(`http://localhost:5001/roles/${currentId}`, {
            rights: currentRights
        })
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onCheck = (check) => {
        //check里面能获取到点击或者取消以后的树列表
        setCurrentRights(check.checked)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }}
                rowKey={item => item.id}
            ></Table>
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    treeData={treeData}
                    checkStrictly={true}
                />

            </Modal>

        </div>
    )
}
