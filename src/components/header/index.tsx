import styles from './header.module.css'
import { Link } from 'react-router-dom'
import { MdDarkMode } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";

export function Header(){
  const { toggleTheme, theme } = useTheme();
  
  return(
    <header className={styles.container}>
      <Link to="/">
        <h1>Cripto<span>Price</span></h1>
      </Link>

      <div>
        <MdDarkMode 
          className={styles.buttonTheme}
          size={30} 
          color={theme === 'dark' ? '#FFF' : '#000'}
          onClick={() => toggleTheme()}
        />
      </div>
    </header>
  )
}