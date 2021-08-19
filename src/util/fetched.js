export const fetched = (api, method = 'GET', data) => {
  const requestOptions = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  }
  return fetch(api, requestOptions)
}
