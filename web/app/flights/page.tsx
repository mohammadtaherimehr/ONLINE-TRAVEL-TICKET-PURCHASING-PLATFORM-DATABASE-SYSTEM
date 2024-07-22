import { Button } from "@/components/material-components"
import FlightPage from "./flight/page"
import { FaArrowRight } from "react-icons/fa"

const FlightsPage = async ({ searchParams }: { searchParams: any }) => {
  const query = `
  query GetTravels {
    getTravels(
        type: "${searchParams.vehicleType}"
        source: "${searchParams.origin}"
        destination: "${searchParams.destination}"
        amount: ${searchParams.count}
        pageNumber: ${searchParams.page ?? 0}
        date: ${searchParams.date}
    ) {
        res {
            id
            originName
            destinationName
            startsAt
            duration
            vehicleType
            travelType
            capacity
            price
        }
        count
    }
}
`
  const fetchData = await fetch(process.env.API_HOST! + "/graphql", {
    body: JSON.stringify({
      query,
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    cache: "no-cache",
  })

  const { res, count } = (await fetchData.json()).data.getTravels

  return (
    <div className="container mx-auto m-3">
      <div className="mb-5">
        <Button>
          <FaArrowRight></FaArrowRight>
          <span className="mr-2">بازگشت</span>
        </Button>
      </div>
      <h3 className="text-xl">تعداد صفر یافت شده برای شما {count}</h3>
      <div className="mt-10">
        {res.map((item: any, key: number) => (
          <FlightPage {...item} key={key} />
        ))}
      </div>
    </div>
  )
}

export default FlightsPage
