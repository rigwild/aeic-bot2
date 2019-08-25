import store from './store'

export const API_PREFIX = process.env.VUE_APP_API_PREFIX

/**
 * Make a call to the API. Extracts the `data` property if call was successful.
 * @param {String} route Request endpoint
 * @param {Object} options Fetch options object
 * @returns {Promise<Object>} The API's response
 */
export const API_CALL = async (route, options = {}) => {
  if (!options.headers) options.headers = {}

  // Set JSON Content-Type
  if (!options.headers['Content-Type'])
    options.headers['Content-Type'] = 'application/json'

  // Set login token if available
  const token = store.state.token
  if (token) options.headers.authorization = `Bearer ${token}`

  // Do the actual request
  return fetch(`${API_PREFIX}${route}`, options)
    .then(async res => {
      // Add the JSON output to the HTTP response instance
      res.json = await res.json()
      return res
    })
    .then(res => {
      if (!res.ok) throw new Error(`${res.json.message}${res.json.data ? ' ' + res.json.data : ''}`)
      return res.json.data
    })
}

export const API_CALL_SHORT = (route, body, method = body ? 'POST' : 'GET') => API_CALL(route, {
  method,
  body: body ? JSON.stringify(body) : undefined
})
