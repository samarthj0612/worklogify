export interface UserSchema{
  id: string,
  name: string,
  email: string,
  phone: string,
  createdAt: string
}

export interface TaskSchema{
  id: string,
  userId: string,
  title: string,
  description: string,
  status: boolean,
  createdAt: string
}

export interface LogSchema{
  date: string,
  logs: string[]
}

export interface ActivitySchema{
  activity: string,
  type: string,
  userId: string,
  createdAt: string
}
