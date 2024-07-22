"use client"

import { Button } from "@/components/material-components"
import { $http } from "@/utils/fetch"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CloseTicket = ({ id, status }: any) => {
  const [loading, setLoading] = useState(false)

  const onCloseClick = () => {
    setLoading(true)
    $http.post(
      "/graphql",
      {
        query: `mutation CloseTicket {
    closeTicket(id: ${id})
}`,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    )
  }

  return (
    <Button
      onClick={onCloseClick}
      disabled={status === "Closed" || loading}
      variant="contained"
      className="mr-auto"
      color="secondary"
    >
      بستن تیکت
    </Button>
  )
}

export default CloseTicket
