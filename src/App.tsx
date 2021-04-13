import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { openDB, DBSchema } from 'idb';

interface MyDB extends DBSchema {
  'favourite-number': {
    key: string;
    value: number;
  };
  products: {
    value: {
      name: string;
      price: number;
      productCode: string;
    };
    key: string;
    indexes: { 'by-price': number };
  };
}

async function demo() {
  const db = await openDB<MyDB>('my-db', 1, {
    upgrade(db) {
      db.createObjectStore('favourite-number');
      const productStore = db.createObjectStore('products', {
        keyPath: 'productCode',
      });
      productStore.createIndex('by-price', 'price');
      console.log('done upgraded');
    },
  });

  // This works
  await db.put('favourite-number', 7, 'Jen');
  // This fails at compile time, as the 'favourite-number' store expects a number.
  //await db.put('favourite-number', 'Twelve', 'Jake');
}

function App() {
  useEffect(() => {
    demo();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
