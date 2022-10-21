import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { userCan } from "../hooks/userCan";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { withSSRAuth } from "../utils/withSSRAuth";
import { Can } from '../components/Can';

export default function Dashboard(){
  const { user, signOut } = useContext(AuthContext);
  

  return (
    <>
      <h1>Dashboard: { user?.email }</h1>

     <button onClick={signOut}>Out</button>
      <Can permissions={['metrics.lists']}>
        
        <div>Métricas</div>
      </Can>
    </>
    
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);

  const response = await apiClient.get('/me');
    
  return {
    props: {},
  };
})
