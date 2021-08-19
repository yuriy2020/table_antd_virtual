import React, { useState, useEffect, useRef } from 'react'
import './grid.css'
import { useSelector, useDispatch } from 'react-redux'
import { actionCreators } from '../store/Grid'
import { createUseStyles, useTheme } from 'react-jss-10'
import 'antd/dist/antd.css'
import { VariableSizeGrid, VariableSizeList } from 'react-window'
import ResizeObserver from 'rc-resize-observer'
import { Table, Pagination, Row } from 'antd'
import classNames from 'classnames'
import { fetched } from '../util/fetched'
import { dataApi } from '../const/api'
import { HIGHLIGHT_COLOR } from '../const/cssConst'
let RATIO = 50

function Grid2({ scroll, onRowDoubleClick }) {
  const columns = useSelector((state) => state.grid.columns)
  const [data, setData] = useState([])
  const [fetching, setFetching] = useState('down')
  const [skip, setSkip] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const preparingData = (rawData) => {
    if (Array.isArray(rawData)) {
      return rawData.map((el, i) => {
        Object.keys(el).map((key) => {
          if (el[key]?.name) {
            el['key'] = key + i // add 'key' for antd-Table
            return (el[key] = el[key]['name'])
          }
        })
        return el
      })
    }
  }

  const getData = async (scrollDirection) => {
    try {
      let take = 20

      const response = await fetched(dataApi(take, skip), 'GET')
      const res = await response.json()
      const prepData = preparingData(res.value)
      setData(prepData)
      setTotalCount(res.total)
      setFetching(false)
    } catch (e) {
      console.log(e)
    }   
  }

  useEffect(() => {
    console.log('skip', skip)
    if (fetching === 'down') {
      setSkip((prev) => prev + 2)
      getData('scrollDown')
    } 
    if (fetching === 'up' && skip > 0) {
      setSkip((prev) => prev - 2)
      getData('scrollUp')
    }
    if (skip === 0) {
      RATIO = 0
    }
  }, [fetching])

  const onRow = (record, rowIndex) => {
    return {
      onClick: (event) => {
        console.log('click')
      }, // click row
      onDoubleClick: (event) => onRowDoubleClick(record), // double click row
      onContextMenu: (event) => {}, // right button click row
      onMouseEnter: (event) => {}, // mouse enter row
      onMouseLeave: (event) => {}, // mouse leave row
    }
  }

  const scrollHandler = ({ target }) => {
    // console.log('scrolling...', target.scrollTop)
    // console.log('height', target.scrollHeight, 'top>>', target.scrollTop, 'inner>>', target.clientHeight)
    let maxScroll = target.scrollHeight - target.clientHeight
    let currentScroll = target.scrollTop
    if (maxScroll === currentScroll) {
      setFetching('down')
      target.scrollTop = target.scrollTop - 70
    }
    if (currentScroll === 0) {
      setFetching('up')
      console.log('maxScroll')
      target.scrollTop = target.scrollTop + 70
    }
  }

  useEffect(() => {
    const tableContent = document.querySelector('.ant-table-body')
    tableContent.addEventListener('scroll', scrollHandler)
    return () => {
      tableContent.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  return (
    <div>
      <Table
        scroll={scroll}
        dataSource={data}
        columns={columns}
        onRow={onRow}
        onScroll={scrollHandler}
        // components={{
        //   body: {
        //     row: EditableRow,
        //   },
        // }}
        pagination={false}
        size={'small'}
      />
    </div>
  )
}

export default Grid2

// const EditableCell = (props) => {
//   console.log(props)
// }
// const EditableRow = (props) => {
//   console.log(props)
//   return <tr>{props.children}</tr>
// }
