"use client"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { useRouter } from "next/navigation"
import DataTable from 'react-data-table-component';

function Add({ reload, reloadId, ruteId, dataAll }: { reload: Function, reloadId: Function, ruteId: String, dataAll: Array<any> }) {
    const [datauser, setDatauser] = useState([])
    const ruteid = ruteId
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [show, setShow] = useState(false);
    const router = useRouter()
    const ref = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false)

    if (isLoading) {
        Swal.fire({
            title: "Mohon tunggu!",
            html: "Sedang mengirim data ke server",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        })
    }

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        ref.current?.focus();
        daftaruser()
    }, [])

    const daftaruser = async () => {
        try {
            const response = await fetch(`/admin/api/user`);
            const result = await response.json();
            setDatauser(result[1]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function clearForm() {

    }
    const handleRowsPerPageChange = (newPerPage: number, page: number) => {
        setItemsPerPage(newPerPage);
        setCurrentPage(page);
    };

    const filteredItems = datauser.filter(
        (item: any) => item.nama && item.nama.toLowerCase().includes(filterText.toLowerCase()),
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
            selector: (row: any) => row.nama,
            sortable: true,
        },
        {
            name: 'No Hp',
            selector: (row: any) => row.hp,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row: any) => (
                !dataAll.some((data: any) => data.userId === Number(row.id) && data.ruteId === Number(ruteid)) ? (
                    <div className="d-flex">
                        <button type="button" className="btn btn-primary light" onClick={() => handleSubmit(row)}>Tambah</button>
                    </div>
                ) : null
            ),
            width: '150px'
        },
    ];

    const handleSubmit = async (row: any) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('userId', row.id)
            formData.append('ruteid', String(ruteid))

            const xxx = await axios.post(`/admin/api/ruteuser`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (xxx.data.pesan == 'berhasil') {
                setIsLoading(false)
                clearForm();
                reload()
                reloadId(ruteid)
                router.refresh()
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil Simpan',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                Tambah User</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row mb-3">
                            <div className="col-md-9">

                            </div>
                            <div className="col-md-3">
                                <div className="input-group mb-3  input-success">
                                    <span className="input-group-text border-0"><i className="mdi mdi-magnify"></i></span>
                                    <input
                                        id="search"
                                        type="text"
                                        placeholder="Search..."
                                        aria-label="Search Input"
                                        value={filterText}
                                        onChange={(e: any) => setFilterText(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
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
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default Add