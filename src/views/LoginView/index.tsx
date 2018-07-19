import * as React from 'react'
import { Form, Input, Button, Icon, Card, message } from 'antd'
import { RouteComponentProps } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'

import { userRequest } from '../../utils/request'

const FormItem = Form.Item

const styles = require('./style.css')

interface ILogin {
  username: string;
  password: string;
}

interface ILoginHandler {
  isLogin: boolean;
  login: Function;
  logout: Function;
}

class LoginView extends React.Component<FormComponentProps & RouteComponentProps<any> & ILoginHandler> {
  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { form: { getFieldsValue }, login, logout } = this.props
    const { username, password } = getFieldsValue() as ILogin

    try {
      await userRequest.login(username, password).then(res => res.data)
      message.success('登录成功')
      login()
    } catch(e) {
      message.error('登录失败')
    }
  }

  render() {
    const { form: { getFieldDecorator } } = this.props
    return (
      <div className={styles.wrapper}>
        <Card className={styles['form-wrapper']}  title="登录">
          <Form className={styles['form']} onSubmit={this.handleSubmit}>
            <FormItem>
              {
                getFieldDecorator('username')(<Input prefix={<Icon type="user" />} placeholder="请输入用户名" />)
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('password')(<Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />)
              }
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit">登录</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}

export default Form.create()(LoginView)
