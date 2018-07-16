import * as React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Layout from './layout'

import { PaperListView } from './PaperView'
import { QuestionListView } from './QuestionView'
import { UserListView } from './UserView'

export default class App extends React.Component {
  render() {
    return (
      <Layout>
        <Switch>
          {/* paper */}
          <Route path="/paper" component={PaperListView} />
          {/* question */}
          <Route path="/question" component={QuestionListView} />
          {/* user */}
          <Route path="/user" component={UserListView} />

          {/* redirect to paper */}
          <Redirect from="/" to="/paper" />
        </Switch>
      </Layout>
    )
  }
}
