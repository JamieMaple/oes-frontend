import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Layout, Menu, Icon, Breadcrumb } from 'antd'

import IndexView from './IndexView'

const styles = require('./layout.css')

const MenuItem = Menu.Item
const Header = Layout.Header
const Content = Layout.Content
const Footer = Layout.Footer

class NavItem {
  title: string
  icon: string
  constructor(title, icon) {
    this.title = title
    this.icon = icon
  }
}
const navList = [
  new NavItem('试题管理', 'solution'),
  new NavItem('试卷管理', 'database'),
  new NavItem('用户管理', 'user'),
]

function Sider({className}: React.HTMLAttributes<null>) {
  return (
    <Layout.Sider className={className} collapsible>
      <Menu theme="dark" defaultSelectedKeys={[navList[0].title]}>
        {
          navList.map(item => <MenuItem key={item.title}>
            <Icon type={item.icon} />
            <span>{item.title}</span>
          </MenuItem>)
        }
      </Menu>
    </Layout.Sider>
  )
}


export default class App extends React.Component {
  render() {
    return (
      <Layout className={styles['main-layout']}>
        <Sider className={styles.sider} />
        <Layout className={styles['inner-layout']}>
          <Header className={styles.header}></Header>
          <Content className={styles['main-content']}>
            <Breadcrumb style={{ margin: '16px 0' }} className={styles.breadcrumb}>
              <Breadcrumb.Item>测试</Breadcrumb.Item>
              <Breadcrumb.Item>测试</Breadcrumb.Item>
            </Breadcrumb>
            <div className={styles.content}>
              Content
            </div>
          </Content>
          <Footer>Maple Jamie @2018 Created</Footer>
        </Layout>
      </Layout>
    )
  }
}
