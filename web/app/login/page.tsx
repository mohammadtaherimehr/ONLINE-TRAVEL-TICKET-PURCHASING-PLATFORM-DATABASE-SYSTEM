"use client"

import {
  Button,
  FormContainer,
  TextFieldElement,
} from "@/components/material-components"
import { $http } from "@/utils/fetch"
import { useRouter } from "next/navigation"
import { useState } from "react"

const LoginPage = () => {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const onSubmit = (data: any) => {
    setLoading(true)

    $http
      .post("/graphql", {
        query: `mutation Login {
    login(data: {username: "${data.username}", password: "${data.password}"}) {
        id
        name
        phoneNumber
        email
        jwtToken
    }
}
`,
      })
      .then((res) => {
        document.cookie = "token=" + res.data.data.login.jwtToken + "; Path=/"
        localStorage.setItem("user", JSON.stringify(res.data.data.login))
        localStorage.setItem("jwt", res.data.data.login.jwtToken)
        router.push("/")
      })
      .finally(() => setLoading(false))
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-neutral-700 w-[800px] rounded shadow p-5 border-gray-800 border">
        <h3 className="font-semibold text-xl">ورود | اصغر سفر</h3>

        <div className="mt-10">
          <FormContainer onSuccess={onSubmit}>
            <TextFieldElement required name="username" label="نام کاربری" />
            <div className="mt-10">
              <TextFieldElement
                required
                name="password"
                label="رمز عبور"
                type="password"
              />
            </div>
            <div className="text-left mt-10">
              <Button
                disabled={loading}
                className="mr-auto "
                variant="contained"
                color="primary"
                size="large"
                type="submit"
              >
                ورود
              </Button>
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
