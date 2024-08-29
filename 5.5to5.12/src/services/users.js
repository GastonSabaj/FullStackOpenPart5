import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getToken = () => {
  return token
}


const getUser = async id => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getUser, setToken, getToken }
