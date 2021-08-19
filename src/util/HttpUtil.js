import Cookies from 'js-cookie'

const HttpUtil = {
  fetchGet: (url, params, token, successCallback, failCallback) => {
    /* Cookies.set('.AspNet.ApplicationCookie',
        "12CXdKqfk2kGgrZNMshBvdd0BqzCEbdIFKBtO4-kRHgfK9yJUQr-mgQrW0iuvkA1NxWf7XpeZW5WOFYOCq61ybVNY6Feu7ULRXW7SGyHm_Um9yZTBth4fhCmFJQudHF703OpEdsYOi9VC68r2eapPxghq_0ODQb2hUK_6fvFerAT7UxePtZod_9xNgcLMw_NWvEjFGEbdixNtu7O0nJAmGjcy01TYAdr-SquPBHDJ-0kSjS9MjROJzxKu_zVldMenZ-w7F7y2Q5z6RG2uMcsA_cPKW6NLLuf93gPVdF-D4SCudIC6hreRUiO8R1TVPfKD_oBfXQApAphuiO7Oz4ORGULuAlhIOz0CRmsKu0rCqHqXXIM3BU24z8uiND6SnArTeS0Ui3PXhGTNeHbKRbJMiCh7NrlCfuHaBbyNM6NGiaP6NUW1PwCmIkR6EHg9sOg5ckJP1iWUR9UxinveX_lX334bAtZJhYl3azovT4wfIc",
        { expires: 1000 }) */

    if (params) {
      url += '?'
      const paramsBody = Object.keys(params)
        .reduce((a, k) => {
          a.push(`${k}=${encodeURIComponent(params[k].toString())}`)
          return a
        }, [])
        .join('&')
      url += paramsBody
    }

    const options = {
      method: 'GET',
      'Access-Control-Allow-Credentials': true,
      'Cache-Control': 'no-cache',
    }

    // if (token) {
    options.credentials = 'include'
    // }

    fetch(url, options)
      .then((response) => response.json())
      .then((responseObj) => {
        // console.log(responseObj);
        if (responseObj !== undefined) {
          successCallback(responseObj)
        }
      })
      .catch((error) => {
        if (failCallback) {
          failCallback(error)
        }
      })
  },

  fetchIncDownload: (url, params, token, successCallback, failCallback) => {
    if (params) {
      url += '?'
      const paramsBody = Object.keys(params)
        .reduce((a, k) => {
          a.push(`${k}=${encodeURIComponent(params[k].toString())}`)
          return a
        }, [])
        .join('&')
      url += paramsBody
    }

    const options = {
      method: 'GET',
      'Access-Control-Allow-Credentials': true,
      'Cache-Control': 'no-cache',
    }

    options.credentials = 'include'

    fetch(url, options)
      .then((response) => {
        if (response.status === 403) {
          throw new Error(response.status)
        } else {
          return response.body
        }
      })
      .then((responseObj) => {
        if (responseObj !== undefined) {
          successCallback(responseObj)
        }
      })
      .catch((error) => {
        if (failCallback) {
          failCallback(error)
        }
      })
  },

  fetchFile: (url, params, successCallback, failCallback) => {
    if (params) {
      url += '?'
      const paramsBody = Object.keys(params)
        .reduce((a, k) => {
          a.push(`${k}=${encodeURIComponent(params[k].toString())}`)
          return a
        }, [])
        .join('&')
      url += paramsBody
    }

    const options = {
      method: 'GET',
      credentials: 'include',
      'Access-Control-Allow-Credentials': true,
    }

    fetch(url, options)
      //.then((response) => response.blob())
      .then((response) => {
        if (response.status === 403) {
          throw new Error(response.status)
        } else {
          return response.blob()
        }
      })
      .then((responseObj) => {
        // console.log(responseObj);
        if (responseObj !== undefined) {
          successCallback(responseObj)
        }
      })
      .catch((error) => {
        if (failCallback) {
          failCallback(error)
        }
      })
  },

  fetchPostFile: (url, method, params, successCallback, failCallback) => {
    const data = new FormData()

    if (params.files) {
      params.files.forEach((f) => {
        try {
          data.append('uploads[]', f, f.name)
        } catch (e) {
          // trows when calling PUT method
          // unexpected Data type, expected Blob gotten Object
          console.log(e)
        }
      })

      data.append('files', JSON.stringify(params.files))
    }
    for (const key in params) {
      if (key !== 'file') {
        data.append(key, params[key])
      }
    }

    const options = {
      method,
      credentials: 'include',
      'Access-Control-Allow-Credentials': true,
      body: data,
    }

    fetch(url, options)
      .then((response) => response.json())
      .then((responseObj) => {
        successCallback(responseObj)
      })
      .catch((error) => {
        if (failCallback) {
          failCallback(error)
        }
      })
  },

  fetchPost: (url, params, token, successCallback, failCallback) => {
    if (typeof params !== 'string') {
      url += '?'
    }

    const options = {
      method: 'POST',
    }

    if (typeof params !== 'string') {
      const paramsBodyArr = Object.keys(params).reduce((a, k) => {
        if (k !== 'picture' && k !== 'text') {
          a.push(`${k}=${encodeURIComponent(params[k].toString())}`)
        }
        return a
      }, [])
      const paramsBody = paramsBodyArr.join('&')
      url += paramsBody
    } else {
      options.body = `'${params}'`
    }

    if (token) {
      options.headers = {
        Authorization: `Bearer ${Cookies.get('.AspNet.ApplicationCookie')}`,
        'Content-Type': 'application/json',
      }
    } else {
      options.headers = {
        'Content-Type': 'application/json',
      }
    }

    fetch(url, options)
      .then((response) => response.json())
      .then((responseObj) => {
        successCallback(responseObj)
      })
      .catch((error) => {
        if (failCallback) {
          failCallback(error)
        }
      })
  },

  serializeGetStringToObject: (obj, splitResult) => {
    let result = {}
    if (!obj) {
      return false
    }
    obj.split('&').map(function (item) {
      let i = item.split('=')
      return (result[i[0]] = i[1].indexOf(',') > -1 && splitResult ? i[1].split(',') : i[1])
    })
    return result
  },

  fetchEdit: (url, params, method, stringify, successCallback, failCallback) => {
    const options = {
      method,
      body: stringify ? `'${params}'` : `${params}`,
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
    }

    fetch(url, options)
      .then((response) => response.json())
      .then((responseObj) => {
        successCallback(responseObj)
      })
      .catch((error) => {
        if (failCallback) {
          failCallback(error)
        }
      })
  },
}

export default HttpUtil
