import {getDataFromDb} from "./db/firebase"
import {getUserToken} from "./db/CONFIG.js" ;
import {useEffect, useState } from 'react';
import Body from "./main";
import {storeSubscription} from './db/firebase.js';

function App() {
    return (
        <>
            <Body />
            
        </>
  );
}

export default App;