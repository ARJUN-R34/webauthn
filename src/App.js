import React, { useState } from 'react';
import { client } from '@passwordless-id/webauthn';
import { v4 } from 'uuid';
import './App.css';


function App() {
  const [deviceName, setDeviceName] = useState(null);
  const [registerResponse, setRegisterResponse] = useState(null);
  const [authenticationResponse, setAuthenticationResponse] = useState(null);

  const handleInputChange = (event) => {
    setDeviceName(event.target.value);
  };

  const isAvailable = client.isAvailable();
  console.log('[Client] isAvailable : ', { isAvailable });

  async function registerDevice() {
    const dName = localStorage.getItem(deviceName);

    if (dName) {
      alert(`${deviceName} is already registered. Please choose another name`);
      setRegisterResponse(`${deviceName} is already registered. Please choose another name`);
      return;
    }

    const challenge = v4();

    const registration = await client.register(deviceName, challenge, {
      authenticatorType: 'both',
      userVerification: 'required',
      timeout: 60000,
      attestation: false,
      debug: false,
    });

    console.log('[Client] registration : ', { registration });
    setRegisterResponse(JSON.stringify(registration));

    localStorage.setItem(deviceName, registration.credential.id);
  }

  async function authenticateDevice() {
    const dName = localStorage.getItem(deviceName);

    if (!dName) {
      alert(`${deviceName} is not registered. Please register the device`);
      setAuthenticationResponse(`${deviceName} is not registered. Please register the device`);
      return;
    }

    const challenge = v4();

    const authentication = await client.authenticate([dName], challenge, {
      authenticatorType: 'both',
      userVerification: 'required',
      timeout: 60000
    });

    console.log('[Client] authentication : ', { authentication });
    setAuthenticationResponse(JSON.stringify(authentication));
  }

  return (
    <>

      <header>
        <div id="logo-container">
          <h2 id="logo-text" className="text-center">
            PoC - Passwordless Key Storage/Sign using WebAuthn
          </h2>
        </div>
      </header>

      <hr className="solid"></hr>

      <section>
        <div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">
                  Register Device
                </h4>

                <hr className="solid"></hr>

                <div className="form-group">
                  <label> <strong> Enter Device Name </strong></label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Name should be unique"
                    id="name"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block mb-3"
                  id="registerDevice"
                  disabled={false}
                  onClick= {registerDevice}
                >
                  Register Device
                </button>

                <p className="info-text alert alert-secondary">
                  <span> Response: {registerResponse} </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">
                  Authenticate Device
                </h4>

                <hr className="solid"></hr>

                <div className="form-group">
                  <label> <strong> Enter Device Name </strong></label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter the registered device name"
                    id="name"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block mb-3"
                  id="registerDevice"
                  disabled={false}
                  onClick= {authenticateDevice}
                >
                  Authenticate Device
                </button>

                <p className="info-text alert alert-secondary">
                  <span> Response: {authenticationResponse} </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;