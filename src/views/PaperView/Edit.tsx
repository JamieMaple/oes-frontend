import * as React from 'react'
import { Form, Input, Button, Row, Col, Table, Modal, Radio, Divider, message } from 'antd'
import { RouteComponentProps } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'
import { RadioChangeEvent } from 'antd/lib/radio'

import { paperRequest, IQuestionConfig as IQuestionRequest, IQuestionConfig } from '../../utils/request'
import { IQuestion as IQuestionResponse } from '../../utils/types'

const FormItem = Form.Item
const commonFormItem = { display: 'flex', justifyContent: 'center' }

interface IQuestion extends IQuestionRequest {
  key: string;
}

type IQuestionForm = {
  [prop in keyof IQuestion]: string;
}

interface IEvent {
  target: {
    value: string;
  }
}

const QuestionsContext = React.createContext({
  questionFormVisible: false,
  showQuestionForm: () => {},
  cancel: () => {},
  deleteQuestion: (key: string) => {},
  questions: [] as IQuestion[],
})


class NewQuestion extends React.Component<{visible, cancel, newQuestion: (q: IQuestion) => void}, any> {
  static id = 0

  state = {
    questionTitle: '',
    questionScore: 0,
    questionAnswer: '',
  }

  getTitle = (e: IEvent) => {
    const val = e.target.value
    this.setState(prev => ({ ...prev, questionTitle: val }))
  }

  getScore = (e: IEvent) => {
    const val = +e.target.value
    if (Number.isNaN(val)) {
      return
    }
    this.setState(prev => ({ ...prev, questionScore: val }))
  }

  getAnswer = (e: RadioChangeEvent) => {
    const val = e.target.value
    this.setState(prev => ({ ...prev, questionAnswer: val }))
  }

  generateUniqueKey = () => {
    return `component-${NewQuestion.id++}`
  }

  submitNewQuestion = (...args) => {
    const { questionTitle, questionAnswer, questionScore } = this.state
    this.setState(prev => ({
      questionTitle: '',
      questionScore: 0,
      questionAnswer: '',
    }))
    this.props.newQuestion({
      key: this.generateUniqueKey(),
      questionNum: 0,
      questionTitle: questionTitle,
      questionScore: questionScore,
      questionAnswer: questionAnswer,
    })
  }

  cancel = () => {
    this.props.cancel()
  }

  render() {
    const { visible } = this.props
    const { questionTitle, questionScore, questionAnswer } = this.state

    const radios = ['A', 'B', 'C', 'D'].map(item => (
      <Radio key={item} value={item}>{item}</Radio>
    ))

    return (
      <Modal visible={visible} title="添加试题" okText="添加" onCancel={this.cancel} onOk={this.submitNewQuestion}>
        <FormItem style={commonFormItem} label="题目">
          <Input onChange={this.getTitle} value={questionTitle} />
        </FormItem>
        <FormItem style={commonFormItem} label="分值">
          <Input onChange={this.getScore} value={questionScore} />
        </FormItem>
        <FormItem style={commonFormItem} label="正确答案">
          <Radio.Group onChange={this.getAnswer} value={questionAnswer}>{radios}</Radio.Group>
        </FormItem>
      </Modal>
    )
  }
}

class QuestionTable extends React.Component<{questions: IQuestion[], deleteQuestion}> {
  render() {
    const { questions, deleteQuestion } = this.props
    return (
      <QuestionsContext.Consumer>
        {
          ctx => (
            <Table dataSource={questions} columns={[
              { title: '题号', key: 'num', dataIndex: 'questionNum' },
              { title: '题目内容', key: 'content', dataIndex: 'questionTitle' },
              { title: '题目分值', key: 'score', dataIndex: 'questionScore' },
              { title: '题目答案', key: 'answer', dataIndex: 'questionAnswer' },
              { title: '操作', key: 'actions', render: (text,record) => (<span>
                <a onClick={ctx.showQuestionForm} href="javascript:;">修改</a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={ctx.deleteQuestion.bind(undefined, record.key)}>删除</a>
              </span>) }
            ]} />
          )
        }
      </QuestionsContext.Consumer>
    )
  }
}

