import { paperRequest, setRequestURLPrefix } from '../utils/request'

beforeAll(() => {
  setRequestURLPrefix('http://10.23.39.140:8225')
})

describe('#paper', function() {
  let addPaperId = 10000
  let testTitle = 'test title'
  let testAnswer = "ABSEDFSFDSFDSF"

  it('#get all papers', async () => {
    try {
      const res = await paperRequest.getAll().then(res => res.data)
      expect(res.data).toBeInstanceOf(Array)
    } catch(e) {
      throw(e)
    }
  })
  it('#add a paper', async () => {
    try {
      const res = await paperRequest.add({
        paper_id: addPaperId,
        paper_title: testTitle,
        paper_answer: testAnswer,
      }).then(res => res.data)
      expect(res.code).toBe(200)
    } catch(e) {
      throw e
    }
  })
  it('#get one paper', async () => {
    try {
      const res = await paperRequest.getOne(addPaperId).then(res => res.data)
      expect(res.data).toBeInstanceOf(Array)
    } catch(e) {
      throw e
    }
  })
  it('#delete one paper', async () => {
    try {
      await paperRequest.delete(addPaperId)
    } catch(e) {
      throw e
    }
  })
  it('#should never get the paper', async () => {
    try {
      const data = await paperRequest.getOne(addPaperId).then(res => res.data)
      expect(data.code).not.toBe(200)
    } catch(e) {
        
    }
  })
})

describe('#question', function() {
  
})

// describe('#')
