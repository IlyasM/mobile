//@flow

export type User = { id: number, name: string, email: string, image: string }

//MESSAGING+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_MESSAGING
export type Message = {
  id: number,
  text: string,
  author_id: number,
  chat_id: number,
  inserted_at: string,
  status: "saved" | "received" | "seen"
}
