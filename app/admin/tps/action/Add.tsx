/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { useRouter } from "next/navigation"
import { supabase, supabaseBUCKET } from '@/app/helper'

function Add({ reload, rute }: { reload: Function, rute: Array<any> }) {
    const [nama, setNama] = useState("")
    const [ruteId, setRuteId] = useState("")
    const [alamat, setAlamat] = useState("")
    const [jammulai, setJammulai] = useState("")
    const [jamselesai, setJamselesai] = useState("")
    const [koordinat1, setKoordinat1] = useState("")
    const [koordinat2, setKoordinat2] = useState("")
    const [file, setFile] = useState<File | null>()
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
    }, [])

    function clearForm() {
        setNama('')
        setRuteId('')
        setFile(null)
        setAlamat('')
        setJammulai('')
        setJamselesai('')
        setKoordinat1('')
        setKoordinat2('')
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        const jamOperasional = `${jammulai} - ${jamselesai}`;
        const koordinat = `${koordinat1}, ${koordinat2}`;
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('ruteId', ruteId)
            formData.append('alamat', alamat)
            formData.append('jamOperasional', jamOperasional)
            formData.append('koordinat', koordinat)
            formData.append('file', file as File)
            const image = formData.get('file') as File;
            const namaunik = Date.now() + '-' + image.name
            formData.append('namaunik', namaunik)

            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`foto-tps/${namaunik}`, image);

            const xxx = await axios.post(`/admin/api/tps`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setTimeout(function () {
                if (xxx.data.pesan == 'berhasil') {
                    handleClose();
                    setIsLoading(false)
                    clearForm();
                    reload()
                    router.refresh()
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Berhasil Simpan',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                Tambah Tps</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data Tps</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Pilih Rute</label>
                            <div className="col-sm-9">
                                <select
                                    required
                                    autoFocus
                                    className="form-control"
                                    value={ruteId} onChange={(e) => setRuteId(e.target.value)}>
                                    <option value={''}> Pilih Rute</option>
                                    {rute?.map((item: any, i) => (
                                        <option key={i} value={item.id} >{item.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Nama</label>
                            <div className="col-sm-9">
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={nama} onChange={(e) => setNama(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Alamat</label>
                            <div className="col-sm-9">
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={alamat} onChange={(e) => setAlamat(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Jam Operasional</label>
                            <div className="col-sm-4">
                                <input
                                    required
                                    type="time"
                                    id="timeInput"
                                    className="form-control"
                                    value={jammulai} onChange={(e) => setJammulai(e.target.value)}
                                />
                            </div>
                            <label className="col-sm-1 col-form-label" > s/d </label>
                            <div className="col-sm-4">
                                <input
                                    required
                                    type="time"
                                    id="timeInput"
                                    className="form-control"
                                    value={jamselesai} onChange={(e) => setJamselesai(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Koordinat</label>
                            <div className="col-sm-4">
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={koordinat1} onChange={(e) => setKoordinat1(e.target.value)}
                                />
                            </div>
                            <label className="col-sm-1 col-form-label" > </label>
                            <div className="col-sm-4">
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={koordinat2} onChange={(e) => setKoordinat2(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Foto</label>
                            <div className="col-sm-9">
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => setFile(e.target.files?.[0])}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                        <button type="submit" className="btn btn-primary light">Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default Add