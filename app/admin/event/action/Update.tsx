"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import { EventTb } from "@prisma/client";
import { useRouter } from "next/navigation"
import { Editor } from '@tinymce/tinymce-react';
import { supabase, supabaseBUCKET, supabaseUrl } from '@/app/helper'
import moment from "moment";

function Update({ event, reload, mandor }: { event: EventTb, reload: Function, mandor: Array<any> }) {
    const [userId, setUserId] = useState(String(event.userId))
    const [nama, setNama] = useState(event.nama)
    const [alamatLokasi, setAlamatLokasi] = useState(event.alamatLokasi)
    const [tanggalMulai, setTanggalmulai] = useState(moment(event.tanggalMulai).format("YYYY-MM-DD"))
    const [tanggalSelesai, setTanggalSelesai] = useState(moment(event.tanggalSelesai).format("YYYY-MM-DD"))
    const [keterangan, setKeterangan] = useState(event.keterangan)
    const [koordinat1, setKoordinat1] = useState("")
    const [koordinat2, setKoordinat2] = useState("")
    const [foto, setFoto] = useState(event.foto)
    const [file, setFile] = useState<File | null>()
    const [preview, setPreview] = useState('')
    const [show, setShow] = useState(false);
    const router = useRouter()
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

    useEffect(() => {
        splitData()
    }, []);

    useEffect(() => {
        if (!file) {
            setPreview('')
            setFoto(event.foto)
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setFoto(objectUrl)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    const splitData = () => {
        const koordinat = event.koordinat.split(', ');
        if (koordinat.length === 2) {
            setKoordinat1(koordinat[0]);
            setKoordinat2(koordinat[1]);
        }
    }

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => setShow(true);

    const refreshform = () => {
        setNama(event.nama)
        setUserId(String(event.userId))
        setAlamatLokasi(event.alamatLokasi)
        setTanggalmulai(moment(event.tanggalMulai).format("YYYY-MM-DD"))
        setTanggalSelesai(moment(event.tanggalSelesai).format("YYYY-MM-DD"))
        setKeterangan(event.keterangan)
        splitData()
        setFile(null)
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        const koordinat = `${koordinat1}, ${koordinat2}`;
        const newfoto = foto === event.foto ? 'no' : 'yes'

        try {
            const formData = new FormData()
            formData.append('userId', userId)
            formData.append('nama', nama)
            formData.append('alamatLokasi', alamatLokasi)
            formData.append('keterangan', keterangan)
            formData.append('tanggalMulai', new Date(tanggalMulai).toISOString())
            formData.append('tanggalSelesai', new Date(tanggalSelesai).toISOString())
            formData.append('koordinat', koordinat)
            formData.append('newfoto', newfoto)
            formData.append('file', file as File)
            const image = formData.get('file') as File;
            const namaunik = Date.now() + '-' + image.name
            formData.append('namaunik', namaunik)

            if (newfoto === 'yes') {
                const deleteResult = await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`foto-event/${event.foto}`]);
                console.log('hapus', deleteResult)

                const uploadResult = await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`foto-event/${namaunik}`, image)

                if (uploadResult.error) {
                    setIsLoading(false)
                    reload()
                    Swal.fire({
                        position: 'top-end',
                        icon: 'warning',
                        title: 'Gagal Upload Gambar',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    throw uploadResult.error
                }
                setFoto(namaunik)
            }

            const xxx = await axios.patch(`/admin/api/event/${event.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'berhasil') {
                setShow(false);
                setIsLoading(false)
                reload()
                router.refresh()
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil diubah',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleEditorChange = (content: any, editor: any) => {
        setKeterangan(content);;
    }

    return (
        <div>
            <span onClick={handleShow} className="btn btn-success shadow btn-xs sharp mx-1"><i className="fa fa-edit"></i></span>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Data Event</Modal.Title>
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
                            <div className="col-sm-9">
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => setFile(e.target.files?.[0])}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" ></label>
                            <div className="col-sm-5">
                                {file ?
                                    <div className="">
                                        <img
                                            className="rounded"
                                            src={preview}
                                            width='100%'
                                            height={150}
                                            alt=""
                                        />
                                    </div>
                                    :
                                    <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-event/${event.foto}`} target="_blank">
                                        <img
                                            className="rounded"
                                            src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-event/${event.foto}`}
                                            width='100%'
                                            height={150}
                                            alt=""
                                        />
                                    </a>
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

export default Update