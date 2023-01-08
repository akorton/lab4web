import React, {createContext, useContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import rest from 'rest';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
} from "react-router-dom";

import {Slider} from 'primereact/slider';
import {InputText} from 'primereact/inputtext';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";

const authContext = createContext();
const useAuth = ()=>{return useContext(authContext);}
const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const signin = (user)=>{
        setUser(user);
    };
    const signout = ()=>{
        setUser(null);
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


const canvasContext = createContext();
const useCanvas = ()=>{return useContext(canvasContext);}
const useProvideCanvas = ()=>{
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [r, setR] = useState(0);
    const [results, setResults] = useState([]);
    return {
        x, setX,
        y, setY,
        r, setR,
        results, setResults
    }
};
const ProvideCanvas = ({children})=>{
    const canvas = useProvideCanvas();
    return (
        <canvasContext.Provider value={canvas}>
            {children}
        </canvasContext.Provider>
    )
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
                        <ProvideCanvas>
                            <MainPage />
                        </ProvideCanvas>
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
const hash = (string) =>{
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    });
}
const LoginForm = ()=>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registered, setRegistered] = useState(false);
    const [registeredClicked, setRegisteredClicked] = useState(false);
    const auth = useAuth();

    const login = (e)=>{
        hash(password).then((hashedPasswd)=>{
            rest(`/api/login?username=${username}&password=${hashedPasswd}`).then(
                (response)=>{
                    let result = response.entity === "true";
                    if (result){
                        auth.signin(username);
                    } else{
                        auth.signout();
                    }
                }
            );
        });
    }
    const register = (e)=>{
        hash(password).then((hashedPassword)=>{
            rest(`/api/register?username=${username}&password=${hashedPassword}`).then(
                (response)=>{
                    let result = response.entity === "true";
                    setRegisteredClicked(true);
                    if (result) setRegistered(true);
                    else setRegistered(false);
                }
            );
        });
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
                    <InputText onChange={onChangeUsername} value={username}/>
                </div>
                <div className="login-element">
                    <label>Input password</label>
                    <InputText onChange={onChangePassword} value={password}/>
                </div>
                <div id="buttons">
                    <Button onClick={login}>Login</Button>
                    <Button onClick={register}>Register</Button>
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
    const auth = useAuth();
    return (
        <>
            <Button onClick={auth.signout}>Sign out</Button>
            <div id="main-div">
                <Canvas />
                <Table />
            </div>
            <div id="input-wrap">
                <Inputs />
            </div>
            <SubmitButton />
        </>
    )
};

const SubmitButton = ()=>{
    const auth = useAuth();
    const canvas = useCanvas();
    const onClick = ()=>{
        rest({
            method: "POST",
            path: "/api/results",
            entity: JSON.stringify({x: canvas.x, y: canvas.y, r: canvas.r, name: auth.user}),
            headers: {'Content-Type': 'application/json'}
        }).then((data)=>{
            let resultValue = JSON.stringify(JSON.parse(data.entity).result);
            canvas.setResults([...canvas.results, {x: canvas.x, y: canvas.y, r: canvas.r, name: auth.user, result: resultValue}]);
        })
    }
    return (
        <Button onClick={onClick}>Submit</Button>
    )
}

const Canvas = () => {
    return (
        <canvas id="canvas"/>
    )
};

const Inputs = ()=>{
    const canvas = useCanvas();
    const validateR = (r)=>{
        return r >= 0;
    }
    const validateY = (y)=>{
        return ((+y || y === "-") && (y.length <= 6)) || (y.length === 0);
    }
    return (
        <div id="inputs">
            <div className="input">
                <h5>X: {canvas.x}</h5>
                <Slider value={canvas.x} onChange={(e)=>canvas.setX(e.value)} step={1} min={-5} max={3}/>
            </div>
            <div className="input">
                <h5>Y: {canvas.y}</h5>
                <InputText value={canvas.y} onChange={(e)=>{if (validateY(e.target.value)) canvas.setY(e.target.value)}} />
            </div>
            <div className="input">
                <h5>R: {canvas.r}</h5>
                <Slider value={canvas.r} onChange={(e)=>{if (validateR(e.value)) canvas.setR(e.value)}} step={1} min={-5} max={3}/>
            </div>
        </div>
    )
}

const getResults = async ()=>{
    let results;
    await rest({method:"GET", path:"/api/results"}).then(
        (response)=>{
            results = JSON.parse(response.entity);
            results.every((item)=>item.name = item.name.trim());
        }
    )
    return results;
}

const Table = () => {
    const canvas = useCanvas();
    const auth = useAuth();
    useEffect(()=>{
        getResults().then(
            (data)=>canvas.setResults(data.filter((item)=>item.name===auth.user))
        );
    }, []);
    return (
        <DataTable value={canvas.results}>
            <Column field="x" header="x"/>
            <Column field="y" header="y"/>
            <Column field="r" header="r"/>
            <Column field="result" header="result"/>
        </DataTable>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
)