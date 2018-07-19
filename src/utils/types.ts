export interface IResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** paper | test
 *  interfaces
 */
export interface IPaper {
  id: number;
  test_id: number;
  test_title: string;
  test_answer: string
  reg_date: Date;
}

export interface IPaperWithQuestions extends IPaper {
  questions: IQuestion[];
}

/** user
 *  interfaces
 */
export interface IUser {
  id: number;
  user_name: string
  // user_role: number;
  // user_pwd
}

/** question | test
 *  interfaces
 */
export interface IQuestion {
  test_id: number
  test_num: number;
  test_title: string;
  test_score: number;
  test_answser: string;
  reg_date: Date;
}

/**
 *  result
 */
export interface IResult {
  user_id: number;
  user_name: string;
  test_id: number;
  test_title: string;
  test_datas: IQuestion[];
}
