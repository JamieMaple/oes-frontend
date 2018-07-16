import React from 'react'
import { render } from 'react-dom'

import Entry from './views'

import 'normalize.css'
import './index.global.css'

render(<Entry />, document.getElementById('app'))

// if (module.hot) {
//   module.hot.accept()
// }
