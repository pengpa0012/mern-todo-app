import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import axios from 'axios'
import { getCookie } from './utils'

function App() {
  const navigate = useNavigate()
  const [todos, setTodos] = useState([])
  const [getTodo, setGetTodo] = useState()
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  const username = localStorage.getItem("username")
  const token = localStorage.getItem("token")

  useEffect(() => {
    if(!isLoggedIn) {
     return navigate("/login")
    }
  }, [isLoggedIn])

  useEffect(() => {
    axios.get(`http://localhost:3001/users/getUser?username=${username}`, {
      headers: {
				'x-access-token': token
			}
    })
    .then(res => setTodos(res.data[0].todos))
    .catch(console.error)

  }, [])

  const onLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    navigate("/")
  }

  const addTodo = () => {
    if(!getTodo) return
    axios.post(`http://localhost:3001/users/addTodos`, {
        username: username,
        todos: getTodo
    }, {
      headers: {
				'x-access-token': token
			}
    })
    .then(res => {
      setTodos([...todos, res.data.result])
      document.getElementById("todoInput").value = ""
      setGetTodo("")
    })
    .catch(console.error)
  }

  const removeTodo = (username, todo) => {
    axios.post(`http://localhost:3001/users/removeTodo`, {
        username: username,
        todo: todo
    }, {
      headers: {
				'x-access-token': token
			}
    })
    .then(res => {
      const newTodos = todos.filter(todo => todo != res.data.result)
      setTodos(newTodos)
    })
    .catch(console.error)
  }

  // TODO
  // - Refactor code (Redundant functions)
  // - Add modals/notif
  // - Logout UI

  return (
    <div className="App">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">TODO APP</h1>
        <div onClick={() => onLogout()}>
          <p>IMG</p>
          <p>Username</p>
        </div>
      </div>
      <div className="flex w-full mt-12">
        <input type="text" placeholder="Add todo..." onChange={(e) => setGetTodo(e.target.value)} className="w-full p-2 rounded-lg" id="todoInput" />
        <button className="ml-2 bg-green-500 px-6 py-2 rounded-lg" onClick={() => addTodo()}>Add</button>
      </div>
      <ul className="mt-10 text-left">
        {
          todos.map((todo,i) => (
            <li className="text-xl flex justify-between items-center border border-gray-500 border-l-0 border-r-0 border-t-0 mb-4 py-2" key={i}>
              <p>{todo}</p>
              <button className="bg-red-500 text-sm p-2 rounded-lg" onClick={() => removeTodo(username, todo)}>Remove</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default App
