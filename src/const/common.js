export const DATE_FORMAT = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}

export const DATE_TIME_FORMAT = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
}

export function FirstUpper(s) {
  return s[0].toUpperCase() + s.substr(1).toLowerCase()
}

export function CreateFile(reqFile) {
  const base64str = reqFile // .file;

  // decode base64 string, remove space for IE compatibility
  const binary = atob(base64str.replace(/\s/g, ''))
  const len = binary.length
  const buffer = new ArrayBuffer(len)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i)
  }

  // var file = new File([view], reqFile.name, { type: 'application/pdf', lastModified: new Date(reqFile.date) });
  const file = new Blob([view], { type: 'application/pdf' })
  file.name = reqFile.name
  file.lastModified = new Date(reqFile.date)
  const url = URL.createObjectURL(file)

  file.preview = url
  return file
}

export const menu = [
  { label: 'Выгрузить в json-файл' },
  { label: '	Выгрузить в csv-файл', value: 'csv' },
  { label: 'Выгрузить в xlsx-файл', value: 'xlsx' },
  { label: 'Выгрузить в docx-файл', value: 'docx' },
  { label: 'Выгрузить в pdf-файл', value: 'pdf' },
]
