//@flow

export type User = { id: number, name: string, email: string }
export type Entry = { chatID: number, uID: number, lastMessage: Message }

//MESSAGING+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_MESSAGING
export type Message = {
  id: number,
  text: string,
  author_id: number,
  chat_id: number,
  inserted_at: string,
  status: "saved" | "received" | "seen"
}

//typing
type Typing = { kind: "typing" }

//sending
type Sending = { text: string, kind: "sending" }

//message not ack..ed by server
type Failed = { text: string, kind: "failed" }

//one tick - message saved to disk on the server
type Saved = { message: Message, kind: "saved" }

//two ticks - message received by recipient
type Received = { message: Message, kind: "received" }

//two coloured ticks - message has been read
type Seen = { message: Message, kind: "seen" }

export type Event = Typing | Sending | Failed | Saved | Received | Seen

export const check = (e: Event): string => {
  switch (e.kind) {
    case "sending":
      return e.text
    case "received":
      return e.message.text
    case "failed":
      return "network error"
    case "seen":
      return "seen"
    case "typing":
      return "typing"
    case "saved":
      return "saved"
    default:
      ;(e.kind: empty)
      throw Error(`event kind of ${e.kind} is not being handled properly`)
  }
}
//MESSAGING+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_MESSAGING
