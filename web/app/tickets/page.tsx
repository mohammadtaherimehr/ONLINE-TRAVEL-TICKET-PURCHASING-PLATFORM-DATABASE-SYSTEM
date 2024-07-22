import { Button } from "@/components/material-components"
import { cookies } from "next/dist/client/components/headers"
import Link from "next/link"
import { FaPlus } from "react-icons/fa"

const TicketsPage = async () => {
  const userCookies = cookies()

  const token = userCookies.get("token")

  const res = await fetch(process.env.API_HOST! + "/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + token?.value,
    },
    body: JSON.stringify({
      query: `query GetUserTickets {
    getUserTickets {
        id
        status
        createdAt
        title
    }
}
`,
      caches: "no-cache",
    }),
  })

  const ticketsList = (await res.json()).data.getUserTickets

  console.log(ticketsList)

  return (
    <div className="container mx-auto mt-10">
      <div className="flex items-center justify-between">
        <p className="text-xl">لیست تیکت های شما</p>

        <Link href="/tickets/new">
          <Button className="flex items-center" color="primary">
            <FaPlus />
            <span className="mr-4">اضافه کردن تیکت</span>
          </Button>
        </Link>
      </div>
      <div className="mt-10">
        {ticketsList.map((item: any, key: number) => (
          <Link
            href={"/tickets/" + item.id}
            key={key}
            className="m-3 shadow flex items-center justify-between bg-stone-700 p-4 rounded-lg"
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
            {item.status}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TicketsPage
