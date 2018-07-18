import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Row, Col, Button, Input } from 'antd'

function TopMenu({
  onSearch = (val) => { console.log('search: ', val) },
  to = '',
  history,
}: {
  to?: string,
  onSearch?: (value: string, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => any,
} & RouteComponentProps<null>) {
  return (
    <Row type="flex" justify="space-between" style={{ marginBottom: 12 }}>
      <Col span={4}>
        <Button type="primary" icon="plus" onClick={() => { 
          if (to) {
            history.push(to)
          }
        }}>
          添加
        </Button>
      </Col>
      <Col span={10}>
        <Input.Search placeholder="搜索一下" onSearch={onSearch} enterButton />
      </Col>
    </Row>
  )
}

export default withRouter(TopMenu)
