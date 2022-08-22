import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    MailOutlined,
    UnlockOutlined, HomeOutlined, SolutionOutlined, TeamOutlined, KeyOutlined, FormOutlined, AlignLeftOutlined, RadarChartOutlined, AuditOutlined, HighlightOutlined, OrderedListOutlined, SnippetsOutlined, ExclamationCircleOutlined, CheckCircleOutlined, StopOutlined
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd';
import '../SandBox/index.css'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
const { Header, Sider, Content } = Layout;



function SideMenu(props) {
    const [collapsed, setCollapsed] = useState(false);
    // 存放<menu></menu>
    const [menuItems, setMenuItems] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5001/rights?_embed=children').then(res => {
            setMenuItems(res.data)
            console.log(res.data, 'res');
        })
    }, [])
    // const jsonMenu = [
    //     {
    //         key: "/home",
    //         label: "首页",
    //         icon: <HomeOutlined />
    //     },
    //     {
    //         key: "/user-manage",
    //         label: "用户管理",
    //         icon: <SolutionOutlined />,
    //         children: [
    //             {
    //                 key: "/user-manage/list",
    //                 label: "用户列表",
    //                 icon: <UserOutlined />
    //             }
    //         ]
    //     },
    //     {
    //         key: "/right-manage",
    //         label: "权限管理",
    //         icon: <UnlockOutlined />,
    //         children: [
    //             {
    //                 key: "/right-manage/role/list",
    //                 label: "角色列表",
    //                 icon: <UserOutlined />
    //             },
    //             {
    //                 key: "/right-manage/right/list",
    //                 label: "权限列表",
    //                 icon: <UnlockOutlined />
    //             }
    //         ]
    //     }
    // ]


    function getItem(label, key, icon, children, type) {
        // 这里是按照antd可以接受的对象格式转化一下
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
    // 封装生成配置式文件,==1时导航允许被渲染
    const checkPagePermission = (item) => {
        return item.pagepermisson == 1  
    }
    function setItem(json) {
        //每次调用都会创建一个新的数组
        let items = []
        json.map(item => {
            if (item.children && checkPagePermission(item)) {
                let newChildren = setItem(item.children)
                items.push(getItem(item.label, item.key, iconList[item.key], newChildren, item.type))
            } else if (checkPagePermission(item)) {
                items.push(getItem(item.label, item.key, iconList[item.key], item.children, item.type))
            }
        })
        return items;
    }

    //将图标封装成一个数组
    const iconList = {
        "/home": <HomeOutlined />,
        "/user-manage": <SolutionOutlined />,
        "/user-manage/list": <UserOutlined />,
        "/right-manage": <UnlockOutlined />,
        "/right-manage/role/list": <TeamOutlined />,
        "/right-manage/right/list": <KeyOutlined />,
        "/news-manage": <MailOutlined />,
        "/news-manage/add": <FormOutlined />,
        "/news-manage/draft": <AlignLeftOutlined />,
        "/news-manage/category": <RadarChartOutlined />,
        "/audit-manage": <AuditOutlined />,
        "/audit-manage/audit": <HighlightOutlined />,
        "/audit-manage/list": <OrderedListOutlined />,
        "/publish-manage": <SnippetsOutlined />,
        "/publish-manage/unpublished": <ExclamationCircleOutlined />,
        "/publish-manage/published": <CheckCircleOutlined />,
        "/publish-manage/sunset": <StopOutlined />

    }



    // const items = [
    //     getItem('首页', '1', <UserOutlined />),
    //     getItem('首页', '2', <UserOutlined />),
    //     getItem('首页', '3', <UserOutlined />),
    //     getItem('用户管理', 'sub1', <MailOutlined />, [
    //         getItem('Option 5', '5'),
    //         getItem('Option 6', '6'),
    //         getItem('Option 7', '7'),
    //         getItem('Option 8', '8'),
    //     ])
    // ];
    let items = setItem(menuItems)
    items = items.map(value => {
        if (value.key == '/home') {
            value.children = undefined;
        }
        return value
    })
    //定义导航菜单的持久化
    const navLocation = [props.location.pathname]
    const openKeys = ['/' + props.location.pathname.split('/')[1]]
    // console.log(openKeys, 'oooo');

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div style={{ display: 'flex', height: '100%', "flexDirection": 'column' }}>
                <div className="logo" >全球新闻发布管理平台</div>
                <div style={{ flex: 1, "overflow": 'auto' }}>
                    <Menu
                        onClick={(e) => {
                            props.history.push(e.key)
                        }}
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={navLocation}
                        defaultOpenKeys={openKeys}
                        items={items}
                    >
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}


export default withRouter(SideMenu)
