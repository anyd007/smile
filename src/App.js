import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, lazy, Suspense } from 'react';
import { AuthContext } from './components/auth/AuthProvider';
import Logout from './components/auth/Logout';
import Loading from "./components/loading/Loading";
import Header from './components/header/Header';
import EditChild from './components/children/EditChild';
import InstallButton from './components/pwa/InstallButton';
import Bg from "./assets/images/bg.png"
import './styles/main.scss';


function App() {
  const AddChild = lazy(() => import("./components/children/AddChild"));
  const ChildrenList = lazy(() => import("./components/children/ChildrenList"));
  const DetalisChild = lazy(() => import("./components/children/DetalisChild"));
  const Login = lazy(() => import("./components/auth/Login"));
  const Statistics = lazy(() => import("./components/children/Statistics"))


  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <div className="bg"
        style={{ backgroundImage: `url(${Bg})` }}></div>
      {user && <Header />}
      {user && <InstallButton />}
      {user && <Logout userData={user}/>}
      <Suspense fallback={<Loading />}>
        <Routes>
          {!user && <Route path='*' element={<Login />} />}

          {user && (
            <>
              <Route path='/' element={
                <>
                  <AddChild />
                  <ChildrenList />
                </>
              } />

              <Route path="/children/:id" element={<DetalisChild />} />
              <Route path="/children/:id/edit" element={<EditChild />} />
              <Route path="/children/:id/stats" element={<Statistics />} />

              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Suspense>
    </div>
  );
}


export default App;
