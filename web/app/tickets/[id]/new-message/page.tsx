"use client"

import {
  Button,
  FormContainer,
  TextareaAutosizeElement,
} from "@/components/material-components"
import { $http } from "@/utils/fetch"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const TicketIdNewMessage = ({ params }: any) => {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const onSubmit = (data: any) => {
    setLoading(true)
    $http
      .post(
        "/graphql",
        {
          query: `mutation SendMessage {
    sendMessage(message: "${data.message}", id: ${params.id}) {
        id
        title
        status
        createdAt
    }
}`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then(() => {
        router.refresh()
      })
      .finally(() => setLoading(false))
  }

  return (
    <FormContainer onSuccess={onSubmit}>
      <TextareaAutosizeElement rows={10} name="message" label="پیام جدید" />
      <div className="mt-10 text-left">
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          color="primary"
        >
          ثبت تیکت
        </Button>
      </div>
    </FormContainer>
  )
}

export default TicketIdNewMessage
