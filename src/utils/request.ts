import axios, { AxiosPromise } from 'axios'
import { stringify } from 'qs'
import { IResponse, IPaper, IQuestion } from './types'
import { addURLPrefix } from './helper'

const requestURL = {
  paper: {
    getAll: '/showalltest',
    add: '/addtest',
    getOne: '/showatest',
    delete: '/deleteatest',
  },
  question: {
    add: '/addquestion',
  },
  user: {
    getAll: '/stu/get',
    add: '/stu/add',
    delete: '/stu/delete',
    update: '/stu/update',
  },
  result: {
    get: '/show/result'  // id param
  }
}

const prefix = ''
addURLPrefix(requestURL, prefix)

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export function setRequestURLPrefix(prefix) {
  addURLPrefix(requestURL, prefix)
}

/** paper request helpers
 *  
 */
export const paperRequest = {
  getAll(): AxiosPromise<IResponse<IPaper[]>> {
    return axios.get(requestURL.paper.getAll)
  },
  add(test_id: number, test_title: string, test_answser: string): AxiosPromise<IResponse<null>> {
    const data = stringify({ test_id, test_title, test_answser })
    return axios.post(requestURL.paper.add, data)
  },
  getOne(id: number): AxiosPromise<IResponse<IQuestion[]>> {
    const data = stringify({ id })
    return axios.post(requestURL.paper.getOne, data)
  },
  delete(id: number): AxiosPromise<IResponse<null>> {
    const data = stringify({ id })
    return axios.post(requestURL.paper.delete, data)
  },
}

/**
 *  user
 */

