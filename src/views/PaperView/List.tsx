import * as React from 'react'
import { Link } from 'react-router-dom'
import { List, Avatar, Row, Col, Button, Input, message } from 'antd'
import { IPaper } from '../../utils/types'
import { paperRequest } from '../../utils/request'
import TopMenu from '../components/TopMenu'

function PaperList({
  data,
  deleteItem,
}: {data: IPaper[], deleteItem: Function}) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item: IPaper) => (
        <List.Item actions={[
          <Link to={`/paper/edit/${item.id}`}>修改</Link>,
          <a onClick={deleteItem.bind(undefined, item.id)} href="javascript:;">删除</a>,
        ]}>
          <List.Item.Meta
            avatar={<Avatar size="large" style={{ backgroundColor: '#f56a00' }}>Paper</Avatar>}
            title={item.test_title}
            description="试卷介绍"
          />
        </List.Item>
      )}
    />
  )
}

export default class ListView extends React.Component {
  state = {
    data: [] as IPaper[],
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = async () => {
    try {
      const res = await paperRequest.getAll()
      this.setState(prev => ({
        ...prev,
        data: res.data.data,
      }))
    } catch(e) {
      message.error(e.message)
    }
  }

  deletePaper = async (id: number) => {
    try {
      await paperRequest.delete(id)
      message.success('删除成功')
      this.loadData()
    } catch(err) {
      message.error(`删除失败${err.message}`)
    }
  }

  render() {
    return (
      <div>
        <TopMenu to="/paper/new" />
        <PaperList data={this.state.data} deleteItem={this.deletePaper} />
      </div>
    )
  }
}
