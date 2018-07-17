import * as React from 'react'
import { List, Avatar, Row, Col, Button, Input, message } from 'antd'
import { IPaper } from '../../utils/types'
import { paperRequest } from '../../utils/request'

function PaperList({
  data
}: { data: IPaper[] }) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item: IPaper) => (
        <List.Item actions={[<a>详情</a>, <a>修改</a>, <a>删除</a>]}>
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

function TopMenu() {
  return (
    <Row type="flex" justify="space-between" style={{ marginBottom: 12 }}>
      <Col span={4}>
        <Button type="primary" icon="plus">添加</Button>
      </Col>
      <Col span={10}>
        <Input.Search placeholder="搜索一下" enterButton />
      </Col>
    </Row>
  )
}

export default class ListView extends React.Component {
  state = {
    data: [] as IPaper[],
  }

  async componentDidMount() {
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

  render() {
    return (
      <div>
        <TopMenu />
        <PaperList data={this.state.data} />
      </div>
    )
  }
}
