import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import axios from 'axios'
import { getCookie } from './utils'
import Notiflix from 'notiflix'

function App() {
  const navigate = useNavigate()
  const [todos, setTodos] = useState([])
  const [getTodo, setGetTodo] = useState()
  const [showDropdown, setShowDropdown] = useState(false)
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  const username = localStorage.getItem("username")
  const token = localStorage.getItem("token")
  const headers = { headers: { 'x-access-token': token }}

  useEffect(() => {
    if(!isLoggedIn) {
     return navigate("/login")
    }
  }, [isLoggedIn])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_ENDPOINT}/users/getUser?username=${username}`, headers)
    .then(res => setTodos(res.data[0].todos))
    .catch(console.error)

  }, [])

  const onLogout = () => {
    if(!confirm("Are you sure you want to logout?")) return
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    navigate("/")
    Notiflix.Notify.success('Logout Successfully')
  }

  const addTodo = () => {
    if(!getTodo) return
    axios.post(`${import.meta.env.VITE_ENDPOINT}/users/addTodos`, {
        username: username,
        todos: getTodo
    }, headers)
    .then(res => {
      setTodos([...todos, res.data.result])
      document.getElementById("todoInput").value = ""
      setGetTodo("")
      Notiflix.Notify.success('Todo Added Successfully')
    })
    .catch(console.error)
  }

  const removeTodo = (username, todo) => {
    axios.post(`${import.meta.env.VITE_ENDPOINT}/users/removeTodo`, {
        username: username,
        todo: todo
    }, headers)
    .then(res => {
      const newTodos = todos.filter(todo => todo != res.data.result)
      setTodos(newTodos)
      Notiflix.Notify.success('Todo Removed Successfully')
    })
    .catch(console.error)
  }

  return (
    <div className="App">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">TODO APP</h1>
        <div className="relative" onMouseLeave={() => setShowDropdown(false)}>
          <div onMouseEnter={() => setShowDropdown(true)}  className="w-12 h-12 bg-blue-500 rounded-full grid items-center cursor-pointer">
            <span className="font-bold text-2xl">{username?.charAt(0)}</span>
          </div>
          <div className={`bg-gray-600 hover:bg-gray-700 p-2 rounded-md absolute left-1/2 -translate-x-1/2 cursor-pointer ${showDropdown ? "block": "hidden"}`}>
            <p className="text-white text-sm" onClick={() => onLogout()}>Logout</p>
          </div>
        </div>
      </div>
      <div className="flex w-full mt-12">
        <input type="text" placeholder="Add todo..." onChange={(e) => setGetTodo(e.target.value)} className="w-full p-3 rounded-lg" id="todoInput" />
        <button className="ml-2 bg-green-500 px-8 py-2 rounded-lg" onClick={() => addTodo()}>Add</button>
      </div>
      <ul className="mt-10 text-left">
        {
          todos.map((todo,i) => (
            <li className="text-xl flex justify-between items-center bg-gray-700 mb-2 p-2 rounded-lg" key={i}>
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
