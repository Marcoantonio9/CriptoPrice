import { useState, useEffect } from 'react'
import type { FormEvent } from "react";
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from "../../context/ThemeContext";

export interface CoinProps{
  id: string,
  name: string,
  symbol: string,
  priceUsd: string,
  vwap24Hr: string,
  changePercent24Hr: string,
  rank: string,
  supply: string,
  maxSupply: string,
  marketCapUsd: string,
  volumeUsd24Hr: string, 
  explore: string,
  formatedPrice?: string,
  formatedMarket?: string,
  formatedVolume?: string

}

interface DataProps{
  data: CoinProps[]
}

export function Home() {
  const [input, setInput] = useState('')
  const [coins, setCoins] = useState<CoinProps[]>([])
  const [offset, setOffset] = useState(0)

  const navigate = useNavigate()
  const { theme } = useTheme();

  useEffect(() => {
    getData()
  }, [offset])

  async function getData() {
    fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&${import.meta.env.VITE_API_KEY}`)
      .then((response) => response.json())
      .then((data: DataProps) => {
        const coinsData = data.data;

        const price = Intl.NumberFormat("en-US", {
          style: 'currency',
          currency: 'USD'
        })

        const priceCompact = Intl.NumberFormat("en-US", {
          style: 'currency',
          currency: 'USD',
          notation: "compact"
        })        
        
        const formatedResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
          }

          return formated
        })

        const listCoins = [...coins, ...formatedResult]
        setCoins(listCoins)
      })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if(input === ""){
      return
    }

    navigate(`/details/${input}`)
  }

  function handleGetMore(){
    if(offset === 0){
      setOffset(10)
      return
    }

    setOffset(offset + 10)
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder='Digite o nome da moeda...'  
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button type="submit">
          <BsSearch size={30} color={theme === 'dark' ? '#FFF' : '#000'}/>
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope='col'>
              Moeda
            </th>
            <th scope='col'>
              Valor Mercado
            </th>  
            <th scope='col'>
              Preço
            </th> 
            <th scope='col'>
              Volume
            </th>
            <th scope='col'>
              Mudança 24h
            </th>                                             
          </tr>
        </thead>

        <tbody id='tbody'>
          {coins.length > 0 && coins.map((item) => (
            <tr className={styles.tr} key={item.id}>
              <td className={styles.tdLabel} data-label="Moeda">
                <div className={styles.name}>
                  <img 
                    className={styles.logo}
                    src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}2@2x.png`} 
                    alt="Logo cripto" />
                  <Link to={`details/${item.id}`}>
                    <span>{item.name} | {item.symbol} </span>
                  </Link>                
                </div>
              </td>

              <td className={styles.tdLabel} data-label="Valor Mercado">
                <span>{item.formatedMarket}</span>   
              </td>    
              
              <td className={styles.tdLabel} data-label="Preço">
                <span>{item.formatedPrice}</span> 
              </td> 

              <td className={styles.tdLabel} data-label="Volume">
                <span>{item.formatedVolume}</span> 
              </td>    

              <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
                <span>{Number(item.changePercent24Hr).toFixed(3)}</span> 
              </td>                     
            </tr>            
          ))}
        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais...
      </button>
    </main>
  )
}
