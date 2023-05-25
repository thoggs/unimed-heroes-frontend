export type ResponseDTO<T> = {
  status: string
  message: string
  model: {
    page: number
    limit: number
    total: number
    count: number
    data: Array<T>
  }
}

export type HeroesResponseModel = {
  id: string
  name: string
  thumbnail: string
  votes: number
  description: string
}