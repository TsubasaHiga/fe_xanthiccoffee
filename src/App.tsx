import { Footer } from '@/components/Footer'
import { Layout } from '@/components/Layout'
import { MainLayout } from '@/components/MainLayout'
import { DateListGeneratorPage } from '@/pages/DateListGeneratorPage'
import { Fragment } from 'react'
import { Toaster } from 'sonner'

function App() {
  return (
    <Fragment>
      <Layout>
        <MainLayout>
          <DateListGeneratorPage />
        </MainLayout>
        <Footer />
      </Layout>
      <Toaster />
    </Fragment>
  )
}

export default App
