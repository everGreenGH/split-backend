import axios from 'axios';

class sdk {  
    constructor() {
        console.log("constructor");
    }

    create() {
        console.log("create");
    }

    open() {
        console.log("open");
    }

    getVersion() {
        console.log("v1.0.0");
    }

    
    init(apiKey) {
        console.log(apiKey);
        axios.get('http://localhost:8000/auth/sdk', {
          headers: {
            'api-key': apiKey,
          },
        })
          .then(response => {
            console.log('Post request successful', response.data);
          })
          .catch(error => {
            console.error('Error in post request', error);
          });
      }
}

export default sdk; 