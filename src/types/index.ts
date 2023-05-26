export type ResponseDTO<T> = {
  status: string
  message: string
  model: {
    data: Array<T>
    next_page_url: string
    path: string
    per_page: number
    prev_page_url: string
    to: number
    total: number
  }
}

export type HeroesResponseModel = {
  id: string
  name: string
  thumbnail: string
  votes: number
  description: string
}