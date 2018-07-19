import * as React from 'react'
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom'
import Layout from './layout'

import { PaperListView,  PaperEditView } from './PaperView'
import LoginView from './LoginView'
import { UserListView, UserDetailView } from './UserView'

export default class App extends React.Component {
  state = {
    // debug
    isLogin: true,
    // prod
    // isLogin: false,
  }

  login = () => {
    this.setState(prev => ({ isLogin: true }))
  }

  logout = () => {
    this.setState(prev => ({ isLogin: false }))
  }

  render() {
    const { isLogin } = this.state
    return (
      isLogin
      ? <Layout>
          <Switch>
            {/* paper */}
            <Route path="/paper/new" component={PaperEditView} />
            <Route path="/paper/:id" component={PaperEditView} />
            <Route path="/paper" component={PaperListView} />
            {/* question */}
            {/* user */}
            <Route path="/user/new" compoennt={UserDetailView} />
            <Route path="/user/:id" component={UserDetailView} />
            {/* <Route path="/user/-/new" component={} */}
            <Route path="/user" component={UserListView} />
            {/* redirect to paper */}
            <Redirect exact from="/login" to="/" />
            <Redirect exact from="/" to="/paper" />
          </Switch>
        </Layout>
      : [
        <Route key="login" path="/login" render={(props: RouteComponentProps<any>) => {
          return <LoginView {...props} isLogin={isLogin} login={this.login} logout={this.logout}  />
        }} />,
        <Redirect key="redirect" to="/login" />
      ]
    )
  }
}
