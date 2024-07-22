import { Button } from "@/components/material-components"
import { cookies } from "next/dist/client/components/headers"
import { FormContainer, TextareaAutosizeElement } from "react-hook-form-mui"
import TicketIdNewMessage from "./new-message/page"
import { FaArrowRight } from "react-icons/fa"
import Link from "next/link"
import CloseTicket from "./close-ticket/page"

const TicketIdPage = async ({ params }: any) => {
  const userCookies = cookies()

  const token = userCookies.get("token")

  const fetchTicket = await fetch(process.env.API_HOST! + "/graphql", {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token?.value}`,
    },
    body: JSON.stringify({
      query: `query GetTicket {
    getTicket(id: ${params.id}) {
        id
        title
        status
        createdAt
           messages {
            id
            message
            senderId
        }
    }
}
`,
    }),
    method: "POST",
    cache: "no-cache",
  })

  const ticketData = (await fetchTicket.json()).data.getTicket

  const firstStarter = ticketData.messages[0]

  return (
    <div className="mx-auto mt-10 container">
      ‌
      <div className="flex items-center justify-between">
        <Link href="/tickets">
          <Button color="primary">
            <FaArrowRight className="ml-5" />
            بازگشت
          </Button>
        </Link>
        <CloseTicket id={ticketData.id} status={ticketData.status} />
      </div>
      <h3 className="font-semibold mt-10 text-lg">مشاهده تیکت</h3>
      <div className="mt-10">
        <p>
          عنوان:‌
          <span className="mr-5">{ticketData.title}</span>
        </p>

        <div className="mt-10">
          {ticketData.messages.map((message: any, key: number) => (
            <div key={key} className="m-3 my-10">
              <span
                className={`bg-stone-700 p-3 ${
                  firstStarter.senderId === message.senderId ? "" : "mr-auto"
                } rounded-lg`}
              >
                {message.message}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <TicketIdNewMessage params={params} />
      </div>
    </div>
  )
}

export default TicketIdPage
