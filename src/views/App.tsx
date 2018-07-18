import * as React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Layout from './layout'

import { PaperListView, PaperDetailView, PaperEditView } from './PaperView'
// import { QuestionListView } from './QuestionView'
import { UserListView, UserDetailView } from './UserView'

export default class App extends React.Component {
  render() {
    return (
      <Layout>
        <Switch>
          {/* paper */}
          <Route path="/paper/edit/:id" component={PaperEditView} />
          <Route path="/paper/new" component={PaperEditView} />
          <Route path="/paper/:id" component={PaperEditView} />
          <Route path="/paper" component={PaperListView} />
          {/* question */}
          {/* user */}
          <Route path="/user/:id" component={UserDetailView} />
          {/* <Route path="/user/-/new" component={} */}
          <Route path="/user" component={UserListView} />
          {/* redirect to paper */}
          <Redirect exact from="/" to="/paper" />
        </Switch>
      </Layout>
    )
  }
}
