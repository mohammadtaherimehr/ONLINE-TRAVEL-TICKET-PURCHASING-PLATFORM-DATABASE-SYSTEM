import { Button, TextField } from "@/components/material-components"

const RegisterPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-neutral-700 w-[800px] rounded shadow p-5 border-gray-800 border">
        <h3 className="font-semibold text-xl">ورود | اصغر سفر</h3>

        <form className="mt-10">
          <TextField className="w-full" label="نام کاربری" />
          <div className="mt-10">
            <TextField className="w-full " label="رمز عبور" type="password" />
          </div>
          <div className="text-left mt-10">
            <Button
              className="mr-auto "
              variant="contained"
              color="primary"
              size="large"
            >
              ورود
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
