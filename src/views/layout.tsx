import * as React from 'react'
import { Switch, Route, Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Layout, Menu, Icon, Breadcrumb } from 'antd'

const styles = require('./layout.css')

const Header = Layout.Header
const Content = Layout.Content
const Footer = Layout.Footer

class NavItem {
  title: string
  icon: string
  url: string
  constructor(title, icon, url) {
    this.title = title
    this.icon = icon
    this.url = url
  }
}
const navList = [
  new NavItem('试卷管理', 'database', '/paper'),
  // new NavItem('试题管理', 'solution', '/question'),
  new NavItem('用户管理', 'user', '/user'),
]

function Sider({className, history, location}:  React.HTMLAttributes<null> & RouteComponentProps<null>) {
  return (
    <Layout.Sider className={className} collapsible>
      <Menu theme="dark" selectedKeys={[location.pathname]}>
        {
          navList.map(item => <Menu.Item onClick={() => history.push(item.url)} key={item.url}>
            <Icon type={item.icon} />
            <span>{item.title}</span>
          </Menu.Item>)
        }
      </Menu>
    </Layout.Sider>
  )
}

const Side = withRouter(Sider) as React.ComponentType<React.HTMLAttributes<{}>>


const breadcrumbMap = {
  '/': '主页',
  '/paper': '试卷管理',
  // '/question': '试题管理',
  '/user': '用户管理',
}

function MainBreadcrumb() {
  const breads = location.pathname.split('/').map(item => `/${item}`)
    .filter(item => item in breadcrumbMap).map(item => ({ path: item, pathname: breadcrumbMap[item] }))
  return (
    <Breadcrumb style={{ margin: '16px 0' }} className={styles.breadcrumb}>
      {
        breads.map(item => <Breadcrumb.Item key={item.path}>
           <Link to={item.path}>{item.pathname}</Link>
        </Breadcrumb.Item>)
      }
    </Breadcrumb>
  )
}

export default class MainLayout extends React.Component {
  render() {
    return (
      <Layout className={styles['main-layout']}>
        <Side className={styles['sider']} />
        <Layout className={styles['inner-layout']}>
          <Header className={styles.header}></Header>
          <Content className={styles['main-content']}>
            <MainBreadcrumb />
            <div className={styles.content}>
              {this.props.children}
            </div>
          </Content>
          <Footer className={styles.footer}>Maple Jamie @2018 Created</Footer>
        </Layout>
      </Layout>
    )
  }
}
