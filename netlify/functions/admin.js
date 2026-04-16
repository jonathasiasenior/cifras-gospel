// Server-side admin function — SERVICE_ROLE never reaches the browser
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE = process.env.VITE_SUPABASE_SERVICE_ROLE
const ANON_KEY    = process.env.VITE_SUPABASE_ANON_KEY

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
}

async function verifyAdmin(token) {
  // 1. Validate the JWT against Supabase
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY }
  })
  if (!r.ok) return null
  const user = await r.json()

  // 2. Check that the user has role=admin in profiles
  const p = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${user.id}`,
    { headers: { Authorization: `Bearer ${SERVICE_ROLE}`, apikey: SERVICE_ROLE } }
  )
  const profiles = await p.json()
  if (!Array.isArray(profiles) || profiles[0]?.role !== 'admin') return null
  return user
}

function supa(path, options = {}) {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE}`,
      apikey: SERVICE_ROLE,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...options.headers
    }
  })
}

exports.handler = async function (event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  // Verify admin token
  const token = (event.headers.authorization || '').replace('Bearer ', '')
  const admin = await verifyAdmin(token)
  if (!admin) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Acesso negado' }) }
  }

  let body
  try { body = JSON.parse(event.body || '{}') }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) } }

  const { action, ...params } = body

  try {
    switch (action) {

      case 'listUsers': {
        const r = await supa('/rest/v1/profiles?select=*&order=created_at')
        return { statusCode: 200, headers, body: await r.text() }
      }

      case 'toggleApprove': {
        const r = await supa(`/rest/v1/profiles?id=eq.${params.userId}`, {
          method: 'PATCH',
          body: JSON.stringify({ approved: params.approved })
        })
        return { statusCode: r.ok ? 200 : 400, headers, body: await r.text() }
      }

      case 'createUser': {
        // Create auth user
        const r = await supa('/auth/v1/admin/users', {
          method: 'POST',
          body: JSON.stringify({
            email: params.email,
            password: params.password,
            email_confirm: true,
            user_metadata: { display_name: params.name }
          })
        })
        const data = await r.json()
        if (!data.id) return { statusCode: 400, headers, body: JSON.stringify(data) }

        // Update profile
        await supa(`/rest/v1/profiles?id=eq.${data.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            display_name: params.name || params.email.split('@')[0],
            phone: params.phone || null,
            must_change_password: true
          })
        })
        return { statusCode: 200, headers, body: JSON.stringify({ id: data.id, email: data.email }) }
      }

      case 'resetPassword': {
        await supa(`/auth/v1/admin/users/${params.userId}`, {
          method: 'PUT',
          body: JSON.stringify({ password: params.password })
        })
        await supa(`/rest/v1/profiles?id=eq.${params.userId}`, {
          method: 'PATCH',
          body: JSON.stringify({ must_change_password: true })
        })
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
      }

      case 'deleteUser': {
        await supa(`/rest/v1/profiles?id=eq.${params.userId}`, { method: 'DELETE' })
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
      }

      case 'listRequests': {
        const r = await supa(`/rest/v1/requests?select=*&type=eq.${params.type}&order=created_at.desc`)
        return { statusCode: 200, headers, body: await r.text() }
      }

      case 'markDone': {
        const r = await supa(`/rest/v1/requests?id=eq.${params.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'done' })
        })
        return { statusCode: r.ok ? 200 : 400, headers, body: await r.text() }
      }

      default:
        return { statusCode: 400, headers, body: JSON.stringify({ error: `Unknown action: ${action}` }) }
    }
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
  }
}
