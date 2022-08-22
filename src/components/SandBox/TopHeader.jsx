import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
    SmileOutlined,
    UserOutlined
} from '@ant-design/icons';

import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Space, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
const { Header, } = Layout;

function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false);
    const changeCollapse = () => {
        setCollapsed(!collapsed)
    }
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        '超级管理员'
                    ),
                }, {
                    key: '4',
                    danger: true,
                    label: '退出',
                    onClick:()=>{
                        // console.log('123123');
                        localStorage.removeItem('token')
                        props.history.replace("/login")
                        // console.log(props.history,'props');
                    }
                },
            ]}
        />
    );
    return (
        <Header
            className="site-layout-background"
            style={{
                padding: '0 16px',
            }}
        >
            {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
            })} */}
            {
                collapsed
                    ? <MenuUnfoldOutlined onClick={changeCollapse} />
                    : <MenuFoldOutlined onClick={changeCollapse} />
            }
            <div style={{ float: 'right' }}>
                <span>欢迎admin回来</span>

                {/* 下拉菜单组件 */}
                <Dropdown overlay={menu}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Avatar
                                size="large"
                                icon={<UserOutlined/>}
                            >
                            </Avatar>
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        </Header>
    )
}
export default withRouter(TopHeader)