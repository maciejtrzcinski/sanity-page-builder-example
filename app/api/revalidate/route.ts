import {revalidateTag} from 'next/cache'
import {NextResponse, type NextRequest} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

// Sanity webhook → on-demand revalidation. Configure a webhook in
// sanity.io/manage pointing at `POST /api/revalidate`, with a secret matching
// SANITY_REVALIDATE_SECRET and a projection that includes the type and slug:
//   {"_type": _type, "slug": slug.current}
type WebhookPayload = {_type?: string; slug?: string}

export async function POST(req: NextRequest) {
  try {
    const {isValidSignature, body} = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    // Reject unless the signature is present and valid (null = no secret set).
    if (!isValidSignature) {
      return new NextResponse('Invalid or missing signature', {status: 401})
    }
    if (!body?._type) {
      return new NextResponse('Bad Request: missing _type', {status: 400})
    }

    const tags = new Set<string>()
    if (body._type === 'page') {
      tags.add('page')
      if (body.slug) tags.add(`page:${body.slug}`)
    } else if (body._type === 'settings') {
      tags.add('settings')
    } else if (
      body._type === 'blogPost' ||
      body._type === 'blogIndex' ||
      body._type === 'blogCategory'
    ) {
      tags.add('blog')
      if (body._type === 'blogPost' && body.slug) tags.add(`blogPost:${body.slug}`)
    }

    // Next 16 requires a cache-life profile as the second argument; "max" purges
    // the tag and lets the next request repopulate it.
    tags.forEach((tag) => revalidateTag(tag, 'max'))

    return NextResponse.json({revalidated: true, tags: [...tags]})
  } catch (error) {
    console.error('Revalidation webhook error:', error)
    return new NextResponse('Error revalidating', {status: 500})
  }
}
