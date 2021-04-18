
const data = {
  0: {
    name: 'test',
    email: 'test@example.com'
  }
}

async function usersList (req, res) {
  return { status: 200, json: Object.values(data) }
}

async function usersGet (req, res) {
  const item = data[req.pathParams.id]
  return { status: 200, json: { ...item } }
}

async function usersCreate (req, res) {
  const id = Object.keys(data).length
  data[id] = req.data

  return { status: 201, json: { id } }
}

async function usersUpdate (req, res) {
  data[req.pathParams.id] = {
    ...data[req.pathParams.id],
    ...req.data
  }
  return { status: 202 }
}

async function usersDelete (req, res) {
  delete data[req.pathParams.id]
  return { status: 202 }
}

module.exports = {
  usersList,
  usersGet,
  usersCreate,
  usersUpdate,
  usersDelete
}
