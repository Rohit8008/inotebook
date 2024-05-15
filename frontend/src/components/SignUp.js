import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = (props) => {
    const [credentials, setCredentials] = useState({ name: '', email: '', password: '', cpassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = credentials;
        let url = process.env.REACT_APP_B_URL;
        try {
            const response = await fetch(url+'/api/auth/createuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, cpassword }),
            });

            const json = await response.json();

            if (json.success) {
                localStorage.setItem('token', json.authtoken);
                navigate('/');
                props.showAlert('Account Created Successfully', 'success');
            } else {
                props.showAlert(json.error, 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input type="text" className="form-control" id="name" name="name" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input type="email" className="form-control" id="email" name="email" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <div className="input-group">
                        <input type={showPassword ? 'text' : 'password'} className="form-control" id="password" name="password" onChange={handleChange} required minLength={5} />
                        <button className="btn btn-outline-secondary" type="button" onClick={toggleShowPassword}>
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">
                        Confirm Password
                    </label>
                    <div className="input-group">
                        <input type={showPassword ? 'text' : 'password'} className="form-control" id="cpassword" name="cpassword" onChange={handleChange} required minLength={5} />
                    </div>
                </div>
                <button
                    disabled={!credentials.email || !credentials.name || !credentials.password || !credentials.cpassword}
                    type="submit"
                    className="btn btn-primary"
                >
                    Sign Up
                </button>
            </form>
        </>
    );
};

export default SignUp;
