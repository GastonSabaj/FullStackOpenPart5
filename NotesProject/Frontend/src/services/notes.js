import axios from 'axios'
const baseUrl = '/api/notes/'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getToken = () => {
  return token
}

const getAll = () => {
  console.log("Entro al getAll!")
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  console.log("La response es: ",response)
  return response.data

}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll, create, update, setToken, getToken
}