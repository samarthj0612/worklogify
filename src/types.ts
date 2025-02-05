export interface UserSchema{
  id: string,
  name: string,
  email: string,
  phone: string,
  createdAt: string
}

export interface LogSchema{
  date: string,
  logs: string[]
}
