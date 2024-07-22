"use client"

import {
  Button,
  FormControl,
  FormContainer,
  TextFieldElement,
  DatePickerElement,
  SelectElement,
} from "@/components/material-components"
import { NextPage } from "next"
import { useRouter } from "next/navigation"

const QueryPage: NextPage<{ cities: string[] }> = ({ cities }) => {
  const router = useRouter()

  const onSubmit = (data: any) => {
    let queryData = "?"

    Object.entries(data).forEach(([key, value]) => {
      if (key === "date") {
        queryData += "date=" + (value as any).toDate().getTime() + "&"
      } else {
        queryData += key + "=" + value + "&"
      }
    })

    router.push("/flights" + queryData.slice(0, -1))
  }

  const cityOptions = cities.map((item) => ({
    id: item,
    label: item,
  }))

  return (
    <div className="container mx-auto">
      <FormContainer onSuccess={onSubmit}>
        <div className="flex gap-10 items-center">
          <FormControl className="flex-1">
            <SelectElement
              required
              name="origin"
              id="origin"
              label="مبدا"
              options={cityOptions}
            ></SelectElement>
          </FormControl>
          <FormControl className="flex-1">
            <SelectElement
              required
              name="destination"
              id="destination"
              value="asc"
              label="مقصد"
              options={cityOptions}
            ></SelectElement>
          </FormControl>
          <FormControl className="flex-1">
            <SelectElement
              required
              name="vehicleType"
              options={[
                {
                  id: "Bus",
                  label: "اتوبوس",
                },
                {
                  id: "Airplane",
                  label: "هواپیما",
                },
                {
                  id: "Train",
                  label: "قطار",
                },
              ]}
              label="وسیله نقلیه"
            ></SelectElement>
          </FormControl>
          <TextFieldElement
            name="count"
            required
            className="flex-1"
            label="تعداد مسافر"
          />
          <DatePickerElement
            required
            name="date"
            className="flex-1"
            label="تاریخ سفر"
          />

          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
          >
            جستجو
          </Button>
        </div>
      </FormContainer>
    </div>
  )
}

export default QueryPage
