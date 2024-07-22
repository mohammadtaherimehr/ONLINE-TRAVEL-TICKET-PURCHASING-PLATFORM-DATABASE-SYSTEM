import { Button } from "@/components/material-components"
import { FaBus, FaPlane, FaTrain } from "react-icons/fa"

const Flight = async ({ params }: any) => {
  const flightData = await fetch(process.env.API_HOST! + "/graphql", {
    body: JSON.stringify({
      query: `query GetTravel {
    getTravel(travelId: ${params.id}) {
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
}
`,
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    cache: "no-cache",
  })

  const travelData = (await flightData.json()).data.getTravel

  const getVehicleIcon = () => {
    if (travelData.vehicleType === "Bus") {
      return <FaBus size={50} className="text-gray-100" />
    } else if (travelData.vehicleType === "Train") {
      return <FaTrain size={50} className="text-gray-100" />
    } else {
      return <FaPlane size={50} className="text-gray-100" />
    }
  }

  return (
    <div className="p-3 container m-2 mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">
          سفر {travelData.originName} به {travelData.destinationName}
        </h3>
        <div className="bg-green-500 px-5 py-2 rounded-lg">
          {travelData.price} هزار تومن
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-center justify-between">
          {getVehicleIcon()}
          <Button variant="contained" color="primary">
            خرید بلیت
          </Button>
        </div>
        <p className="mt-10">
          زمان حرکت{" "}
          {new Date(Number(travelData.startsAt)).toLocaleDateString("fa-IR")}
        </p>

        <p className="mt-5">مدت زمان حرکت {travelData.duration}</p>
      </div>
    </div>
  )
}

export default Flight
