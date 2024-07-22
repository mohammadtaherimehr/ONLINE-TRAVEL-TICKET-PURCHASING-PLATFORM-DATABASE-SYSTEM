import MaterialUiWrapper from "@/components/material-ui-wrapper"
import "./globals.scss"
import Header from "@/components/header"

export const metadata = {
  title: "اصغر سفر",
  description: "با اصغر سفر خوب بگردش",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html dir="rtl" lang="fa" className="dark font-vazir text-right">
      <body className="dark:bg-darken dark:text-gray-200 bg-gray-50">
        <MaterialUiWrapper>
          <Header />
          {children}
        </MaterialUiWrapper>
      </body>
    </html>
  )
}
