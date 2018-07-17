import axios, { AxiosPromise } from 'axios'
import { stringify } from 'qs'
import { IResponse, IPaper, IQuestion, IUser, IResult } from './types'
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

const prefix = '/oesrd'
addURLPrefix(requestURL, prefix)

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export function setRequestURLPrefix(prefix) {
  addURLPrefix(requestURL, prefix)
}

/** 
 *  paper request helpers
 */
export interface IPaperConfig {
  paper_id: number,
  paper_answer: string,
  paper_title: string,
}

function mapPaperToTest({
  paper_id: test_id,
  paper_title: test_title,
  paper_answer: test_answer,
}: IPaperConfig) {
  return {
    test_id,
    test_title,
    test_answer,
  }
}

export const paperRequest = {
  getAll(offset?: number, limit?: number): AxiosPromise<IResponse<IPaper[]>> {
    return axios.get(requestURL.paper.getAll)
  },
  add(paper: IPaperConfig): AxiosPromise<IResponse<null>> {
    const data = stringify(mapPaperToTest(paper))
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
 *  user request
 */
export interface IQuestionConfig {
  paper_id: number,
  question_num: number,
  question_content: string,
  question_score: number,
  question_answer: string,
}

// 后端字段有毒...
function mapQuestionToTest({
  paper_id: test_id,
  question_num: test_num,
  question_answer: test_answer,
  question_content: test_content,
  question_score: test_score,
}: IQuestionConfig) {
  return {
    test_id,
    test_num,
    test_content,
    test_score,
    test_answer,
  }
}

export const userRequest = {
  getAll(): AxiosPromise<IResponse<IUser[]>> {
    return axios.get(requestURL.user.getAll)
  },
  add(): AxiosPromise<IResponse<IUser[]>> {
    return axios.post(requestURL.user.add)
  },
  delete(id: number): AxiosPromise<IResponse<null>> {
    const data = stringify({ student_id: id })
    return axios.post(requestURL.user.delete)
  }
}

export const questionRequest = {
  add(question: IQuestionConfig): AxiosPromise<IResponse<null>> {
    const data = stringify(mapQuestionToTest(question))
    return axios.post(requestURL.user.add, data)
  },
  // delete(id: number): AxiosPromise<IResponse<null>> {
  //   return axios.post(requestURL.user.delete)
  // },
  // update(): AxiosPromise<IResponse<null>> {
  //   return axios.post(requestURL.user.update)
  // },
}

/**
 *  request
 */

export const resultRequest = {
  get(userId: number, paperId: number): AxiosPromise<IResponse<IResult>> {
    return axios.get(requestURL.result.get, {
      params: {
        id: userId,
        test_id: paperId,
      }
    })
  }
}
