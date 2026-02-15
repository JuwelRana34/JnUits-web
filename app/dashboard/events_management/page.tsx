import { Suspense } from 'react'

import EventCreationForm from './_events_components/EventForm'

export default function page() {
  return (
    <div>
      <Suspense fallback={<p>loading</p>}>
        <EventCreationForm />
      </Suspense>
    </div>
  )
}
