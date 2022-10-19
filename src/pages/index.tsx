import type { NextPage, GetServerSideProps } from 'next'
import { parseCookies } from 'nookies';

import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/Home.module.css'
import { withSSRGuest } from '../utils/withSSRGuest';

const Home: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {signIn } = useContext(AuthContext)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    
    const data = {
      email,
      password
    }

   await signIn(data)
  }
  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.container}>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
       <label>
        Senha
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
       </label>

        <button type="submit">Entrar</button>
      </form>
    </main>
  )
}

export default Home

export const getServerSideProps = withSSRGuest(async (ctx) => {
 
  return {
    props: {},
  };
})
