"use client"

import { $http } from "@/utils/fetch"
import {
  Button,
  FormContainer,
  TextFieldElement,
  TextareaAutosizeElement,
} from "@/components/material-components"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FaArrowRight } from "react-icons/fa"

const NewTicketPage = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = (data: any) => {
    setLoading(true)

    $http
      .post(
        "/graphql",
        {
          query: `mutation CreateTicket($message: String!, $title: String!) {
    createTicket(message: $message, title: $title) {
        id
        status
        createdAt
    }
}
`,
          variables: { message: data.message, title: data.title },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((res) => {
        router.push("/tickets")
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="container mx-auto mt-10">
      <Link href="/tickets">
        <Button color="primary">
          <FaArrowRight className="ml-5" />
          بازگشت
        </Button>
      </Link>
      <p className="text-xl mt-5">اضافه کردن تیکت</p>
      <div className="mt-10">
        <FormContainer onSuccess={onSubmit}>
          <div className="mb-5">
            <TextFieldElement name="title" label="عنوان" />
          </div>
          <TextareaAutosizeElement rows={10} name="message" label="پیام شما" />

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
      </div>
    </div>
  )
}

export default NewTicketPage
