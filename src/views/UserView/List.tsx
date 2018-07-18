import * as React from 'react'
import { Table, Divider, message } from 'antd'
import { IUser } from '../../utils/types'
import { userRequest } from '../../utils/request'
import TopMenu from '../components/TopMenu'

const { Column } = Table

function UserTable({ users }: { users: IUser[] }) {
  return (
    <Table dataSource={users}>
      <Column key="id" dataIndex="id" title="用户ID" />
      <Column key="username" dataIndex="user_name" title="用户名" />
      <Column key="actions" title="操作" render={(text, record) => (
        <span>
          <a href="javascript:;">详情</a>
          <Divider type="vertical" />
          {/* <a href="javascript:;">修改</a>
          <Divider type="vertical" /> */}
          <a href="javascript:;">删除</a>
        </span>
      )} />
    </Table>
  )
}

export default class extends React.Component {
  state = {
    users: [] as IUser[]
  }

  async componentDidMount() {
    try {
      const res = await userRequest.getAll()
      this.setState(prev => ({
        ...prev,
        users: res.data.data,
      }))
    } catch(e) {
      message.error(e.message)
    }
  }
  
  render() {
    return (
      <div>
        <TopMenu />
        <UserTable users={this.state.users} />
      </div>
    )
  }
}
