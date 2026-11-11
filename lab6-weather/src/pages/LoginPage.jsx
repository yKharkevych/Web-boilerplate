import { useState } from 'react'
import { useNavigate } from 'react-router'
import './LoginPage.css'

function LoginPage(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    function handleSubmit(event) {
        event.preventDefault()

        if (username === 'liza3' && password === 'liza3') {
            setError('')
            document.cookie = 'isLoggedIn=true; path=/; max-age=86400; SameSite=Lax'
            navigate('/dashboard', { replace: true })
        } else {
            setError('Invalid username or password')
        }
    }

    return (
        <div className="login-page"> 
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    className="login-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor='password'>Password</label>
                <input
                    id="password"
                    className="login-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login-button">Sign in</button>
                {error && <p className="login-error">{error}</p>}
            </form>
        </div>
    )
}

export default LoginPage