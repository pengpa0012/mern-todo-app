import axios from 'axios'
import { atom, useAtom } from 'jotai'
import {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Login = () => {
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem("isLoggedIn")

  useEffect(() => {
    if(isLoggedIn) {
      return navigate("/")
     }
  }, [])
  
  

  const onSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const username = form.elements['username'].value
    const password = form.elements['password'].value
    if(!username || !password) return
    console.log(username, password)

    axios.post('http://localhost:3001/users/login', {
      username: username,
      password: password
    })
    .then(response => {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("username", username);
      localStorage.setItem("token", response.data.accessToken);
      navigate("/")
      alert(response.data.message)
    })
    .catch((err) => alert("Error Login"))
  }
  return (
    <div className="absolute inset-0 grid items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg" style={{ width: 300 }}>
        <h1 className="text-2xl mb-4">Todo App</h1>
        <form className="flex flex-col" onSubmit={onSubmit} id="form">
          <input type="text" name="username" placeholder="username" className="p-2 rounded-lg mb-2"/>
          <input type="text" name="password" placeholder="password" className="p-2 rounded-lg mb-2" />
          <button type="submit" className="bg-green-500 rounded-lg py-2 mb-4">Login</button>
        </form>
        <p className="text-sm">Create account <Link to="/signup" className="text-blue-200 text-underline">here</Link></p>
      </div>
    </div>
  )
}
