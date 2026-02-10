import React from 'react';
import { useContext, useState, lazy, Suspense } from 'react';
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


  const { user, loading } = useContext(AuthContext);

  const [selectedChild, setSelectedChild] = useState(null);
  const [childToEdit, setChildToEdit] = useState(null);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <div className="bg"
      style={{ backgroundImage: `url(${Bg})` }}></div>
      <Header />
      <InstallButton/>
      <Suspense fallback={<Loading />}>
        {!user ? (
          <Login />
        ) : (
          <>
            <Logout userData={user} />

            {childToEdit ? (
              <EditChild
                child={childToEdit}
                onClose={() => {
                  setChildToEdit(null);
                  setSelectedChild(null);
                }}
              />
            ) : selectedChild ? (
              <DetalisChild
                detalsChild={selectedChild}
                onClose={() => setSelectedChild(null)}
                onEdit={() => setChildToEdit(selectedChild)}
              />
            ) : (
              <>
                <AddChild />
                <ChildrenList
                  onSelectedChild={setSelectedChild}
                  onEditChild={setChildToEdit}
                />
               
              </>
            )}
          </>
        )}
      </Suspense>
    </div>
  );
}


export default App;
