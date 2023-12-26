import axios from 'axios';

class sdk {
  constructor() {
    console.log("Split initialized");
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

  async init(apiKey) {
    try {
      const response = await axios.get('http://localhost:8000/auth/sdk', {
        headers: {
          'api-key': apiKey,
        },
      });
      const success = response.data === true;
      return success;
    } catch (error) {
      console.error('Error in request', error);
      throw error; 
    }
  }
}

export default sdk; 