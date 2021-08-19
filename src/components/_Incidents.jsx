import React, { useState, useEffect, useRef } from 'react'
import Grid from './_Grid1'
import TopPanel from './_TopPanel'
import { useSelector, useDispatch } from 'react-redux'
import { actionCreators } from '../store/Incidents'

function _Incidents() {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [incident, setIncident] = useState()
  const [needFetch, setNeedFetch] = useState(false)
  // =========================
  const { fetchFields, fetchRights, fetchDicts, hideToast } = actionCreators
  const showOnlyDialog = process.env.REACT_APP_DLG
  // imported from Redux
  const dispatch = useDispatch()
  const { fields, viewType, toast } = useSelector((state) => state.incidents)
  const { searchText } = useSelector((state) => state.topPanel)

  let _tableRef = useRef(null)

  useEffect(() => {
    // dispatch(fetchFields()) // метаданные
    // dispatch(fetchRights())
    // dispatch(fetchDicts())
  }, [])

  // useEffect(() => console.log('incident', incident), [incident])

  const handleRowClick = (incident) => {
    console.log('DBL');
    // setOpenEditDialog(true)
    // setIncident(incident)
    // setNeedFetch(true)
  }
  
  

  return (
    <div>
      {!showOnlyDialog && (
        <div>
          <TopPanel fields={fields} table={_tableRef.current} />

          <Grid onRowDoubleClick={handleRowClick} scroll={{ y: 150 }} />

        </div>
      )}

     
    </div>
  )
}

export default _Incidents
