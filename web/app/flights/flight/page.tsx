import { Button } from "@/components/material-components"
import Link from "next/link"
import { FaPlane, FaBus, FaTrain } from "react-icons/fa"

export interface FlightProps {
  id: number
  originName: string
  destinationName: string
  startsAt: Date
  duration: number
  vehicleType: string
  capacity: number
  price: number
}

const FlightCard: React.FC<FlightProps> = ({
  id,
  originName,
  destinationName,
  startsAt,
  duration,
  vehicleType,
  capacity,
  price,
}) => {
  const getVehicleIcon = () => {
    if (vehicleType === "Bus") {
      return <FaBus size={30} className="text-gray-100" />
    } else if (vehicleType === "Train") {
      return <FaTrain size={30} className="text-gray-100" />
    } else {
      return <FaPlane size={30} className="text-gray-100" />
    }
  }

  return (
    <div className="bg-stone-700 m-3 rounded-lg shadow-lg p-4">
      <div className="flex items-center mb-4">
        {getVehicleIcon()}
        <div>
          <h3 className="text-xl mr-5 font-semibold">
            {originName} به {destinationName}
          </h3>
          <div className="flex mt-10 items-center">
            <span className="mr-4">
              {new Date(Number(startsAt)).toLocaleDateString("en-US")}
            </span>
            <span className="mr-10">{duration}</span>
          </div>
        </div>
        <span className="text-2xl mr-auto font-semibold">
          {price} هزار تومن
        </span>
      </div>

      <div className="flex items-center mt-5 justify-between">
        <div className="flex items-center justify-between">
          <span className="">ظرفیت باقی مانده: {capacity}</span>
        </div>

        <div className="text-left">
          <Link href={"/flight/" + id}>
            <Button variant="contained" color="primary">
              رزرو سفر
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FlightCard
