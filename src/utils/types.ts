export interface IResponse<T> {
  code: number,
  message: string,
  data: T,
}

/** paper | test
 *  interfaces
 */
export interface IPaper {
  id: number,
  test_id: number,
  test_title: string,
  test_answer: string,
  reg_date: Date,
}

/** user
 *  interfaces
 */
export interface IUser {
  id: number,
  user_id: number,
  user_name: string,
  user_role: number,
  // user_pwd
}

/** question | test
 *  interfaces
 */
export interface IQuestion {
  id: number,
  test_id: number,
  test_num: number,
  test_content: string,
  test_score: number,
  test_answser: string,
  reg_date: Date,
}
