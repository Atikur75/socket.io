import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Backend port running
const socket = io('http://localhost:8000/');

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [readData, setReadData] = useState([]);
  // const [id, setId] = useState('');

  useEffect(() => {

    socket.on('connected', (message) => {
      console.log(message);
    });

    socket.on('created', (data) => {
      console.log(data);
      setReadData((prev) => [...prev, data]);
    });

    // Read Data
    socket.on('read', (data) => {
      setReadData(data);
    });

    socket.emit('read');

    // Deleted Data
    socket.on('deleted', (id)=>{
      setReadData((prev) => prev.filter((item)=> item._id != id));
    })


    // Clean Up
    return () => {
      socket.off('create');
      socket.off('created');
      socket.off('read');
    };

  }, []);

  let handleSubmit = () => {
    socket.emit('create', {
      name,
      description,
    });
  }

  // Delete Data
  let handleDelete = (id) => {
    // console.log(item._id);
    // setId(item._id);
    socket.emit('deleted',id);
  }

  return (
    <>
      <input onChange={(e) => setName(e.target.value)} type='text' placeholder='Enter name...' />
      <input onChange={(e) => setDescription(e.target.value)} type='text' placeholder='Enter description...' />
      <button className='bg-lime-500 py-2 px-4 rounded-md ml-2' onClick={handleSubmit}>Submit</button>
      <br />
      <br />
      <br />
      <ul>
        {readData.map((item) => (
          <li>{item.name} ------ {item.description}
            <button className='bg-lime-500 py-2 px-4 rounded-md ml-2'>Edit</button>
            <button onClick={() => handleDelete(item._id)} className='bg-red-500 py-2 px-4 rounded-md ml-2'>Delete</button>
          </li>
        ))}
      </ul>

    </>
  )
}

export default App
