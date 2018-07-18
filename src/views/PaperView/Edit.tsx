import * as React from 'react'
import { Form, Input, Button, Row, Col, Table, Modal, Radio, Divider, message } from 'antd'
import { RouteComponentProps } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'

import { paperRequest } from '../../utils/request'

const FormItem = Form.Item
const commonFormItem = { display: 'flex', justifyContent: 'center' }

interface IQuestion {
  key: string;
  questionNum: number;
  questionTitle: string;
  questionAnswer: string;
  questionScore: number;
}

type IQuestionForm = {
  [prop in keyof IQuestion]: string;
}

const CreateQuestionFormModal = Form.create()(
  class NewQuestion extends React.Component<{visible, cancel, newQuestion: (q: IQuestion) => void} & FormComponentProps, any> {
    static id = 0

    generateUniqueKey = () => {
      return `component-${NewQuestion.id++}`
    }
    submitNewQuestion = (...args) => {
      const question = this.props.form.getFieldsValue() as IQuestionForm

      this.props.newQuestion({
        ...question,
        key: this.generateUniqueKey(),
        questionNum: +question.questionNum,
        questionScore: +question.questionScore,
      })
    }

    componentWillReceiveProps(next) {
      if (!next.visible) {
        this.props.form.resetFields()
      }
    }

    cancel = () => {
      this.props.cancel()
    }

    render() {
      const { visible, form: { getFieldDecorator } } = this.props

      const radios = ['A', 'B', 'C', 'D'].map(item => (
        <Radio key={item} value={item}>{item}</Radio>
      ))

      return (
        <Modal visible={visible} title="添加试题" okText="添加" onCancel={this.cancel} onOk={this.submitNewQuestion}>
          <Form>
            <FormItem style={commonFormItem} label="题号">
              {
                getFieldDecorator('questionNum')(
                  <Input type="number" />
                )
              }
            </FormItem>
            <FormItem style={commonFormItem} label="题目">
              {
                getFieldDecorator('questionTitle')(
                  <Input />
                )
              }
            </FormItem>
            <FormItem style={commonFormItem} label="分值">
              {
                getFieldDecorator('questionScore')(
                  <Input type="number" />
                )
              }
            </FormItem>
            <FormItem style={commonFormItem} label="正确答案">
              {
                getFieldDecorator('questionAnswer')(
                  <Radio.Group>{radios}</Radio.Group>
                )
              }
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)

class QuestionTable extends React.Component<{questions: IQuestion[], deleteQuestion}> {
  render() {
    const { questions, deleteQuestion } = this.props
    return <Table dataSource={questions} columns={[
      { title: '题号', key: 'num', dataIndex: 'questionNum' },
      { title: '题目内容', key: 'content', dataIndex: 'questionTitle' },
      { title: '题目分值', key: 'score', dataIndex: 'questionScore' },
      { title: '题目答案', key: 'answer', dataIndex: 'questionAnswer' },
      { title: '操作', key: 'actions', render: (text,record) => (<span>
        <a href="javascript:;">修改</a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={deleteQuestion.bind(undefined, record.key)}>删除</a>
      </span>) }
    ]} />
  }
}

class EditForm extends React.Component<FormComponentProps & RouteComponentProps<any>, {
  questionFormVisible: boolean;
  questions: IQuestion[];
}> {
  state = {
    questionFormVisible: false,
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
      questions: [],
    }))
    this.props.form.resetFields()
  }

  render() {
    const { form: { getFieldDecorator } } = this.props
    return (
      <div>
        <CreateQuestionFormModal
          visible={this.state.questionFormVisible}
          newQuestion={this.newQuestion}
          cancel={this.cancelShowCreateQuestionForm}
        />
        <Form onSubmit={this.handleSubmit}>
          <Row type="flex" justify="center">
            <Col span={8}>
              <FormItem style={commonFormItem} label="试卷编号">
                {
                  getFieldDecorator('paperID')(<Input type="number" />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem style={commonFormItem} label="试卷标题">
                {
                  getFieldDecorator('paperTitle')(<Input />)
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
            <QuestionTable deleteQuestion={this.deleteQuestion} questions={this.state.questions} />
          </FormItem>
          <FormItem style={{ display: 'flex', justifyContent: 'center' }}>
            <Button htmlType="submit" style={{ marginRight: 20 }} type="primary">添加</Button>
            <Button onClick={this.resetFormData} type="danger">清空</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(EditForm)
