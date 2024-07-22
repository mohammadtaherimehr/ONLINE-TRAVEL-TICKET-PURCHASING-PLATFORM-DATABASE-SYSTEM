import QueryPage from "./query/page"

export default async function Home() {
  const res = await fetch(process.env.API_HOST! + "/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: "{ getCities { name } }",
    }),
    headers: {
      "content-type": "application/json",
    },
    cache: "no-cache",
  })

  const cityData = (await res.json()).data.getCities

  return (
    <div>
      <section>
        <img
          className="h-[600px] object-cover"
          width="100%"
          src="/Charter-Bus-Rentals-Photo.jpg"
        />
        <div className="bg-zinc-800 m-3 relative -translate-y-1/2 p-8 flex items-center gap-5 rounded-lg">
          <QueryPage cities={cityData.map((item: any) => item.name)} />
        </div>
      </section>

      <section className="mt-20 container mx-auto px-2">
        <h3 className="font-semibold text-3xl">با اصغر خوب بگردش</h3>
      </section>
    </div>
  )
}
