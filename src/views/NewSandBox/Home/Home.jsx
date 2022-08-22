import React, { useEffect } from 'react'
import { Button } from 'antd'
import axios from 'axios'

export default function Home() {
    const query = () => {
        axios.get('http://localhost:3000/comments?_expand=post').then(res => { console.log(res, 'res'); });
    }
    const add = () => {
        axios.post('http://localhost:3000/posts',
            { id: 3, title: '测试', author: '添加成功！' }
        ).then(res => { console.log(res, 'res'); });
    }

    const change = () => {
        axios.patch('http://localhost:3000/posts/3', {
            title: '测试修改功能'
        })
    }
    const del = () => {
        axios.delete('http://localhost:3000/posts/1', {
            title: '测试修改功能'
        })
    }
    return (
        <div>
            Home
            <Button type='primary' onClick={query} >查询</Button>
            <Button type='primary' onClick={add} >增加</Button>
            <Button type='primary' onClick={change}>修改</Button>
            <Button type='primary' onClick={del} >删除</Button>
        </div>
    )
}
