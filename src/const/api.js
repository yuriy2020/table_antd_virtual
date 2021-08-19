// FOR local debug
let API_URL = 'http://localhost:36058/api'
let NET = 'http://localhost:36058/'
// let API_URL ='http://172.16.204.117/api'
// let NET = 'http://127.16.204.117/';

// FOR local debug builded version
// let API_URL = 'http://localhost/api';
// let NET = 'http://localhost/';

if (process.env.NODE_ENV == 'production') {
  API_URL = '/api'
  NET = '/'
}
export const BASE_URL = API_URL
export const NET_URL = NET
// export const BASE_URL = 'http://89.111.128.58:8080/api';

export const dataApi = (take = 20, skip = 0) =>
  `${API_URL}/newinc/get?take=${take}&skip=${skip}&sortDir=desc&sortBy=dateCreated&passportType=SopkaAndZpm&onMy=3`
