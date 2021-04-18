
interface User {
    id: number,
    name: string,
    email: string
}

interface Order {
    id: number,
    type: string,
    product: string,
    user_id: User['id']
}

export default interface Data {
    users: Array<User>,
    orders: Array<Order>
}
