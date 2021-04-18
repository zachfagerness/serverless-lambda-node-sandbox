import Data from './data-model'

const data: Data = {
  users: [{
    id: 1,
    name: 'test',
    email: 'test@example.com'
  }],
  orders: [{
    id: 1,
    type: 'test type',
    product: 'test product',
    user_id: 1
  }]
}

console.log(data)
