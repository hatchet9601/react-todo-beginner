import './App.scss';
import {useEffect, useState} from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from 'date-fns/locale/ja';
// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPenToSquare, faClock, faSquarePlus} from "@fortawesome/free-regular-svg-icons";
import {faEraser} from "@fortawesome/free-solid-svg-icons";

registerLocale('ja', ja);

function App() {
  const [todoAddTitle, setTodoAddTitle] = useState('')
  const [startDate, setStartDate] = useState(new Date());
  const [todoAddStatus, setTodoAddStatus] = useState('no-yet')
  const [filter,setFilter] = useState('all')
  const [todos, setTodos] = useState([])
  const [filterdTodos,setFilterdTodos] = useState([])
  
  //ステータスの値は複数出現するため配列化
  const statusList = [
    {value:'no-yet', label: '未着手'},
    {value:'start', label: '着手'},
    {value:'comp', label: '完了'}
  ]

  //タスク追加関連
  const onClickAddTodo = () => {
    if(todoAddTitle === '') return
    const newTodo = {
      id:todos.length > 0 ? todos.length : 0,
      title:todoAddTitle,
      date:startDate,
      status:todoAddStatus,
      editing:false
    }
    const newTodos = [...todos, newTodo];
    setTodoAddTitle('');
    setTodos(newTodos)
  }
  const onChangeAddDate = (date) => {
    setStartDate(date)
  }
  const onChangeTitle = (event) => {
    setTodoAddTitle(event.target.value);
  }
  const onChangeAddStatus = (event) => {
    setTodoAddStatus(event.target.value);
  }
  //追加後のタスク変更関連
  const onClickTodoTitle = (index) => {
    const newTodos = [...todos];
    newTodos[index].editing = true
    setTodos(newTodos)
  }
  const onChangeTodoTitle = (event, index) => {
    const newTodos = [...todos];
    newTodos[index].title = event.target.value
    setTodos(newTodos)
  }
  const onBlurTodoTitle = (index) => {
    const newTodos = [...todos];
    newTodos[index].editing = false
    setTodos(newTodos)
  }
  const onChangeDate =(index, date) => {
    const newTodos = [...todos];
    newTodos[index].date = date
    setTodos(newTodos)
  }
  const onChangeDetail = (event, index) => {
    const newTodos = [...todos];
    newTodos[index].detail = event.target.value;
    setTodos(newTodos)
  }
  const onChangeStatus = (event, index) => {
     const newTodos = [...todos];
     newTodos[index].status = event.target.value;
     setTodos(newTodos)
  }
  const onClickDelete = (id) => {
    const newTodos = todos.filter( (todo) => todo.id !== id )
    setTodos(newTodos)
  }
  //filter
  const onClickTodoFilter = (key) => {
    setFilter(key)
  }
  //filterの値が変更された時と、todosが変更（追加、削除）時のみ実行
  useEffect(() => {
    const filteringTodos = () => {
      switch(filter) {
        case 'all':
          setFilterdTodos(todos)
          break;
        default :
          setFilterdTodos(
            todos.filter(todo => todo.status === filter)
          )
          break;
      }
    }
    filteringTodos();
  }, [filter, todos])
  
  return (
    <div className="App">
      <header className="hd">
        <h1 className="hd__title">React-Todo</h1>
      </header>
      <div className="main">
        <section className="todo-add">
          <div className="todo-add__data form">
            <input placeholder='タスク名を入力してください' value={todoAddTitle} className="form__input" onChange={onChangeTitle} ></input>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              locale='ja'
              selected={startDate}
              onChange={onChangeAddDate}
            />
              <select className={`form__select todo-status todo-status--${todoAddStatus}`} onChange={onChangeAddStatus}>
                {
                  statusList.map( (status) => {
                    return (
                      <option value={status.value} className="todo-status__option" key={status.value}>{status.label}</option>
                    )
                  })
                }
              </select>
            <button className="form__button form__button--add" onClick={onClickAddTodo}><FontAwesomeIcon icon={faSquarePlus} />追加</button>
          </div>
        </section>
        <section className="todos-section">
          <h2 className="todos-section__title">タスク一覧</h2>
          <ul className="todo-filter">
            <li className="todo-filter__item">
              <button className={`todo-filter__button todo-filter__button--all ${filter === 'all' ? 'todo-filter__button--active' : ''}`} onClick={() => onClickTodoFilter('all')}>すべて</button>
            </li>
            {
              statusList.map( (status) => {
                return (
                  <li className="todo-filter__item" key={status.value}>
                    <button className={`todo-filter__button todo-filter__button--${status.value}  ${filter === status.value ? 'todo-filter__button--active' : ''}`} onClick={() => onClickTodoFilter(status.value)}>{status.label}</button>
                  </li>
                )
              })
            }
          </ul>
          <table className="todos">
            <tbody>
              <tr className="todos__head">
                <th className="todos__heading">タスク名</th>
                <th className="todos__heading">完了予定日</th>
                <th className="todos__heading">詳細</th>
                <th className="todos__heading">ステータス</th>
                <th className="todos__heading"></th>
              </tr>
              {filterdTodos.map( (todo, index) => {
                return (
                  <tr className="todos__item todo" key={index}>
                    <td className="todo__title" onClick={() => onClickTodoTitle(index)}>
                      <FontAwesomeIcon icon={faPenToSquare} className="todo__icon todo__icon--edit"/>
                      {todo.editing ?
                        <input value={todo.title} className="form__input form__input--edit" onChange={(event) => onChangeTodoTitle(event, index)} onBlur={() => onBlurTodoTitle( index)}></input> 
                        :
                        todo.title
                      }
                    </td>
                    <td className="todo__date">
                      <FontAwesomeIcon icon={faClock} />
                      <DatePicker
                        dateFormat="yyyy/MM/dd"
                        locale='ja'
                        selected={todo.date}
                        onChange={(date) => onChangeDate(index, date)}
                      />
                    </td>
                    <td className="todo__detail form">
                      <textarea className="form__textarea form__textarea--detail" rows="1" onChange={(event) => onChangeDetail(event, index)}></textarea>
                    </td>
                    <td className="todo__status form">
                        <select className={`form__select todo-status todo-status--${todo.status}`} value={todo.status} onChange={(event) => onChangeStatus(event,index)}>
                        {
                          statusList.map( (status) => {
                            return (
                              <option value={status.value} className="todo-status__option" key={status.value}>{status.label}</option>
                            )
                          })
                        }
                        </select>
                    </td>
                    <td className="todo__buttons form">
                        <button className="form__button form__button--delete" onClick={() => onClickDelete(todo.id)}><FontAwesomeIcon icon={faEraser} />削除</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default App;