import {draftMode} from 'next/headers'
import {NextResponse, type NextRequest} from 'next/server'

// Exit preview: turn off draft mode and return to the home page.
export async function GET(request: NextRequest) {
  ;(await draftMode()).disable()
  return NextResponse.redirect(new URL('/', request.url))
}
