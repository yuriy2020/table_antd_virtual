import React, { useState, useEffect, useRef } from 'react'
import InfiniteLoader from 'react-window-infinite-loader'
import './grid.css'
import { useSelector, useDispatch } from 'react-redux'
import { actionCreators } from '../store/Grid'
import { createUseStyles, useTheme } from 'react-jss-10'
import 'antd/dist/antd.css'
import { VariableSizeGrid, VariableSizeList ,FixedSizeList} from 'react-window'
import ResizeObserver from 'rc-resize-observer'
import { Table, Pagination, Row } from 'antd'
import classNames from 'classnames'
import { fetched } from '../util/fetched'
import { dataApi } from '../const/api'
import { HIGHLIGHT_COLOR } from '../const/cssConst'
import { RIGHT_PANEL_BORDER_WIDTH } from '../const/cssConst'
export const rowHeight = 30
export const rightPading = RIGHT_PANEL_BORDER_WIDTH
const useStyles = createUseStyles({})

function _Grid({ onRowDoubleClick, scroll }) {
  const columns = useSelector((state) => state.grid.columns)
  const [data, setData] = useState([])
  const searchText = useSelector((state) => state.topPanel.searchText)
  const [tableWidth, setTableWidth] = useState(0)
  const widthColumnCount = columns.filter(({ width }) => !width).length
  const [skip, setSkip] = useState(0)
  const [fetching, setFetching] = useState('down')
  let [totalCount, setTotalCount] = useState(0)

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

  const addHightlightText = (searchtext = '') => {
    const allTextTable = document.querySelectorAll('.ant-table-cell')
    const hightlightText = searchtext
    allTextTable.forEach((cell) => {
      if (hightlightText !== '') {
        let split = cell.textContent.split(hightlightText)
        if (cell.textContent.indexOf(hightlightText) !== -1) {
          cell.innerHTML = split.join(`<span style="background-color:${HIGHLIGHT_COLOR}">${hightlightText}</span>`)
        } else {
          cell.textContent = split.join()
        }
      } else {
        cell.textContent = cell.textContent
      }
    })
  }

  const getData = async (startIndex = 0, stopIndex) => {
    
    console.log('>>>>', startIndex, stopIndex)
    try {
      let take = 20

      const response = await fetched(dataApi(take, startIndex), 'GET')
      const res = await response.json()
      const prepData = preparingData(res.value)
      console.log('startIndex', startIndex, skip)
      setData([...data, ...prepData]) 
      setTotalCount(res.total)
      setFetching(false)
    } catch (e) {
      console.log(e)
    }
  }

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

  const gridRef = useRef()

  // const [connectObject] = useState(() => {
  //   const obj = {}
  //   Object.defineProperty(obj, 'scrollLeft', {
  //     get: () => null,
  //     set: (scrollLeft) => {
  //       if (gridRef.current) {
  //         gridRef.current.scrollTo({
  //           scrollLeft,
  //         })
  //       }
  //     },
  //   })
  //   return obj
  // })

  // const resetVirtualGrid = () => {
  //   gridRef.current.resetAfterIndices({
  //     columnIndex: 0,
  //     shouldForceUpdate: true,
  //   })
  // }

  // useEffect(() => resetVirtualGrid, [tableWidth])

  const mergedColumns = columns.map((column) => {
    if ('width' in column) {
      return column
    }

    return { ...column, width: Math.floor(tableWidth / widthColumnCount) }
  })

  const onClickRow = (row) => {
    console.log('row', row)
  }
  const onDoubleClickRow = (row) => {
    console.log('dblClick', row)
    onRowDoubleClick(row)
  }

  const isItemLoaded = (index) => {
    console.log('isItemLoaded', index, !!data[index])
    return !!data[index]
  }

  const Row = React.memo(({ index, style }) => {
    //console.log('columnIndex', index, rawData[index]);
    return (<div>{data[index]?.name}</div>);
    // <div key={columnIndex}>{columnIndex}</div>
  });

  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    console.log('rawData>>>', rawData)
    console.log('totalCount>>>', totalCount)
    totalCount = 113;
    // console.log('scrollbarSize>>>', scrollbarSize);
    // console.log('onScroll>>>', onScroll);
    // ref.current = connectObject
    const totalHeight = rawData.length * 54

    return (
      <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={totalCount} loadMoreItems={getData}>
        {({ onItemsRendered, ref }) => (
          // <VariableSizeGrid
          //   ref={ref}
          //   className='virtual-grid'
          //   columnCount={mergedColumns.length}
          //   columnWidth={(index) => {
          //     const { width } = mergedColumns[index]
          //     return totalHeight > scroll.y && index === mergedColumns.length - 1 ? width - scrollbarSize - 1 : width
          //   }}
          //   height={scroll.y}
          //   rowCount={totalCount}
          //   rowHeight={() => 35}
          //   width={tableWidth}
          //   // onScroll={({ scrollLeft }) => {
          //   //   onScroll({
          //   //     scrollLeft,
          //   //   })
          //   // }}
          //   onItemsRendered={onItemsRendered}
          // >
          //   {({ columnIndex, rowIndex, style }) => {
          //     // console.log(rowIndex);
          //     return (
          //       <div
          //         onClick={() => onClickRow(rawData[rowIndex])}
          //         onDoubleClick={() => {
          //           onDoubleClickRow(rawData[rowIndex])
          //         }}
          //         className={classNames('virtual-table-cell', {
          //           'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
          //         })}
          //         style={{ ...style, padding: '2px 10px', whiteSpace: 'nowrap' }}
          //       >
          //         {rawData[rowIndex][mergedColumns[columnIndex].dataIndex]}
          //       </div>
          //     )
          //   }}
          // </VariableSizeGrid>
          <FixedSizeList itemCount={totalCount} onItemsRendered={onItemsRendered} ref={ref} height={350} width={600} itemSize={35}>
            {Row}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    )
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    addHightlightText(searchText)
  }, [searchText])

  const scrollHandler = ({ target }) => {
    console.log('scrolling...', target.scrollTop)
    // console.log('height', target.scrollHeight, 'top>>', target.scrollTop, 'inner>>', target.clientHeight)
    let maxScroll = target.scrollHeight - target.clientHeight
    let currentScroll = target.scrollTop
    // if (maxScroll === currentScroll) {
    //   setFetching('down')
    //   target.scrollTop -= 50
    // }
    // if (currentScroll === 0) {
    //   setFetching('up')
    //   console.log('maxScroll')
    //   target.scrollTop += 50
    // }
  }

  // useEffect(() => {
  //   const tableContent = document.querySelector('.virtual-grid')
  //   tableContent.addEventListener('scroll', scrollHandler)
  //   return () => {
  //     tableContent.removeEventListener('scroll', scrollHandler)
  //   }
  // }, [])

  useEffect(() => {
    // console.log('skip', skip)
    // if (fetching === 'down') {
    //   setSkip((prev) => prev + 10)
    //   getData('scrollDown')
    // }
    // if (fetching === 'up' && skip > 0) {
    //   setSkip((prev) => prev - 10)
    //   getData('scrollUp')
    // }
    // if (skip === 0) {
    //   RATIO = 0
    // }
  }, [fetching])

  return (
    <>
      <ResizeObserver
        onResize={({ width }) => {
          console.log(width)
          setTableWidth(width)
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          scroll={scroll}
          pagination={false}
          components={{
            body: renderVirtualList,
          }}
          onScroll={scrollHandler}
          
        />
      </ResizeObserver>
    </>
  )
}

export default _Grid
