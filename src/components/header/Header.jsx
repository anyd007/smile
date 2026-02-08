import "./Header.scss";
import Logo from "../../assets/images/logo.png"

const Header = () => {
    return ( 
        <div className="header-component">
            <h1 className="header-title"><span>SMILE - </span>MYJEMY ZĘBY </h1>
            <img className="img-logo" src={Logo} alt="logo" />
        </div>
     );
}
 
export default Header;