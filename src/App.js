import React, { useEffect, useState } from 'react'
import './App.css';
import axios from 'axios'
import { Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material'

function App() {
  const baseUrl = 'https://api-node-pg.onrender.com/clientes/';

  const [cliente, setCliente] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [clienteSeleccionado, setclienteSeleccionado] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    correo: '',
    telefono: '',
    nit: ''
  })

  const handleChange = e => {
    const { name, value } = e.target;
    setclienteSeleccionado(prevState => ({
      ...prevState,
      [name]: value
    }))
    console.log(clienteSeleccionado);
  }

  const peticionGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setCliente(response.data)
      });
  }

  const peticionPost = async () => {
    await axios.post(baseUrl, clienteSeleccionado)
      .then(response => {
        setCliente(cliente.concat(response.data))
        abrirCerrarModalInsertar()
      })
  }

  const peticionPut = async () => {
    await axios.put(baseUrl + clienteSeleccionado.id, clienteSeleccionado)
      .then(response => {
        var nuevaData = cliente;
        nuevaData.map(cliente => {
          if (clienteSeleccionado.id === cliente.id) {
            cliente.nombre = clienteSeleccionado.nombre;
            cliente.apellido = clienteSeleccionado.apellido;
            cliente.direccion = clienteSeleccionado.direccion;
            cliente.correo = clienteSeleccionado.correo;
            cliente.telefono = clienteSeleccionado.telefono;
            cliente.nit = clienteSeleccionado.nit;
          }
        })
        setCliente(nuevaData);
        abrirCerrarModalEditar();
      })
  }

  const peticionDelete = async () => {
    await axios.delete(baseUrl + clienteSeleccionado.id)
      .then(response => {
        setCliente(cliente.filter(cliente => cliente.id !== clienteSeleccionado.id));
        abrirCerrarModalEliminar();
      })
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }
  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }
  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const seleccionarCliente = (cliente, caso) => {
    setclienteSeleccionado(cliente);
    (caso === 'Editar') ? abrirCerrarModalEditar() : abrirCerrarModalEliminar()
  }

  useEffect(() => {
    peticionGet();
  }, [])

  const bodyInsertar = (
    <div className='modal-contenido'>
      <h3>Agregar Cliente</h3>
      <TextField name='nombre' label='Nombre' onChange={handleChange} variant="standard" margin="normal" required />
      &nbsp;&nbsp;&nbsp;
      <TextField name='apellido' label='Apellido' onChange={handleChange} variant="standard" margin="normal" required />
      <br />
      <TextField fullWidth name='direccion' label='Direccion' onChange={handleChange} variant="standard" margin="normal" required />
      <br />
      <TextField fullWidth name='correo' label='Correo' onChange={handleChange} variant="standard" margin="normal" required />
      <br />
      <TextField name='telefono' label='Telefono' onChange={handleChange} variant="standard" margin="normal" required />
      &nbsp;&nbsp;&nbsp;
      <TextField name='nit' label='Nit' onChange={handleChange} variant="standard" margin="normal" required />
      <br /><br />
      <div align='center'>
        <Button variant='contained' color='success' onClick={() => peticionPost()}>Insertar &nbsp;<Save /></Button>
        &nbsp;&nbsp;&nbsp;
        <Button variant='contained' color='warning' onClick={() => abrirCerrarModalInsertar()}>Cancelar &nbsp; <Cancel /></Button>
      </div>
    </div>
  )

  const bodyEditar = (
    <div className='modal-contenido'>
      <h3>Modificar Cliente</h3>
      <TextField name='nombre' label='Nombre' onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.nombre} variant="standard" margin="normal" />
      &nbsp;&nbsp;&nbsp;
      <TextField name='apellido' label='Apellido' onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.apellido} variant="standard" margin="normal" />
      <br />
      <TextField fullWidth name='direccion' label='Direccion' onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.direccion} variant="standard" margin="normal" />
      <br />
      <TextField fullWidth name='correo' label='Correo' onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.correo} variant="standard" margin="normal" />
      <br />
      <TextField name='telefono' label='Telefono' onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.telefono} variant="standard" margin="normal" />
      &nbsp;&nbsp;&nbsp;
      <TextField name='nit' label='Nit' onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.nit} variant="standard" margin="normal" />
      <br /><br />
      <div align='center'>
        <Button variant='contained' color='success' onClick={() => peticionPut()}>Guardar &nbsp;<Save /></Button>
        &nbsp;&nbsp;&nbsp;
        <Button variant='contained' color='warning' onClick={() => abrirCerrarModalEditar()}>Cancelar &nbsp; <Cancel /></Button>
      </div>
    </div>
  )

  const bodyEliminar = (
    <div className='modal-contenido'>
      <p>Estás seguro que deseas eliminar al cliente <b>{clienteSeleccionado && clienteSeleccionado.nombre}</b> ? </p>
      <div align='center'>
        <Button variant='contained' color="secondary" onClick={() => peticionDelete()} >Sí</Button>
        &nbsp;&nbsp;&nbsp;
        <Button variant='contained' onClick={() => abrirCerrarModalEliminar()}>No</Button>
      </div>
    </div>
  )

  return (
    <div className='divApp'>
      <br />
      <Button variant='contained' color='primary' onClick={() => abrirCerrarModalInsertar()} >Agregar &nbsp;<Add /></Button>
      <br /><br />
      <TableContainer>
        <Table stickyHeader >
          <TableHead>
            <TableRow >
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Direccion</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Nit</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cliente.map(cliente => (
              <TableRow key={cliente.id} className='sombra'>
                <TableCell >{cliente.nombre}</TableCell>
                <TableCell>{cliente.apellido}</TableCell>
                <TableCell>{cliente.direccion}</TableCell>
                <TableCell>{cliente.correo}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>{cliente.nit}</TableCell>
                <TableCell>
                  <Edit onClick={() => seleccionarCliente(cliente, 'Editar')} className='iconos' />
                  &nbsp;&nbsp;&nbsp;
                  <Delete onClick={() => seleccionarCliente(cliente, 'Eliminar')} className='iconos' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar} className='modal'>
        {bodyInsertar}
      </Modal>

      <Modal open={modalEditar} onClose={abrirCerrarModalEditar} className='modal'>
        {bodyEditar}
      </Modal>

      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar} className='modal'>
        {bodyEliminar}
      </Modal>
    </div>
  )
}

export default App;
