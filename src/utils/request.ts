import axios, { AxiosPromise } from 'axios'
import { stringify } from 'qs'
import { IResponse, IPaper, IQuestion, IUser, IResult, IPaperWithQuestions } from './types'
import { addURLPrefix } from './helper'

const requestURL = {
  paper: {
    getAll: '/showalltest',
    add: '/add/test_question',
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
    login: '/login',
  },
  result: {
    get: '/show/result'  // id param
  }
}

const prefix = '/oesrd'
addURLPrefix(requestURL, prefix)

// 迫于后端淫威
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.interceptors.response.use((response) => {
  if (response.data && response.data.code >= 300) {
    throw new Error(response.data.message)
  }
  return response
})


export function setRequestURLPrefix(prefix) {
  addURLPrefix(requestURL, prefix)
}

/** 
 *  paper request helpers
 */
export interface IQuestionConfig {
  questionNum: number;
  questionTitle: string;
  questionScore: number;
  questionAnswer: string;
}

// 后端字段有毒...
function mapQuestionToTest({
  questionNum: test_num,
  questionAnswer: test_answer,
  questionTitle: test_title,
  questionScore: test_score,
}: IQuestionConfig) {
  return {
    test_num,
    test_title,
    test_score,
    test_answer,
  }
}

export interface IPaperConfig {
  paperID: number;
  // paperAnswer?: string;
  paperTitle: string;
  questions: IQuestionConfig[];
}

function mapPaperToTest({
  paperID: test_id,
  paperTitle: test_title,
  // paperAnswer: test_answer,
  questions,
}: IPaperConfig) {
  return {
    test_id,
    test_title,
    // test_answer,
    questions: questions.map(mapQuestionToTest as any),
  }
}

export const paperRequest = {
  getAll(offset?: number, limit?: number): AxiosPromise<IResponse<IPaper[]>> {
    return axios.get(requestURL.paper.getAll)
  },
  add(paper: IPaperConfig): AxiosPromise<IResponse<null>> {
    const data = mapPaperToTest(paper)
    return axios.post(requestURL.paper.add, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  getOne(id: number): AxiosPromise<IResponse<IPaperWithQuestions>> {
    const data = stringify({ id })
    return axios.post(requestURL.paper.getOne, data)
  },
  delete(id: number): AxiosPromise<IResponse<null>> {
    const data = stringify({ num: id })
    return axios.post(requestURL.paper.delete, data)
  },
}

/**
 *  user request
 */
export const userRequest = {
  getAll(): AxiosPromise<IResponse<IUser[]>> {
    return axios.get(requestURL.user.getAll)
  },
  login(username: string, password: string): AxiosPromise<IResponse<null>> {
    const data = stringify({ username, password })
    return axios.post(requestURL.user.login, data)
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
