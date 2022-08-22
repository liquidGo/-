import React, { useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import SideMenu from '../../components/SandBox/SideMenu'
import TopHeader from '../../components/SandBox/TopHeader'
import Home from './Home/Home'
import UserList from './User-manage/UserList'
import RoleList from './Right-manage/RoleList'
import RightList from './Right-manage/RightList'
import No404 from './No404/No404'
//css
import './NewSandBox.css'



const {Content} = Layout;


export default function NewSandBox() {
    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow:'auto'
                    }}
                >
                    <Switch>
                        <Route path='/home' component={Home}></Route>
                        <Route path='/user-manage/list' component={UserList}></Route>
                        <Route path='/right-manage/role/list' component={RoleList}></Route>
                        <Route path='/right-manage/right/list' component={RightList}></Route>

                        <Redirect from='/' to='/home' exact />
                        <Route path='*' component={No404} ></Route>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}