interface IEditState {
  questionFormVisible: boolean;
  paperID: number;
  paperTitle: string;
  questions: IQuestion[];
}

function mapQuestionResponseToQuestion(questions: IQuestionResponse[]): IQuestion[] {
  return questions.map((question: IQuestionResponse): IQuestion => {
    const { test_num, test_title, test_answser, test_score } = question
    return {
      key: `${test_num}-${test_title}}`,
      questionNum: test_num,
      questionTitle: test_title,
      questionScore: test_score,
      questionAnswer: test_answser,
    }
  })
}

class EditForm extends React.Component<FormComponentProps & RouteComponentProps<any>, IEditState> {
  state: IEditState = {
    questionFormVisible: false,
    paperID: undefined,
    paperTitle: undefined,
    questions: [],
  }

  showCreateQuestionForm = () => {
    this.setState(prev => ({
      ...prev,
      questionFormVisible: true,
    }))
  }

  cancelShowCreateQuestionForm = () => {
    this.setState(prev => ({
      ...prev,
      questionFormVisible: false,
    }))
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = this.props.form.getFieldsValue() as any
    try {
      await paperRequest.add({
        paperID: data.paperID,
        paperTitle: data.paperTitle,
        questions: this.state.questions,
      })
      message.success('添加成功')
      this.props.history.goBack()
    } catch(e) {
      message.error(e.message)
    }
  }

  newQuestion = (newQuestion: IQuestion) => {
    this.setState(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    this.cancelShowCreateQuestionForm()
  }

  deleteQuestion = (key: string) => {
    this.setState(prev => ({
      ...prev,
      questions: prev.questions.filter(question => question.key !== key),
    }))
  }

  resetFormData = () => {
    this.setState(prev => ({
      ...prev,
      paperID: undefined,
      paperTitle: undefined,
      questions: [],
    }))
    this.props.form.resetFields()
  }

  async componentWillMount() {
    const { match: { params: { id } } } = this.props
    const num = +id
    
    try {
      if (Number.isNaN(num)) {
        return
      }
      const data = await paperRequest.getOne(id).then(res => res.data.data)
      this.setState((prev: IEditState): IEditState => ({
        ...prev,
        paperID: data.test_id,
        paperTitle: data.test_title,
        questions: mapQuestionResponseToQuestion(data.questions),
      }))
    } catch(e) {
      message.error(e.message)
    }
  }

  render() {
    const { form: { getFieldDecorator } } = this.props
    const { questionFormVisible, questions, paperID, paperTitle } = this.state
    return (
      <QuestionsContext.Provider value={{
        questionFormVisible: questionFormVisible,
        questions: questions,
        cancel: this.cancelShowCreateQuestionForm,
        showQuestionForm: this.showCreateQuestionForm,
        deleteQuestion: this.deleteQuestion,
      }}>
        <div>
          <NewQuestion
            visible={questionFormVisible}
            newQuestion={this.newQuestion}
            cancel={this.cancelShowCreateQuestionForm}
          />
          <Form onSubmit={this.handleSubmit}>
            <Row type="flex" justify="center">
              <Col span={8}>
                <FormItem style={commonFormItem} label="试卷编号">
                  {
                    getFieldDecorator('paperID', {initialValue: paperID})(<Input type="number"/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem style={commonFormItem} label="试卷标题">
                  {
                    getFieldDecorator('paperTitle', { initialValue: paperTitle })(<Input />)
                  }
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem>
                  <Button onClick={this.showCreateQuestionForm} type="dashed">添加试题</Button>
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <QuestionTable deleteQuestion={this.deleteQuestion} questions={questions.map((question: IQuestion, index: number) => ({...question, questionNum: index  + 1}))} />
            </FormItem>
            <FormItem style={{ display: 'flex', justifyContent: 'center' }}>
              <Button htmlType="submit" style={{ marginRight: 20 }} type="primary">添加</Button>
              <Button onClick={this.resetFormData} type="danger">清空</Button>
            </FormItem>
          </Form>
        </div>
      </QuestionsContext.Provider>
    )
  }
}

export default Form.create()(EditForm)
