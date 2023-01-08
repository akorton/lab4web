import React, {createContext, useContext, useState} from 'react';
import ReactDOM from 'react-dom';
import rest from 'rest';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
} from "react-router-dom";

const authContext = createContext();
const useAuth = ()=>{return useContext(authContext);}
const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const signin = (user, cb)=>{
        setUser(user);
        cb();
    };
    const signout = (cb)=>{
        setUser(null);
        cb();
    };

    return {
      user,
      signin,
      signout
    };
}
const ProvideAuth = ({children})=>{
    const auth = useProvideAuth();
    return (<authContext.Provider value={auth}>
        {children}
    </authContext.Provider>)
}
function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}
const App = ()=>{
    return (
        <ProvideAuth>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LoginPage />
                    </Route>
                    <PrivateRoute exact path="/main">
                        <MainPage />
                    </PrivateRoute>
                </Switch>
            </Router>
        </ProvideAuth>
    )
};

const LoginPage = ()=>{
    return (
        <>
            <Header />
            <LoginForm />
            <AuthHint />
        </>
    )
};

const Header = () => {
    const name = "Кортыш Андрей";
    const group = "P32151";
    const variant = "Вариант 1293";
    return (
        <div id="header">
            <div>
                <h1>
                    {name}
                </h1>
                <h1>
                    {group}
                </h1>
                <h1>
                    {variant}
                </h1>
            </div>
            <div>
                <Link to="/main">Main Page</Link>
            </div>
        </div>
    )
};

const LoginForm = ()=>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registered, setRegistered] = useState(false);
    const [registeredClicked, setRegisteredClicked] = useState(false);
    const auth = useAuth();
    const login = (e)=>{
        rest(`/api/login?username=${username}&password=${password}`).then(
            (response)=>{
                let result = response.entity === "true";
                if (result){
                    auth.signin(username);
                } else{
                    auth.signout();
                }
            }
        );
    }
    const register = (e)=>{
        rest(`/api/register?username=${username}&password=${password}`).then(
            (response)=>{
                let result = response.entity === "true";
                setRegisteredClicked(true);
                if (result) setRegistered(true);
                else setRegistered(false);
            }
        );
    }
    const onChangeUsername = (event)=>{
        setUsername(event.target.value);
    }
    const onChangePassword = (event)=>{
        setPassword(event.target.value);
    }
    return (
        <>
            <div id="login">
                <div className="login-element">
                    <label>Input username:</label>
                    <input type="text" onChange={onChangeUsername} value={username}/>
                </div>
                <div className="login-element">
                    <label>Input password</label>
                    <input type="password" onChange={onChangePassword} value={password}/>
                </div>
                <div id="buttons">
                    <button onClick={login}>Login</button>
                    <button onClick={register}>Register</button>
                </div>
                <div id="extra-text">
                    {registered ? <h3>Successfully registered!</h3> : (registeredClicked ? <h3>Registration was not<br /> successful!</h3> : <></>)}
                </div>
            </div>
        </>
    )
};

const AuthHint = ()=>{
  const auth = useAuth();
    return (
      auth.user ? <h3>You are logged in as {auth.user}.</h3> : <h3>You are not logged in.</h3>
  )
};

const MainPage = ()=>{
    return (
        <div>
            <Link to="/">Login Page</Link>
            <div>
                <Canvas />
                <Table />
            </div>
        </div>
    )
};

const Canvas = () => {
    return (
        <></>
    )
}

const getResults = async ()=>{
    let results;
    await rest("/api/results").then(
        (response)=>{
            results = JSON.parse(response.entity);
        }
    )
    return results;
}

const Table = () => {
    const [results, setResults] = useState([]);
    setInterval(()=>{
        getResults().then((result)=>setResults(result));
    }, 10000);
    return (
        <table>
            <tbody>
                <tr>
                    <th>x</th>
                    <th>y</th>
                    <th>r</th>
                    <th>result</th>
                </tr>
                {results.map((value, index, array)=> {
                    return <TableElement key={index} x={value.x} y={value.y} r={value.r} result={value.result}/>
                })}
            </tbody>
        </table>
    )
}

const TableElement = (props) => {
    console.log(props.result);
    return (
        <tr>
            <td>{props.x}</td>
            <td>{props.y}</td>
            <td>{props.r}</td>
            <td>{JSON.stringify(props.result)}</td>
        </tr>
    )
}



ReactDOM.render(
    <App />,
    document.getElementById("root")
)