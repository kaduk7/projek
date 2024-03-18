"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { useRouter } from "next/navigation"
import { supabase, supabaseBUCKET } from '@/app/helper'
import { Editor } from '@tinymce/tinymce-react';

function Add({ reload, mandor }: { reload: Function, mandor: Array<any> }) {
    const [nama, setNama] = useState("")
    const [userId, setUserId] = useState("")
    const [alamatLokasi, setAlamatLokasi] = useState("")
    const [tanggalMulai, setTanggalmulai] = useState("")
    const [tanggalSelesai, setTanggalSelesai] = useState("")
    const [keterangan, setKeterangan] = useState("")
    const [koordinat1, setKoordinat1] = useState("")
    const [koordinat2, setKoordinat2] = useState("")
    const [file, setFile] = useState<File | null>()
    const [preview, setPreview] = useState('')
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

    useEffect(() => {
        if (!file) {
            setPreview('')
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    function clearForm() {
        setNama('')
        setUserId('')
        setAlamatLokasi('')
        setFile(null)
        setTanggalmulai('')
        setTanggalSelesai('')
        setKeterangan('')
        setKoordinat1('')
        setKoordinat2('')
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        const koordinat = `${koordinat1}, ${koordinat2}`;
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('userId', userId)
            formData.append('alamatLokasi', alamatLokasi)
            formData.append('keterangan', keterangan)
            formData.append('tanggalMulai', new Date(tanggalMulai).toISOString())
            formData.append('tanggalSelesai', new Date(tanggalSelesai).toISOString())
            formData.append('koordinat', koordinat)
            formData.append('file', file as File)
            const image = formData.get('file') as File;
            const namaunik = Date.now() + '-' + image.name
            formData.append('namaunik', namaunik)

            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`foto-event/${namaunik}`, image);

            const xxx = await axios.post(`/admin/api/event`, formData, {
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

    const handleEditorChange = (content: any, editor: any) => {
        setKeterangan(content);;
    }

    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                Tambah</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Mandor</label>
                            <div className="col-sm-9">
                                <select
                                    required
                                    className="form-control"
                                    value={userId} onChange={(e) => setUserId(e.target.value)}>
                                    <option value={''}> Pilih Mandor</option>
                                    {mandor?.map((item: any, i) => (
                                        <option key={i} value={item.id} >{item.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Tanggal Mulai</label>
                            <div className="col-sm-3">
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    value={tanggalMulai} onChange={(e) => setTanggalmulai(e.target.value)}
                                />
                            </div>
                            <label className="col-sm-3 col-form-label" > Tanggal Selesai</label>
                            <div className="col-sm-3">
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)}
                                />
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
                            <label className="col-sm-3 col-form-label" >Alamat Lokasi</label>
                            <div className="col-sm-9">
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={alamatLokasi} onChange={(e) => setAlamatLokasi(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Foto</label>
                            <div className="col-sm-4">
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => setFile(e.target.files?.[0])}
                                />
                            </div>
                            <div className="col-sm-5">
                                {file ?
                                    <div className="">
                                        <img
                                            src={preview}
                                            className=""
                                            width='100%'
                                            height={150}
                                            alt=""
                                        />
                                    </div>
                                    :
                                    <img className="bg-gambarfoto2" />
                                }
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Keterangan</label>
                            <div className="col-sm-9">
                                <Editor
                                    value={keterangan}
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | blocks |formatselect | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                    onEditorChange={handleEditorChange}
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