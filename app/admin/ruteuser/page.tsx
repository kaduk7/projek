"use client"
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Add from './action/Add';
import Delete from './action/Delete';


const Ruteuser = () => {
  const [dataruteuserall, setDataRuteUserall] = useState([])
  const [dataruteuser, setDataRuteUser] = useState([])
  const [datazona, setDatazona] = useState([])
  const [datarute, setDatarute] = useState([])
  const [zonaid, setZonaid] = useState('')
  const [ruteid, setRuteid] = useState('')
  const [filterText, setFilterText] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    reload()
    daftarzona()
  }, [])

  const reload = async () => {
    try {
      const response = await fetch(`/admin/api/ruteuser`);
      const result = await response.json();
      setDataRuteUserall(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  const daftarzona = async () => {
    try {
      const response = await fetch(`/admin/api/zona`);
      const result = await response.json();
      setDatazona(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  const reloadId = async (ruteid:String) => {
    const response = await fetch(`/admin/api/ruteuser/${ruteid}`)
    const result = await response.json();
    setDataRuteUser(result);
  }

  const onZona = async (e: any) => {
    if (e.target.value === '') {
      setRuteid('')
    }
    setZonaid(e.target.value)
    const response = await fetch(`/admin/api/rute/${e.target.value}`)
    const result = await response.json();
    setDatarute(result)
  }

  const onRute = async (e: any) => {
    setRuteid(e.target.value)
    const response = await fetch(`/admin/api/ruteuser/${e.target.value}`)
    const result = await response.json();
    setDataRuteUser(result);
  }

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = dataruteuser.filter(
    (item: any) => item.userTb.nama && item.userTb.nama.toLowerCase().includes(filterText.toLowerCase()),
  );

  const columns = [
    {
      name: 'No',
      cell: (row: any, index: number) => <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>,
      sortable: false,
      width: '80px'
    },
    {
      name: 'Nama',
      selector: (row: any) => row.userTb.nama,
      sortable: true,
    },
    {
      name: 'No Hp',
      selector: (row: any) => row.userTb.hp,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: any) => (
        <div className="d-flex">
          <Delete reload={reload} reloadId={reloadId} ruteId={ruteid} ruteuserId={row.id}  />
        </div>
      ),
      width: '150px'
    },

  ];

  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title col-md-5 ">Rute User</h1>
              <div className="card-title col-md-3">
                <div className="row">
                  <div className="mb-3 col-md-12">
                    <h6 className="form-label" >Zona</h6>
                    <select
                      required
                      autoFocus
                      className="form-control"
                      value={zonaid} onChange={onZona}>
                      <option value={''}> Pilih Zona</option>
                      {datazona?.map((item: any, i) => (
                        <option key={i} value={item.id} >{item.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="card-title col-md-3">
                <div className="row">
                  <div className="mb-3 col-md-12">
                    <h6 className="form-label" >Rute</h6>
                    {zonaid === '' ?
                      <select
                        className="form-control">
                        <option value={''}> Menunggu pilih zona</option>
                      </select>
                      :
                      <select
                        className="form-control"
                        value={ruteid} onChange={onRute}>
                        <option value={''}> Pilih Rute</option>
                        {datarute?.map((item: any, i) => (
                          <option key={i} value={item.id} >{item.nama}</option>
                        ))}
                      </select>
                    }

                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              {ruteid === '' ?
                <div>Silahkan Pilih Rute terlebih dahulu</div>
                :
                <>
                  <div className="row mb-3">
                    <div className="col-md-9">
                      <Add reload={reload} reloadId={reloadId} ruteId={ruteid} dataAll={dataruteuserall} />
                    </div>
                  </div>
                  <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    persistTableHead
                    responsive
                    paginationPerPage={itemsPerPage}
                    paginationTotalRows={filteredItems.length}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    paginationRowsPerPageOptions={[5, 10, 20]}
                    customStyles={{
                      headRow: {
                        style: {
                          backgroundColor: '#53d0b2',
                        },
                      },
                    }}
                  />
                </>
              }
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default Ruteuser