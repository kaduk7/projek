"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import { TpsTb } from "@prisma/client";
import { useRouter } from "next/navigation"
import { supabase, supabaseBUCKET, supabaseUrl } from '@/app/helper'
import { setuid } from "process";

function Update({ tps, reload, rute, pengawas }: { tps: TpsTb, reload: Function, rute: Array<any>, pengawas: Array<any> }) {
    const [nama, setNama] = useState(tps.nama)
    const [ruteId, setRuteId] = useState(String(tps.ruteId))
    const [userId, setUserId] = useState(String(tps.userId))
    const [alamat, setAlamat] = useState(tps.alamat)
    const [jammulai, setJammulai] = useState("")
    const [jamselesai, setJamselesai] = useState("")
    const [koordinat1, setKoordinat1] = useState("")
    const [koordinat2, setKoordinat2] = useState("")
    const [foto, setFoto] = useState(tps.foto)
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
            setFoto(tps.foto)
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setFoto(objectUrl)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    const splitData = () => {
        const koordinat = tps.koordinat.split(', ');
        if (koordinat.length === 2) {
            setKoordinat1(koordinat[0]);
            setKoordinat2(koordinat[1]);
        }
        const jamOperasional = tps.jamOperasional.split(' - ');
        if (jamOperasional.length === 2) {
            setJammulai(jamOperasional[0]);
            setJamselesai(jamOperasional[1]);
        }
    }

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => setShow(true);

    const refreshform = () => {
        setNama(tps.nama)
        setRuteId(String(tps.ruteId))
        setUserId(String(tps.userId))
        setAlamat(tps.alamat)
        splitData()
        setFile(null)
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        const jamOperasional = `${jammulai} - ${jamselesai}`;
        const koordinat = `${koordinat1}, ${koordinat2}`;
        const newfoto = foto === tps.foto ? 'no' : 'yes'
        console.log('newfoto', newfoto)
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('ruteId', ruteId)
            formData.append('userId', userId)
            formData.append('alamat', alamat)
            formData.append('jamOperasional', jamOperasional)
            formData.append('koordinat', koordinat)
            formData.append('file', file as File)
            formData.append('newfoto', newfoto)
            const image = formData.get('file') as File;
            const namaunik = Date.now() + '-' + image.name
            formData.append('namaunik', namaunik)

            if (newfoto === 'yes') {
                await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`foto-tps/${tps.foto}`]);

                const uploadResult = await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`foto-tps/${namaunik}`, image);

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

            const xxx = await axios.patch(`/admin/api/tps/${tps.id}`, formData, {
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
                        <Modal.Title>Edit Data Rute</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Pengawas</label>
                            <div className="col-sm-9">
                                <select
                                    required
                                    autoFocus
                                    className="form-control"
                                    value={userId} onChange={(e) => setUserId(e.target.value)}>
                                    <option value={''}> Pilih Pengawas</option>
                                    {pengawas?.map((item: any, i) => (
                                        <option key={i} value={item.id} >{item.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
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
                                    <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-tps/${tps.foto}`} target="_blank">
                                        <img
                                            className="rounded"
                                            src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-tps/${tps.foto}`}
                                            width='100%'
                                            height={150}
                                            alt=""
                                        />
                                    </a>
                                }
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